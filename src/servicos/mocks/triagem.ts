import AsyncStorage from '@react-native-async-storage/async-storage';

import type { TriagemPayload, TriagemRegistro } from '../../tipos/triagem';

const CHAVE = 'consultaFacil.triagens';

async function ler(): Promise<TriagemRegistro[]> {
  try {
    const bruto = await AsyncStorage.getItem(CHAVE);
    return bruto ? (JSON.parse(bruto) as TriagemRegistro[]) : [];
  } catch {
    return [];
  }
}

export async function mockSalvarTriagem(payload: TriagemPayload): Promise<TriagemRegistro> {
  const registros = await ler();
  const registro: TriagemRegistro = {
    ...payload,
    id_triagem: `local-${Date.now()}`,
    criado_em: new Date().toISOString(),
  };
  await AsyncStorage.setItem(CHAVE, JSON.stringify([registro, ...registros]));
  return registro;
}

export async function mockListarTriagens(idPaciente: number): Promise<TriagemRegistro[]> {
  const registros = await ler();
  return registros.filter((registro) => registro.id_paciente === idPaciente);
}
