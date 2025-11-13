# 📄 **README_FRONTEND.md**

```markdown
# Frontend Gazin SPA 🎨

Interface completa em **React**, integrada com o backend Gazin API.  
Implementa todo o fluxo de cadastro, listagem, edição e exclusão de:

- **Níveis**
- **Desenvolvedores**

Com:

- Paginação  
- Busca  
- Ordenação  
- Cálculo de idade  
- UI customizada com tema azul  
- Modal de edição  
- Confirmação de exclusão  
- Validações e mensagens amigáveis  

---

## 📁 Estrutura das Pastas

```text
frontend/
├── 📂 src
│   ├── 📂 components
│   │   ├── ModalNivel.js
│   │   ├── ModalDesenvolvedor.js
│   │   ├── Table.js
│   │   └── Header.js
│   ├── 📂 pages
│   │   ├── NiveisPage.js
│   │   └── DesenvolvedoresPage.js
│   ├── 📂 styles
│   │   └── theme.css
│   ├── api.js
│   ├── App.js
│   └── index.js
├── package.json
└── Dockerfile
🎨 Tema visual aplicado
Arquivo:

bash
Copiar código
src/styles/theme.css
Inclui:

Fundo cinza suave

Paleta azul

Tabelas menores

Botões reduzidos em 20%

Espaçamento uniforme

O novo tema melhora bastante a estética sem reescrever a UI inteira.

▶️ Rodando com Docker
bash
Copiar código
docker compose up -d --build
Frontend disponível em:

arduino
Copiar código
http://localhost:3000
▶️ Rodando sem Docker
bash
Copiar código
cd frontend
npm install
npm start
Se for rodar o backend separado, configure em .env:

bash
Copiar código
REACT_APP_API_URL=http://localhost:3001/api
🧩 Funcionalidades
Níveis
Listar com paginação

Buscar por nome

Ordenar por colunas

Ver total de devs associados

Criar, editar e remover

Bloqueio de exclusão quando há devs dependentes

Validação de campos

Desenvolvedores
Listar com paginação

Buscar por nome

Ordenar por id, nome, sexo e data

Calcular idade automaticamente

Criar, editar e remover

Validação completa

Extras aplicados no frontend
Estilo uniforme e agradável

Código limpo com hooks

API centralizada em api.js

Componentes reutilizáveis

Alertas amigáveis

Modal simples e funcional

☑️ Requisitos atendidos pelo Frontend
Item	Situação
CRUD completo	✅
Paginação	✅
Busca	✅
Ordenação por colunas	✅
Validações	✅
UI responsiva	✅
Tema visual personalizado	✅
Confirmação de exclusão	✅
Dockerfile	✅

👨‍💻 Autor
Luciano Eugênio Schiavon
📧 luciano@redescorporativas.com.br
📱 44 99946 4300