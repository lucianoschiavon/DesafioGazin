📄 README_BACKEND.md
# Backend Gazin API 🚀

API REST para gerenciamento de **Níveis** e **Desenvolvedores**, construída em **Node.js + Express + Sequelize + PostgreSQL**, seguindo todos os requisitos do desafio técnico da Gazin.

Este backend implementa:

- CRUD completo
- Paginação, busca e ordenação
- Validações sólidas
- Subconsulta SQL para contagem de devs por nível
- Testes unitários e E2E
- Documentação Swagger
- Execução via Docker

---

## 📁 Estrutura das Pastas

```text
backend/
├── 📂 config
│   └── database.js
├── 📂 controllers
│   ├── niveisController.js
│   └── desenvolvedoresController.js
├── 📂 routes
│   ├── niveis.js
│   └── desenvolvedores.js
├── 📂 validators
│   └── payloadValidators.js
├── 📂 models
│   ├── index.js
│   ├── nivel.js
│   └── desenvolvedor.js
├── 📂 middlewares
│   └── errorHandler.js
├── 📂 docs
│   └── openapi.json
├── 📂 tests
│   ├── niveisController.test.js
│   ├── niveis.e2e.test.js
│   └── payloadValidators.test.js
├── app.js
├── server.js
├── jest.config.js
├── package.json
└── Dockerfile

⚙️ Tecnologias

Node.js

Express

Sequelize

PostgreSQL

Jest

Supertest

Swagger UI

▶️ Como rodar o Backend com Docker
docker compose up -d --build


Ou rodar só o backend:

docker compose up -d backend


A API ficará em:

http://localhost:3001


Swagger disponível em:

http://localhost:3001/docs

▶️ Como rodar sem Docker
cd backend
npm install
npm run dev


Você precisa do PostgreSQL rodando com:

DB: gazin
USER: postgres
PASS: desafiogazin
PORT: 5432

🧪 Testes

Rodar testes:

docker compose exec backend npm test


Testes incluídos:

Validação de payload

Controller de níveis

Teste E2E completo de níveis

🧭 Endpoints
Níveis /api/niveis
Método	Descrição	Status
GET	Lista níveis com paginação, busca e totalDevs	200 / 404
POST	Cria nível	201
PUT	Edita nível	200 / 404
DELETE	Remove nível (bloqueado se possui devs)	204 / 400
Desenvolvedores /api/desenvolvedores
Método	Descrição	Status
GET	Lista devs com paginação, busca, ordenação e idade calculada	200 / 404
POST	Cria dev	201
PUT	Edita dev	200 / 404
DELETE	Remove dev	204
☑️ Requisitos atendidos pelo Backend
Item	Situação
CRUD completo	✅
Paginação	✅
Busca	✅
Ordenação	✅
Validações	✅
Bloqueio de exclusão de nível	✅
Contagem de devs por nível	✅
Cálculo de idade	✅
Swagger	✅
Testes unitários	✅
Teste E2E	✅
Dockerfile	✅
👨‍💻 Autor

Luciano Eugênio Schiavon
📧 luciano@redescorporativas.com.br

📱 44 99946 4300