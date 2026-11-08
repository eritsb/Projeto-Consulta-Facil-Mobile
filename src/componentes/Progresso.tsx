import { StyleSheet, Text, View } from 'react-native';

import { cores, espacos, raios } from '../tema/cores';
import { fontes } from '../tema/fontes';

type Props = {
  atual: number;
  total: number;
  rotulo?: string;
};

export function Progresso({ atual, total, rotulo }: Props) {
  const passos = Array.from({ length: total }, (_, indice) => indice + 1);
  const texto = `Etapa ${atual} de ${total}`;

  return (
    <View
      style={estilos.container}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 1, max: total, now: atual, text: texto }}
    >
      <View style={estilos.linhaTexto}>
        <Text style={estilos.texto}>{texto}</Text>
        {rotulo ? <Text style={estilos.rotulo}>{rotulo}</Text> : null}
      </View>
      <View style={estilos.barra}>
        {passos.map((passo) => (
          <View
            key={passo}
            style={[estilos.segmento, passo <= atual ? estilos.segmentoAtivo : null]}
          />
        ))}
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    gap: espacos.xs,
  },
  linhaTexto: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  texto: {
    fontSize: fontes.tamanho.xs,
    fontWeight: fontes.peso.forte,
    color: cores.primariaEscura,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  rotulo: {
    fontSize: fontes.tamanho.xs,
    color: cores.textoSecundario,
  },
  barra: {
    flexDirection: 'row',
    gap: espacos.xs,
  },
  segmento: {
    flex: 1,
    height: 6,
    borderRadius: raios.pill,
    backgroundColor: cores.borda,
  },
  segmentoAtivo: {
    backgroundColor: cores.primaria,
  },
});
