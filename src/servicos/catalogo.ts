import { apiFetch } from './api';
import type { Clinica, Disponibilidade, Especialidade, Profissional } from '../tipos/api';

type FiltrosProfissional = {
  nome?: string;
  clinica?: number;
  especialidade?: number;
};

function query(params: Record<string, string | number | undefined>): string {
  const partes = Object.entries(params)
    .filter(([, valor]) => valor !== undefined && valor !== '')
    .map(([chave, valor]) => `${encodeURIComponent(chave)}=${encodeURIComponent(String(valor))}`);
  return partes.length ? `?${partes.join('&')}` : '';
}

export async function listarEspecialidades(
  nome?: string,
  token?: string | null,
): Promise<Especialidade[]> {
  return apiFetch<Especialidade[]>(`/especialidades${query({ nome })}`, { token });
}

export async function listarClinicas(nome?: string, token?: string | null): Promise<Clinica[]> {
  return apiFetch<Clinica[]>(`/clinicas${query({ nome })}`, { token });
}

export async function listarProfissionais(
  filtros: FiltrosProfissional = {},
  token?: string | null,
): Promise<Profissional[]> {
  return apiFetch<Profissional[]>(`/profissionais${query(filtros)}`, { token });
}

export async function listarDisponibilidades(
  idProfissional: number,
  token?: string | null,
): Promise<Disponibilidade[]> {
  return apiFetch<Disponibilidade[]>(`/disponibilidades/profissional/${idProfissional}`, { token });
}
