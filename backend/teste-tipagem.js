/**
 * @type {import('./types').DesenvolvedorDTO}
 */
const dev = {
  id: 1,
  nome: 'Luciano',
  sexo: 'M',
  data_nascimento: '1985-03-15',
  hobby: 'Programar',
  nivel: { id: 2, nivel: 'Sênior' }
};

// coloque o mouse em 'dev.' e veja as sugestões
console.log(dev.nome);

/**
 * @type {import('./types').Paginado<import('./types').DesenvolvedorDTO>}
 */
const resposta = {
  data: [dev],
  meta: {
    total: 1,
    per_page: 10,
    current_page: 1,
    last_page: 1
  }
};

// teste de autocomplete
console.log(resposta.meta.total);
