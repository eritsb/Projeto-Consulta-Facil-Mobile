import type { Clinica, Disponibilidade, Especialidade, Profissional } from '../../tipos/api';

export type EspecialidadeResumo = {
  id: number;
  nome: string;
};

export type ClinicaResumo = {
  id: number;
  nome: string;
  endereco?: string;
};

export type ProfissionalResumo = {
  id: number;
  nome: string;
  registro?: string;
  conselho?: string;
  clinicaNome?: string;
  especialidadeNome?: string;
};

export type DisponibilidadeResumo = {
  id: number;
  data: string;
  horaInicio: string;
  horaFim: string;
};

export type ParametrosFluxo = {
  especialidadeId?: string | string[];
  especialidadeNome?: string | string[];
  clinicaId?: string | string[];
  clinicaNome?: string | string[];
  clinicaEndereco?: string | string[];
  profissionalId?: string | string[];
  profissionalNome?: string | string[];
  profissionalRegistro?: string | string[];
  profissionalConselho?: string | string[];
  profissionalEspecialidade?: string | string[];
  profissionalClinica?: string | string[];
  disponibilidadeId?: string | string[];
  data?: string | string[];
  horaInicio?: string | string[];
  horaFim?: string | string[];
  reiniciar?: string | string[];
};

type ResumoFluxo = {
  especialidade?: EspecialidadeResumo | null;
  clinica?: ClinicaResumo | null;
  profissional?: ProfissionalResumo | null;
  disponibilidade?: DisponibilidadeResumo | null;
};

export function textoParam(valor: string | string[] | undefined): string | null {
  const texto = Array.isArray(valor) ? valor[0] : valor;
  if (typeof texto !== 'string') return null;
  const limpo = texto.trim();
  return limpo ? limpo : null;
}

export function numeroParam(valor: string | string[] | undefined): number | null {
  const texto = textoParam(valor);
  if (!texto) return null;
  const numero = Number(texto);
  return Number.isFinite(numero) ? numero : null;
}

export function resumoEspecialidade(especialidade: Especialidade): EspecialidadeResumo {
  return { id: Number(especialidade.id_especialidade), nome: especialidade.nome };
}

export function resumoClinica(clinica: Clinica): ClinicaResumo {
  return {
    id: Number(clinica.id_clinica),
    nome: clinica.nome,
    endereco: clinica.endereco,
  };
}

export function resumoProfissional(profissional: Profissional): ProfissionalResumo {
  return {
    id: Number(profissional.id_profissional),
    nome: profissional.nome,
    registro: profissional.registro_profissional,
    conselho: profissional.conselho,
    clinicaNome: profissional.clinica_nome,
    especialidadeNome: profissional.especialidade_nome,
  };
}

export function resumoDisponibilidade(disponibilidade: Disponibilidade): DisponibilidadeResumo {
  return {
    id: Number(disponibilidade.id_disponibilidade),
    data: disponibilidade.data,
    horaInicio: disponibilidade.hora_inicio,
    horaFim: disponibilidade.hora_fim,
  };
}

export function montarParametros(resumo: ResumoFluxo): Record<string, string> {
  const parametros: Record<string, string> = {};

  if (resumo.especialidade) {
    parametros.especialidadeId = String(resumo.especialidade.id);
    parametros.especialidadeNome = resumo.especialidade.nome;
  }

  if (resumo.clinica) {
    parametros.clinicaId = String(resumo.clinica.id);
    parametros.clinicaNome = resumo.clinica.nome;
    if (resumo.clinica.endereco) parametros.clinicaEndereco = resumo.clinica.endereco;
  }

  if (resumo.profissional) {
    parametros.profissionalId = String(resumo.profissional.id);
    parametros.profissionalNome = resumo.profissional.nome;
    if (resumo.profissional.registro) {
      parametros.profissionalRegistro = resumo.profissional.registro;
    }
    if (resumo.profissional.conselho) {
      parametros.profissionalConselho = resumo.profissional.conselho;
    }
    if (resumo.profissional.especialidadeNome) {
      parametros.profissionalEspecialidade = resumo.profissional.especialidadeNome;
    }
    if (resumo.profissional.clinicaNome) {
      parametros.profissionalClinica = resumo.profissional.clinicaNome;
    }
  }

  if (resumo.disponibilidade) {
    parametros.disponibilidadeId = String(resumo.disponibilidade.id);
    parametros.data = resumo.disponibilidade.data;
    parametros.horaInicio = resumo.disponibilidade.horaInicio;
    parametros.horaFim = resumo.disponibilidade.horaFim;
  }

  return parametros;
}
