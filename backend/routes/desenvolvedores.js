// Rotas para Desenvolvedores
const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');

// Importa os modelos
const Desenvolvedor = require('../models/desenvolvedor');
const Nivel = require('../models/nivel');


// 🟢 ROTA GET /desenvolvedores - Lista desenvolvedores com busca e paginação
router.get('/', async (req, res) => {
  try {
    // Parâmetros de busca e paginação
    const { nome, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    const where = {};

    // Filtro por nome
    if (nome && nome.trim() !== '') {
      where.nome = { [Op.iLike]: `%${nome.trim()}%` };
    }

    // Consulta com JOIN para trazer o nível
    const resultado = await Desenvolvedor.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [['nome', 'ASC']],
      include: [{ model: Nivel, as: 'nivel' }]
    });

    // Retorno paginado
    res.json({
      total: resultado.count,
      paginas: Math.ceil(resultado.count / limit),
      dados: resultado.rows
    });
  } catch (erro) {
    // Tratamento de erro
    console.error('Erro ao listar desenvolvedores:', erro);
    res.status(500).json({ mensagem: 'Erro ao listar desenvolvedores', detalhe: erro.message });
  }
});


// 🟢 ROTA POST /desenvolvedores - Cadastra novo desenvolvedor
router.post('/', async (req, res) => {
  try {
    const { nome, sexo, data_nascimento, hobby, nivel_id } = req.body;
    const novoDev = await Desenvolvedor.create({ nome, sexo, data_nascimento, hobby, nivel_id });
    res.status(201).json(novoDev);
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao criar desenvolvedor', detalhe: erro.message });
  }
});


// 🟢 ROTA PUT /desenvolvedores/:id - Atualiza desenvolvedor existente
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, sexo, data_nascimento, hobby, nivel_id } = req.body;

    const dev = await Desenvolvedor.findByPk(id);
    if (!dev) {
      return res.status(404).json({ mensagem: 'Desenvolvedor não encontrado' });
    }

    await dev.update({ nome, sexo, data_nascimento, hobby, nivel_id });
    res.json(dev);
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao atualizar desenvolvedor', detalhe: erro.message });
  }
});


// 🛑 ROTA DELETE /desenvolvedores/:id - Remove desenvolvedor
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const dev = await Desenvolvedor.findByPk(id);
    if (!dev) {
      return res.status(404).json({ mensagem: 'Desenvolvedor não encontrado' });
    }

    await dev.destroy();
    res.status(204).send(); // Sem conteúdo, mas com sucesso
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao remover desenvolvedor', detalhe: erro.message });
  }
});


// Exporta o router
module.exports = router;
