import { StyleSheet, Text, View } from 'react-native';

import { cores, espacos, raios } from '../tema/cores';
import { fontes } from '../tema/fontes';
import type { TomEtiqueta } from './formatos';

type Props = {
  texto: string;
  tom?: TomEtiqueta;
};

const PALETA: Record<TomEtiqueta, { fundo: string; cor: string; simbolo: string }> = {
  sucesso: { fundo: cores.sucessoFundo, cor: cores.sucesso, simbolo: '✓' },
  erro: { fundo: cores.erroFundo, cor: cores.erro, simbolo: '!' },
  aviso: { fundo: cores.avisoFundo, cor: cores.aviso, simbolo: '!' },
  info: { fundo: cores.infoFundo, cor: cores.primariaEscura, simbolo: 'i' },
  neutro: { fundo: cores.fundoSuave, cor: cores.textoSecundario, simbolo: '•' },
};

export function Etiqueta({ texto, tom = 'neutro' }: Props) {
  const coresTom = PALETA[tom];

  return (
    <View
      style={[estilos.caixa, { backgroundColor: coresTom.fundo, borderColor: coresTom.cor }]}
      accessibilityLabel={`Status: ${texto}`}
    >
      <Text style={[estilos.simbolo, { color: coresTom.cor }]}>{coresTom.simbolo}</Text>
      <Text style={[estilos.texto, { color: coresTom.cor }]}>{texto}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  caixa: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: espacos.xs,
    borderWidth: 1,
    borderRadius: raios.pill,
    paddingHorizontal: espacos.sm,
    paddingVertical: 2,
  },
  simbolo: {
    fontSize: fontes.tamanho.xs,
    fontWeight: fontes.peso.extra,
  },
  texto: {
    fontSize: fontes.tamanho.xs,
    fontWeight: fontes.peso.forte,
  },
});
