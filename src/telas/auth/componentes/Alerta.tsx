import { StyleSheet, Text, View } from 'react-native';

import { cores, espacos, raios } from '../../../tema/cores';

type Props = {
  mensagem: string;
  tipo?: 'erro' | 'sucesso' | 'info';
};

export function Alerta({ mensagem, tipo = 'erro' }: Props) {
  const fundo =
    tipo === 'erro' ? cores.erroFundo : tipo === 'sucesso' ? cores.sucessoFundo : cores.infoFundo;
  const cor =
    tipo === 'erro' ? cores.erro : tipo === 'sucesso' ? cores.sucesso : cores.primaria;

  return (
    <View
      style={[estilos.caixa, { backgroundColor: fundo, borderColor: cor }]}
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
    >
      <Text style={[estilos.texto, { color: cor }]}>{mensagem}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  caixa: {
    borderWidth: 1,
    borderRadius: raios.md,
    padding: espacos.md,
  },
  texto: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
});
