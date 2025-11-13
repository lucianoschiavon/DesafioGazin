// Luciano Eugênio Schiavon
// 12-11-2025
// Validações de payload do backend
// Cada função retorna { ok: boolean, erros: { campo: mensagem } }

function validateNivelPayload(body) {
  const erros = {};
  const nivel = body?.nivel;

  if (!nivel || !String(nivel).trim()) {
    erros.nivel = 'Informe o nome do nível';
  }

  return { ok: Object.keys(erros).length === 0, erros };
}

/**
 * Validação de payload de Desenvolvedor
 * Usada tanto no POST quanto no PUT
 * 
 * @param {object} body
 * @param {{ isUpdate?: boolean }} options
 * @returns {{ ok: boolean, erros: Record<string,string> }}
 */
function validateDevPayload(body, { isUpdate = false } = {}) {
  const erros = {};
  const { nivel_id, nome, sexo, data_nascimento, hobby } = body || {};

  // No update também exigimos todos os campos, acompanhando o enunciado base
  if (nivel_id === undefined || nivel_id === null) {
    erros.nivel_id = 'Selecione um nível';
  }

  if (!nome || !String(nome).trim()) {
    erros.nome = 'Informe o nome';
  }

  if (!sexo || !['M', 'F'].includes(sexo)) {
    erros.sexo = 'Sexo deve ser M ou F';
  }

  if (!data_nascimento) {
    erros.data_nascimento = 'Informe a data de nascimento';
  }

  if (!hobby || !String(hobby).trim()) {
    erros.hobby = 'Informe o hobby';
  }

  return { ok: Object.keys(erros).length === 0, erros };
}

// Exporta as funções para uso nos controllers
module.exports = {
  validateNivelPayload,
  validateDevPayload
};
