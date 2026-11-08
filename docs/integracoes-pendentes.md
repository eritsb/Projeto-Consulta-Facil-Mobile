# Integrações pendentes

O backend ainda não oferece pré-triagem, IA, notificações push e recuperação
de senha. Para não bloquear o app, os serviços já têm contrato e fallback.
Quando o endpoint existir, **não altere as telas**: preencha a variável no
`.env` e implemente o `fetch` dentro do serviço.

## Variáveis

```env
EXPO_PUBLIC_API_URL=https://back-end-pi-ihs1.onrender.com
EXPO_PUBLIC_IA_URL=
EXPO_PUBLIC_TRIAGEM_URL=
EXPO_PUBLIC_NOTIFICACOES_URL=
EXPO_PUBLIC_RECUPERACAO_URL=
```

## Tabela

| Funcionalidade | Arquivo | Função | Endpoint esperado | Método | Request | Response | Fallback | Dono |
|---|---|---|---|---|---|---|---|---|
| Análise de triagem | `src/servicos/ia.ts` | `analisarTriagem` | `EXPO_PUBLIC_IA_URL` | POST | `TriagemPayload` | `RecomendacaoIA` | mock por palavras-chave | P3 |
| Chatbot | `src/servicos/ia.ts` | `enviarMensagemChat` | `EXPO_PUBLIC_IA_URL/chat` | POST | `ChatPayload` | `ChatResposta` | mock roteirizado | P3 |
| Salvar triagem | `src/servicos/triagem.ts` | `salvarTriagem` | `EXPO_PUBLIC_TRIAGEM_URL` | POST | `TriagemPayload` | `TriagemRegistro` | AsyncStorage | P3 |
| Listar triagens | `src/servicos/triagem.ts` | `listarTriagens` | `EXPO_PUBLIC_TRIAGEM_URL/paciente/{id}` | GET | — | `TriagemRegistro[]` | AsyncStorage | P3 |
| Push token | `src/servicos/notificacoes.ts` | `registrarTokenPush` | `EXPO_PUBLIC_NOTIFICACOES_URL` | POST | `{ token }` | 204 | ignora | P3 |
| Recuperar senha | `src/servicos/recuperacaoSenha.ts` | `solicitarRecuperacao` | `EXPO_PUBLIC_RECUPERACAO_URL` | POST | `{ email }` | 204 | mensagem informativa | P1 |

## Contratos esperados

```ts
export type TriagemPayload = {
  id_paciente: number;
  sintomas: string[];
  localizacao: string;
  duracao: string;
  intensidade: number; // 1 a 5
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

export type ChatPayload = {
  mensagem: string;
  historico: { autor: 'paciente' | 'assistente'; texto: string }[];
};

export type ChatResposta = {
  resposta: string;
  especialidade_sugerida?: string;
  acao?: 'agendar' | 'triagem' | 'nenhuma';
};
```

## Padrão de implementação

```ts
const IA_URL = process.env.EXPO_PUBLIC_IA_URL ?? '';

export async function analisarTriagem(payload: TriagemPayload): Promise<RecomendacaoIA> {
  if (!IA_URL) return mockAnalisarTriagem(payload);
  return apiFetch<RecomendacaoIA>(IA_URL, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
```

## Checklist quando o backend ficar pronto

- [ ] Preencher a variável no `.env` (e no EAS, se for build).
- [ ] Implementar o `fetch` dentro do serviço.
- [ ] Remover o mock apenas do caminho de produção (manter para testes).
- [ ] Atualizar esta tabela (status: integrado).
- [ ] Rodar lint/typecheck e testar o fluxo completo.
- [ ] Nunca colocar chave de IA no app; ela deve ficar no backend.
