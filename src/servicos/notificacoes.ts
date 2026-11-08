import { apiFetch } from './api';
import { NOTIFICACOES_URL, integracaoConfigurada } from './config';

export const notificacoesDisponiveis = integracaoConfigurada(NOTIFICACOES_URL);

export async function registrarTokenPush(token: string): Promise<void> {
  if (!notificacoesDisponiveis) return;
  await apiFetch<void>(NOTIFICACOES_URL, { method: 'POST', body: { token } });
}
