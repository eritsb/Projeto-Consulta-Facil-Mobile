import { apiFetch } from './api';
import type { RespostaLogin, Usuario } from '../tipos/api';

export async function login(email: string, senha: string): Promise<RespostaLogin> {
  return apiFetch<RespostaLogin>('/auth/login', {
    method: 'POST',
    body: { email: email.trim().toLowerCase(), senha },
  });
}

export async function buscarPerfil(token: string): Promise<Usuario & Record<string, unknown>> {
  return apiFetch<Usuario & Record<string, unknown>>('/auth/perfil', { token });
}
