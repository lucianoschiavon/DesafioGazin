// Rotas para Desenvolvedores
const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');

// Importa os modelos
const Desenvolvedor = require('../models/desenvolvedor');
const Nivel = require('../models/nivel');

// Função utilitária para calcular idade
function calcularIdade(dataNascimento) {
  const hoje = new Date();
  const nascimento = new Date(dataNascimento);
  if (Number.isNaN(nascimento.getTime())) {
    return null;
  }

  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const mes = hoje.getMonth() - nascimento.getMonth();
  if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
    idade -= 1;
  }
  return idade;
}

// Normaliza o formato de saída do desenvolvedor
function mapearDesenvolvedor(dev) {
  const idade = calcularIdade(dev.data_nascimento);

  return {
    id: dev.id,
    nome: dev.nome,
    sexo: dev.sexo,
    data_nascimento: dev.data_nascimento,
    idade,
    hobby: dev.hobby,
    nivel: dev.nivel
      ? {
          id: dev.nivel.id,
          nivel: dev.nivel.nivel
        }
      : null
  };
}

// Validação de payload para criação e edição de desenvolvedor
async function validarPayloadDesenvolvedor(payload) {
  const erros = {};
  const { nome, sexo, data_nascimento, hobby, nivel_id } = payload || {};

  if (!nome || !nome.trim()) {
    erros.nome = 'Nome é obrigatório';
  }

  if (!sexo || !['M', 'F'].includes(sexo)) {
    erros.sexo = 'Sexo deve ser M ou F';
  }

  if (!data_nascimento) {
    erros.data_nascimento = 'Data de nascimento é obrigatória';
  } else {
    const data = new Date(data_nascimento);
    if (Number.isNaN(data.getTime())) {
      erros.data_nascimento = 'Data de nascimento inválida, use formato YYYY-MM-DD';
    } else {
      const hoje = new Date();
      if (data > hoje) {
        erros.data_nascimento = 'Data de nascimento não pode ser futura';
      }
    }
  }

  if (!hobby || !hobby.trim()) {
    erros.hobby = 'Hobby é obrigatório';
  }

  if (!nivel_id) {
    erros.nivel_id = 'nivel_id é obrigatório';
  } else {
    const nivel = await Nivel.findByPk(nivel_id);
    if (!nivel) {
      erros.nivel_id = 'Nivel informado não existe';
    }
  }

  return erros;
}

// GET /api/desenvolvedores
// Lista desenvolvedores com busca, paginação e campo idade
router.get('/', async (req, res) => {
  try {
    const { nome, page = 1, limit = 10 } = req.query;

    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;
    const offset = (pageNumber - 1) * limitNumber;

    const where = {};

    if (nome && nome.trim() !== '') {
      where.nome = { [Op.iLike]: `%${nome.trim()}%` };
    }

    const resultado = await Desenvolvedor.findAndCountAll({
      where,
      limit: limitNumber,
      offset,
      order: [['nome', 'ASC']],
      include: [{ model: Nivel, as: 'nivel' }]
    });

    if (resultado.count === 0) {
      return res.status(404).json({ mensagem: 'Nenhum desenvolvedor encontrado' });
    }

    const total = resultado.count;
    const lastPage = Math.ceil(total / limitNumber) || 1;

    const data = resultado.rows.map(mapearDesenvolvedor);

    return res.json({
      data,
      meta: {
        total,
        per_page: limitNumber,
        current_page: pageNumber,
        last_page: lastPage
      }
    });
  } catch (erro) {
    console.error('Erro ao listar desenvolvedores:', erro);
    return res.status(500).json({
      mensagem: 'Erro ao listar desenvolvedores',
      detalhe: erro.message
    });
  }
});

// POST /api/desenvolvedores
// Cadastra novo desenvolvedor com validação e retorno padronizado
router.post('/', async (req, res) => {
  try {
    const erros = await validarPayloadDesenvolvedor(req.body);

    if (Object.keys(erros).length > 0) {
      return res.status(400).json({
        mensagem: 'Dados inválidos para criação de desenvolvedor',
        erros
      });
    }

    const { nome, sexo, data_nascimento, hobby, nivel_id } = req.body;

    const novoDev = await Desenvolvedor.create({
      nome: nome.trim(),
      sexo,
      data_nascimento,
      hobby: hobby.trim(),
      nivel_id
    });

    const devComNivel = await Desenvolvedor.findByPk(novoDev.id, {
      include: [{ model: Nivel, as: 'nivel' }]
    });

    return res.status(201).json(mapearDesenvolvedor(devComNivel));
  } catch (erro) {
    console.error('Erro ao criar desenvolvedor:', erro);
    return res.status(500).json({
      mensagem: 'Erro ao criar desenvolvedor',
      detalhe: erro.message
    });
  }
});

// PUT /api/desenvolvedores/:id
// Atualiza desenvolvedor existente
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const dev = await Desenvolvedor.findByPk(id);

    if (!dev) {
      return res.status(404).json({ mensagem: 'Desenvolvedor não encontrado' });
    }

    const erros = await validarPayloadDesenvolvedor(req.body);

    if (Object.keys(erros).length > 0) {
      return res.status(400).json({
        mensagem: 'Dados inválidos para atualização de desenvolvedor',
        erros
      });
    }

    const { nome, sexo, data_nascimento, hobby, nivel_id } = req.body;

    await dev.update({
      nome: nome.trim(),
      sexo,
      data_nascimento,
      hobby: hobby.trim(),
      nivel_id
    });

    const devAtualizado = await Desenvolvedor.findByPk(dev.id, {
      include: [{ model: Nivel, as: 'nivel' }]
    });

    return res.json(mapearDesenvolvedor(devAtualizado));
  } catch (erro) {
    console.error('Erro ao atualizar desenvolvedor:', erro);
    return res.status(500).json({
      mensagem: 'Erro ao atualizar desenvolvedor',
      detalhe: erro.message
    });
  }
});

// DELETE /api/desenvolvedores/:id
// Remove desenvolvedor
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const dev = await Desenvolvedor.findByPk(id);

    if (!dev) {
      return res.status(404).json({ mensagem: 'Desenvolvedor não encontrado' });
    }

    await dev.destroy();

    return res.status(204).send();
  } catch (erro) {
    console.error('Erro ao remover desenvolvedor:', erro);
    return res.status(500).json({
      mensagem: 'Erro ao remover desenvolvedor',
      detalhe: erro.message
    });
  }
});


// Exporta o router
module.exports = router;
