import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import {
  Botao,
  Campo,
  CartaoEspecialidade,
  Carregando,
  EstadoErro,
  EstadoVazio,
  Progresso,
  Tela,
  Toast,
  useDebounce,
  useRecurso,
} from '../../componentes';
import { useAuth } from '../../contexto/AuthContext';
import { listarEspecialidades } from '../../servicos/catalogo';
import { espacos } from '../../tema';
import { useFluxoAgendamento, useHidratarFluxo } from './contexto';
import {
  montarParametros,
  resumoEspecialidade,
  type EspecialidadeResumo,
  type ParametrosFluxo,
} from './parametros';

export function EspecialidadeTela() {
  const params = useLocalSearchParams() as ParametrosFluxo;
  useHidratarFluxo(params);

  const fluxo = useFluxoAgendamento();
  const { token } = useAuth();
  const [termo, setTermo] = useState('');
  const termoAdiado = useDebounce(termo);

  const recurso = useRecurso(`agendamento-especialidades:${termoAdiado}`, async () => {
    const lista = await listarEspecialidades(termoAdiado || undefined, token);
    return lista.filter((especialidade) => especialidade.ativo);
  });

  function irParaClinica(especialidade: EspecialidadeResumo) {
    fluxo.definirEspecialidade(especialidade);
    router.push({
      pathname: '/(app)/agendamento/clinica',
      params: montarParametros({ especialidade }),
    });
  }

  function renderizarLista() {
    if (recurso.carregando) {
      return <Carregando mensagem="Carregando especialidades..." />;
    }

    if (recurso.erro) {
      return <EstadoErro mensagem={recurso.erro} aoTentarNovamente={recurso.recarregar} />;
    }

    const lista = recurso.dados ?? [];

    if (lista.length === 0) {
      return termoAdiado ? (
        <EstadoVazio
          simbolo="!"
          titulo="Nenhuma especialidade encontrada"
          descricao={`Não encontramos especialidades para "${termoAdiado}". Tente outro termo.`}
        />
      ) : (
        <EstadoVazio
          titulo="Nenhuma especialidade disponível"
          descricao="Tente novamente em instantes."
        />
      );
    }

    return (
      <View style={estilos.lista}>
        {lista.map((especialidade) => (
          <CartaoEspecialidade
            key={especialidade.id_especialidade}
            especialidade={especialidade}
            selecionada={fluxo.especialidade?.id === Number(especialidade.id_especialidade)}
            aoPressionar={() => irParaClinica(resumoEspecialidade(especialidade))}
          />
        ))}
      </View>
    );
  }

  return (
    <Tela
      titulo="Qual atendimento você procura?"
      subtitulo="Escolha uma especialidade para começar."
      aoVoltar={() => router.back()}
    >
      <Progresso atual={1} total={5} />

      {fluxo.especialidade ? (
        <Toast
          mensagem={`Especialidade pré-selecionada: ${fluxo.especialidade.nome}.`}
          tom="info"
        />
      ) : null}

      {fluxo.especialidade ? (
        <Botao
          titulo={`Continuar com ${fluxo.especialidade.nome}`}
          aoPressionar={() => irParaClinica(fluxo.especialidade as EspecialidadeResumo)}
        />
      ) : null}

      <Campo
        valor={termo}
        aoMudar={setTermo}
        placeholder="Buscar especialidade"
        rotuloAcessivel="Buscar especialidade"
        aoLimpar={() => setTermo('')}
      />

      {renderizarLista()}
    </Tela>
  );
}

const estilos = StyleSheet.create({
  lista: {
    gap: espacos.sm,
  },
});
