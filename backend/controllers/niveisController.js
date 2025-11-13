// Luciano Eugênio Schiavon
// 12-11-2025
// Controller de Níveis
// Objetivo:
// - Listar níveis com busca, paginação e ordenação
// - Trazer o campo totalDevs via subconsulta
// - CRUD completo conforme o enunciado base do desafio Gazin

const { Op, literal, col } = require('sequelize');
const { Nivel, Desenvolvedor } = require('../models');
const { parseListQuery, buildMeta } = require('../utils/pagination');
const { validateNivelPayload } = require('../utils/validation');

// GET /api/niveis
async function listar(req, res, next) {
  try {
    const { page, limit, offset, sort, order } = parseListQuery(
      req.query,
      ['id', 'nivel', 'totalDevs'] // campos permitidos
    );

    const where = {};
    if (req.query.nivel) {
      where.nivel = { [Op.iLike]: `%${req.query.nivel}%` };
    }

    const total = await Nivel.count({ where });

    // Projeto base: quando não há registros, retornar 404
    if (total === 0) {
      return res.status(404).json({
        data: [],
        meta: buildMeta(0, page, limit)
      });
    }

    const sortExpr = sort === 'totalDevs'
      ? literal(`(SELECT COUNT(*) FROM desenvolvedores d WHERE d.nivel_id = "Nivel"."id")`)
      : col(`Nivel.${sort}`);

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
      order: [[sortExpr, order.toUpperCase()]],
      limit,
      offset
    });

    return res.json({
      data: rows,
      meta: buildMeta(total, page, limit)
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
}

// POST /api/niveis
async function criar(req, res, next) {
  try {
    const { ok, erros } = validateNivelPayload(req.body);
    if (!ok) {
      return res.status(400).json({ mensagem: 'Corpo inválido', erros });
    }

    const novo = await Nivel.create({ nivel: String(req.body.nivel).trim() });
    return res.status(201).json(novo);
  } catch (err) {
    console.error(err);
    next(err);
  }
}

// PUT /api/niveis/:id
async function atualizar(req, res, next) {
  try {
    const id = Number(req.params.id);
    const row = await Nivel.findByPk(id);
    if (!row) {
      return res.status(404).json({ mensagem: 'Nível não encontrado' });
    }

    const { ok, erros } = validateNivelPayload(req.body);
    if (!ok) {
      return res.status(400).json({ mensagem: 'Corpo inválido', erros });
    }

    row.nivel = String(req.body.nivel).trim();
    await row.save();
    return res.json(row);
  } catch (err) {
    console.error(err);
    next(err);
  }
}

// DELETE /api/niveis/:id
async function remover(req, res, next) {
  try {
    const id = Number(req.params.id);
    const row = await Nivel.findByPk(id);
    if (!row) {
      return res.status(404).json({ mensagem: 'Nível não encontrado' });
    }

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
    next(err);
  }
}

module.exports = { listar, criar, atualizar, remover };
