import { StyleSheet, Text, View } from 'react-native';

import type { Clinica } from '../tipos/api';
import { cores, espacos } from '../tema/cores';
import { fontes } from '../tema/fontes';
import { Cartao } from './Cartao';
import { Etiqueta } from './Etiqueta';

type Props = {
  clinica: Clinica;
  aoPressionar: () => void;
  especialidadeNome?: string;
  totalProfissionais?: number;
  selecionada?: boolean;
};

export function CartaoClinica({
  clinica,
  aoPressionar,
  especialidadeNome,
  totalProfissionais,
  selecionada = false,
}: Props) {
  const resumoProfissionais =
    totalProfissionais === undefined
      ? null
      : totalProfissionais === 0
        ? 'Sem profissionais cadastrados'
        : `${totalProfissionais} ${totalProfissionais === 1 ? 'profissional disponível' : 'profissionais disponíveis'}`;

  return (
    <Cartao
      aoPressionar={aoPressionar}
      selecionado={selecionada}
      rotuloAcessivel={`Clínica ${clinica.nome}${selecionada ? ', selecionada' : ''}`}
      dicaAcessivel="Toque para ver os profissionais desta clínica"
    >
      <View style={estilos.linha}>
        <Text style={estilos.nome}>{clinica.nome}</Text>
        <Text style={estilos.seta}>›</Text>
      </View>

      <Text style={estilos.info}>{clinica.endereco}</Text>

      {clinica.horario_funcionamento ? (
        <Text style={estilos.info}>Funcionamento: {clinica.horario_funcionamento}</Text>
      ) : null}

      {clinica.telefone ? <Text style={estilos.info}>Telefone: {clinica.telefone}</Text> : null}

      {especialidadeNome ? <Etiqueta texto={especialidadeNome} tom="info" /> : null}

      {resumoProfissionais ? <Text style={estilos.info}>{resumoProfissionais}</Text> : null}
    </Cartao>
  );
}

const estilos = StyleSheet.create({
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: espacos.sm,
  },
  nome: {
    flex: 1,
    fontSize: fontes.tamanho.lg,
    lineHeight: fontes.altura.lg,
    fontWeight: fontes.peso.forte,
    color: cores.texto,
  },
  seta: {
    fontSize: 24,
    color: cores.primaria,
  },
  info: {
    fontSize: fontes.tamanho.sm,
    lineHeight: fontes.altura.sm,
    color: cores.textoSecundario,
  },
});
