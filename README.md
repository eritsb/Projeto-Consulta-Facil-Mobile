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
npm run build:web
```

## PWA

O app pode ser instalado como PWA e funciona offline para o shell e os recursos
já visitados.

- Manifest: `public/manifest.json`.
- Service worker: `public/sw.js` (registrado apenas em produção/web).
- Ícones: `public/icons/`.
- Template HTML: `public/index.html`.

Para testar:

```bash
npm run build:web
npx serve dist
```

Abra `http://localhost:8080`, confira o manifest e o service worker no DevTools
e teste com a rede offline. O deploy exige HTTPS e fallback de rotas para
`index.html`. Detalhes em `docs/pwa.md`.

## Estrutura

```text
app/                  rotas (Expo Router)
  (auth)/             boas-vindas, login, cadastro, recuperação
  (app)/              área autenticada
public/               manifest, service worker, ícones e template HTML
src/
  contexto/           AuthContext
  servicos/           cliente HTTP, serviços e mocks
  componentes/        design system reutilizável (P2)
  telas/              telas por domínio
    inicio/           T07 — Início (P2)
    busca/            T08 — Busca (P2)
    agendamento/      T09–T15 — fluxo de agendamento (P2)
    historico/        T16 — Histórico (P2)
  tema/               cores, tipografia, espaçamentos, raios e sombras
  tipos/              tipos compartilhados
  utilitarios/        formatadores, validadores e registro do PWA
docs/                 telas, contrato da API, PWA e integrações pendentes
```

## P2 — Design System, Início, Busca, Agendamento e Histórico

Responsável: Kennedy Veras (GitHub: [@Kverasz](https://github.com/Kverasz)).
Branch: `feat/design-busca-agendamento-Kverasz`.

### Entregas

- **Tema e design system**: tokens de tipografia e sombras em `src/tema/` e
  componentes reutilizáveis em `src/componentes/` (Botão, Campo, Card,
  Cabeçalho, Progresso, Toast, Modal, estados de loading/erro/vazio, Etiqueta,
  cartões de especialidade/clínica/profissional/agendamento e abas).
- **T07 Início** (`app/(app)/inicio.tsx`): saudação, próximo atendimento,
  “Preciso de atendimento”, “Já sei o que preciso”, atalhos de especialidades
  e botão de notificações.
- **T08 Busca** (`app/(app)/busca.tsx`): busca com debounce e abas
  Especialidades / Clínicas / Profissionais.
- **T09–T15 Agendamento** (`app/(app)/agendamento/`): Especialidade → Clínica →
  Profissional → Data → Horário → Revisão → Sucesso, com `POST /agendamentos`.
- **T16 Histórico** (`app/(app)/historico.tsx`): consultas passadas/canceladas
  com filtro por período.
- **Integração**: `src/servicos/catalogo.ts` e `src/servicos/agendamentos.ts`.
  IDs retornados pela API como string são normalizados no app.
- **Parâmetros de triagem (P3)**: as telas de agendamento aceitam
  `especialidadeId`/`especialidadeNome` e os demais parâmetros do fluxo para
  pré-seleção vinda da triagem ou de um resultado de busca.

### Rotas do fluxo

| Tela | Rota |
|---|---|
| T07 — Início | `/(app)/inicio` |
| T08 — Busca | `/(app)/busca` |
| T09 — Especialidade | `/(app)/agendamento/especialidade` |
| T10 — Clínica | `/(app)/agendamento/clinica` |
| T11 — Profissional | `/(app)/agendamento/profissional` |
| T12 — Data | `/(app)/agendamento/data` |
| T13 — Horário | `/(app)/agendamento/horario` |
| T14 — Revisão | `/(app)/agendamento/revisao` |
| T15 — Sucesso | `/(app)/agendamento/sucesso` |
| T16 — Histórico | `/(app)/historico` |

O estado do fluxo fica em `src/telas/agendamento/contexto.tsx`; a passagem de
parâmetros entre telas e a hidratação inicial ficam em
`src/telas/agendamento/parametros.ts`.

### Estados e acessibilidade

- Toda tela cobre loading, erro, vazio e sucesso, com ação de “Tentar
  novamente” quando aplicável.
- Uso de `accessibilityLabel`, `accessibilityRole`, estados selecionado/
  desabilitado e áreas de toque de pelo menos 44 px.
- Status e horários usam texto e símbolo além da cor (por exemplo,
  “Disponível”, “Indisponível” e “Cancelado”).

### Como validar o P2

```bash
npm install
npm run lint
npm run typecheck
npm run build:web
npx expo start
```

Fluxo manual:

1. Entrar com um paciente.
2. Início → “Já sei o que preciso” → Especialidade → Clínica → Profissional →
   Data → Horário → Revisão → Sucesso.
3. Em Busca, testar as três abas e iniciar o agendamento por um resultado.
4. Conferir o próximo atendimento na Início e filtrar o Histórico por período.

### Pendências e limites desta fase

- “Preciso de atendimento” abre `/(app)/triagem` (P3) e “Ver agendamento”/cards
  abrem `/(app)/agendamentos/[id]` (P4); essas rotas pertencem às fases
  correspondentes.
- O botão de notificações exibe um aviso provisório até a T22 (P3) existir.
- O backend aplica apenas um filtro por vez em `/profissionais`; a combinação
  clínica + especialidade é feita no app.
- O projeto ainda não possui suíte de testes automatizados.

## Documentação

- `docs/telas.md`: especificação das telas T01–T27.
- `docs/api.md`: contrato dos endpoints do backend.
- `docs/integracoes-pendentes.md`: o que falta no backend e como integrar.
- `docs/pwa.md`: manifest, service worker, testes offline e deploy.
- `AGENTS.md`: regras para pessoas e agentes de IA.
- `CONTRIBUTING.md`: fluxo de branches, commits e PRs.

## Time

O projeto é dividido entre quatro pessoas (P1–P4). Cada uma trabalha em uma
branch `feat/...` e abre PR para `main`; ninguém faz push direto na `main` nem
faz merge sem revisão.
