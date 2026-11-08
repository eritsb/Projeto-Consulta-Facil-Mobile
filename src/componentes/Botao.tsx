import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { cores, espacos, raios } from '../tema/cores';
import { fontes } from '../tema/fontes';

type Variante = 'primaria' | 'secundaria' | 'texto' | 'perigo';

type Props = {
  titulo: string;
  aoPressionar: () => void;
  variante?: Variante;
  carregando?: boolean;
  desabilitado?: boolean;
  rotuloAcessivel?: string;
  estilo?: StyleProp<ViewStyle>;
  compacto?: boolean;
};

const CORES_TEXTO: Record<Variante, string> = {
  primaria: cores.superficie,
  secundaria: cores.primaria,
  texto: cores.primaria,
  perigo: cores.superficie,
};

const CORES_ESTILO: Record<Variante, ViewStyle> = {
  primaria: { backgroundColor: cores.primaria },
  secundaria: { backgroundColor: cores.superficie, borderWidth: 1, borderColor: cores.primaria },
  texto: { backgroundColor: 'transparent' },
  perigo: { backgroundColor: cores.erro },
};

export function Botao({
  titulo,
  aoPressionar,
  variante = 'primaria',
  carregando = false,
  desabilitado = false,
  rotuloAcessivel,
  estilo,
  compacto = false,
}: Props) {
  const inativo = desabilitado || carregando;

  return (
    <Pressable
      onPress={aoPressionar}
      disabled={inativo}
      accessibilityRole="button"
      accessibilityLabel={rotuloAcessivel ?? titulo}
      accessibilityState={{ disabled: inativo, busy: carregando }}
      hitSlop={8}
      style={({ pressed }) => [
        estilos.base,
        compacto ? estilos.compacto : null,
        CORES_ESTILO[variante],
        inativo ? estilos.inativo : null,
        pressed && !inativo ? estilos.pressionado : null,
        estilo,
      ]}
    >
      <View style={estilos.conteudo}>
        {carregando ? (
          <ActivityIndicator color={CORES_TEXTO[variante]} style={estilos.indicador} />
        ) : null}
        <Text style={[estilos.texto, { color: CORES_TEXTO[variante] }]}>{titulo}</Text>
      </View>
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
    paddingVertical: espacos.sm,
  },
  compacto: {
    minHeight: 44,
    paddingHorizontal: espacos.md,
  },
  conteudo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: espacos.sm,
  },
  indicador: {
    marginRight: espacos.xs,
  },
  inativo: {
    opacity: 0.6,
  },
  pressionado: {
    opacity: 0.85,
  },
  texto: {
    fontSize: fontes.tamanho.md,
    fontWeight: fontes.peso.forte,
    textAlign: 'center',
  },
});
