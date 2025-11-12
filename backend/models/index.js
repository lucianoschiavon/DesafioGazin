// Luciano Eugênio Schiavon
// 11-11-2025
// Centraliza e carrega todos os modelos do Sequelize com suas associações

const sequelize = require('../config/database');
const Nivel = require('./nivel');
const Desenvolvedor = require('./desenvolvedor');

// Aplica as associações corretamente
Nivel.hasMany(Desenvolvedor, {
  as: 'Desenvolvedores',
  foreignKey: 'nivel_id'
});

Desenvolvedor.belongsTo(Nivel, {
  as: 'nivel',
  foreignKey: 'nivel_id'
});

module.exports = {
  sequelize,
  Nivel,
  Desenvolvedor
};
