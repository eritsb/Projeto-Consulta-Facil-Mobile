import { router, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import {
  Cartao,
  Carregando,
  EstadoErro,
  EstadoVazio,
  Progresso,
  Tela,
  dataHoraNoPassado,
  formatarDataLonga,
  nomeDiaSemana,
  useRecurso,
} from '../../componentes';
import { useAuth } from '../../contexto/AuthContext';
import { listarDisponibilidades } from '../../servicos/catalogo';
import { cores, espacos } from '../../tema';
import { fontes } from '../../tema/fontes';
import type { Disponibilidade } from '../../tipos/api';
import { useFluxoAgendamento, useHidratarFluxo } from './contexto';
import { montarParametros, numeroParam, type ParametrosFluxo } from './parametros';

type GrupoData = {
  data: string;
  horarios: Disponibilidade[];
};

export function DataTela() {
  const params = useLocalSearchParams() as ParametrosFluxo;
  useHidratarFluxo(params);

  const fluxo = useFluxoAgendamento();
  const { token } = useAuth();
  const profissional = fluxo.profissional;
  const aguardandoHidratacao = !profissional && Boolean(numeroParam(params.profissionalId));

  const recurso = useRecurso(`agendamento-datas:${profissional?.id ?? 0}`, async () => {
    if (!profissional) return [];
    const lista = await listarDisponibilidades(profissional.id, token);
    return lista.filter(
      (disponibilidade) =>
        disponibilidade.status === 'DISPONIVEL' &&
        !dataHoraNoPassado(disponibilidade.data, disponibilidade.hora_inicio),
    );
  });

  const grupos = useMemo<GrupoData[]>(() => {
    const mapa = new Map<string, Disponibilidade[]>();

    (recurso.dados ?? []).forEach((disponibilidade) => {
      const horarios = mapa.get(disponibilidade.data) ?? [];
      horarios.push(disponibilidade);
      mapa.set(disponibilidade.data, horarios);
    });

    return Array.from(mapa.entries())
      .sort(([dataA], [dataB]) => dataA.localeCompare(dataB))
      .map(([data, horarios]) => ({
        data,
        horarios: horarios.sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio)),
      }));
  }, [recurso.dados]);

  function escolherData(data: string) {
    router.push({
      pathname: '/(app)/agendamento/horario',
      params: {
        ...montarParametros({
          especialidade: fluxo.especialidade,
          clinica: fluxo.clinica,
          profissional: fluxo.profissional,
        }),
        data,
      },
    });
  }

  function renderizarConteudo() {
    if (aguardandoHidratacao) {
      return <Carregando mensagem="Carregando..." />;
    }

    if (!profissional) {
      return (
        <EstadoVazio
          titulo="Escolha um profissional"
          descricao="Precisamos saber com quem você quer agendar."
          acaoTitulo="Voltar"
          aoAcao={() => router.back()}
        />
      );
    }

    if (recurso.carregando) {
      return <Carregando mensagem="Buscando datas disponíveis..." />;
    }

    if (recurso.erro) {
      return <EstadoErro mensagem={recurso.erro} aoTentarNovamente={recurso.recarregar} />;
    }

    if (grupos.length === 0) {
      return (
        <EstadoVazio
          titulo="Sem horários disponíveis"
          descricao="Este profissional não tem horários livres no momento."
          acaoTitulo="Escolher outro profissional"
          aoAcao={() => router.back()}
        />
      );
    }

    return (
      <View style={estilos.lista}>
        {grupos.map((grupo) => (
          <Cartao
            key={grupo.data}
            aoPressionar={() => escolherData(grupo.data)}
            rotuloAcessivel={`${nomeDiaSemana(grupo.data)}, ${formatarDataLonga(grupo.data)}`}
            dicaAcessivel="Toque para ver os horários desta data"
          >
            <View style={estilos.linha}>
              <View style={estilos.textos}>
                <Text style={estilos.dia}>{nomeDiaSemana(grupo.data)}</Text>
                <Text style={estilos.data}>{formatarDataLonga(grupo.data, false)}</Text>
                <Text style={estilos.info}>
                  {grupo.horarios.length}{' '}
                  {grupo.horarios.length === 1 ? 'horário disponível' : 'horários disponíveis'}
                </Text>
              </View>
              <Text style={estilos.seta}>›</Text>
            </View>
          </Cartao>
        ))}
      </View>
    );
  }

  return (
    <Tela
      titulo="Escolha a data"
      subtitulo={profissional ? `Profissional: ${profissional.nome}` : 'Selecione um dia.'}
      aoVoltar={() => router.back()}
    >
      <Progresso atual={4} total={5} rotulo="Data e horário" />
      {renderizarConteudo()}
    </Tela>
  );
}

const estilos = StyleSheet.create({
  lista: {
    gap: espacos.sm,
  },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacos.sm,
  },
  textos: {
    flex: 1,
    gap: 2,
  },
  dia: {
    fontSize: fontes.tamanho.xs,
    fontWeight: fontes.peso.forte,
    color: cores.primariaEscura,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  data: {
    fontSize: fontes.tamanho.lg,
    lineHeight: fontes.altura.lg,
    fontWeight: fontes.peso.forte,
    color: cores.texto,
  },
  info: {
    fontSize: fontes.tamanho.sm,
    color: cores.textoSecundario,
  },
  seta: {
    fontSize: 24,
    color: cores.primaria,
  },
});
