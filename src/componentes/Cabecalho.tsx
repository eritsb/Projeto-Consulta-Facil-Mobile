import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { cores, espacos } from '../tema/cores';
import { fontes } from '../tema/fontes';

type Props = {
  titulo: string;
  subtitulo?: string;
  aoVoltar?: () => void;
  acaoDireita?: ReactNode;
  compacto?: boolean;
};

export function Cabecalho({ titulo, subtitulo, aoVoltar, acaoDireita, compacto = false }: Props) {
  return (
    <View style={[estilos.container, compacto ? estilos.containerCompacto : null]}>
      <View style={estilos.linha}>
        {aoVoltar ? (
          <Pressable
            onPress={aoVoltar}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Voltar"
            style={({ pressed }) => [estilos.botaoIcone, pressed ? estilos.pressionado : null]}
          >
            <Text style={estilos.seta}>←</Text>
          </Pressable>
        ) : (
          <View style={estilos.espaco} />
        )}

        <View style={estilos.textos}>
          <Text
            accessibilityRole="header"
            style={[estilos.titulo, compacto ? estilos.tituloCompacto : null]}
          >
            {titulo}
          </Text>
          {subtitulo ? <Text style={estilos.subtitulo}>{subtitulo}</Text> : null}
        </View>

        <View style={estilos.direita}>{acaoDireita}</View>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    paddingHorizontal: espacos.lg,
    paddingTop: espacos.md,
    paddingBottom: espacos.sm,
  },
  containerCompacto: {
    paddingTop: espacos.sm,
    paddingBottom: espacos.xs,
  },
  linha: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: espacos.sm,
  },
  botaoIcone: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -espacos.sm,
  },
  seta: {
    fontSize: 26,
    color: cores.primaria,
    lineHeight: 30,
  },
  espaco: {
    width: 44,
    height: 44,
  },
  textos: {
    flex: 1,
    gap: espacos.xs,
  },
  titulo: {
    fontSize: fontes.tamanho.xxl,
    lineHeight: fontes.altura.xxl,
    fontWeight: fontes.peso.extra,
    color: cores.texto,
  },
  tituloCompacto: {
    fontSize: fontes.tamanho.xl,
    lineHeight: fontes.altura.xl,
  },
  subtitulo: {
    fontSize: fontes.tamanho.sm,
    lineHeight: fontes.altura.sm,
    color: cores.textoSecundario,
  },
  direita: {
    minWidth: 44,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  pressionado: {
    opacity: 0.6,
  },
});
