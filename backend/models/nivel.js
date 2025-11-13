// Luciano Eugênio Schiavon
// 12-11-2025
// Modelo: Nivel
// Representa a tabela 'niveis' no banco. Mantém timestamps desativados, como o projeto base pede.

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Define o modelo Nivel
const Nivel = sequelize.define('Nivel', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nivel: { type: DataTypes.STRING, allowNull: false }
}, {
  tableName: 'niveis',
  timestamps: false
});

module.exports = Nivel;
