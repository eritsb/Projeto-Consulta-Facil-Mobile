# Checklist de desenvolvimento — 4 pessoas

## Ordem de merge

1. **P1** — base Expo, tema, tipos, cliente HTTP, auth, sessão e docs.
2. **P2** — componentes, início, busca, agendamento e histórico.
3. **P3** — triagem, IA, chatbot e notificações.
4. **P4** — agendamentos, perfil, acessibilidade e QA.

Cada pessoa cria sua branch a partir da `main` atualizada, abre PR e espera
review. Ninguém faz push direto na `main` nem merge sem aprovação.

## P1 — Infra, autenticação, integração e deploy (13 pts)

- [x] Repositório e scaffold Expo SDK 58.
- [x] TypeScript strict, ESLint, CI de lint/typecheck.
- [x] Tema base (`src/tema/cores.ts`).
- [x] Tipos compartilhados (`src/tipos/api.ts`, `src/tipos/triagem.ts`).
- [x] Cliente HTTP e configuração por `.env`.
- [x] Serviços de auth, pacientes, catálogo e agendamentos.
- [x] Sessão em `expo-secure-store` e `AuthContext`.
- [x] Telas T01–T06.
- [x] Documentação (`docs/telas.md`, `docs/api.md`, `docs/integracoes-pendentes.md`).
- [x] Contratos e mocks de IA/triagem/notificações para o P3.
- [ ] Configurar EAS com conta Expo (quando houver conta/projectId).
- [ ] Trocar CODEOWNERS pelos usuários reais do time.

Branch: `feat/infra-auth-eritsb`.

## P2 — Componentes, início, busca e agendamento (13 pts)

- [ ] Componentes reutilizáveis em `src/componentes/`.
- [ ] T07 — Início.
- [ ] T08 — Busca.
- [ ] T09–T15 — Fluxo de agendamento.
- [ ] T16 — Histórico.
- [ ] Integração com `catalogo.ts` e `agendamentos.ts`.
- [ ] Estados de loading/erro/vazio/sucesso.
- [ ] Testar com dados reais do backend.

Branch sugerida: `feat/inicio-busca-agendamento-<nome>`.

## P3 — Triagem, IA e notificações (12 pts)

- [ ] T17–T20 — Triagem e resultado.
- [ ] T21 — Chatbot.
- [ ] T22 — Notificações.
- [ ] Evoluir mocks de `ia.ts` e `triagem.ts`.
- [ ] Integrar `expo-notifications` (lembretes locais).
- [ ] Preencher `EXPO_PUBLIC_IA_URL`/`EXPO_PUBLIC_TRIAGEM_URL` quando existirem.
- [ ] Revisar aviso legal: nunca diagnosticar.

Branch sugerida: `feat/triagem-ia-notificacoes-<nome>`.

## P4 — Agendamentos, perfil, acessibilidade e QA (12 pts)

- [ ] T23 — Meus Agendamentos.
- [ ] T24 — Detalhes e cancelamento.
- [ ] T25 — Reagendar com segurança.
- [ ] T26 — Perfil.
- [ ] T27 — Acessibilidade (fonte, contraste, persistência).
- [ ] Roteiro de QA dos fluxos principais.
- [ ] Revisão de acessibilidade e textos.

Branch sugerida: `feat/agendamentos-perfil-qa-<nome>`.

## Definition of Done (todas as pessoas)

- [ ] Tela navegável e integrada via `src/servicos`.
- [ ] Loading, erro, vazio e sucesso.
- [ ] `accessibilityLabel`, foco e toque ≥ 44 px.
- [ ] `npm run lint` e `npm run typecheck` verdes.
- [ ] PR pequeno, sem conflitos, com descrição e como testar.
- [ ] Sem `.env`, tokens ou chaves no commit.
