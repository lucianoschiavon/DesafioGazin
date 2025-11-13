// Luciano Eugênio Schiavon
// 12-11-2025
// Rotas de Desenvolvedores usando controller dedicado

const express = require('express');
const router = express.Router();

// Importa as ações do controller
const devs = require('../controllers/desenvolvedoresController');

// IMPORTANTE: não faça consultas aqui, nem use await no topo do arquivo.
// Toda a lógica de banco deve ficar dentro do controller.

// Lista com busca, paginação e ordenação
router.get('/', devs.listar);

// Cria novo desenvolvedor
router.post('/', devs.criar);

// Atualiza desenvolvedor por id
router.put('/:id', devs.atualizar);

// Remove desenvolvedor por id
router.delete('/:id', devs.remover);

module.exports = router;
