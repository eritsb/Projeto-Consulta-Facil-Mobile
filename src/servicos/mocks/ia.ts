import type {
  ChatPayload,
  ChatResposta,
  RecomendacaoIA,
  TriagemPayload,
} from '../../tipos/triagem';

const AVISO =
  'Esta é apenas uma orientação e não substitui uma avaliação médica. Em caso de emergência, procure atendimento imediato.';

type Regra = {
  termos: string[];
  especialidade: string;
  id_especialidade?: number;
  justificativa: string;
};

const REGRAS: Regra[] = [
  {
    termos: ['dor', 'articula', 'osso', 'joelho', 'coluna', 'musculo', 'ombro', 'perna', 'braco', 'torcao'],
    especialidade: 'Ortopedia',
    id_especialidade: 1,
    justificativa: 'As queixas relatadas podem estar relacionadas a ossos, músculos ou articulações.',
  },
  {
    termos: ['febre', 'tosse', 'garganta', 'gripe', 'resfriado', 'falta de ar', 'cansaco'],
    especialidade: 'Clínica Geral',
    id_especialidade: 2,
    justificativa: 'Sintomas gerais como febre e tosse costumam ser avaliados inicialmente pela Clínica Geral.',
  },
  {
    termos: ['peito', 'coracao', 'palpitacao', 'pressao', 'cardiaco'],
    especialidade: 'Cardiologia',
    id_especialidade: 3,
    justificativa: 'Sintomas no peito ou relacionados ao coração merecem avaliação cardiológica.',
  },
  {
    termos: ['pele', 'coceira', 'mancha', 'alergia', 'acne', 'ferida'],
    especialidade: 'Dermatologia',
    id_especialidade: 4,
    justificativa: 'Alterações na pele são avaliadas pela Dermatologia.',
  },
  {
    termos: ['cabeca', 'enxaqueca', 'tontura', 'convulsao', 'formigamento'],
    especialidade: 'Neurologia',
    id_especialidade: 5,
    justificativa: 'Dores de cabeça persistentes e alterações neurológicas podem ser avaliadas pela Neurologia.',
  },
  {
    termos: ['estomago', 'abdomen', 'barriga', 'nausea', 'digestao', 'intestino'],
    especialidade: 'Gastroenterologia',
    id_especialidade: 6,
    justificativa: 'Queixas digestivas e abdominais são avaliadas pela Gastroenterologia.',
  },
  {
    termos: ['ansiedade', 'tristeza', 'depressao', 'sono', 'panico', 'estresse'],
    especialidade: 'Psicologia',
    id_especialidade: 7,
    justificativa: 'Questões emocionais e de saúde mental podem ser acolhidas pela Psicologia.',
  },
  {
    termos: ['crianca', 'bebe', 'filho', 'pediatrico'],
    especialidade: 'Pediatria',
    id_especialidade: 8,
    justificativa: 'Crianças e bebês são acompanhados pela Pediatria.',
  },
  {
    termos: ['mulher', 'utero', 'menstruacao', 'gravidez', 'ginecologico'],
    especialidade: 'Ginecologia',
    id_especialidade: 9,
    justificativa: 'Queixas ginecológicas são avaliadas pela Ginecologia.',
  },
];

function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

export function mockAnalisarTriagem(payload: TriagemPayload): RecomendacaoIA {
  const texto = normalizar(
    [...payload.sintomas, payload.localizacao, payload.observacoes ?? ''].join(' '),
  );
  const regra = REGRAS.find((item) =>
    item.termos.some((termo) => texto.includes(normalizar(termo))),
  );

  if (!regra) {
    return {
      especialidade: 'Clínica Geral',
      justificativa: 'Com as informações atuais, a Clínica Geral é o melhor ponto de partida.',
      aviso: AVISO,
      emergencia: payload.intensidade >= 5,
    };
  }

  return {
    id_especialidade: regra.id_especialidade,
    especialidade: regra.especialidade,
    justificativa: regra.justificativa,
    aviso: AVISO,
    emergencia: payload.intensidade >= 5,
  };
}

export function mockChat(payload: ChatPayload): ChatResposta {
  const texto = normalizar(payload.mensagem);

  if (texto.includes('emergencia') || texto.includes('falta de ar') || texto.includes('desmaio')) {
    return {
      resposta:
        'Se você está com falta de ar intensa, dor no peito ou desmaio, procure um pronto-socorro imediatamente. Se preferir, posso ajudar a encontrar uma Clínica Geral.',
      acao: 'nenhuma',
    };
  }

  const recomendacao = mockAnalisarTriagem({
    id_paciente: 0,
    sintomas: [payload.mensagem],
    localizacao: '',
    duracao: '',
    intensidade: 2,
    febre: false,
    idade: null,
  });

  return {
    resposta: `Entendi. Pelo que você contou, uma boa opção pode ser ${recomendacao.especialidade}. Quer ver os horários disponíveis?`,
    especialidade_sugerida: recomendacao.especialidade,
    acao: 'agendar',
  };
}
