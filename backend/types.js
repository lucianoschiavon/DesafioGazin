// Luciano Eugênio Schiavon
// 12-11-2025
// Tipagem de dados para o backend do Projeto de Desenvolvedores
// ---------------------------------------------------------------
// Este arquivo define, via JSDoc, os tipos principais usados no backend.
// Objetivo: permitir autocomplete e validação de tipo no editor sem precisar de TypeScript.

/**
 * Representa um nível cadastrado no sistema
 * @typedef {Object} NivelDTO
 * @property {number} id - Identificador único do nível
 * @property {string} nivel - Nome do nível
 * @property {number} [totalDevs] - Quantidade de desenvolvedores associados (campo calculado)
 */

/**
 * Corpo esperado para criação/edição de nível
 * @typedef {Object} NivelBody
 * @property {string} nivel - Nome do nível (obrigatório)
 */

/**
 * Representa um desenvolvedor cadastrado
 * @typedef {Object} DesenvolvedorDTO
 * @property {number} id - Identificador único
 * @property {string} nome - Nome completo
 * @property {'M'|'F'} sexo - Sexo (M ou F)
 * @property {string} data_nascimento - Data no formato ISO (yyyy-mm-dd)
 * @property {string} hobby - Hobby do desenvolvedor
 * @property {number} nivel_id - ID do nível relacionado
 * @property {number} [idade] - Idade calculada no SELECT
 * @property {{ id:number, nivel:string }} [nivel] - Objeto com dados do nível (quando incluído)
 */

/**
 * Corpo esperado para criação/edição de desenvolvedor
 * @typedef {Object} DesenvolvedorBody
 * @property {string} nome
 * @property {'M'|'F'} sexo
 * @property {string} data_nascimento
 * @property {string} hobby
 * @property {number} nivel_id
 */

/**
 * Estrutura comum para metadados de paginação
 * @typedef {Object} MetaPaginacao
 * @property {number} total - Total de registros
 * @property {number} per_page - Registros por página
 * @property {number} current_page - Página atual
 * @property {number} last_page - Última página
 */

/**
 * Resposta paginada padrão
 * @template T
 * @typedef {Object} Paginado
 * @property {T[]} data - Lista de objetos retornados
 * @property {MetaPaginacao} meta - Metadados da resposta
 */
