# Consulta Fácil Mobile

App mobile (React Native + Expo) do projeto Consulta Fácil.

O app permite que pacientes encontrem especialidades, clínicas e profissionais,
agendem consultas e acompanhem seus atendimentos. A triagem com IA, as
notificações e a recuperação de senha já têm contrato e espaço reservados no
código, mas dependem de endpoints que ainda serão criados no backend.

## Stack

- Expo SDK 58 + React Native 0.88
- TypeScript (strict)
- Expo Router (rotas em `app/`)
- Backend REST: `https://back-end-pi-ihs1.onrender.com`
- Swagger: `https://back-end-pi-ihs1.onrender.com/api-docs/`

## Requisitos

- Node.js 22+
- npm
- App Expo Go no celular ou emulador Android/iOS

## Como rodar

```bash
npm install
cp .env.example .env
npx expo start
```

Para abrir no navegador: `npm run web`.

## Variáveis de ambiente

Copie `.env.example` para `.env` e ajuste se necessário:

```env
EXPO_PUBLIC_API_URL=https://back-end-pi-ihs1.onrender.com
EXPO_PUBLIC_IA_URL=
EXPO_PUBLIC_TRIAGEM_URL=
EXPO_PUBLIC_NOTIFICACOES_URL=
EXPO_PUBLIC_RECUPERACAO_URL=
```

As variáveis vazias ativam o fallback local/mock. Nunca commite o `.env`.

## Scripts

```bash
npm run lint
npm run typecheck
npm run doctor
```

## Estrutura

```text
app/                  rotas (Expo Router)
  (auth)/             boas-vindas, login, cadastro, recuperação
  (app)/              área autenticada
src/
  contexto/           AuthContext
  servicos/           cliente HTTP, serviços e mocks
  telas/              telas e componentes por domínio
  tema/               cores, espaçamentos e raios
  tipos/              tipos compartilhados
  utilitarios/        formatadores e validadores
docs/                 telas, contrato da API e integrações pendentes
```

## Documentação

- `docs/telas.md`: especificação das telas T01–T27.
- `docs/api.md`: contrato dos endpoints do backend.
- `docs/integracoes-pendentes.md`: o que falta no backend e como integrar.
- `AGENTS.md`: regras para pessoas e agentes de IA.
- `CONTRIBUTING.md`: fluxo de branches, commits e PRs.

## Time

O projeto é dividido entre quatro pessoas (P1–P4). Cada uma trabalha em uma
branch `feat/...` e abre PR para `main`; ninguém faz push direto na `main` nem
faz merge sem revisão.
