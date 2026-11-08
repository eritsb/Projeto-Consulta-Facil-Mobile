import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import {
  CartaoProfissional,
  Carregando,
  EstadoErro,
  EstadoVazio,
  Progresso,
  Tela,
  useRecurso,
} from '../../componentes';
import { useAuth } from '../../contexto/AuthContext';
import { listarProfissionais } from '../../servicos/catalogo';
import { espacos } from '../../tema';
import type { Profissional } from '../../tipos/api';
import { useFluxoAgendamento, useHidratarFluxo } from './contexto';
import { montarParametros, resumoProfissional, type ParametrosFluxo } from './parametros';

export function ProfissionalTela() {
  const params = useLocalSearchParams() as ParametrosFluxo;
  useHidratarFluxo(params);

  const fluxo = useFluxoAgendamento();
  const { token } = useAuth();
  const especialidade = fluxo.especialidade;
  const clinica = fluxo.clinica;

  const recurso = useRecurso(
    `agendamento-profissionais:${especialidade?.id ?? 'x'}:${clinica?.id ?? 'y'}`,
    async () => {
      const filtros = especialidade
        ? { especialidade: especialidade.id }
        : clinica
          ? { clinica: clinica.id }
          : {};

      const lista = await listarProfissionais(filtros, token);

      return lista
        .filter((profissional) => profissional.ativo)
        .filter(
          (profissional) => !clinica || Number(profissional.id_clinica) === clinica.id,
        )
        .filter(
          (profissional) =>
            !especialidade ||
            Number(profissional.id_especialidade) === especialidade.id,
        );
    },
  );

  const contexto = [especialidade?.nome, clinica?.nome].filter(Boolean).join(' • ');

  function escolher(profissional: Profissional) {
    const resumo = resumoProfissional(profissional);
    fluxo.definirProfissional(resumo);
    router.push({
      pathname: '/(app)/agendamento/data',
      params: montarParametros({
        especialidade: fluxo.especialidade,
        clinica: fluxo.clinica,
        profissional: resumo,
      }),
    });
  }

  function renderizarConteudo() {
    if (recurso.carregando) {
      return <Carregando mensagem="Carregando profissionais..." />;
    }

    if (recurso.erro) {
      return <EstadoErro mensagem={recurso.erro} aoTentarNovamente={recurso.recarregar} />;
    }

    const lista = recurso.dados ?? [];

    if (lista.length === 0) {
      return (
        <EstadoVazio
          titulo="Nenhum profissional encontrado"
          descricao="Não encontramos profissionais para esta combinação. Tente outra clínica ou especialidade."
          acaoTitulo="Voltar"
          aoAcao={() => router.back()}
        />
      );
    }

    return (
      <View style={estilos.lista}>
        {lista.map((profissional) => (
          <CartaoProfissional
            key={profissional.id_profissional}
            profissional={profissional}
            selecionado={fluxo.profissional?.id === Number(profissional.id_profissional)}
            aoPressionar={() => escolher(profissional)}
          />
        ))}
      </View>
    );
  }

  return (
    <Tela
      titulo="Escolha o profissional"
      subtitulo={contexto || 'Selecione um profissional.'}
      aoVoltar={() => router.back()}
    >
      <Progresso atual={3} total={5} />

      {renderizarConteudo()}
    </Tela>
  );
}

const estilos = StyleSheet.create({
  lista: {
    gap: espacos.sm,
  },
});
