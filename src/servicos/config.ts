function normalizarUrl(valor: string | undefined): string {
  return (valor ?? '').trim().replace(/\/+$/, '');
}

export const API_URL = normalizarUrl(process.env.EXPO_PUBLIC_API_URL) || 'https://back-end-pi-ihs1.onrender.com';

export const IA_URL = normalizarUrl(process.env.EXPO_PUBLIC_IA_URL);
export const TRIAGEM_URL = normalizarUrl(process.env.EXPO_PUBLIC_TRIAGEM_URL);
export const NOTIFICACOES_URL = normalizarUrl(process.env.EXPO_PUBLIC_NOTIFICACOES_URL);
export const RECUPERACAO_URL = normalizarUrl(process.env.EXPO_PUBLIC_RECUPERACAO_URL);

export function integracaoConfigurada(url: string): boolean {
  return url.length > 0;
}
