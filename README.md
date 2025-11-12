# Projeto de Cadastro de Desenvolvedores 🚀

Sistema completo para cadastro de **desenvolvedores** e **níveis**, com backend em Node.js + Express e frontend em React.  
O projeto segue as especificações do desafio técnico, com foco em boas práticas, documentação e execução via **Docker Compose**.

---

## 📁 Estrutura do Projeto

📦 projeto-desenvolvedores
├── 📂 backend
│ ├── 📂 routes
│ ├── 📂 models
│ ├── 📂 config
│ ├── app.js
│ ├── package.json
│ └── Dockerfile
├── 📂 frontend
│ ├── src/
│ ├── package.json
│ └── Dockerfile
└── 🐳 docker-compose.yml

yaml
Copiar código

---

## ⚙️ Tecnologias Utilizadas

- **Backend:** Node.js, Express, Sequelize, PostgreSQL
- **Frontend:** React, Axios, React Router DOM
- **Banco:** PostgreSQL
- **Containerização:** Docker e Docker Compose

---

## ▶️ Como Executar Localmente

### Requisitos
- Docker e Docker Compose instalados

### Passos
```bash
# Clonar o repositório
git clone https://github.com/seuusuario/projeto-desenvolvedores.git
cd projeto-desenvolvedores

# Subir todos os serviços
docker compose up -d
Acesse:

Frontend: http://localhost:3000

Backend (API): http://localhost:3001

Banco de Dados: PostgreSQL no container banco_desenvolvedores (porta 5432)

🧭 Endpoints Principais
Níveis (/api/niveis)
Método	Descrição	Status
GET	Lista níveis com paginação e total de devs	200 / 404
POST	Cria novo nível	201
PUT	Edita nível existente	200
DELETE	Remove nível (bloqueado se houver devs)	204 / 400

Desenvolvedores (/api/desenvolvedores)
Método	Descrição	Status
GET	Lista desenvolvedores com paginação e idade calculada	200 / 404
POST	Cria novo desenvolvedor	201
PUT	Edita desenvolvedor existente	200
DELETE	Remove desenvolvedor	204

🧩 Funcionalidades Implementadas
✅ CRUD completo de níveis e desenvolvedores
✅ Paginação, busca e ordenação
✅ Contagem de devs por nível
✅ Cálculo automático de idade
✅ Bloqueio de exclusão de nível com devs associados
✅ SPA React integrada à API
✅ Containers orquestrados com Docker Compose

☁️ Deploy / Publicação
🔹 Render
Crie duas aplicações:

Backend: tipo Web Service

Frontend: tipo Static Site

Configure variáveis de ambiente:

ini
Copiar código
DATABASE_URL=postgresql://usuario:senha@host:5432/gazin
PORT=3001
No frontend, defina a variável:

ini
Copiar código
REACT_APP_API_URL=https://seu-backend.onrender.com/api
Deploy automático ao fazer push para o GitHub.

📘 Guia oficial: https://render.com/docs

🔹 Railway
Crie um novo projeto e adicione:

Um serviço PostgreSQL

Um serviço Node.js (backend)

Um serviço React (frontend)

Configure as variáveis:

ini
Copiar código
DATABASE_URL=postgresql://usuario:senha@host:5432/gazin
PORT=3001
No frontend:

ini
Copiar código
REACT_APP_API_URL=https://seu-backend.up.railway.app/api
Deploy automático via GitHub.

📘 Guia oficial: https://railway.app/docs

🧪 Testes e Validação
Testado manualmente via Postman e SPA.

Todas as respostas e códigos HTTP validados conforme o desafio técnico.

Containers Docker testados individualmente e em conjunto.

🧹 Boas Práticas Aplicadas
Código comentado em português

Funções reutilizáveis (parseListQuery, calcIdade)

Padrão RESTful seguido

Mensagens claras de sucesso e erro

Organização modular e limpa

👨‍💻 Autor
Luciano Eugênio Schiavon
📧 luciano@redescorporativas.com.br
📱 (44) 99946-4300

📋 Checklist Atendido
Item	Descrição	Situação
🚀	CRUD de Níveis e Desenvolvedores	✅
🚀	Paginação e busca	✅
🚀	Bloqueio de exclusão com dependências	✅
🎨	SPA funcional e responsiva	✅
🐳	Docker Compose com backend + frontend + banco	✅
🧩	Código limpo e comentado	✅

🧱 Observação Final
O projeto foi desenvolvido integralmente via Docker Compose, testado e validado conforme os requisitos do desafio técnico, atendendo os níveis 1 e 2, e parcialmente o nível 3.