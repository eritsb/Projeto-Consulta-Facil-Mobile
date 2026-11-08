import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  Carregando,
  EstadoErro,
  EstadoVazio,
  Progresso,
  Tela,
  dataHoraNoPassado,
  formatarDataLonga,
  formatarHora,
  nomeDiaSemana,
  useRecurso,
} from '../../componentes';
import { useAuth } from '../../contexto/AuthContext';
import { listarDisponibilidades } from '../../servicos/catalogo';
import { cores, espacos, raios } from '../../tema';
import { fontes } from '../../tema/fontes';
import type { Disponibilidade } from '../../tipos/api';
import { useFluxoAgendamento, useHidratarFluxo } from './contexto';
import {
  montarParametros,
  numeroParam,
  resumoDisponibilidade,
  textoParam,
  type ParametrosFluxo,
} from './parametros';

export function HorarioTela() {
  const params = useLocalSearchParams() as ParametrosFluxo;
  useHidratarFluxo(params);

  const fluxo = useFluxoAgendamento();
  const { token } = useAuth();
  const profissional = fluxo.profissional;
  const data = textoParam(params.data);
  const aguardandoHidratacao =
    (!profissional || !data) &&
    (Boolean(numeroParam(params.profissionalId)) || Boolean(textoParam(params.data)));

  const recurso = useRecurso(`agendamento-horarios:${profissional?.id ?? 0}:${data ?? ''}`, async () => {
    if (!profissional || !data) return [];
    const lista = await listarDisponibilidades(profissional.id, token);
    return lista
      .filter((disponibilidade) => disponibilidade.data === data)
      .sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio));
  });

  function escolher(disponibilidade: Disponibilidade) {
    const resumo = resumoDisponibilidade(disponibilidade);
    fluxo.definirDisponibilidade(resumo);
    router.push({
      pathname: '/(app)/agendamento/revisao',
      params: montarParametros({
        especialidade: fluxo.especialidade,
        clinica: fluxo.clinica,
        profissional: fluxo.profissional,
        disponibilidade: resumo,
      }),
    });
  }

  function renderizarConteudo() {
    if (aguardandoHidratacao) {
      return <Carregando mensagem="Carregando..." />;
    }

    if (!profissional || !data) {
      return (
        <EstadoVazio
          titulo="Escolha uma data"
          descricao="Volte e selecione o dia do atendimento."
          acaoTitulo="Voltar"
          aoAcao={() => router.back()}
        />
      );
    }

    if (recurso.carregando) {
      return <Carregando mensagem="Buscando horários..." />;
    }

    if (recurso.erro) {
      return <EstadoErro mensagem={recurso.erro} aoTentarNovamente={recurso.recarregar} />;
    }

    const lista = recurso.dados ?? [];

    if (lista.length === 0) {
      return (
        <EstadoVazio
          titulo="Nenhum horário para esta data"
          descricao="Tente escolher outro dia."
          acaoTitulo="Escolher outra data"
          aoAcao={() => router.back()}
        />
      );
    }

    return (
      <View style={estilos.grade}>
        {lista.map((disponibilidade) => {
          const ocupado =
            disponibilidade.status !== 'DISPONIVEL' ||
            dataHoraNoPassado(disponibilidade.data, disponibilidade.hora_inicio);
          const hora = formatarHora(disponibilidade.hora_inicio);

          return (
            <Pressable
              key={disponibilidade.id_disponibilidade}
              onPress={() => escolher(disponibilidade)}
              disabled={ocupado}
              accessibilityRole="button"
              accessibilityLabel={`${hora}, ${ocupado ? 'indisponível' : 'disponível'}`}
              accessibilityState={{ disabled: ocupado }}
              style={({ pressed }) => [
                estilos.horario,
                ocupado ? estilos.horarioOcupado : estilos.horarioLivre,
                pressed && !ocupado ? estilos.pressionado : null,
              ]}
            >
              <Text style={[estilos.hora, ocupado ? estilos.horaOcupada : null]}>{hora}</Text>
              <Text style={[estilos.estado, ocupado ? estilos.estadoOcupado : null]}>
                {ocupado ? 'Indisponível' : 'Disponível'}
              </Text>
            </Pressable>
          );
        })}
      </View>
    );
  }

  const subtitulo =
    data && profissional
      ? `${nomeDiaSemana(data)}, ${formatarDataLonga(data, false)} • ${profissional.nome}`
      : 'Selecione um horário.';

  return (
    <Tela titulo="Escolha o horário" subtitulo={subtitulo} aoVoltar={() => router.back()}>
      <Progresso atual={4} total={5} rotulo="Data e horário" />
      {renderizarConteudo()}
    </Tela>
  );
}

const estilos = StyleSheet.create({
  grade: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: espacos.sm,
  },
  horario: {
    flexBasis: '30%',
    flexGrow: 1,
    minHeight: 68,
    borderRadius: raios.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: espacos.sm,
    gap: 2,
  },
  horarioLivre: {
    backgroundColor: cores.superficie,
    borderColor: cores.bordaForte,
  },
  horarioOcupado: {
    backgroundColor: cores.fundoSuave,
    borderColor: cores.borda,
  },
  pressionado: {
    opacity: 0.85,
  },
  hora: {
    fontSize: fontes.tamanho.lg,
    fontWeight: fontes.peso.forte,
    color: cores.texto,
  },
  horaOcupada: {
    color: cores.textoSecundario,
  },
  estado: {
    fontSize: fontes.tamanho.xs,
    fontWeight: fontes.peso.medio,
    color: cores.primariaEscura,
  },
  estadoOcupado: {
    color: cores.textoSecundario,
  },
});
