# Contrato da API — Consulta Fácil

Base URL: `https://back-end-pi-ihs1.onrender.com`
Swagger: `https://back-end-pi-ihs1.onrender.com/api-docs/`
Formato: JSON. Erros: `{ "erro": "mensagem" }`.

Rotas protegidas usam `Authorization: Bearer <token>`.
O token vem de `POST /auth/login` e expira em 8h por padrão.

## Autenticação

### POST /auth/login
Request:
```json
{ "email": "maria@email.com", "senha": "12345678" }
```
Response 200:
```json
{
  "mensagem": "Login realizado com sucesso",
  "token": "jwt...",
  "usuario": { "id": 2, "nome": "Maria Silva", "email": "maria@email.com", "perfil": "PACIENTE" }
}
```
Erros: 400 (dados inválidos), 401 (credenciais), 403 (conta inativa).

### GET /auth/perfil
Header: `Authorization: Bearer <token>`
Response 200: dados do usuário + `perfil`.
Erros: 401, 403, 404.

## Pacientes

### POST /pacientes
Request:
```json
{
  "nome": "Maria Silva",
  "cpf": "12345678901",
  "data_nascimento": "1995-02-10",
  "telefone": "81988888888",
  "email": "maria@email.com",
  "senha": "12345678",
  "endereco": "Recife - PE"
}
```
Obrigatórios: nome, cpf, data_nascimento, email, senha.
Response 201: `{ "mensagem": "...", "paciente": { ... } }`
Erros: 400, 409 (CPF/e-mail já cadastrado).

### GET /pacientes/{id}
Response 200:
```json
{
  "id_paciente": 2,
  "nome": "Maria Silva",
  "cpf": "12345678901",
  "data_nascimento": "1995-02-10",
  "telefone": "81988888888",
  "email": "maria@email.com",
  "endereco": "Recife - PE",
  "perfil": "PACIENTE",
  "ativo": true,
  "data_cadastro": "2026-10-20T00:00:00.000Z"
}
```

### PUT /pacientes/{id}
Body parcial: `nome`, `cpf`, `data_nascimento`, `telefone`, `email`,
`senha`, `endereco`, `ativo`.
Response 200: paciente atualizado.
Erros: 400, 404, 409.

## Catálogo

### GET /especialidades?nome=
Response 200: `[{ "id_especialidade": 1, "nome": "Ortopedia", "descricao": "...", "ativo": true }]`

### GET /clinicas?nome=
Response 200:
```json
[{ "id_clinica": 1, "nome": "Clínica Boa Saúde", "cnpj": "...", "telefone": "...", "email": "...", "endereco": "Boa Viagem", "horario_funcionamento": "...", "ativo": true }]
```

### GET /profissionais?nome=|clinica=|especialidade=
Apenas um filtro por vez é aplicado pelo backend.
Response 200:
```json
[{
  "id_profissional": 1,
  "id_clinica": 1,
  "id_especialidade": 1,
  "nome": "Dr. Carlos Mendes",
  "cpf": "...",
  "registro_profissional": "12345",
  "conselho": "CRM-PE",
  "telefone": "...",
  "email": "...",
  "perfil": "PROFISSIONAL",
  "ativo": true,
  "clinica_nome": "Clínica Boa Saúde",
  "especialidade_nome": "Ortopedia"
}]
```

### GET /disponibilidades/profissional/{id}
Response 200:
```json
[{ "id_disponibilidade": 1, "id_profissional": 1, "data": "2026-10-20", "hora_inicio": "08:00:00", "hora_fim": "09:00:00", "status": "DISPONIVEL" }]
```

## Agendamentos

### POST /agendamentos
Request:
```json
{ "id_paciente": 2, "id_profissional": 1, "id_disponibilidade": 1, "observacao": "Primeira consulta" }
```
Response 201: `{ "mensagem": "...", "agendamento": { ... } }`
Erros: 400, 404, 409 (horário indisponível/conflito).

### GET /agendamentos/paciente/{id}
Response 200:
```json
[{
  "id_agendamento": 1,
  "id_paciente": 2,
  "paciente_nome": "Maria Silva",
  "id_profissional": 1,
  "profissional_nome": "Dr. Carlos Mendes",
  "id_clinica": 1,
  "clinica_nome": "Clínica Boa Saúde",
  "id_especialidade": 1,
  "especialidade_nome": "Ortopedia",
  "id_disponibilidade": 1,
  "data_consulta": "2026-10-20",
  "hora_consulta": "08:00:00",
  "hora_fim": "09:00:00",
  "status": "AGENDADO",
  "observacao": null,
  "data_criacao": "..."
}]
```

### GET /agendamentos/{id}
Response 200: mesmo formato acima.

### PUT /agendamentos/{id}
Body: `{ "status": "CONFIRMADO", "observacao": "..." }`
Status: `AGENDADO`, `CONFIRMADO`, `CANCELADO`, `REALIZADO`.

### PATCH /agendamentos/{id}/cancelar
Response 200: `{ "mensagem": "...", "agendamento": { ... } }`
Erros: 404, 409 (já cancelado/realizado).

## Ainda não existentes no backend

- `POST /recuperar-senha`
- `POST /triagens` e `GET /triagens/paciente/{id}`
- `POST /ia/triagem` e `POST /ia/chat`
- `POST /notificacoes/registrar-token`

Ver `docs/integracoes-pendentes.md`.
