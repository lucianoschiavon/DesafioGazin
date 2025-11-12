// Luciano Eugênio Schiavon
// 08-11-2025 (44)99946-4300 luciano@redescorporativas.com.br

// OBS: GET    /niveis -> listar todos niveis
//      POST   /niveis -> cadastrar um novo nivel
//      PUT    /nivies/:id -> editar um nivel existente
//      DELETE /niveis/:id -> remover um nivel

// Rotas para Níveis
// Requisitos atendidos aqui:
// - GET com busca (query 'nivel'), paginação (page, limit) e ordenação (sort, order)
// - Campo totalDevs por nível
// - DELETE bloqueado quando houver devs associados (400 com mensagem clara)


const express = require('express');
const { Op, literal, col } = require('sequelize');
const router = express.Router();

// use o index que exporta { sequelize, Nivel, Desenvolvedor }
const { Nivel, Desenvolvedor } = require('../models');

// util: normaliza paginação e ordenação
function parseListQuery(q) {
  const page = Math.max(parseInt(q.page || '1', 10), 1);
  const limit = Math.max(parseInt(q.limit || '10', 10), 1);
  const offset = (page - 1) * limit;

  const allowedSort = new Set(['id', 'nivel', 'totalDevs']);
  let sort = (q.sort || 'id').toString();
  if (!allowedSort.has(sort)) sort = 'id';

  let order = (q.order || 'asc').toString().toLowerCase();
  if (!['asc', 'desc'].includes(order)) order = 'asc';

  return { page, limit, offset, sort, order };
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 * 
 * @typedef {import('../types').NivelDTO} NivelDTO
 * @typedef {import('../types').Paginado<NivelDTO>} ListaNiveis
 * 
 * Esta rota retorna um objeto no formato:
 * {
 *   data: [ { id, nivel, totalDevs } ],
 *   meta: { total, per_page, current_page, last_page }
 * }
 */


// GET /api/niveis
router.get('/', async (req, res) => {
  try {
    const { page, limit, offset, sort, order } = parseListQuery(req.query);
    const where = {};
    if (req.query.nivel) {
      where.nivel = { [Op.iLike]: `%${req.query.nivel}%` };
    }

    const total = await Nivel.count({ where });
    if (total === 0) {
      return res.status(404).json({
        data: [],
        meta: { total: 0, per_page: limit, current_page: page, last_page: 1 }
      });
    }

    // ordenação por totalDevs usa alias calculado
    const orderClause =
  sort === 'totalDevs'
    ? [[literal(`(SELECT COUNT(*) FROM desenvolvedores d WHERE d.nivel_id = "Nivel"."id")`), order]]
    : [[col(`Nivel.${sort}`), order]];

    // subconsulta conta direto na tabela física desenvolvedores
    const rows = await Nivel.findAll({
      where,
      attributes: [
        'id',
        'nivel',
        [literal(`(
          SELECT COUNT(*)::int
          FROM desenvolvedores d
          WHERE d.nivel_id = "Nivel"."id"
        )`), 'totalDevs']
      ],
      order: orderClause,
      limit,
      offset
    });

    return res.json({
      data: rows,
      meta: {
        total,
        per_page: limit,
        current_page: page,
        last_page: Math.max(Math.ceil(total / limit), 1)
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro ao listar níveis' });
  }
});

// POST /api/niveis
router.post('/', async (req, res) => {
  try {
    const { nivel } = req.body || {};
    if (!nivel || !nivel.trim()) {
      return res.status(400).json({ mensagem: 'Corpo inválido', erros: { nivel: 'Informe o nome do nível' } });
    }
    const novo = await Nivel.create({ nivel: nivel.trim() });
    return res.status(201).json(novo);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro ao criar nível' });
  }
});

// PUT /api/niveis/:id
router.put('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { nivel } = req.body || {};
    if (!nivel || !nivel.trim()) {
      return res.status(400).json({ mensagem: 'Corpo inválido', erros: { nivel: 'Informe o nome do nível' } });
    }

    const row = await Nivel.findByPk(id);
    if (!row) return res.status(404).json({ mensagem: 'Nível não encontrado' });

    row.nivel = nivel.trim();
    await row.save();
    return res.json(row);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro ao editar nível' });
  }
});

// DELETE /api/niveis/:id
router.delete('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const row = await Nivel.findByPk(id);
    if (!row) return res.status(404).json({ mensagem: 'Nível não encontrado' });

    const totalDevs = await Desenvolvedor.count({ where: { nivel_id: id } });
    if (totalDevs > 0) {
      return res.status(400).json({
        mensagem: 'Não é possível remover o nível, existem desenvolvedores associados',
        totalDevs
      });
    }

    await row.destroy();
    return res.status(204).send();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro ao remover nível' });
  }
});

module.exports = router;