// Luciano Eugênio Schiavon
// 08-11-2025 (44)99946-4300 luciano@redescorporativas.com.br

// OBS: GET    /niveis -> listar todos niveis
//      POST   /niveis -> cadastrar um novo nivel
//      PUT    /nivies/:id -> editar um nivel existente
//      DELETE /niveis/:id -> remover um nivel

// Importa o Express e o Router para definir as rotas
const express = require('express');
const router = express.Router();
const { Op, Sequelize } = require('sequelize');

// Importa os modelos
const Nivel = require('../models/nivel');
const Desenvolvedor = require('../models/desenvolvedor');


// 🟢 ROTA GET /niveis - Lista níveis com busca, paginação e contagem de devs
router.get('/', async (req, res) => {
  try {
    // Parâmetros de busca e paginação
    const { nivel, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    const where = {};

    // Filtro por nome do nível
    if (nivel && nivel.trim() !== '') {
      where.nivel = { [Op.iLike]: `%${nivel.trim()}%` };
    }

    // Consulta com contagem de desenvolvedores associados
    const resultado = await Nivel.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [['nivel', 'ASC']],
      include: [{
        model: Desenvolvedor,
        as: 'desenvolvedores',
        attributes: []
      }],
      attributes: {
        include: [
          [Sequelize.fn('COUNT', Sequelize.col('desenvolvedores.id')), 'totalDevs']
        ]
      },
      group: ['Nivel.id']
    });

    // Retorno paginado
    res.json({
      total: resultado.count.length,
      paginas: Math.ceil(resultado.count.length / limit),
      dados: resultado.rows
    });
  } catch (erro) {
    // Tratamento de erro
    console.error('Erro ao listar níveis:', erro);
    res.status(500).json({ mensagem: 'Erro ao listar níveis', detalhe: erro.message });
  }
});


// 🟢 ROTA POST /niveis - Cadastra novo nível
router.post('/', async (req, res) => {
  try {
    const { nivel } = req.body;
    const novoNivel = await Nivel.create({ nivel });
    res.status(201).json(novoNivel);
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao criar nível', detalhe: erro.message });
  }
});


// 🟢 ROTA PUT /niveis/:id - Atualiza nível existente
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nivel } = req.body;

    const nivelExistente = await Nivel.findByPk(id);
    if (!nivelExistente) {
      return res.status(404).json({ mensagem: 'Nível não encontrado' });
    }

    await nivelExistente.update({ nivel });
    res.json(nivelExistente);
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao atualizar nível', detalhe: erro.message });
  }
});


// 🛑 ROTA DELETE /niveis/:id - Remove nível (com verificação de vínculo)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Verifica se há desenvolvedores vinculados
    const devs = await Desenvolvedor.count({ where: { nivel_id: id } });
    if (devs > 0) {
      return res.status(400).json({ mensagem: 'Não é possível remover: nível com desenvolvedores associados.' });
    }

    const nivel = await Nivel.findByPk(id);
    if (!nivel) {
      return res.status(404).json({ mensagem: 'Nível não encontrado' });
    }

    await nivel.destroy();
    res.status(204).send();
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao remover nível', detalhe: erro.message });
  }
});


// Exporta o router
module.exports = router;