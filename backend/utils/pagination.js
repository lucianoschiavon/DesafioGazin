// Utilitários de paginação e ordenação
// - parseListQuery: lê page, limit, sort e order da query string com saneamento
// - buildMeta: monta o objeto "meta" padronizado para a resposta paginada

/**
 * Lê e normaliza parâmetros de paginação e ordenação.
 * @param {object} q - req.query
 * @param {string[]} allowedSort - lista de campos permitidos para sort
 */
function parseListQuery(q, allowedSort = ['id']) {
  const page = Math.max(parseInt(q.page || '1', 10), 1);
  const limit = Math.max(parseInt(q.limit || '10', 10), 1);
  const offset = (page - 1) * limit;

  let sort = (q.sort || 'id').toString();
  if (!allowedSort.includes(sort)) sort = 'id';

  let order = (q.order || 'asc').toString().toLowerCase();
  if (!['asc', 'desc'].includes(order)) order = 'asc';

  return { page, limit, offset, sort, order };
}

/**
 * Constrói o objeto meta padronizado.
 * @param {number} total - total de registros
 * @param {number} page - página atual
 * @param {number} limit - tamanho da página
 */
function buildMeta(total, page, limit) {
  return {
    total,
    per_page: limit,
    current_page: page,
    last_page: Math.max(Math.ceil(total / limit), 1)
  };
}

module.exports = { parseListQuery, buildMeta };

