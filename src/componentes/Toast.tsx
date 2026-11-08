import { Pressable, StyleSheet, Text, View } from 'react-native';

import { cores, espacos, raios } from '../tema/cores';
import { fontes } from '../tema/fontes';
import type { TomEtiqueta } from './formatos';

type Props = {
  mensagem: string;
  tom?: Exclude<TomEtiqueta, 'neutro'>;
  aoFechar?: () => void;
};

const FUNDOS: Record<Exclude<TomEtiqueta, 'neutro'>, string> = {
  erro: cores.erroFundo,
  sucesso: cores.sucessoFundo,
  aviso: cores.avisoFundo,
  info: cores.infoFundo,
};

const CORES: Record<Exclude<TomEtiqueta, 'neutro'>, string> = {
  erro: cores.erro,
  sucesso: cores.sucesso,
  aviso: cores.aviso,
  info: cores.primariaEscura,
};

const SIMBOLOS: Record<Exclude<TomEtiqueta, 'neutro'>, string> = {
  erro: '!',
  sucesso: '✓',
  aviso: '!',
  info: 'i',
};

export function Toast({ mensagem, tom = 'info', aoFechar }: Props) {
  return (
    <View
      style={[estilos.caixa, { backgroundColor: FUNDOS[tom], borderColor: CORES[tom] }]}
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
    >
      <View style={[estilos.simbolo, { borderColor: CORES[tom] }]}>
        <Text style={[estilos.simboloTexto, { color: CORES[tom] }]}>{SIMBOLOS[tom]}</Text>
      </View>

      <Text style={[estilos.texto, { color: CORES[tom] }]}>{mensagem}</Text>

      {aoFechar ? (
        <Pressable
          onPress={aoFechar}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Fechar aviso"
          style={estilos.fechar}
        >
          <Text style={[estilos.fecharTexto, { color: CORES[tom] }]}>×</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const estilos = StyleSheet.create({
  caixa: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacos.sm,
    borderWidth: 1,
    borderRadius: raios.md,
    padding: espacos.md,
  },
  simbolo: {
    width: 24,
    height: 24,
    borderRadius: raios.pill,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  simboloTexto: {
    fontSize: fontes.tamanho.xs,
    fontWeight: fontes.peso.extra,
  },
  texto: {
    flex: 1,
    fontSize: fontes.tamanho.sm,
    lineHeight: fontes.altura.sm,
    fontWeight: fontes.peso.medio,
  },
  fechar: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: -espacos.sm,
  },
  fecharTexto: {
    fontSize: 22,
  },
});
