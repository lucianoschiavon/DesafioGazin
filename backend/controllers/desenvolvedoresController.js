// Luciano Eugênio Schiavon
// 12-11-2025
// Controller de Desenvolvedores
// Objetivo:
// - Listar com busca, paginação e ordenação
// - Incluir dados do nível e calcular idade no retorno
// - CRUD completo seguindo o enunciado. Quando não houver registros, retorna 404 conforme projeto base

const { Op } = require('sequelize');
const { Desenvolvedor, Nivel } = require('../models');
// Validador de payload que você criou em validators/payloadValidators.js
const { validateDevPayload } = require('../validators/payloadValidators');

// Normaliza paginação e ordenação
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

// Calcula idade a partir de yyyy-mm-dd
function calcIdade(isoDate) {
  if (!isoDate) return null;
  const hoje = new Date();
  const nasc = new Date(isoDate);
  let idade = hoje.getFullYear() - nasc.getFullYear();
  const m = hoje.getMonth() - nasc.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) idade--;
  return idade;
}

module.exports = {
  // GET /api/desenvolvedores
  async listar(req, res) {
    try {
      const { page, limit, offset, sort, order } = parseListQuery(req.query);
      const where = {};
      if (req.query.nome) {
        where.nome = { [Op.iLike]: `%${req.query.nome}%` };
      }

      const total = await Desenvolvedor.count({ where });

      // Projeto base: quando não há registros, retornar 404
      if (total === 0) {
        return res.status(404).json({
          data: [],
          meta: { total: 0, per_page: limit, current_page: page, last_page: 1 }
        });
      }

      const rows = await Desenvolvedor.findAll({
        where,
        include: [{ model: Nivel, as: 'nivel', attributes: ['id', 'nivel'] }],
        order: [[sort, order]],
        limit,
        offset
      });

      // Mapeia para o formato do enunciado
      const data = rows.map(r => ({
        id: r.id,
        nome: r.nome,
        sexo: r.sexo,
        data_nascimento: r.data_nascimento,
        idade: calcIdade(r.data_nascimento),
        hobby: r.hobby,
        nivel: r.nivel ? { id: r.nivel.id, nivel: r.nivel.nivel } : null
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
  },

  // POST /api/desenvolvedores
  async criar(req, res) {
    try {
      // Usa validador centralizado
      const { ok, erros } = validateDevPayload(req.body, { isUpdate: false });
      if (!ok) {
        return res.status(400).json({ mensagem: 'Corpo inválido', erros });
      }

      const { nivel_id, nome, sexo, data_nascimento, hobby } = req.body;

      const novo = await Desenvolvedor.create({
        nivel_id,
        nome: String(nome).trim(),
        sexo,
        data_nascimento,
        hobby: String(hobby).trim()
      });

      return res.status(201).json(novo);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ mensagem: 'Erro ao criar desenvolvedor' });
    }
  },

  // PUT /api/desenvolvedores/:id
  async atualizar(req, res) {
    try {
      const id = Number(req.params.id);
      const row = await Desenvolvedor.findByPk(id);
      if (!row) {
        return res.status(404).json({ mensagem: 'Desenvolvedor não encontrado' });
      }

      // Validação para update
      const { ok, erros } = validateDevPayload(req.body, { isUpdate: true });
      if (!ok) {
        return res.status(400).json({ mensagem: 'Corpo inválido', erros });
      }

      const { nivel_id, nome, sexo, data_nascimento, hobby } = req.body;

      row.nivel_id = nivel_id;
      row.nome = String(nome).trim();
      row.sexo = sexo;
      row.data_nascimento = data_nascimento;
      row.hobby = String(hobby).trim();

      await row.save();

      return res.json(row);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ mensagem: 'Erro ao editar desenvolvedor' });
    }
  },

  // DELETE /api/desenvolvedores/:id
  async remover(req, res) {
    try {
      const id = Number(req.params.id);
      const row = await Desenvolvedor.findByPk(id);
      if (!row) {
        return res.status(404).json({ mensagem: 'Desenvolvedor não encontrado' });
      }

      await row.destroy();
      return res.status(204).send();
    } catch (err) {
      console.error(err);
      return res.status(500).json({ mensagem: 'Erro ao remover desenvolvedor' });
    }
  }
};
