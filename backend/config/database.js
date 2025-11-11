// Luciano Eugênio Schiavon
// 08-11-2025 (44)99946-4300 luciano@redescorporativas.com.br

// OBS: Lemos a variável DATABASE_URL do .env e cria-se uma conexão com o Postgresql através do Sequelize 
// que exporta a conexão para ser usada no index.js e nos modelos (models/) 

// Importa o pacote dotenv para carregar as variáveis do arquivo .env
require('dotenv').config();

// Importa o Sequelize, que é o ORM usado para interagir com o banco de dados
const { Sequelize } = require('sequelize');



// Cria uma nova instância do Sequelize usando a URL de conexão do PostgreSQL
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres', // Tipo de banco de dados
  logging: false,      // Desativa os logs SQL no console (pode ativar para debug)
});

// Exporta a instância para ser usada em outros arquivos
module.exports = sequelize;

