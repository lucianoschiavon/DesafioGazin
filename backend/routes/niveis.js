// Luciano Eugênio Schiavon
// 08-11-2025 (44)99946-4300 luciano@redescorporativas.com.br

// OBS: GET    /niveis -> listar todos niveis
//      POST   /niveis -> cadastrar um novo nivel
//      PUT    /nivies/:id -> editar um nivel existente
//      DELETE /niveis/:id -> remover um nivel

// Rotas para Níveis

const express = require('express');
const router = express.Router();
const { Op, Sequelize } = require('sequelize');

const Nivel = require('../models/nivel');
const Desenvolvedor = require('../models/desenvolvedor');

// Validação do payload de nível
function validarPayloadNivel(payload) {
  const erros = {};
  const { nivel } = payload || {};

  if (!nivel || !nivel.trim()) {
    erros.nivel = 'Nivel é obrigatório';
  }

  return erros;
}

// GET /api/niveis
// Lista níveis com busca, paginação e coluna totalDevs
router.get('/', async (req, res) => {
  try {
    const { nivel, page = 1, limit = 10 } = req.query;

    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;
    const offset = (pageNumber - 1) * limitNumber;

    const where = {};

    if (nivel && nivel.trim() !== '') {
      where.nivel = { [Op.iLike]: `%${nivel.trim()}%` };
    }

    const resultado = await Nivel.findAndCountAll({
      where,
      limit: limitNumber,
      offset,
      order: [['nivel', 'ASC']],
      attributes: {
        include: [
          [
            Sequelize.literal(`(
              SELECT COUNT(*)
              FROM desenvolvedores AS d
              WHERE d.nivel_id = "Nivel"."id"
            )`),
            'totalDevs'
          ]
        ]
      }
    });

    if (resultado.count === 0) {
      return res.status(404).json({ mensagem: 'Nenhum nível encontrado' });
    }

    const total = resultado.count;
    const lastPage = Math.ceil(total / limitNumber) || 1;

    return res.json({
      data: resultado.rows,
      meta: {
        total,
        per_page: limitNumber,
        current_page: pageNumber,
        last_page: lastPage
      }
    });
  } catch (erro) {
    console.error('Erro ao listar níveis:', erro);
    return res.status(500).json({
      mensagem: 'Erro ao listar níveis',
      detalhe: erro.message
    });
  }
});

// POST /api/niveis
// Cadastra novo nível
router.post('/', async (req, res) => {
  try {
    const erros = validarPayloadNivel(req.body);

    if (Object.keys(erros).length > 0) {
      return res.status(400).json({
        mensagem: 'Dados inválidos para criação de nível',
        erros
      });
    }

    const { nivel } = req.body;

    const novoNivel = await Nivel.create({
      nivel: nivel.trim()
    });

    return res.status(201).json(novoNivel);
  } catch (erro) {
    console.error('Erro ao criar nível:', erro);
    return res.status(500).json({
      mensagem: 'Erro ao criar nível',
      detalhe: erro.message
    });
  }
});

// PUT /api/niveis/:id
// Atualiza nível existente
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const nivelExistente = await Nivel.findByPk(id);

    if (!nivelExistente) {
      return res.status(404).json({ mensagem: 'Nível não encontrado' });
    }

    const erros = validarPayloadNivel(req.body);

    if (Object.keys(erros).length > 0) {
      return res.status(400).json({
        mensagem: 'Dados inválidos para atualização de nível',
        erros
      });
    }

    const { nivel } = req.body;

    await nivelExistente.update({
      nivel: nivel.trim()
    });

    return res.json(nivelExistente);
  } catch (erro) {
    console.error('Erro ao atualizar nível:', erro);
    return res.status(500).json({
      mensagem: 'Erro ao atualizar nível',
      detalhe: erro.message
    });
  }
});

// DELETE /api/niveis/:id
// Remove nível se não houver desenvolvedores associados
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const quantidadeDevs = await Desenvolvedor.count({
      where: { nivel_id: id }
    });

    if (quantidadeDevs > 0) {
      return res.status(400).json({
        mensagem: 'Não é possível remover nível com desenvolvedores associados'
      });
    }

    const nivel = await Nivel.findByPk(id);

    if (!nivel) {
      return res.status(404).json({ mensagem: 'Nível não encontrado' });
    }

    await nivel.destroy();

    return res.status(204).send();
  } catch (erro) {
    console.error('Erro ao remover nível:', erro);
    return res.status(500).json({
      mensagem: 'Erro ao remover nível',
      detalhe: erro.message
    });
  }
});

module.exports = router;
