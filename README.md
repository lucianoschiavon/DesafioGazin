🌐 Desafio Gazin Tech — Fullstack Completo

Este projeto implementa um sistema de cadastro de Níveis e Desenvolvedores, com CRUD completo, paginação, ordenação, validações, documentação Swagger, testes automatizados e deploy via Docker.

A aplicação é composta de duas partes:

Backend Node.js + Express + PostgreSQL + Sequelize

Frontend React

Sistema completo para cadastro de **desenvolvedores** e **níveis**, com backend em **Node.js + Express + Sequelize + PostgreSQL** e frontend em **React**.  
O projeto segue as especificações do desafio técnico da Gazin, com foco em boas práticas, documentação e execução via **Docker Compose**.

---

## 📁 Estrutura do Projeto

```text
📦 desafio-gazin-desenvolvedores
├── 📂 backend
│   ├── 📂 config
│   │   └── database.js
│   ├── 📂 controllers
│   │   ├── niveisController.js
│   │   └── desenvolvedoresController.js
│   ├── 📂 routes
│   │   ├── niveis.js
│   │   └── desenvolvedores.js
│   ├── 📂 models
│   │   ├── index.js
│   │   ├── nivel.js
│   │   └── desenvolvedor.js
│   ├── 📂 validators
│   │   └── payloadValidators.js
│   ├── 📂 middlewares
│   │   └── errorHandler.js
│   ├── 📂 docs
│   │   └── openapi.json      ← documentação Swagger
│   ├── 📂 tests
│   │   ├── niveisController.test.js
│   │   ├── niveis.e2e.test.js
│   │   └── payloadValidators.test.js
│   ├── app.js                ← configura o Express (rotas, middlewares)
│   ├── server.js             ← sobe o servidor HTTP
│   ├── package.json
│   └── Dockerfile
│
├── 📂 frontend
│   ├── 📂 src
│   │   ├── App.js
│   │   ├── api.js
│   │   └── styles
│   │       └── theme.css     ← estilos globais (tema azul)
│   ├── public/
│   ├── package.json
│   └── Dockerfile
│
└── 🐳 docker-compose.yml
⚙️ Tecnologias Utilizadas
Backend

Node.js

Express

Sequelize ORM

PostgreSQL

Jest e Supertest (testes)

Swagger UI (documentação da API)

Frontend

React

Hooks (useState, useEffect, useMemo)

Fetch/Axios para integração com a API

SPA simples com duas telas (Níveis e Desenvolvedores)

Infraestrutura

Docker

Docker Compose

▶️ Como Executar com Docker
Requisitos
Docker instalado

Docker Compose instalado

Passos
bash
Copiar código
# Clonar o repositório
git clone https://github.com/seu-usuario/desafio-gazin-desenvolvedores.git
cd desafio-gazin-desenvolvedores

# Subir todos os serviços em segundo plano
docker compose up -d
Após subir os containers, acesse:

Frontend: http://localhost:3000

Backend (API): http://localhost:3001

Documentação Swagger: http://localhost:3001/docs

O banco PostgreSQL roda no container banco_desenvolvedores, porta 5432, com:

text
Copiar código
DB: gazin
USER: postgres
PASSWORD: desafiogazin
HOST: banco_dados (dentro da rede docker)
▶️ Como Executar Sem Docker (opcional)
Backend
bash
Copiar código
cd backend
npm install

# configurar .env (exemplo)
cp .env.example .env
# ajustar DATABASE_URL se necessário

npm run dev
# ou
npm start
Backend ficará em: http://localhost:3001

Frontend
bash
Copiar código
cd frontend
npm install

# se necessário, configurar a URL da API
# por exemplo em src/api.js ou variável REACT_APP_API_URL

npm start
Frontend ficará em: http://localhost:3000

🧭 Endpoints Principais
Níveis (/api/niveis)
Método	Descrição	Status esperado
GET	Lista níveis com paginação, busca por nome e total de devs	200 ou 404 se vazio
POST	Cria novo nível	201 ou 400 se inválido
PUT	Edita um nível existente (/api/niveis/:id)	200 ou 400 ou 404
DELETE	Remove um nível (/api/niveis/:id)	204 ou 400 ou 404

Detalhes importantes:

GET /api/niveis suporta:

page, limit

sort (id, nivel, totalDevs)

order (asc, desc)

nivel para busca parcial por nome

Resposta quando há registros (formato paginado):

json
Copiar código
{
  "data": [
    {
      "id": 1,
      "nivel": "Júnior",
      "totalDevs": 3
    }
  ],
  "meta": {
    "total": 1,
    "per_page": 10,
    "current_page": 1,
    "last_page": 1
  }
}
Desenvolvedores (/api/desenvolvedores)
Método	Descrição	Status esperado
GET	Lista devs com paginação, busca, ordenação e idade calculada	200 ou 404 se vazio
POST	Cria novo desenvolvedor	201 ou 400 se inválido
PUT	Edita desenvolvedor existente (/api/desenvolvedores/:id)	200 ou 400 ou 404
DELETE	Remove desenvolvedor (/api/desenvolvedores/:id)	204 ou 404

Campos usados em GET:

json
Copiar código
{
  "id": 1,
  "nome": "Nome do Desenvolvedor",
  "sexo": "M",
  "data_nascimento": "1990-01-01",
  "idade": 31,
  "hobby": "Programação",
  "nivel": {
    "id": 1,
    "nivel": "Pleno"
  }
}
Parâmetros de listagem:

page, limit

sort (id, nome, sexo, data_nascimento)

order (asc, desc)

nome para busca parcial

A idade é calculada no backend a partir de data_nascimento.

🧩 Funcionalidades Implementadas
Backend
✅ CRUD completo de Níveis

✅ CRUD completo de Desenvolvedores

✅ Paginação em ambas as listagens

✅ Busca por query (nome do nível e nome do dev)

✅ Ordenação por colunas (id, nome, sexo, data de nascimento, total de devs)

✅ Contagem de devs por nível com subconsulta SQL estável

✅ Bloqueio de exclusão de nível com devs associados (retorna 400)

✅ Validações de payload em módulo dedicado (validators/payloadValidators.js)

✅ Tratamento de erros centralizado por middleware

✅ Documentação da API via Swagger (/docs)

✅ Testes unitários e de integração com Jest e Supertest

Frontend
✅ SPA com duas “abas” principais: Níveis e Desenvolvedores

✅ Tabelas com:

paginação

ordenação clicando no cabeçalho

busca por nome

✅ Modal para cadastro e edição de níveis

✅ Modal para cadastro e edição de desenvolvedores

✅ Validações básicas no frontend

✅ Confirmação antes da exclusão

✅ Mensagens de sucesso e erro (alerts tipo toast simples)

✅ Cálculo e exibição da idade do dev

✅ Estilização com tema azul (arquivo src/styles/theme.css)

🧪 Testes e Validação
Rodar testes do backend
Dentro do container backend:

bash
Copiar código
docker compose exec backend npm test
Configuração do Jest:

js
Copiar código
// backend/jest.config.js
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js']
};
Cobertura atual:

Testes de validação de payload (payloadValidators.test.js)

Testes do controller de níveis (niveisController.test.js)

Teste de fluxo completo de níveis (E2E niveis.e2e.test.js)

📘 Swagger (Documentação da API)
A documentação está disponível em:

http://localhost:3001/docs

Implementação:

Arquivo backend/docs/openapi.json descreve os endpoints de níveis e desenvolvedores.

Em app.js:

js
Copiar código
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/openapi.json');

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));
☁️ Deploy e Publicação (sugestão)
Render
Criar um Web Service para o backend

Criar um Static Site para o frontend

Configurar variáveis de ambiente no backend:

ini
Copiar código
DATABASE_URL=postgres://postgres:desafiogazin@host:5432/gazin
PORT=3001
No frontend:

ini
Copiar código
REACT_APP_API_URL=https://seu-backend.onrender.com/api
Railway
Criar um serviço PostgreSQL

Criar um serviço Node.js para o backend

Criar um serviço static ou Node.js para o frontend

Variáveis:

ini
Copiar código
DATABASE_URL=postgres://postgres:desafiogazin@host:5432/gazin
PORT=3001
REACT_APP_API_URL=https://seu-backend.up.railway.app/api
📋 Checklist Atendido
Nível 1
Item	Descrição	Local	Status
[x]	Listar níveis	🚀🎨	OK
[x]	Cadastrar um nível	🚀🎨	OK
[x]	Editar um nível	🚀🎨	OK
[x]	Remover um nível	🚀🎨	OK
[x]	Listar desenvolvedores	🚀🎨	OK
[x]	Cadastrar desenvolvedor	🚀🎨	OK
[x]	Editar desenvolvedor	🚀🎨	OK
[x]	Remover desenvolvedor	🚀🎨	OK

Nível 2
Item	Descrição	Local	Status
[x]	Impedir remoção de nível com devs associados	🚀	OK
[x]	Busca via query na listagem de níveis	🚀🎨	OK
[x]	Busca via query na listagem de desenvolvedores	🚀🎨	OK
[x]	Tratamento de exceções / retornos de erro concisos	🚀🎨	OK
[x]	Paginação na listagem de níveis	🚀🎨	OK
[x]	Paginação na listagem de desenvolvedores	🚀🎨	OK
[x]	Mensagens de sucesso e/ou erros (alerts na UI)	🎨	OK
[x]	Confirmação para exclusão de itens	🎨	OK
[x]	Ordenação das tabelas clicando no nome da coluna	🎨	OK
[x]	Validações de campos no backend e frontend	🚀🎨	OK
[x]	Coluna com quantidade de devs associados na página de níveis	🎨	OK

Nível 3
Item	Descrição	Local	Status
[x]	Tipagem de dados (JSDoc, DTOs)	🚀🎨	OK
[x]	Organização e estrutura de pastas	🚀🎨	OK
[x]	Reaproveitamento de código	🚀🎨	OK
[x]	Clean Code	🚀🎨	OK
[ ]	Arquitetura formal Clean/Onion/Hex	🚀🎨	Parcial Devido ao tamanho do projeto
[x]	Testes unitários / feature	🚀🎨	OK
[x]	Documentação código/endpoint (Swagger)	🚀🎨	OK

Nível 4
Item	Descrição	Local	Status
[x]	Disponibilização do backend via Docker	🚀	OK
[x]	Disponibilização do frontend via Docker	🎨	OK
[x]	Containers backend + frontend + banco via Docker Compose	🚀🎨	OK
[X]	Publicação do projeto online (Render / Railway / etc.)	🚀🎨	OK

👨‍💻 Autor
Luciano Eugênio Schiavon
📧 luciano@redescorporativas.com.br
📱 (44) 99946-4300

🧱 Observação Final
O projeto foi desenvolvido com foco em:

aderência ao enunciado do desafio

código limpo e comentado em português

organização de pastas

testes automatizados

documentação da API e facilidade de execução via Docker

Pronto para ser clonado, subir com docker compose up -d e avaliado. 
se for em vps modificar localhost nas conexões para ip da maquina virtual