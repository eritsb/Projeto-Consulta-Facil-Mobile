import { API_URL } from './config';
import type { ErroApi } from '../tipos/api';

export class ApiError extends Error {
  status: number;

  constructor(mensagem: string, status: number) {
    super(mensagem);
    this.name = 'ApiError';
    this.status = status;
  }
}

type MetodoHttp = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type OpcoesRequisicao = {
  method?: MetodoHttp;
  body?: unknown;
  token?: string | null;
  headers?: Record<string, string>;
};

function mensagemPorStatus(status: number): string {
  if (status === 400) return 'Dados inválidos. Confira as informações e tente novamente.';
  if (status === 401) return 'E-mail ou senha inválidos.';
  if (status === 403) return 'Sua conta está inativa ou você não tem permissão.';
  if (status === 404) return 'Não encontramos o que você procura.';
  if (status === 409) return 'Não foi possível concluir: já existe um registro ou horário ocupado.';
  if (status >= 500) return 'O servidor está com problemas. Tente novamente em instantes.';
  return 'Não foi possível concluir a operação.';
}

function tentarJson(texto: string): unknown {
  try {
    return JSON.parse(texto);
  } catch {
    return null;
  }
}

function mensagemDoErro(dados: unknown, status: number): string {
  if (dados && typeof dados === 'object' && 'erro' in dados) {
    const mensagem = (dados as ErroApi).erro;
    if (typeof mensagem === 'string' && mensagem.trim()) return mensagem;
  }
  return mensagemPorStatus(status);
}

export async function apiFetch<T>(caminho: string, opcoes: OpcoesRequisicao = {}): Promise<T> {
  const url = caminho.startsWith('http')
    ? caminho
    : `${API_URL}${caminho.startsWith('/') ? '' : '/'}${caminho}`;

  let resposta: Awaited<ReturnType<typeof fetch>>;

  try {
    resposta = await fetch(url, {
      method: opcoes.method ?? 'GET',
      headers: {
        Accept: 'application/json',
        ...(opcoes.body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...(opcoes.token ? { Authorization: `Bearer ${opcoes.token}` } : {}),
        ...opcoes.headers,
      },
      body: opcoes.body !== undefined ? JSON.stringify(opcoes.body) : undefined,
    });
  } catch {
    throw new ApiError('Não foi possível conectar ao servidor. Verifique sua internet.', 0);
  }

  const texto = await resposta.text();
  const dados = texto ? tentarJson(texto) : null;

  if (!resposta.ok) {
    throw new ApiError(mensagemDoErro(dados, resposta.status), resposta.status);
  }

  return dados as T;
}
