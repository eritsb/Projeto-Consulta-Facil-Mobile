import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import {
  Botao,
  Campo,
  Cartao,
  Carregando,
  EstadoVazio,
  Progresso,
  Tela,
  Toast,
  formatarDataLonga,
  formatarHora,
  nomeDiaSemana,
} from '../../componentes';
import { useAuth } from '../../contexto/AuthContext';
import { ApiError } from '../../servicos/api';
import { criarAgendamento } from '../../servicos/agendamentos';
import { cores, espacos } from '../../tema';
import { fontes } from '../../tema/fontes';
import { useFluxoAgendamento, useHidratarFluxo } from './contexto';
import { numeroParam, type ParametrosFluxo } from './parametros';

type LinhaProps = {
  rotulo: string;
  valor: string;
};

function LinhaResumo({ rotulo, valor }: LinhaProps) {
  return (
    <View style={estilos.linhaResumo}>
      <Text style={estilos.rotulo}>{rotulo}</Text>
      <Text style={estilos.valor}>{valor}</Text>
    </View>
  );
}

export function RevisaoTela() {
  const params = useLocalSearchParams() as ParametrosFluxo;
  useHidratarFluxo(params);

  const fluxo = useFluxoAgendamento();
  const { usuario, token } = useAuth();
  const [observacao, setObservacao] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  const profissional = fluxo.profissional;
  const disponibilidade = fluxo.disponibilidade;
  const aguardandoHidratacao =
    (!profissional || !disponibilidade) &&
    (Boolean(numeroParam(params.profissionalId)) ||
      Boolean(numeroParam(params.disponibilidadeId)));

  const especialidadeNome =
    fluxo.especialidade?.nome ?? profissional?.especialidadeNome ?? 'Não informada';
  const clinicaNome = fluxo.clinica?.nome ?? profissional?.clinicaNome ?? 'Não informada';
  const registro = [profissional?.conselho, profissional?.registro].filter(Boolean).join(' ');
  const data = disponibilidade?.data;
  const horaInicio = disponibilidade?.horaInicio;
  const horaFim = disponibilidade?.horaFim;

  async function confirmar() {
    if (!usuario || !profissional || !disponibilidade) return;

    setErro(null);
    setEnviando(true);

    try {
      const agendamento = await criarAgendamento(
        {
          id_paciente: usuario.id,
          id_profissional: profissional.id,
          id_disponibilidade: disponibilidade.id,
          observacao: observacao.trim() || undefined,
        },
        token,
      );

      router.replace({
        pathname: '/(app)/agendamento/sucesso',
        params: {
          agendamentoId: String(agendamento.id_agendamento),
          especialidade: agendamento.especialidade_nome,
          profissional: agendamento.profissional_nome,
          clinica: agendamento.clinica_nome,
          data: agendamento.data_consulta,
          hora: agendamento.hora_consulta,
          status: agendamento.status,
        },
      });
    } catch (falha) {
      if (falha instanceof ApiError && falha.status === 409) {
        setErro('Este horário acabou de ser ocupado. Escolha outro horário e tente novamente.');
      } else {
        setErro(
          falha instanceof Error
            ? falha.message
            : 'Não foi possível confirmar o agendamento. Tente novamente.',
        );
      }
    } finally {
      setEnviando(false);
    }
  }

  if (!profissional || !disponibilidade) {
    return (
      <Tela
        titulo="Confira seu agendamento"
        aoVoltar={() => router.back()}
      >
        <Progresso atual={5} total={5} />
        {aguardandoHidratacao ? (
          <Carregando mensagem="Carregando informações..." />
        ) : (
          <EstadoVazio
            simbolo="!"
            titulo="Informações incompletas"
            descricao="Faltam dados para concluir o agendamento. Recomece a escolha."
            acaoTitulo="Recomeçar agendamento"
            aoAcao={() =>
              router.replace({
                pathname: '/(app)/agendamento/especialidade',
                params: { reiniciar: '1' },
              })
            }
          />
        )}
      </Tela>
    );
  }

  return (
    <Tela
      titulo="Confira seu agendamento"
      subtitulo="Revise as informações antes de confirmar."
      aoVoltar={() => router.back()}
      rodape={
        <Botao
          titulo="Confirmar agendamento"
          aoPressionar={confirmar}
          carregando={enviando}
        />
      }
    >
      <Progresso atual={5} total={5} />

      {erro ? <Toast mensagem={erro} tom="erro" aoFechar={() => setErro(null)} /> : null}

      <Cartao>
        <LinhaResumo rotulo="Especialidade" valor={especialidadeNome} />
        <LinhaResumo rotulo="Profissional" valor={profissional.nome} />
        {registro ? <LinhaResumo rotulo="Registro" valor={registro} /> : null}
        <LinhaResumo rotulo="Clínica" valor={clinicaNome} />
        {fluxo.clinica?.endereco ? (
          <LinhaResumo rotulo="Endereço" valor={fluxo.clinica.endereco} />
        ) : null}
        {data ? (
          <LinhaResumo
            rotulo="Data"
            valor={`${nomeDiaSemana(data)}, ${formatarDataLonga(data)}`}
          />
        ) : null}
        {horaInicio ? (
          <LinhaResumo
            rotulo="Horário"
            valor={`${formatarHora(horaInicio)}${horaFim ? ` às ${formatarHora(horaFim)}` : ''}`}
          />
        ) : null}
      </Cartao>

      <Campo
        label="Observação (opcional)"
        valor={observacao}
        aoMudar={setObservacao}
        placeholder="Alguma informação que o profissional deva saber?"
        rotuloAcessivel="Observação do agendamento"
        multiline
        numeroLinhas={3}
        maxLength={280}
      />

      <Text style={estilos.aviso}>
        Ao confirmar, você reserva este horário. Chegue com antecedência ao local.
      </Text>
    </Tela>
  );
}

const estilos = StyleSheet.create({
  linhaResumo: {
    gap: 2,
    paddingVertical: espacos.xs,
    borderBottomWidth: 1,
    borderBottomColor: cores.borda,
  },
  rotulo: {
    fontSize: fontes.tamanho.xs,
    fontWeight: fontes.peso.forte,
    color: cores.textoSecundario,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  valor: {
    fontSize: fontes.tamanho.md,
    lineHeight: fontes.altura.md,
    fontWeight: fontes.peso.medio,
    color: cores.texto,
  },
  aviso: {
    fontSize: fontes.tamanho.sm,
    lineHeight: fontes.altura.sm,
    color: cores.textoSecundario,
  },
});
