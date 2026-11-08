import { Redirect, Stack } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { useAuth } from '../../src/contexto/AuthContext';
import { cores } from '../../src/tema/cores';

export default function AppLayout() {
  const { carregando, usuario } = useAuth();

  if (carregando) {
    return (
      <View style={estilos.container}>
        <ActivityIndicator size="large" color={cores.primaria} />
      </View>
    );
  }

  if (!usuario) {
    return <Redirect href="/(auth)/boas-vindas" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: cores.fundo,
  },
});
