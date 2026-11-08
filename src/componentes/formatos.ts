import type { StatusAgendamento } from '../tipos/api';

const MESES = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
];

const DIAS_SEMANA = [
  'domingo',
  'segunda-feira',
  'terça-feira',
  'quarta-feira',
  'quinta-feira',
  'sexta-feira',
  'sábado',
];

export function formatarHora(hora: string | null | undefined): string {
  if (!hora) return '--:--';
  return hora.slice(0, 5);
}

function partesDaData(iso: string): [number, number, number] | null {
  const [ano, mes, dia] = iso.slice(0, 10).split('-').map(Number);
  if (!ano || !mes || !dia) return null;
  return [ano, mes, dia];
}

export function formatarDataCurta(iso: string | null | undefined): string {
  if (!iso) return '--/--/----';
  const partes = partesDaData(iso);
  if (!partes) return iso;
  const [ano, mes, dia] = partes;
  return `${String(dia).padStart(2, '0')}/${String(mes).padStart(2, '0')}/${ano}`;
}

export function formatarDataLonga(iso: string | null | undefined, comAno = true): string {
  if (!iso) return 'Data não informada';
  const partes = partesDaData(iso);
  const nomeMes = MESES[(partes?.[1] ?? 0) - 1];
  if (!partes || !nomeMes) return iso;
  const [ano, , dia] = partes;
  const base = `${dia} de ${nomeMes}`;
  return comAno ? `${base} de ${ano}` : base;
}

export function nomeDiaSemana(iso: string): string {
  const partes = partesDaData(iso);
  if (!partes) return '';
  const [ano, mes, dia] = partes;
  const data = new Date(ano, mes - 1, dia);
  return DIAS_SEMANA[data.getDay()] ?? '';
}

export function hojeIso(): string {
  const hoje = new Date();
  const mes = String(hoje.getMonth() + 1).padStart(2, '0');
  const dia = String(hoje.getDate()).padStart(2, '0');
  return `${hoje.getFullYear()}-${mes}-${dia}`;
}

export function dataNoPassado(iso: string): boolean {
  return iso < hojeIso();
}

export function dataHoraNoPassado(iso: string, hora: string): boolean {
  const partes = partesDaData(iso);
  if (!partes) return false;
  const [ano, mes, dia] = partes;
  const agora = new Date();
  const data = new Date(ano, mes - 1, dia, Number(hora.slice(0, 2)), Number(hora.slice(3, 5)));
  return data.getTime() < agora.getTime();
}

export type TomEtiqueta = 'sucesso' | 'erro' | 'aviso' | 'info' | 'neutro';

type EtiquetaStatus = {
  texto: string;
  tom: TomEtiqueta;
};

const STATUS: Record<StatusAgendamento, EtiquetaStatus> = {
  AGENDADO: { texto: 'Agendado', tom: 'info' },
  CONFIRMADO: { texto: 'Confirmado', tom: 'sucesso' },
  CANCELADO: { texto: 'Cancelado', tom: 'erro' },
  REALIZADO: { texto: 'Realizado', tom: 'neutro' },
};

export function etiquetaDoStatus(status: string): EtiquetaStatus {
  if (status in STATUS) return STATUS[status as StatusAgendamento];
  return { texto: status, tom: 'neutro' };
}

export function agendamentoEstaAtivo(status: string): boolean {
  return status === 'AGENDADO' || status === 'CONFIRMADO';
}
