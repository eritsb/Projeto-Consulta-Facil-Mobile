import { type ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { cores, espacos, raios } from '../../../tema/cores';

type Props = {
  titulo: string;
  subtitulo?: string;
  aoVoltar?: () => void;
  children: ReactNode;
};

export function TelaAuth({ titulo, subtitulo, aoVoltar, children }: Props) {
  return (
    <SafeAreaView style={estilos.seguro}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={estilos.teclado}
      >
        <ScrollView
          contentContainerStyle={estilos.conteudo}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {aoVoltar ? (
            <Pressable
              onPress={aoVoltar}
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel="Voltar"
              style={estilos.voltar}
            >
              <Text style={estilos.voltarTexto}>← Voltar</Text>
            </Pressable>
          ) : null}

          <View style={estilos.logo}>
            <Text style={estilos.logoTexto}>CF</Text>
          </View>

          <Text style={estilos.titulo}>{titulo}</Text>
          {subtitulo ? <Text style={estilos.subtitulo}>{subtitulo}</Text> : null}

          <View style={estilos.formulario}>{children}</View>
        </ScrollView>
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
    flexGrow: 1,
    paddingHorizontal: espacos.lg,
    paddingTop: espacos.md,
    paddingBottom: espacos.xl,
  },
  voltar: {
    alignSelf: 'flex-start',
    paddingVertical: espacos.sm,
    marginBottom: espacos.md,
  },
  voltarTexto: {
    color: cores.primaria,
    fontSize: 16,
    fontWeight: '600',
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: raios.lg,
    backgroundColor: cores.primaria,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: espacos.lg,
  },
  logoTexto: {
    color: cores.superficie,
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 1,
  },
  titulo: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '800',
    color: cores.texto,
    marginBottom: espacos.sm,
  },
  subtitulo: {
    fontSize: 16,
    lineHeight: 24,
    color: cores.textoSecundario,
    marginBottom: espacos.lg,
  },
  formulario: {
    gap: espacos.md,
    marginTop: espacos.sm,
  },
});
