import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

import { cores, espacos, raios } from '../../../tema/cores';

type Props = {
  titulo: string;
  aoPressionar: () => void;
  variante?: 'primaria' | 'secundaria';
  carregando?: boolean;
  desabilitado?: boolean;
};

export function Botao({
  titulo,
  aoPressionar,
  variante = 'primaria',
  carregando = false,
  desabilitado = false,
}: Props) {
  const inativo = desabilitado || carregando;
  const secundario = variante === 'secundaria';

  return (
    <Pressable
      onPress={aoPressionar}
      disabled={inativo}
      accessibilityRole="button"
      accessibilityLabel={titulo}
      accessibilityState={{ disabled: inativo, busy: carregando }}
      style={({ pressed }) => [
        estilos.base,
        secundario ? estilos.secundario : estilos.primario,
        inativo ? estilos.inativo : null,
        pressed && !inativo ? estilos.pressionado : null,
      ]}
    >
      {carregando ? (
        <ActivityIndicator color={secundario ? cores.primaria : cores.superficie} />
      ) : (
        <Text style={[estilos.texto, secundario ? estilos.textoSecundario : estilos.textoPrimario]}>
          {titulo}
        </Text>
      )}
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  base: {
    minHeight: 52,
    borderRadius: raios.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: espacos.lg,
  },
  primario: {
    backgroundColor: cores.primaria,
  },
  secundario: {
    backgroundColor: cores.superficie,
    borderWidth: 1,
    borderColor: cores.primaria,
  },
  inativo: {
    opacity: 0.6,
  },
  pressionado: {
    opacity: 0.85,
  },
  texto: {
    fontSize: 16,
    fontWeight: '700',
  },
  textoPrimario: {
    color: cores.superficie,
  },
  textoSecundario: {
    color: cores.primaria,
  },
});
