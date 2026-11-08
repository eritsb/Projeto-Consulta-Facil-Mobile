# AGENTS.md — Consulta Fácil Mobile

Instruções para pessoas e agentes de IA que trabalham neste repositório.

## Stack

- Expo SDK 58 + React Native 0.88
- TypeScript (strict)
- Expo Router (rotas em `app/`)
- Backend REST já publicado em `https://back-end-pi-ihs1.onrender.com`

> Expo muda a cada SDK. Antes de usar uma API do Expo/EAS/React Native,
> confira a documentação da versão em `https://docs.expo.dev/versions/v58.0.0/`.

## Comandos

```bash
npm install
npx expo start
npm run lint
npm run typecheck
npx expo-doctor
```

Nunca use `npm install <pacote>` para dependências nativas: use
`npx expo install <pacote>` para pegar a versão compatível com o SDK.

## Estrutura

```text
app/                      rotas (Expo Router)
  (auth)/                 login, cadastro, recuperação
  (app)/                  área autenticada
src/
  componentes/            componentes reutilizáveis (P2)
  contexto/               AuthContext
  servicos/               chamadas HTTP e regras de dados
    api.ts                cliente HTTP
    config.ts             URLs via variáveis EXPO_PUBLIC_*
    mocks/                mocks temporários
  telas/                  telas e componentes por domínio
  tema/                   cores, espaçamentos, raios
  tipos/                  tipos compartilhados
  utilitarios/            formatadores e validadores
docs/
  telas.md                especificação de telas
  api.md                  contrato dos endpoints
  integracoes-pendentes.md
```

## Regras de camada

- Telas não chamam `fetch` diretamente; sempre usam `src/servicos`.
- URLs vêm de `src/servicos/config.ts` (`.env`). Nunca hardcode.
- Toda tela deve ter loading, erro, vazio e sucesso.
- Acessibilidade: `accessibilityLabel`, `accessibilityRole`, foco visível,
  área de toque ≥ 44 px e nunca depender só de cor.
- Não commitar `.env`, tokens ou chaves.
- Não editar `ios/` e `android/` (gerados pelo Expo).

## Integrações pendentes

Pré-triagem, IA, notificações push e recuperação de senha ainda não existem
no backend. Os serviços já têm contrato e fallback/mock. Quando o backend
ficar pronto, basta preencher a variável no `.env` e implementar o `fetch`
dentro do serviço, sem alterar as telas. Ver `docs/integracoes-pendentes.md`.

## Propriedade de arquivos

Ver `.github/CODEOWNERS`. Não altere pastas de outra pessoa sem aprovação.
Pastas compartilhadas (`src/servicos/api.ts`, `src/servicos/auth.ts`,
`src/tipos`, configs) pertencem ao P1.

## Fluxo Git/PR

1. `git switch main && git pull --rebase origin main`
2. `git switch -c feat/<area>-<nome>`
3. Implemente, rode lint/typecheck e testes (se existirem).
4. `git fetch origin && git rebase origin/main`
5. Commit no padrão Conventional Commits.
6. `git push -u origin <branch>`
7. Abra PR para `main` e peça review. Nunca faça merge nem push na `main`.

## Definition of Done

- Funcionalidade navegável e integrada via serviços.
- Estados de loading/erro/vazio/sucesso.
- Acessibilidade básica.
- `npm run lint` e `npm run typecheck` verdes.
- PR pequeno, sem conflitos, com descrição e como testar.
