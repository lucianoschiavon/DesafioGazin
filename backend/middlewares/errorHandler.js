// middlewares/errorHandler.js
function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const payload = { mensagem: err.message || 'Erro interno' };
  if (err.erros) payload.erros = err.erros;
  res.status(status).json(payload);
}
module.exports = { errorHandler };
