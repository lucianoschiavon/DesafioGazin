// Luciano Eugênio Schiavon
// 12-11-2025
// Modelo: Desenvolvedor
// Representa a tabela 'desenvolvedores' no banco, com timestamps desativados
// e chave estrangeira nivel_id apontando para 'niveis.id'

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * Tipos JSDoc para melhorar IntelliSense
 *
 * @typedef {object} DesenvolvedorInstance
 * @property {number} id
 * @property {string} nome
 * @property {'M'|'F'} sexo
 * @property {string} data_nascimento // ISO yyyy-mm-dd
 * @property {string} hobby
 * @property {number} nivel_id
 */

/** @type {import('sequelize').ModelCtor<import('sequelize').Model<DesenvolvedorInstance>>} */
const Desenvolvedor = sequelize.define('Desenvolvedor', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  nome: {
    type: DataTypes.STRING,
    allowNull: false,
    // Validações simples no nível do modelo
    validate: {
      notEmpty: { msg: 'Nome não pode ser vazio' },
      len: { args: [2, 255], msg: 'Nome deve ter entre 2 e 255 caracteres' }
    }
  },

  sexo: {
    type: DataTypes.CHAR(1),
    allowNull: false,
    validate: {
      isIn: {
        args: [['M', 'F']],
        msg: 'Sexo deve ser M ou F'
      }
    }
  },

  // Armazenado como DATEONLY para casar com o formato yyyy-mm-dd
  data_nascimento: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      isDate: { msg: 'Data de nascimento inválida' }
    }
  },

  hobby: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Hobby não pode ser vazio' }
    }
  },

  nivel_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    // Referência declarativa. A FK real é criada na migration/schema
    references: {
      model: 'niveis',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT'
  }

}, {
  tableName: 'desenvolvedores',
  timestamps: false,
  // Índices úteis em consultas por nome e por FK
  indexes: [
    { fields: ['nivel_id'] },
    { fields: ['nome'] }
  ]
});

module.exports = Desenvolvedor;
