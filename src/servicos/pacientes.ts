import { apiFetch } from './api';
import type { AtualizarPacientePayload, CadastroPacientePayload, Paciente } from '../tipos/api';

export async function cadastrarPaciente(dados: CadastroPacientePayload): Promise<Paciente> {
  const resposta = await apiFetch<{ mensagem: string; paciente: Paciente }>('/pacientes', {
    method: 'POST',
    body: dados,
  });
  return resposta.paciente;
}

export async function buscarPaciente(id: number, token?: string | null): Promise<Paciente> {
  return apiFetch<Paciente>(`/pacientes/${id}`, { token });
}

export async function atualizarPaciente(
  id: number,
  dados: AtualizarPacientePayload,
  token?: string | null,
): Promise<Paciente> {
  return apiFetch<Paciente>(`/pacientes/${id}`, {
    method: 'PUT',
    body: dados,
    token,
  });
}
