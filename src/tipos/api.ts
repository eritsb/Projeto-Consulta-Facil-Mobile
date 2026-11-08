export type Perfil = 'PACIENTE' | 'PROFISSIONAL' | 'ADMIN';

export type Usuario = {
  id: number;
  nome: string;
  email: string;
  perfil: Perfil;
};

export type RespostaLogin = {
  mensagem: string;
  token: string;
  usuario: Usuario;
};

export type Paciente = {
  id_paciente: number;
  nome: string;
  cpf: string;
  data_nascimento: string;
  telefone: string | null;
  email: string;
  endereco: string | null;
  perfil: Perfil;
  ativo: boolean;
  data_cadastro: string;
};

export type CadastroPacientePayload = {
  nome: string;
  cpf: string;
  data_nascimento: string;
  telefone?: string;
  email: string;
  senha: string;
  endereco?: string;
};

export type AtualizarPacientePayload = Partial<CadastroPacientePayload> & {
  ativo?: boolean;
};

export type Especialidade = {
  id_especialidade: number;
  nome: string;
  descricao: string | null;
  ativo: boolean;
};

export type Clinica = {
  id_clinica: number;
  nome: string;
  cnpj: string;
  telefone: string | null;
  email: string | null;
  endereco: string;
  horario_funcionamento: string | null;
  ativo: boolean;
};

export type Profissional = {
  id_profissional: number;
  id_clinica: number;
  id_especialidade: number;
  nome: string;
  cpf: string;
  registro_profissional: string;
  conselho: string;
  telefone: string | null;
  email: string;
  perfil: Perfil;
  ativo: boolean;
  clinica_nome: string;
  especialidade_nome: string;
};

export type Disponibilidade = {
  id_disponibilidade: number;
  id_profissional: number;
  data: string;
  hora_inicio: string;
  hora_fim: string;
  status: 'DISPONIVEL' | 'RESERVADO';
};

export type StatusAgendamento = 'AGENDADO' | 'CONFIRMADO' | 'CANCELADO' | 'REALIZADO';

export type Agendamento = {
  id_agendamento: number;
  id_paciente: number;
  paciente_nome: string;
  id_profissional: number;
  profissional_nome: string;
  id_clinica: number;
  clinica_nome: string;
  id_especialidade: number;
  especialidade_nome: string;
  id_disponibilidade: number;
  data_consulta: string;
  hora_consulta: string;
  hora_fim: string;
  status: StatusAgendamento;
  observacao: string | null;
  data_criacao: string;
};

export type CriarAgendamentoPayload = {
  id_paciente: number;
  id_profissional: number;
  id_disponibilidade: number;
  observacao?: string;
};

export type AtualizarAgendamentoPayload = {
  status?: StatusAgendamento;
  observacao?: string;
};

export type ErroApi = {
  erro: string;
};
