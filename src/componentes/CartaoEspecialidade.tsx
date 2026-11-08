import { StyleSheet, Text, View } from 'react-native';

import type { Especialidade } from '../tipos/api';
import { cores, espacos } from '../tema/cores';
import { fontes } from '../tema/fontes';
import { Cartao } from './Cartao';
import { Etiqueta } from './Etiqueta';

type Props = {
  especialidade: Especialidade;
  aoPressionar: () => void;
  selecionada?: boolean;
};

export function CartaoEspecialidade({ especialidade, aoPressionar, selecionada = false }: Props) {
  return (
    <Cartao
      aoPressionar={aoPressionar}
      selecionado={selecionada}
      rotuloAcessivel={`Especialidade ${especialidade.nome}${selecionada ? ', selecionada' : ''}`}
      dicaAcessivel="Toque para escolher esta especialidade"
    >
      <View style={estilos.linha}>
        <Text style={estilos.nome}>{especialidade.nome}</Text>
        <Text style={estilos.seta}>›</Text>
      </View>

      {especialidade.descricao ? (
        <Text style={estilos.descricao}>{especialidade.descricao}</Text>
      ) : null}

      {selecionada ? <Etiqueta texto="Selecionada" tom="info" /> : null}
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
  descricao: {
    fontSize: fontes.tamanho.sm,
    lineHeight: fontes.altura.sm,
    color: cores.textoSecundario,
  },
});
