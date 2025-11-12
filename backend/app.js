// Luciano Eugênio Schiavon
// 12-11-2025
// Arquivo principal do backend (ponto de entrada da API)

// Importa dependências principais
const express = require('express');
const cors = require('cors');
const app = express();

// Middlewares globais -------------------------------------------
// Permite que o frontend acesse o backend via navegador (CORS)
app.use(cors());

// Faz o Express entender JSON no corpo das requisições
app.use(express.json());

// ---------------------------------------------------------------
// Registra as rotas principais da aplicação
// Cada arquivo em ./routes define os endpoints de uma área

app.use('/api/niveis', require('./routes/niveis'));
app.use('/api/desenvolvedores', require('./routes/desenvolvedores'));

// ---------------------------------------------------------------
// Rota padrão só para teste rápido no navegador
app.get('/', (req, res) => {
  res.send('API Gazin - Backend rodando!');
});

// ---------------------------------------------------------------
// Sobe o servidor na porta 3001 (definida também no docker-compose)
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Servidor backend rodando na porta ${PORT}`);
});
