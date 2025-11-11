// Luciano Eugênio Schiavon
// 08-11-2025 (44)99946-4300 luciano@redescorporativas.com.br

// ordem funcional: importacoes, configuracao do express, teste de conexao
//                  sincronizacao dos modelos, definicao de rotas e inicializacao do servidor

/// Importa o framework Express para criar a API
const express = require('express');

// Importa o pacote dotenv para carregar variáveis de ambiente do arquivo .env
require('dotenv').config();

// Importa o Sequelize configurado
const sequelize = require('./config/database');

// Importa os modelos para garantir que sejam registrados
const Nivel = require('./models/nivel');
const Desenvolvedor = require('./models/desenvolvedor');
Nivel.hasMany(Desenvolvedor, { foreignKey: 'nivel_id' });
Desenvolvedor.belongsTo(Nivel, { foreignKey: 'nivel_id' });


// Cria uma instância do Express
const app = express();

// Middleware para permitir que a API receba dados em formato JSON
app.use(express.json());

// Testa a conexão com o banco de dados
sequelize.authenticate()
  .then(() => {
    console.log('✅ Conexão com o banco de dados estabelecida com sucesso!');
  })
  .catch((erro) => {
    console.error('❌ Erro ao conectar com o banco de dados:', erro);
  });

// Sincroniza os modelos com o banco de dados
sequelize.sync({ alter: true }) // quando alterar o banco /models já atualiza o postgresql mas em
  .then(() => {                 // ambientes de producao recomendo utilizar migrations para versionar
    console.log('📦 Tabelas sincronizadas com o banco de dados');
  })
  .catch((erro) => {
    console.error('❌ Erro ao sincronizar tabelas:', erro);
  });

// Define a rota para API niveis
const rotasNiveis = require('./routes/niveis');
app.use('/niveis', rotasNiveis);

// Define a rota para API desenvolvedores
const rotasDesenvolvedores = require('./routes/desenvolvedores');
app.use('/desenvolvedores', rotasDesenvolvedores);

  // Define uma rota simples para verificar se a API está funcionando
app.get('/', (req, res) => {
  res.send('API de Desenvolvedores está rodando!');
});

// Inicia o servidor na porta definida no .env ou 3001
const PORTA = process.env.PORT || 3001;
app.listen(PORTA, () => {
  console.log(`🚀 Servidor rodando na porta ${PORTA}`);
});