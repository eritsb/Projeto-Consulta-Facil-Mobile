# Contribuindo — Consulta Fácil Mobile

## Antes de começar

1. Instale Node.js 22+ e o Expo Go (ou um development build).
2. Autentique sua conta no GitHub:
   ```bash
   git config --global user.name "Seu Nome"
   git config --global user.email "email-do-github"
   gh auth login
   gh auth status
   ```
3. Clone o repositório e instale as dependências:
   ```bash
   git clone https://github.com/eritsb/Projeto-Consulta-Facil-Mobile.git
   cd Projeto-Consulta-Facil-Mobile
   npm install
   cp .env.example .env
   ```

## Branches

- `main`: protegida, somente via PR.
- `feat/<area>-<nome>`: nova funcionalidade.
- `fix/<area>-<nome>`: correção.
- `docs/<assunto>`: documentação.
- `chore/<assunto>`: configuração/dependências.

## Commits

Use Conventional Commits:

```text
feat(auth): adiciona login com e-mail e senha
fix(agenda): corrige fuso horário na listagem
docs(telas): detalha fluxo de triagem
chore(deps): atualiza expo-secure-store
```

## Pull Request

- Um PR por funcionalidade, preferencialmente com menos de 400 linhas.
- Atualize a branch com a `main` antes de abrir:
  ```bash
  git fetch origin
  git rebase origin/main
  ```
- Rode `npm run lint` e `npm run typecheck`.
- Preencha o template do PR, inclua screenshots/vídeo quando houver UI.
- Marque o revisor definido no `CODEOWNERS`.
- Nunca faça merge do próprio PR.

## Propriedade de pastas

| Área | Dono |
|---|---|
| `src/servicos/api.ts`, `auth.ts`, `pacientes.ts`, `catalogo.ts`, `agendamentos.ts`, `src/tipos`, configs | P1 |
| `src/componentes`, `src/tema`, telas de início/busca/agendamento/histórico | P2 |
| telas de triagem/IA/notificações e serviços `triagem.ts`, `ia.ts`, `notificacoes.ts` | P3 |
| telas de agendamentos/perfil, `src/acessibilidade`, `src/servicos/preferencias.ts` | P4 |

## Dependências

Só o P1 altera `package.json` e o lockfile. Para adicionar uma biblioteca,
abra uma issue pedindo a inclusão.

## Segurança

- Nunca commite `.env`, tokens, chaves de IA ou credenciais.
- Chaves de IA devem ficar no backend, nunca no app.
- Não grave dados sensíveis no `AsyncStorage`; use `expo-secure-store`.
