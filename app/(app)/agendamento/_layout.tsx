import { Stack } from 'expo-router';

import { FluxoAgendamentoProvider } from '../../../src/telas/agendamento/contexto';

export default function AgendamentoLayout() {
  return (
    <FluxoAgendamentoProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </FluxoAgendamentoProvider>
  );
}
