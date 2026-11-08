import { router, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import {
  CartaoClinica,
  Carregando,
  EstadoErro,
  EstadoVazio,
  Progresso,
  Tela,
  Toast,
  useRecurso,
} from '../../componentes';
import { useAuth } from '../../contexto/AuthContext';
import { listarClinicas, listarProfissionais } from '../../servicos/catalogo';
import { espacos } from '../../tema';
import type { Clinica } from '../../tipos/api';
import { useFluxoAgendamento, useHidratarFluxo } from './contexto';
import { montarParametros, resumoClinica, type ParametrosFluxo } from './parametros';

type ItemClinica = {
  clinica: Clinica;
  totalProfissionais?: number;
};

export function ClinicaTela() {
  const params = useLocalSearchParams() as ParametrosFluxo;
  useHidratarFluxo(params);

  const fluxo = useFluxoAgendamento();
  const { token } = useAuth();
  const especialidade = fluxo.especialidade;

  const recurso = useRecurso(`agendamento-clinicas:${especialidade?.id ?? 'todas'}`, async () => {
    const [clinicas, profissionais] = await Promise.all([
      listarClinicas(undefined, token),
      especialidade
        ? listarProfissionais({ especialidade: especialidade.id }, token)
        : Promise.resolve([]),
    ]);

    return {
      clinicas: clinicas.filter((clinica) => clinica.ativo),
      profissionais: profissionais.filter((profissional) => profissional.ativo),
    };
  });

  const itens = useMemo<ItemClinica[]>(() => {
    const dados = recurso.dados;
    if (!dados) return [];

    if (!especialidade) {
      return dados.clinicas.map((clinica) => ({ clinica }));
    }

    const totalPorClinica = new Map<number, number>();
    dados.profissionais.forEach((profissional) => {
      const idClinica = Number(profissional.id_clinica);
      totalPorClinica.set(idClinica, (totalPorClinica.get(idClinica) ?? 0) + 1);
    });

    return dados.clinicas
      .map((clinica) => ({
        clinica,
        totalProfissionais: totalPorClinica.get(Number(clinica.id_clinica)) ?? 0,
      }))
      .filter((item) => (item.totalProfissionais ?? 0) > 0);
  }, [recurso.dados, especialidade]);

  function escolher(clinica: Clinica) {
    const resumo = resumoClinica(clinica);
    fluxo.definirClinica(resumo);
    router.push({
      pathname: '/(app)/agendamento/profissional',
      params: montarParametros({ especialidade: fluxo.especialidade, clinica: resumo }),
    });
  }

  function renderizarConteudo() {
    if (recurso.carregando) {
      return <Carregando mensagem="Carregando clínicas..." />;
    }

    if (recurso.erro) {
      return <EstadoErro mensagem={recurso.erro} aoTentarNovamente={recurso.recarregar} />;
    }

    if (itens.length === 0) {
      return (
        <EstadoVazio
          titulo="Nenhuma clínica encontrada"
          descricao={
            especialidade
              ? `Ainda não há clínicas com profissionais de ${especialidade.nome}.`
              : 'Tente novamente em instantes.'
          }
          acaoTitulo={especialidade ? 'Trocar especialidade' : undefined}
          aoAcao={especialidade ? () => router.back() : undefined}
        />
      );
    }

    return (
      <View style={estilos.lista}>
        {itens.map((item) => (
          <CartaoClinica
            key={item.clinica.id_clinica}
            clinica={item.clinica}
            especialidadeNome={especialidade?.nome}
            totalProfissionais={item.totalProfissionais}
            selecionada={fluxo.clinica?.id === Number(item.clinica.id_clinica)}
            aoPressionar={() => escolher(item.clinica)}
          />
        ))}
      </View>
    );
  }

  return (
    <Tela
      titulo="Escolha onde quer ser atendido"
      subtitulo={
        especialidade ? `Especialidade: ${especialidade.nome}` : 'Selecione uma clínica.'
      }
      aoVoltar={() => router.back()}
    >
      <Progresso atual={2} total={5} />

      {especialidade ? (
        <Toast mensagem={`Mostrando clínicas com ${especialidade.nome}.`} tom="info" />
      ) : null}

      {renderizarConteudo()}
    </Tela>
  );
}

const estilos = StyleSheet.create({
  lista: {
    gap: espacos.sm,
  },
});
