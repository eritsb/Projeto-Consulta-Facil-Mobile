import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text } from 'react-native';

import { Botao } from '../../src/telas/auth/componentes/Botao';
import { TelaAuth } from '../../src/telas/auth/componentes/TelaAuth';
import { cores, espacos } from '../../src/tema/cores';

export default function EmailEnviado() {
  const { email } = useLocalSearchParams<{ email?: string }>();

  return (
    <TelaAuth titulo="Confira seu e-mail" subtitulo="As instruções de recuperação foram enviadas.">
      <Text style={estilos.texto}>
        {email
          ? `Enviamos as instruções para ${email}. Confira também a caixa de spam.`
          : 'Enviamos as instruções para o e-mail informado. Confira também a caixa de spam.'}
      </Text>

      <Botao titulo="Voltar ao login" aoPressionar={() => router.replace('/(auth)/login')} />
    </TelaAuth>
  );
}

const estilos = StyleSheet.create({
  texto: {
    fontSize: 16,
    lineHeight: 24,
    color: cores.textoSecundario,
    marginBottom: espacos.md,
  },
});
