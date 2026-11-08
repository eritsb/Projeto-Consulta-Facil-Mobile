import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '../../src/contexto/AuthContext';
import { Botao } from '../../src/telas/auth/componentes/Botao';
import { cores, espacos, raios } from '../../src/tema/cores';

export default function Inicio() {
  const { usuario, sair } = useAuth();
  const primeiroNome = usuario?.nome.split(' ')[0] ?? '';

  async function aoSair() {
    await sair();
    router.replace('/(auth)/boas-vindas');
  }

  return (
    <SafeAreaView style={estilos.seguro}>
      <View style={estilos.conteudo}>
        <Text style={estilos.saudacao}>Olá, {primeiroNome}!</Text>
        <Text style={estilos.titulo}>Como podemos ajudar?</Text>

        <View style={estilos.card}>
          <Text style={estilos.cardTitulo}>Área do paciente</Text>
          <Text style={estilos.cardTexto}>
            A tela inicial completa será implementada pelo P2. Aqui ficarão o próximo
            atendimento, os atalhos de especialidades e o acesso à triagem.
          </Text>
        </View>

        <Botao titulo="Sair da conta" variante="secundaria" aoPressionar={aoSair} />
      </View>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  seguro: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  conteudo: {
    flex: 1,
    padding: espacos.lg,
    gap: espacos.md,
  },
  saudacao: {
    fontSize: 16,
    color: cores.textoSecundario,
  },
  titulo: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '800',
    color: cores.texto,
    marginBottom: espacos.sm,
  },
  card: {
    backgroundColor: cores.superficie,
    borderRadius: raios.lg,
    borderWidth: 1,
    borderColor: cores.borda,
    padding: espacos.lg,
    gap: espacos.sm,
    marginBottom: espacos.md,
  },
  cardTitulo: {
    fontSize: 18,
    fontWeight: '700',
    color: cores.texto,
  },
  cardTexto: {
    fontSize: 14,
    lineHeight: 21,
    color: cores.textoSecundario,
  },
});
