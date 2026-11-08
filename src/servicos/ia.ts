import { apiFetch } from './api';
import { IA_URL, integracaoConfigurada } from './config';
import { mockAnalisarTriagem, mockChat } from './mocks/ia';
import type {
  ChatPayload,
  ChatResposta,
  RecomendacaoIA,
  TriagemPayload,
} from '../tipos/triagem';

export const iaDisponivel = integracaoConfigurada(IA_URL);

export async function analisarTriagem(payload: TriagemPayload): Promise<RecomendacaoIA> {
  if (!iaDisponivel) return mockAnalisarTriagem(payload);
  return apiFetch<RecomendacaoIA>(IA_URL, { method: 'POST', body: payload });
}

export async function enviarMensagemChat(payload: ChatPayload): Promise<ChatResposta> {
  if (!iaDisponivel) return mockChat(payload);
  return apiFetch<ChatResposta>(`${IA_URL}/chat`, { method: 'POST', body: payload });
}
