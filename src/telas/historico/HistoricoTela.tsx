import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import {
  BarraAbas,
  CartaoAgendamento,
  Carregando,
  EstadoErro,
  EstadoVazio,
  Tela,
  agendamentoEstaAtivo,
  dataHoraNoPassado,
  useRecurso,
} from '../../componentes';
import { useAuth } from '../../contexto/AuthContext';
import { listarAgendamentosPaciente } from '../../servicos/agendamentos';
import { cores, espacos } from '../../tema';
import { fontes } from '../../tema/fontes';

const PERIODOS: Record<string, number | null> = {
  todos: null,
  '30': 30,
  '180': 180,
  '365': 365,
};

function limiteDeDias(dias: number): string {
  const data = new Date();
  data.setDate(data.getDate() - dias);
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  return `${data.getFullYear()}-${mes}-${dia}`;
}

export function HistoricoTela() {
  const { usuario, token } = useAuth();
  const [periodo, setPeriodo] = useState('todos');

  const recurso = useRecurso(`historico:${usuario?.id ?? 0}`, async () => {
    if (!usuario) return [];
    const lista = await listarAgendamentosPaciente(usuario.id, token);

    return lista
      .filter(
        (agendamento) =>
          !agendamentoEstaAtivo(agendamento.status) ||
          dataHoraNoPassado(agendamento.data_consulta, agendamento.hora_consulta),
      )
      .sort((a, b) =>
        `${b.data_consulta}${b.hora_consulta}`.localeCompare(
          `${a.data_consulta}${a.hora_consulta}`,
        ),
      );
  });

  const itens = useMemo(() => {
    const lista = recurso.dados ?? [];
    const dias = PERIODOS[periodo];
    if (dias === null || dias === undefined) return lista;
    const limite = limiteDeDias(dias);
    return lista.filter((agendamento) => agendamento.data_consulta >= limite);
  }, [recurso.dados, periodo]);

  function renderizarConteudo() {
    if (recurso.carregando) {
      return <Carregando mensagem="Carregando histórico..." />;
    }

    if (recurso.erro) {
      return <EstadoErro mensagem={recurso.erro} aoTentarNovamente={recurso.recarregar} />;
    }

    if ((recurso.dados ?? []).length === 0) {
      return (
        <EstadoVazio
          titulo="Nenhuma consulta no histórico"
          descricao="Quando você tiver consultas passadas ou canceladas, elas aparecerão aqui."
          acaoTitulo="Agendar atendimento"
          aoAcao={() =>
            router.push({
              pathname: '/(app)/agendamento/especialidade',
              params: { reiniciar: '1' },
            })
          }
        />
      );
    }

    if (itens.length === 0) {
      return (
        <EstadoVazio
          titulo="Nenhum resultado neste período"
          descricao="Tente selecionar um período maior."
          acaoTitulo="Ver todos"
          aoAcao={() => setPeriodo('todos')}
        />
      );
    }

    return (
      <View style={estilos.lista}>
        <Text style={estilos.resumo}>
          {itens.length} {itens.length === 1 ? 'consulta' : 'consultas'}
        </Text>
        {itens.map((agendamento) => (
          <CartaoAgendamento
            key={agendamento.id_agendamento}
            agendamento={agendamento}
            aoPressionar={() =>
              router.push(`/(app)/agendamentos/${agendamento.id_agendamento}`)
            }
          />
        ))}
      </View>
    );
  }

  return (
    <Tela
      titulo="Histórico"
      subtitulo="Consultas passadas e canceladas."
      aoVoltar={() => router.back()}
    >
      <BarraAbas
        ativa={periodo}
        aoMudar={setPeriodo}
        abas={[
          { chave: 'todos', rotulo: 'Todos' },
          { chave: '30', rotulo: '30 dias' },
          { chave: '180', rotulo: '6 meses' },
          { chave: '365', rotulo: '1 ano' },
        ]}
      />

      {renderizarConteudo()}
    </Tela>
  );
}

const estilos = StyleSheet.create({
  lista: {
    gap: espacos.sm,
  },
  resumo: {
    fontSize: fontes.tamanho.xs,
    fontWeight: fontes.peso.forte,
    color: cores.textoSecundario,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
