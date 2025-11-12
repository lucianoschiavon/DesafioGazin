// Luciano Eugênio Schiavon
// 08-11-2025 (44)99946-4300 luciano@redescorporativas.com.br

// OBS: Representa a tabela desenvolvedoeres do Banco de Dados, definindo os campos id e nivel
// com tipos e regras e desativa os timestamps automáticos para simplificar
// aqui incluimos a chave estrangeira nivel_id

// Importa os tipos do Sequelize
const { DataTypes } = require('sequelize');

// Importa a instância do Sequelize
const sequelize = require('../config/database');

// Importa o modelo de Nível para criar a associação
const Nivel = require('./nivel');


const Desenvolvedor = sequelize.define('Desenvolvedor', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  sexo: {
    type: DataTypes.CHAR(1),
    allowNull: false
  },
  data_nascimento: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  hobby: {
    type: DataTypes.STRING,
    allowNull: false
  },
  nivel_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'desenvolvedores',    // nome da tabela
  timestamps: false               // desativa createdAt/updatedAt
});

// Exporta o modelo
module.exports = Desenvolvedor;
