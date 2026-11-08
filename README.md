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
  telas/              telas e componentes por domínio
  tema/               cores, espaçamentos e raios
  tipos/              tipos compartilhados
  utilitarios/        formatadores, validadores e registro do PWA
docs/                 telas, contrato da API, PWA e integrações pendentes
```

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

## O que foi feito nesta branch (`feat/infra-auth-eritsb`)

Esta branch entrega a base do app e a fundação que as demais pessoas vão usar.

### Base e qualidade

- [x] Projeto Expo SDK 58 + React Native 0.88 + TypeScript strict.
- [x] Expo Router com rotas em `app/`.
- [x] ESLint, scripts de lint/typecheck/doctor e CI no GitHub Actions.
- [x] `app.json`, `eas.json`, `.env.example` e `.gitignore`.

### Autenticação e sessão

- [x] Telas T01–T06 (splash, boas-vindas, login, cadastro, recuperação e
  confirmação).
- [x] `AuthContext` com login, cadastro, logout e restauração de sessão.
- [x] Token e usuário persistidos com `expo-secure-store`.
- [x] Componentes de auth reutilizáveis em `src/telas/auth/componentes/`.

### Serviços e integrações

- [x] Cliente HTTP com tratamento de erros em `src/servicos/api.ts`.
- [x] Serviços de auth, pacientes, catálogo e agendamentos.
- [x] Contratos e mocks de IA, triagem e notificações para o P3.
- [x] Recuperação de senha com fallback enquanto o backend não tem o endpoint.
- [x] URLs configuráveis por `EXPO_PUBLIC_*`.

### PWA

- [x] `public/manifest.json`, `public/sw.js` e `public/index.html`.
- [x] Ícones 192/512/maskable e apple-touch-icon.
- [x] Cache offline do shell/assets e fallback de navegação.
- [x] Registro do service worker apenas em produção/web.
- [x] `public/_redirects` com SPA fallback para Netlify.

### Documentação

- [x] `docs/telas.md`, `docs/api.md`, `docs/integracoes-pendentes.md`,
  `docs/checklist.md` e `docs/pwa.md`.
- [x] `AGENTS.md`, `CONTRIBUTING.md`, template de PR e CODEOWNERS.

### Validação

- [x] `npm run lint`
- [x] `npm run typecheck`
- [x] `npx expo-doctor` (20/20)
- [x] `npm run build:web`
- [x] `node --check public/sw.js`

### Pendências do P1

- [ ] Inicializar o EAS com a conta Expo e gerar o `projectId`.
- [ ] Trocar os `@eritsb` do `.github/CODEOWNERS` pelos usuários reais.

A tela `app/(app)/inicio.tsx` está como placeholder para o P2. As demais telas
e fluxos seguem a divisão de `docs/checklist.md`.
