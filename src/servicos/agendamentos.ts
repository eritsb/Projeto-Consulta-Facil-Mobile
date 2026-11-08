import { apiFetch } from './api';
import type {
  Agendamento,
  AtualizarAgendamentoPayload,
  CriarAgendamentoPayload,
} from '../tipos/api';

export async function criarAgendamento(
  dados: CriarAgendamentoPayload,
  token?: string | null,
): Promise<Agendamento> {
  const resposta = await apiFetch<{ mensagem: string; agendamento: Agendamento }>('/agendamentos', {
    method: 'POST',
    body: dados,
    token,
  });
  return resposta.agendamento;
}

export async function listarAgendamentosPaciente(
  idPaciente: number,
  token?: string | null,
): Promise<Agendamento[]> {
  return apiFetch<Agendamento[]>(`/agendamentos/paciente/${idPaciente}`, { token });
}

export async function buscarAgendamento(id: number, token?: string | null): Promise<Agendamento> {
  return apiFetch<Agendamento>(`/agendamentos/${id}`, { token });
}

export async function atualizarAgendamento(
  id: number,
  dados: AtualizarAgendamentoPayload,
  token?: string | null,
): Promise<Agendamento> {
  return apiFetch<Agendamento>(`/agendamentos/${id}`, {
    method: 'PUT',
    body: dados,
    token,
  });
}

export async function cancelarAgendamento(id: number, token?: string | null): Promise<Agendamento> {
  const resposta = await apiFetch<{ mensagem: string; agendamento: Agendamento }>(
    `/agendamentos/${id}/cancelar`,
    { method: 'PATCH', token },
  );
  return resposta.agendamento;
}
