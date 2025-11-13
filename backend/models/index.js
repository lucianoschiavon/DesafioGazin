// Luciano Eugênio Schiavon
// 12-11-2025
// Centraliza e carrega todos os modelos Sequelize e define as associações entre eles

const sequelize = require('../config/database');
const Nivel = require('./nivel');
const Desenvolvedor = require('./desenvolvedor');

/**
 * ASSOCIAÇÕES
 *
 * 1) Um nível possui vários desenvolvedores  1:N
 * 2) Um desenvolvedor pertence a um nível    N:1
 *
 * Aliases padronizados:
 * - Nivel.hasMany(... { as: 'desenvolvedores' })
 * - Desenvolvedor.belongsTo(... { as: 'nivel' })
 * Use estes aliases nos includes das consultas
 */
Nivel.hasMany(Desenvolvedor, {
  as: 'desenvolvedores',
  foreignKey: 'nivel_id'
});

Desenvolvedor.belongsTo(Nivel, {
  as: 'nivel',
  foreignKey: 'nivel_id'
});

// Exporta centralizado
module.exports = {
  sequelize,
  Nivel,
  Desenvolvedor
};
