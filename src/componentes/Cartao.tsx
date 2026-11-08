import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { cores, espacos, raios } from '../tema/cores';
import { sombras } from '../tema/sombras';

type Props = {
  children: ReactNode;
  aoPressionar?: () => void;
  rotuloAcessivel?: string;
  dicaAcessivel?: string;
  selecionado?: boolean;
  estilo?: StyleProp<ViewStyle>;
};

export function Cartao({
  children,
  aoPressionar,
  rotuloAcessivel,
  dicaAcessivel,
  selecionado = false,
  estilo,
}: Props) {
  if (!aoPressionar) {
    return <View style={[estilos.base, selecionado ? estilos.selecionado : null, estilo]}>{children}</View>;
  }

  return (
    <Pressable
      onPress={aoPressionar}
      accessibilityRole="button"
      accessibilityLabel={rotuloAcessivel}
      accessibilityHint={dicaAcessivel}
      accessibilityState={{ selected: selecionado }}
      style={({ pressed }) => [
        estilos.base,
        selecionado ? estilos.selecionado : null,
        pressed ? estilos.pressionado : null,
        estilo,
      ]}
    >
      {children}
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  base: {
    backgroundColor: cores.superficie,
    borderRadius: raios.lg,
    borderWidth: 1,
    borderColor: cores.borda,
    padding: espacos.md,
    gap: espacos.sm,
    ...sombras.cartao,
  },
  selecionado: {
    borderColor: cores.primaria,
    borderWidth: 2,
    backgroundColor: cores.primariaClara,
  },
  pressionado: {
    opacity: 0.9,
  },
});
