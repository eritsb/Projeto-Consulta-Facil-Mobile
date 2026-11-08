import { Redirect } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { useAuth } from '../src/contexto/AuthContext';
import { cores } from '../src/tema/cores';

export default function Splash() {
  const { carregando, usuario } = useAuth();

  if (carregando) {
    return (
      <View style={estilos.container}>
        <ActivityIndicator size="large" color={cores.primaria} />
      </View>
    );
  }

  return <Redirect href={usuario ? '/(app)/inicio' : '/(auth)/boas-vindas'} />;
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: cores.fundo,
  },
});
