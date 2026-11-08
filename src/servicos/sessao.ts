import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import type { Usuario } from '../tipos/api';

const CHAVE_TOKEN = 'consultaFacil.token';
const CHAVE_USUARIO = 'consultaFacil.usuario';

type ArmazenamentoWeb = {
  getItem: (chave: string) => string | null;
  setItem: (chave: string, valor: string) => void;
  removeItem: (chave: string) => void;
};

function armazenamentoWeb(): ArmazenamentoWeb | null {
  return (globalThis as { localStorage?: ArmazenamentoWeb }).localStorage ?? null;
}

async function definir(chave: string, valor: string): Promise<void> {
  if (Platform.OS === 'web') {
    armazenamentoWeb()?.setItem(chave, valor);
    return;
  }
  await SecureStore.setItemAsync(chave, valor);
}

async function obter(chave: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    return armazenamentoWeb()?.getItem(chave) ?? null;
  }
  return SecureStore.getItemAsync(chave);
}

async function remover(chave: string): Promise<void> {
  if (Platform.OS === 'web') {
    armazenamentoWeb()?.removeItem(chave);
    return;
  }
  await SecureStore.deleteItemAsync(chave);
}

export async function salvarSessao(token: string, usuario: Usuario): Promise<void> {
  await definir(CHAVE_TOKEN, token);
  await definir(CHAVE_USUARIO, JSON.stringify(usuario));
}

export async function lerSessao(): Promise<{ token: string; usuario: Usuario } | null> {
  try {
    const token = await obter(CHAVE_TOKEN);
    const usuario = await obter(CHAVE_USUARIO);
    if (!token || !usuario) return null;
    return { token, usuario: JSON.parse(usuario) as Usuario };
  } catch {
    return null;
  }
}

export async function limparSessao(): Promise<void> {
  await remover(CHAVE_TOKEN);
  await remover(CHAVE_USUARIO);
}
