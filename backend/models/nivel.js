// Luciano Eugênio Schiavon
// 08-11-2025 (44)99946-4300 luciano@redescorporativas.com.br

// OBS: Representa a tabela nives do Banco de Dados, definindo os campos id e nivel
// com tipos e regras e desativa os timestamps automáticos para simplificar

// Importa o Sequelize e o tipo DataTypes para definir os campos da tabela
const { DataTypes } = require('sequelize');

// Importa a instância do Sequelize configurada
const sequelize = require('../config/database');

// Define o modelo 'Nivel' que representa a tabela 'niveis' no banco de dados
const Nivel = sequelize.define('Nivel', {
  // Campo 'id' como chave primária, gerado automaticamente
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  // Campo 'nivel' que armazena o nome do nível (ex: Júnior, Pleno, Sênior)
  nivel: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'niveis', // Nome da tabela no banco
  timestamps: false    // Desativa os campos automáticos 'createdAt' e 'updatedAt'
});

// TIMESTAMPS TODOS PROJETOS COLOCO MAIS COMO NÃO MENSIONA A NECESSIDADE.
// exemplo de codigo para ativar timestamps

// const Nivel = sequelize.define('Nivel', {
//  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
//  nivel: { type: DataTypes.STRING, allowNull: false }
//  }, {
//  tableName: 'niveis',
//  timestamps: true // ou simplesmente omitir, pois é o padrão
//  });

// SQL

// CREATE TABLE niveis (
//  id SERIAL PRIMARY KEY,
//  nivel VARCHAR(255) NOT NULL,
//  createdAt TIMESTAMP NOT NULL,
//  updatedAt TIMESTAMP NOT NULL
// );

Nivel.beforeCreate((nivel, options) => {
  console.log('Tentando criar nível:', nivel);
});

// Exporta o modelo para ser usado em outros arquivos
module.exports = Nivel;