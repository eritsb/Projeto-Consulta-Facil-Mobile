import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Botao } from '../../src/telas/auth/componentes/Botao';
import { TelaAuth } from '../../src/telas/auth/componentes/TelaAuth';
import { cores, espacos } from '../../src/tema/cores';

export default function BoasVindas() {
  return (
    <TelaAuth
      titulo="Cuide do seu próximo passo."
      subtitulo="Encontre especialidades, compare horários e agende seu atendimento de forma simples."
    >
      <View style={estilos.botoes}>
        <Botao titulo="Começar" aoPressionar={() => router.push('/(auth)/cadastro')} />
        <Botao
          titulo="Já tenho uma conta"
          variante="secundaria"
          aoPressionar={() => router.push('/(auth)/login')}
        />
      </View>

      <Text style={estilos.rodape}>
        O Consulta Fácil não substitui uma avaliação médica. Em emergências, procure um
        pronto-socorro.
      </Text>
    </TelaAuth>
  );
}

const estilos = StyleSheet.create({
  botoes: {
    gap: espacos.md,
    marginTop: espacos.md,
  },
  rodape: {
    marginTop: espacos.lg,
    fontSize: 13,
    lineHeight: 19,
    color: cores.textoSuave,
  },
});
