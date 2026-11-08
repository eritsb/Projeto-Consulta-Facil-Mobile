import { StyleSheet, Text, View } from 'react-native';

import type { Agendamento } from '../tipos/api';
import { cores, espacos } from '../tema/cores';
import { fontes } from '../tema/fontes';
import { Cartao } from './Cartao';
import { Etiqueta } from './Etiqueta';
import { etiquetaDoStatus, formatarDataLonga, formatarHora, nomeDiaSemana } from './formatos';

type Props = {
  agendamento: Agendamento;
  aoPressionar?: () => void;
  compacto?: boolean;
};

export function CartaoAgendamento({ agendamento, aoPressionar, compacto = false }: Props) {
  const status = etiquetaDoStatus(agendamento.status);
  const dia = nomeDiaSemana(agendamento.data_consulta);
  const data = formatarDataLonga(agendamento.data_consulta, false);
  const hora = formatarHora(agendamento.hora_consulta);
  const dataTexto = dia ? `${dia}, ${data}` : data;

  const rotulo = [
    agendamento.especialidade_nome,
    agendamento.profissional_nome,
    agendamento.clinica_nome,
    dataTexto,
    `às ${hora}`,
    status.texto,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <Cartao
      aoPressionar={aoPressionar}
      rotuloAcessivel={aoPressionar ? `Agendamento: ${rotulo}` : undefined}
      dicaAcessivel={aoPressionar ? 'Toque para ver os detalhes do agendamento' : undefined}
    >
      <View style={estilos.topo}>
        <Text style={estilos.especialidade}>{agendamento.especialidade_nome}</Text>
        <Etiqueta texto={status.texto} tom={status.tom} />
      </View>

      <Text style={estilos.profissional}>{agendamento.profissional_nome}</Text>

      {compacto ? null : (
        <Text style={estilos.info}>{agendamento.clinica_nome}</Text>
      )}

      <Text style={estilos.data}>
        {dataTexto} • {hora}
      </Text>
    </Cartao>
  );
}

const estilos = StyleSheet.create({
  topo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: espacos.sm,
  },
  especialidade: {
    flex: 1,
    fontSize: fontes.tamanho.lg,
    lineHeight: fontes.altura.lg,
    fontWeight: fontes.peso.forte,
    color: cores.texto,
  },
  profissional: {
    fontSize: fontes.tamanho.md,
    lineHeight: fontes.altura.md,
    color: cores.textoSecundario,
  },
  info: {
    fontSize: fontes.tamanho.sm,
    lineHeight: fontes.altura.sm,
    color: cores.textoSecundario,
  },
  data: {
    fontSize: fontes.tamanho.sm,
    lineHeight: fontes.altura.sm,
    color: cores.primariaEscura,
    fontWeight: fontes.peso.forte,
    marginTop: espacos.xs,
  },
});
