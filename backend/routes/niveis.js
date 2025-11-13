// Luciano Eugênio Schiavon
// 12-11-2025
// Rotas de Níveis usando controller dedicado

const express = require('express');
const router = express.Router();
const niveis = require('../controllers/niveisController');

// GET lista com busca, paginação e ordenação
router.get('/', niveis.listar);

// POST cria novo nível
router.post('/', niveis.criar);

// PUT atualiza nível por id
router.put('/:id', niveis.atualizar);

// DELETE remove nível por id respeitando a regra de bloqueio
router.delete('/:id', niveis.remover);

module.exports = router;
