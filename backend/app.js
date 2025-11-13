// Luciano Eugênio Schiavon
// 12-11-2025
// Configuração do Express: middlewares e rotas. Não dá listen aqui.

const express = require('express');
const cors = require('cors');

const app = express();

// Middlewares globais
app.use(cors());
app.use(express.json());

// Rotas principais
app.use('/api/niveis', require('./routes/niveis'));
app.use('/api/desenvolvedores', require('./routes/desenvolvedores'));

// Rota de saúde simples
app.get('/', (req, res) => {
  res.json({
    mensagem: 'API Gazin - Backend rodando',
    endpoints: {
      niveis: '/api/niveis',
      desenvolvedores: '/api/desenvolvedores'
    }
  });
});

// Middleware global de tratamento de erros
const { errorHandler } = require('./middlewares/errorHandler');
app.use(errorHandler); 

// Swagger UI (documentação interativa)
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/openapi.json');
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));

console.log('📘 Swagger disponível em /docs');


// Exporta o app para o server.js dar o listen
module.exports = app;
