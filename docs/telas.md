# Especificação de Telas — Consulta Fácil Mobile

## Convenções gerais

- Toda tela deve ter: loading, erro, vazio e sucesso.
- Textos em pt-BR, linguagem simples e acolhedora.
- Acessibilidade: labels, foco, toque ≥ 44px e não depender só de cor.
- Telas não chamam `fetch`; usam `src/servicos`.
- Navegação via Expo Router (`app/`).
- Referência visual: https://github.com/eritsb/figmafrontend
  (`src/App.tsx` e `src/imports/pasted_text/saude-recife-prototype.md`).
- Fora do escopo: telemedicina, biometria, documentos, admin e profissional.

## Fluxos principais

1. Boas-vindas → Login/Cadastro → Início.
2. Início → “Preciso de atendimento” → Triagem → Processamento → Resultado →
   Especialidade → Clínica → Profissional → Data → Horário → Revisão → Sucesso.
3. Início → “Já sei o que preciso” → Especialidade → Clínica → Profissional →
   Data → Horário → Revisão → Sucesso.
4. Início → Meus Agendamentos → Detalhes → Reagendar/Cancelar.
5. Início → Histórico / Notificações / Perfil.

---

# P1 — Autenticação

## T01 — Splash
- Rota: `app/index.tsx`
- Objetivo: abertura e verificação de sessão.
- UI: logo/nome “Consulta Fácil”, indicador de carregamento.
- Ação: se houver sessão, ir para `/(app)/inicio`; senão `/(auth)/boas-vindas`.
- API: nenhuma.

## T02 — Boas-vindas
- Rota: `app/(auth)/boas-vindas.tsx`
- UI: título “Cuide do seu próximo passo.”, texto de apoio,
  botões “Começar” e “Já tenho uma conta”.
- Ações: Começar → Cadastro; Já tenho conta → Login.

## T03 — Login
- Rota: `app/(auth)/login.tsx`
- UI: e-mail, senha (mostrar/ocultar), “Entrar”, “Esqueci minha senha”,
  “Não tenho conta”.
- Ações: validar; `POST /auth/login`; salvar token no `SecureStore`;
  redirecionar por perfil.
- Estados: loading, credenciais inválidas, conta inativa, offline.
- Aceite: sessão restaurada ao reabrir o app.

## T04 — Cadastro de paciente
- Rota: `app/(auth)/cadastro.tsx`
- Campos: nome, CPF, data de nascimento, telefone, e-mail, senha, endereço.
- Ações: validar; `POST /pacientes`; autenticar; ir para o início.
- Estados: loading, erro 400/409, sucesso.
- Aceite: CPF/e-mail duplicado exibe a mensagem do backend.

## T05 — Esqueci minha senha
- Rota: `app/(auth)/esqueci-senha.tsx`
- UI: campo e-mail, botão “Enviar instruções”.
- Ação: se a integração não estiver configurada, avisar que a recuperação
  ainda não está disponível no backend. Não simular envio.
- Estado: informativo.

## T06 — E-mail enviado
- Rota: `app/(auth)/email-enviado.tsx`
- UI: confirmação e botão “Voltar ao login”.

---

# P2 — Início, Busca, Agendamento e Histórico

## T07 — Início
- Rota: `app/(app)/inicio.tsx`
- UI: saudação, “Como podemos ajudar?”, card “Próximo atendimento”,
  botões “Preciso de atendimento” e “Já sei o que preciso”, atalhos de
  especialidades, sino de notificações.
- Ações: triagem; busca; agendamentos; notificações; perfil.
- API: `GET /agendamentos/paciente/{id}`, `GET /especialidades`.
- Estados: loading, erro, sem próximo atendimento.

## T08 — Busca
- Rota: `app/(app)/busca.tsx`
- UI: campo de busca, abas Especialidades / Clínicas / Profissionais.
- Ações: `GET /especialidades?nome=`, `GET /clinicas?nome=`,
  `GET /profissionais?nome=|clinica=|especialidade=`.
- Estados: loading, vazio, sem resultados, erro.
- Aceite: tocar em um resultado inicia o agendamento.

## T09 — Agendamento: Especialidade
- Rota: `app/(app)/agendamento/especialidade.tsx`
- UI: busca + lista de especialidades ativas.
- Ação: selecionar e avançar.
- API: `GET /especialidades`.

## T10 — Agendamento: Clínica
- Rota: `app/(app)/agendamento/clinica.tsx`
- UI: cards com nome, endereço e especialidades.
- Ação: selecionar clínica.
- API: `GET /clinicas`.

## T11 — Agendamento: Profissional
- Rota: `app/(app)/agendamento/profissional.tsx`
- UI: profissionais filtrados por clínica/especialidade.
- Ação: selecionar profissional.
- API: `GET /profissionais?clinica=&especialidade=`.

## T12 — Agendamento: Data
- Rota: `app/(app)/agendamento/data.tsx`
- UI: seleção de datas com horários disponíveis.
- API: `GET /disponibilidades/profissional/{id}`.
- Estados: sem horários, erro com “Tentar novamente”.

## T13 — Agendamento: Horário
- Rota: `app/(app)/agendamento/horario.tsx`
- UI: botões grandes; disponível, selecionado e indisponível com texto/ícone,
  não só cor.
- Ação: selecionar horário.

## T14 — Agendamento: Revisão
- Rota: `app/(app)/agendamento/revisao.tsx`
- UI: especialidade, profissional, clínica, data, horário e
  “Confirmar agendamento”.
- Ação: `POST /agendamentos` com `id_paciente`, `id_profissional`,
  `id_disponibilidade`.
- Estados: loading, conflito 409, erro, sucesso.

## T15 — Agendamento: Sucesso
- Rota: `app/(app)/agendamento/sucesso.tsx`
- UI: “Agendamento realizado!”, resumo, “Ver agendamento” e
  “Voltar ao início”.

## T16 — Histórico
- Rota: `app/(app)/historico.tsx`
- UI: consultas passadas/canceladas, filtro por período.
- API: `GET /agendamentos/paciente/{id}`.
- Estados: loading, vazio, erro.

---

# P3 — Triagem, IA e Notificações

## T17 — Triagem: Introdução
- Rota: `app/(app)/triagem/index.tsx`
- UI: “Vamos entender o que você precisa”, aviso de que não substitui
  avaliação médica, botão “Começar”.

## T18 — Triagem: Perguntas (Q1–Q5)
- Rota: `app/(app)/triagem/perguntas.tsx`
- Q1 sintomas: Dor, Febre, Tosse, Cansaço, Alteração na pele, Outro.
- Q2 localização: cabeça/pescoço, peito, abdômen, braços/pernas, costas,
  pele, não sei.
- Q3 duração: hoje, dias, semanas, meses, não sei.
- Q4 intensidade: escala 1–5 acessível.
- Q5 informações adicionais: texto livre.
- Idade: obter do perfil; se ausente, perguntar antes do resultado.
- UI: progresso “1 de 5”, botão Continuar desabilitado até responder.
- Ação: salvar rascunho em `AsyncStorage`.

## T19 — Triagem: Processamento
- Rota: `app/(app)/triagem/processamento.tsx`
- UI: indicador de carregamento e “Estamos analisando suas respostas”.
- Ação: chamar IA (mock até o backend existir).

## T20 — Triagem: Resultado
- Rota: `app/(app)/triagem/resultado.tsx`
- UI: especialidade sugerida, texto “Com base nas suas respostas, essa pode
  ser uma especialidade adequada”, aviso legal, “Ver opções de atendimento”
  e “Escolher outra especialidade”.
- Ações: agendamento com especialidade pré-selecionada; voltar à busca.
- Observação: nunca diagnosticar.

## T21 — Chatbot de Orientação
- Rota: `app/(app)/ia/chat.tsx`
- UI: conversa, sugestões rápidas, campo de texto, botão enviar.
- Ação: interpretar necessidade e sugerir especialidade; usar mock até o
  endpoint de IA.
- Estados: digitando, erro, tentar novamente.
- Aceite: permitir iniciar agendamento a partir da conversa.

## T22 — Notificações
- Rota: `app/(app)/notificacoes.tsx`
- UI: lista de lembretes/confirmações; marcar como lida.
- Dados: gerados a partir dos agendamentos + `expo-notifications` local.
- Estados: vazio, erro.

---

# P4 — Agendamentos, Perfil e Acessibilidade

## T23 — Meus Agendamentos
- Rota: `app/(app)/agendamentos/index.tsx`
- UI: cards com especialidade, profissional, clínica, data, horário, status
  e “Ver detalhes”.
- API: `GET /agendamentos/paciente/{id}`.
- Estados: loading, vazio, erro.

## T24 — Detalhes do Agendamento
- Rota: `app/(app)/agendamentos/[id].tsx`
- UI: dados completos; “Reagendar” e “Cancelar agendamento”.
- Ação: cancelar via `PATCH /agendamentos/{id}/cancelar` com confirmação.
- Estados: loading, erro, sucesso.

## T25 — Reagendar
- Rota: `app/(app)/agendamentos/reagendar.tsx`
- UI: escolha de nova data/horário.
- Ação: criar novo agendamento e só depois cancelar o antigo. Se a criação
  falhar, não cancelar.
- API: `GET /disponibilidades/profissional/{id}`, `POST /agendamentos`,
  `PATCH /agendamentos/{id}/cancelar`.

## T26 — Perfil
- Rota: `app/(app)/perfil.tsx`
- UI: nome, e-mail, telefone, data de nascimento, editar dados,
  acessibilidade, privacidade, sair.
- API: `GET/PUT /pacientes/{id}`.
- Estados: loading, erro, sucesso.

## T27 — Acessibilidade
- Rota: dentro do perfil ou `app/(app)/acessibilidade.tsx`
- UI: fonte maior, alto contraste, lembretes.
- Ação: salvar em `AsyncStorage` e aplicar no app inteiro.
- Aceite: preferências persistem ao reabrir.
