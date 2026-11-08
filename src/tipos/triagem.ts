export type TriagemPayload = {
  id_paciente: number;
  sintomas: string[];
  localizacao: string;
  duracao: string;
  intensidade: number;
  febre: boolean;
  idade: number | null;
  observacoes?: string;
  relato_audio?: string;
};

export type RecomendacaoIA = {
  id_especialidade?: number;
  especialidade: string;
  justificativa: string;
  aviso: string;
  emergencia?: boolean;
};

export type TriagemRegistro = TriagemPayload & {
  id_triagem: string;
  criado_em: string;
  recomendacao?: RecomendacaoIA;
};

export type ChatAutor = 'paciente' | 'assistente';

export type ChatPayload = {
  mensagem: string;
  historico: { autor: ChatAutor; texto: string }[];
};

export type ChatResposta = {
  resposta: string;
  especialidade_sugerida?: string;
  acao?: 'agendar' | 'triagem' | 'nenhuma';
};
