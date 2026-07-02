# Sistema de Vagas para Freelancers

Este projeto e uma aplicacao web para conectar contratantes e freelancers. O sistema permite cadastrar usuarios, publicar vagas, candidatar-se a oportunidades, gerenciar candidaturas, conversar por chat e marcar projetos como concluidos.

O projeto esta dividido em duas partes:

- `frontend`: interface web feita com React, Vite, Tailwind CSS, Axios e React Router.
- `backend`: API feita com Node.js, Express, MySQL, JWT e bcrypt.

## Funcionalidades

- Cadastro e login de usuarios.
- Dois tipos de conta: freelancer e contratante.
- Freelancer pode visualizar vagas disponiveis, filtrar vagas, candidatar-se, remover candidaturas, cadastrar curriculo, conversar no chat e ver projetos concluidos.
- Contratante pode criar, editar e excluir vagas, visualizar candidatos, aprovar ou recusar candidaturas, conversar com candidatos e finalizar uma vaga com avaliacao.
- Autenticacao por token JWT salvo no `localStorage`.

## Estrutura do Projeto

```text
.
+-- backend
|   +-- src
|   |   +-- app.js
|   |   +-- config
|   |   |   +-- db.js
|   |   +-- controllers
|   |   +-- middlewares
|   |   +-- routes
|   +-- package.json
+-- frontend
|   +-- src
|   |   +-- components
|   |   +-- pages
|   |   +-- services
|   |   |   +-- api.js
|   |   +-- App.jsx
|   +-- package.json
+-- readme.md
```

## Requisitos

Antes de rodar o projeto, instale:

- Node.js
- npm
- MySQL

## Configurando o Backend

Entre na pasta do backend:

```bash
cd backend
```

Instale as dependencias:

```bash
npm install
```

Crie um arquivo `.env` dentro da pasta `backend` com as seguintes variaveis:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=nome_do_banco
JWT_SECRET=sua_chave_secreta
```

O frontend esta configurado para chamar a API em `http://localhost:3000`. Caso mude a porta do backend, ajuste tambem o arquivo `frontend/src/services/api.js`.

## Banco de Dados

Crie um banco no MySQL com o mesmo nome configurado em `DB_NAME`.

Exemplo:

```sql
CREATE DATABASE nome_do_banco;
USE nome_do_banco;
```

Se ainda nao tiver as tabelas criadas, use a estrutura minima abaixo:

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  user_type TINYINT NOT NULL
);

CREATE TABLE perfil_freelancer (
  user_id INT PRIMARY KEY,
  category VARCHAR(255),
  descricao TEXT,
  habilidades TEXT,
  telefone VARCHAR(30),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE vagas (
  id_vagas INT AUTO_INCREMENT PRIMARY KEY,
  id_user INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(255),
  modality VARCHAR(255),
  salary VARCHAR(255),
  location VARCHAR(255),
  data_final DATE,
  description TEXT,
  requirements TEXT,
  created_at DATETIME,
  usuario_selecionado INT NULL,
  flag_status TINYINT DEFAULT 0,
  nota_avaliacao INT NULL,
  FOREIGN KEY (id_user) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (usuario_selecionado) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE vagas_aplicadas (
  idvagas_aplicadas INT PRIMARY KEY,
  id_user_vagas_aplicadas INT NOT NULL,
  id_vagas INT NOT NULL,
  flag_pendencia TINYINT DEFAULT 1,
  FOREIGN KEY (id_user_vagas_aplicadas) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (id_vagas) REFERENCES vagas(id_vagas) ON DELETE CASCADE
);

CREATE TABLE conversa (
  id_conversa INT PRIMARY KEY,
  id_user_contratante_conversa INT NOT NULL,
  id_user_freelancer_conversa INT NOT NULL,
  id_vaga_conversa INT NOT NULL,
  created_at DATETIME,
  FOREIGN KEY (id_user_contratante_conversa) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (id_user_freelancer_conversa) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (id_vaga_conversa) REFERENCES vagas(id_vagas) ON DELETE CASCADE
);

CREATE TABLE mensagem (
  id_mensagem INT PRIMARY KEY,
  id_conversa_mensagem INT NOT NULL,
  id_sender INT NOT NULL,
  conteudo TEXT NOT NULL,
  created_at DATETIME,
  FOREIGN KEY (id_conversa_mensagem) REFERENCES conversa(id_conversa) ON DELETE CASCADE,
  FOREIGN KEY (id_sender) REFERENCES users(id) ON DELETE CASCADE
);
```

No sistema, `user_type` funciona assim:

- `0`: freelancer
- `1`: contratante

Em `vagas_aplicadas`, `flag_pendencia` funciona assim:

- `0`: recusado
- `1`: pendente
- `2`: aprovado

Em `vagas`, `flag_status` funciona assim:

- `0`: vaga aberta
- `1`: vaga concluida

## Rodando o Backend

Na pasta `backend`, execute:

```bash
npm run dev
```

Se estiver tudo certo, a API ficara disponivel em:

```text
http://localhost:3000
```

A rota inicial deve responder:

```text
Api rodando
```

## Configurando o Frontend

Abra outro terminal e entre na pasta do frontend:

```bash
cd frontend
```

Instale as dependencias:

```bash
npm install
```

Rode o frontend:

```bash
npm run dev
```

O Vite mostrara a URL local no terminal. Normalmente sera:

```text
http://localhost:5173
```

Acesse essa URL no navegador para usar o sistema.

## Como Usar

### Cadastro e login

1. Abra o frontend no navegador.
2. Clique em `Cadastre-se`.
3. Escolha o tipo de conta: `Freelancer` ou `Contratante`.
4. Preencha nome, email, senha e confirmacao de senha.
5. Depois do cadastro, o sistema salva o token e redireciona para o dashboard.

Tambem e possivel entrar depois pela tela de login usando email e senha.

### Usando como freelancer

Depois de entrar com uma conta freelancer, voce pode:

- Acessar o dashboard para ver vagas disponiveis.
- Buscar vagas pelo titulo.
- Filtrar vagas por categoria ou modalidade.
- Clicar em `Aplicar` para se candidatar a uma vaga.
- Acessar `Curriculo` para cadastrar categoria, descricao, habilidades e telefone.
- Acessar `Vagas Aplicadas` para acompanhar candidaturas e remover uma candidatura.
- Acessar `Chat` para conversar com contratantes.
- Acessar `Projetos Concluidos` para ver trabalhos finalizados e avaliados.

### Usando como contratante

Depois de entrar com uma conta contratante, voce pode:

- Criar uma nova vaga pelo dashboard ou pelo menu `Vagas > Nova vaga`.
- Acessar `Vagas > Minhas vagas` para ver as vagas criadas.
- Editar ou excluir uma vaga.
- Visualizar candidatos de uma vaga.
- Aprovar ou recusar candidatos.
- Abrir chat com candidatos.
- Finalizar uma vaga quando houver candidato aprovado.
- Dar uma nota de avaliacao ao projeto concluido.

## Rotas Principais do Frontend

```text
/login                 Tela de login
/register              Tela de cadastro
/dashboard             Tela inicial
/curriculum            Curriculo do freelancer
/vagas-aplicadas       Candidaturas do freelancer
/projetos-concluidos   Projetos finalizados do freelancer
/jobs                  Vagas do contratante
/jobs/create           Criacao de vaga
/chat                  Conversas
```

## Endpoints Principais da API

### Autenticacao

```text
POST /auth/register
POST /auth/login
GET  /auth/me
```

### Perfil

```text
GET /profile/freelancer
PUT /profile/freelancer
```

### Vagas

```text
GET    /jobs/allJobs
POST   /jobs/createJob
GET    /jobs/myJobs
GET    /jobs/completed
GET    /jobs/:id_vagas/candidates
PATCH  /jobs/:id_vagas/candidates/:idvagas_aplicadas/status
POST   /jobs/:id_vagas/apply
PATCH  /jobs/:id_vagas/complete
PUT    /jobs/:id_vagas
DELETE /jobs/:id_vagas
```

### Candidaturas

```text
GET    /vagas/minhasVagas
DELETE /vagas/minhasVagas/removerCandidatura/:idvagas_aplicadas
```

### Chat

```text
GET    /chat/conversations
POST   /chat/conversations
GET    /chat/conversations/:id_conversa/messages
POST   /chat/conversations/:id_conversa/messages
DELETE /chat/conversations/:id_conversa
```

As rotas privadas precisam receber o token JWT no cabecalho:

```text
Authorization: Bearer seu_token
```

No frontend isso ja e feito automaticamente pelo interceptor em `frontend/src/services/api.js`.

## Scripts Disponiveis

Backend:

```bash
npm run dev
```

Frontend:

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Problemas Comuns

Se aparecer erro de conexao com o banco, confira se o MySQL esta rodando e se as variaveis `DB_HOST`, `DB_USER`, `DB_PASSWORD` e `DB_NAME` estao corretas.

Se aparecer `JWT_SECRET nao configurado`, confira se o arquivo `.env` existe dentro da pasta `backend` e possui a variavel `JWT_SECRET`.

Se o frontend nao conseguir chamar a API, confira se o backend esta rodando em `http://localhost:3000` ou ajuste a `baseURL` em `frontend/src/services/api.js`.

Se a sessao expirar ou o token ficar invalido, faca login novamente.
