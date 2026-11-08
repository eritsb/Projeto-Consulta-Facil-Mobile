import { apiFetch } from './api';
import { TRIAGEM_URL, integracaoConfigurada } from './config';
import { mockListarTriagens, mockSalvarTriagem } from './mocks/triagem';
import type { TriagemPayload, TriagemRegistro } from '../tipos/triagem';

export const triagemDisponivel = integracaoConfigurada(TRIAGEM_URL);

export async function salvarTriagem(payload: TriagemPayload): Promise<TriagemRegistro> {
  if (!triagemDisponivel) return mockSalvarTriagem(payload);
  return apiFetch<TriagemRegistro>(TRIAGEM_URL, { method: 'POST', body: payload });
}

export async function listarTriagens(idPaciente: number): Promise<TriagemRegistro[]> {
  if (!triagemDisponivel) return mockListarTriagens(idPaciente);
  return apiFetch<TriagemRegistro[]>(`${TRIAGEM_URL}/paciente/${idPaciente}`);
}
