import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { cores, espacos, raios } from '../tema/cores';
import { fontes } from '../tema/fontes';

export type Aba = {
  chave: string;
  rotulo: string;
  contagem?: number;
};

type Props = {
  abas: Aba[];
  ativa: string;
  aoMudar: (chave: string) => void;
};

export function BarraAbas({ abas, ativa, aoMudar }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={estilos.conteudo}
      accessibilityRole="tablist"
    >
      {abas.map((aba) => {
        const selecionada = aba.chave === ativa;
        const rotulo =
          aba.contagem === undefined ? aba.rotulo : `${aba.rotulo} (${aba.contagem})`;

        return (
          <Pressable
            key={aba.chave}
            onPress={() => aoMudar(aba.chave)}
            accessibilityRole="tab"
            accessibilityState={{ selected: selecionada }}
            accessibilityLabel={rotulo}
            style={({ pressed }) => [
              estilos.aba,
              selecionada ? estilos.abaAtiva : null,
              pressed ? estilos.pressionada : null,
            ]}
          >
            <Text style={[estilos.texto, selecionada ? estilos.textoAtivo : null]}>{rotulo}</Text>
            {selecionada ? <View style={estilos.marcador} /> : null}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  conteudo: {
    gap: espacos.sm,
    paddingVertical: espacos.xs,
  },
  aba: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: espacos.md,
    borderRadius: raios.pill,
    backgroundColor: cores.superficie,
    borderWidth: 1,
    borderColor: cores.bordaForte,
  },
  abaAtiva: {
    backgroundColor: cores.primaria,
    borderColor: cores.primaria,
  },
  pressionada: {
    opacity: 0.85,
  },
  texto: {
    fontSize: fontes.tamanho.sm,
    fontWeight: fontes.peso.medio,
    color: cores.textoSecundario,
  },
  textoAtivo: {
    color: cores.superficie,
    fontWeight: fontes.peso.forte,
  },
  marcador: {
    position: 'absolute',
    bottom: 6,
    left: espacos.md,
    right: espacos.md,
    height: 2,
    borderRadius: raios.pill,
    backgroundColor: cores.superficie,
  },
});
