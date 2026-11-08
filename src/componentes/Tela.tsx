import type { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { cores, espacos } from '../tema/cores';
import { Cabecalho } from './Cabecalho';

type Props = {
  titulo: string;
  subtitulo?: string;
  aoVoltar?: () => void;
  acaoDireita?: ReactNode;
  children: ReactNode;
  rodape?: ReactNode;
  rolagem?: boolean;
  estiloConteudo?: StyleProp<ViewStyle>;
  cabecalhoCompacto?: boolean;
};

export function Tela({
  titulo,
  subtitulo,
  aoVoltar,
  acaoDireita,
  children,
  rodape,
  rolagem = true,
  estiloConteudo,
  cabecalhoCompacto = false,
}: Props) {
  return (
    <SafeAreaView style={estilos.seguro} edges={['top', 'left', 'right', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={estilos.teclado}
      >
        <Cabecalho
          titulo={titulo}
          subtitulo={subtitulo}
          aoVoltar={aoVoltar}
          acaoDireita={acaoDireita}
          compacto={cabecalhoCompacto}
        />

        {rolagem ? (
          <ScrollView
            contentContainerStyle={[estilos.conteudo, estiloConteudo]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        ) : (
          <View style={[estilos.conteudoFixo, estiloConteudo]}>{children}</View>
        )}

        {rodape ? <View style={estilos.rodape}>{rodape}</View> : null}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  seguro: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  teclado: {
    flex: 1,
  },
  conteudo: {
    paddingHorizontal: espacos.lg,
    paddingBottom: espacos.xl,
    gap: espacos.md,
  },
  conteudoFixo: {
    flex: 1,
    paddingHorizontal: espacos.lg,
    paddingBottom: espacos.md,
    gap: espacos.md,
  },
  rodape: {
    paddingHorizontal: espacos.lg,
    paddingVertical: espacos.md,
    borderTopWidth: 1,
    borderTopColor: cores.borda,
    backgroundColor: cores.superficie,
    gap: espacos.sm,
  },
});
