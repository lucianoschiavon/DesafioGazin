// Luciano Eugênio Schiavon
// 12-11-2025
// Ponto de entrada do servidor: carrega app, testa DB e inicia o listen.

require('dotenv').config();

const app = require('./app');

// Carrega sequelize e associações para garantir que modelos estejam prontos
const { sequelize } = require('./models');

// Teste opcional de conexão com o banco
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Banco OK');
  } catch (err) {
    console.error('Falha ao conectar no banco:', err.message);
  }
})();

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API rodando na porta ${PORT}`);
});
