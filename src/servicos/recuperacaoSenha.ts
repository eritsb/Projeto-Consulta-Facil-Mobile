import { apiFetch } from './api';
import { RECUPERACAO_URL, integracaoConfigurada } from './config';

export const recuperacaoDisponivel = integracaoConfigurada(RECUPERACAO_URL);

export async function solicitarRecuperacao(email: string): Promise<void> {
  if (!recuperacaoDisponivel) return;
  await apiFetch<void>(RECUPERACAO_URL, {
    method: 'POST',
    body: { email: email.trim().toLowerCase() },
  });
}
