import { StyleSheet, Text, View } from 'react-native';

import type { Profissional } from '../tipos/api';
import { cores, espacos } from '../tema/cores';
import { fontes } from '../tema/fontes';
import { Cartao } from './Cartao';
import { Etiqueta } from './Etiqueta';

type Props = {
  profissional: Profissional;
  aoPressionar: () => void;
  selecionado?: boolean;
};

export function CartaoProfissional({
  profissional,
  aoPressionar,
  selecionado = false,
}: Props) {
  const registro = [profissional.conselho, profissional.registro_profissional]
    .filter(Boolean)
    .join(' ');

  return (
    <Cartao
      aoPressionar={aoPressionar}
      selecionado={selecionado}
      rotuloAcessivel={`Profissional ${profissional.nome}${selecionado ? ', selecionado' : ''}`}
      dicaAcessivel="Toque para ver os horários deste profissional"
    >
      <View style={estilos.linha}>
        <Text style={estilos.nome}>{profissional.nome}</Text>
        <Text style={estilos.seta}>›</Text>
      </View>

      {profissional.especialidade_nome ? (
        <Etiqueta texto={profissional.especialidade_nome} tom="info" />
      ) : null}

      {profissional.clinica_nome ? (
        <Text style={estilos.info}>{profissional.clinica_nome}</Text>
      ) : null}

      {registro ? <Text style={estilos.info}>Registro: {registro}</Text> : null}
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
