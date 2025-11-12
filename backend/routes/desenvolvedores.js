//Luciano Eugênio Schiavon
//11-11-2025 (44)99946-4300
//Melhoria no codigo para evitar erros de CORS no Docker e paginacao consistente

// Rotas de Desenvolvedores
// Requisitos atendidos aqui:
// - GET com busca (query 'nome'), paginação (page, limit) e ordenação (sort, order)
// - Retorno com estrutura pedida e cálculo de idade

// Consolidação da lógica de paginação e ordenação — antes, cada endpoint repetia 
// parsing de page, limit, sort, order; agora há uma função parseListQuery() única. ganho 60 linhas de código

const express = require('express');
const { Op } = require('sequelize');
const router = express.Router();

/*const Desenvolvedor = require('../models/desenvolvedor');
const Nivel = require('../models/nivel'); */
const { Nivel, Desenvolvedor } = require('../models');

// util
function parseListQuery(q) {
  const page = Math.max(parseInt(q.page || '1', 10), 1);
  const limit = Math.max(parseInt(q.limit || '10', 10), 1);
  const offset = (page - 1) * limit;

  const allowedSort = new Set(['id', 'nome', 'sexo', 'data_nascimento']);
  let sort = (q.sort || 'id').toString();
  if (!allowedSort.has(sort)) sort = 'id';

  let order = (q.order || 'asc').toString().toLowerCase();
  if (!['asc', 'desc'].includes(order)) order = 'asc';

  return { page, limit, offset, sort, order };
}

function calcIdade(isoDate) {
  if (!isoDate) return null;
  const hoje = new Date();
  const nasc = new Date(isoDate);
  let idade = hoje.getFullYear() - nasc.getFullYear();
  const m = hoje.getMonth() - nasc.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) idade--;
  return idade;
}

// GET /api/desenvolvedores
router.get('/', async (req, res) => {
  try {
    const { page, limit, offset, sort, order } = parseListQuery(req.query);
    const where = {};
    if (req.query.nome) {
      where.nome = { [Op.iLike]: `%${req.query.nome}%` };
    }

    const total = await Desenvolvedor.count({ where });

    if (total === 0) {
      return res.status(404).json({
        data: [],
        meta: { total: 0, per_page: limit, current_page: page, last_page: 1 }
      });
    }

    const rows = await Desenvolvedor.findAll({
      where,
      include: [{ model: Nivel, attributes: ['id', 'nivel'] }],
      order: [[sort, order]],
      limit,
      offset
    });

    // mapeia para o formato esperado no readme
    const data = rows.map(r => ({
      id: r.id,
      nome: r.nome,
      sexo: r.sexo,
      data_nascimento: r.data_nascimento,
      idade: calcIdade(r.data_nascimento),
      hobby: r.hobby,
      nivel: r.Nivel ? { id: r.Nivel.id, nivel: r.Nivel.nivel } : null
    }));

    return res.json({
      data,
      meta: {
        total,
        per_page: limit,
        current_page: page,
        last_page: Math.max(Math.ceil(total / limit), 1)
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro ao listar desenvolvedores' });
  }
});

// POST /api/desenvolvedores
router.post('/', async (req, res) => {
  try {
    const { nivel_id, nome, sexo, data_nascimento, hobby } = req.body || {};
    const erros = {};
    if (!nivel_id) erros.nivel_id = 'Informe o nível';
    if (!nome || !nome.trim()) erros.nome = 'Informe o nome';
    if (!['M', 'F'].includes(sexo || '')) erros.sexo = 'Sexo deve ser M ou F';
    if (!data_nascimento) erros.data_nascimento = 'Informe a data de nascimento';
    if (!hobby || !hobby.trim()) erros.hobby = 'Informe o hobby';

    if (Object.keys(erros).length) {
      return res.status(400).json({ mensagem: 'Corpo inválido', erros });
    }

    const novo = await Desenvolvedor.create({
      nivel_id,
      nome: nome.trim(),
      sexo,
      data_nascimento,
      hobby: hobby.trim()
    });

    return res.status(201).json(novo);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro ao criar desenvolvedor' });
  }
});

// PUT /api/desenvolvedores/:id
router.put('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const row = await Desenvolvedor.findByPk(id);
    if (!row) return res.status(404).json({ mensagem: 'Desenvolvedor não encontrado' });

    const { nivel_id, nome, sexo, data_nascimento, hobby } = req.body || {};
    const erros = {};
    if (nivel_id === undefined || nivel_id === null) erros.nivel_id = 'Informe o nível';
    if (!nome || !nome.trim()) erros.nome = 'Informe o nome';
    if (!['M', 'F'].includes(sexo || '')) erros.sexo = 'Sexo deve ser M ou F';
    if (!data_nascimento) erros.data_nascimento = 'Informe a data de nascimento';
    if (!hobby || !hobby.trim()) erros.hobby = 'Informe o hobby';
    if (Object.keys(erros).length) {
      return res.status(400).json({ mensagem: 'Corpo inválido', erros });
    }

    row.nivel_id = nivel_id;
    row.nome = nome.trim();
    row.sexo = sexo;
    row.data_nascimento = data_nascimento;
    row.hobby = hobby.trim();
    await row.save();

    return res.json(row);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro ao editar desenvolvedor' });
  }
});

// DELETE /api/desenvolvedores/:id
router.delete('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const row = await Desenvolvedor.findByPk(id);
    if (!row) return res.status(404).json({ mensagem: 'Desenvolvedor não encontrado' });

    await row.destroy();
    return res.status(204).send();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro ao remover desenvolvedor' });
  }
});

module.exports = router;