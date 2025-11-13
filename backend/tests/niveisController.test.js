// Luciano Eugênio Schiavon
// 12-11-2025
// Testes do controller de níveis usando mocks dos models

// Primeiro mock dos models
jest.mock('../models', () => {
  const Nivel = {
    count: jest.fn(),
    findAll: jest.fn()
  };
  const Desenvolvedor = {
    count: jest.fn()
  };
  return { Nivel, Desenvolvedor };
});

const niveisController = require('../controllers/niveisController');
const { Nivel } = require('../models');

// helper simples para simular res do Express
function createMockRes() {
  const res = {};
  res.statusCode = 200;
  res.body = null;

  res.status = function (code) {
    this.statusCode = code;
    return this;
  };

  res.json = function (data) {
    this.body = data;
    return this;
  };

  res.send = function (data) {
    this.body = data;
    return this;
  };

  return res;
}

describe('niveisController.listar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve retornar 404 quando não houver níveis cadastrados', async () => {
    const req = { query: {} };
    const res = createMockRes();

    Nivel.count.mockResolvedValue(0);

    await niveisController.listar(req, res);

    expect(Nivel.count).toHaveBeenCalledTimes(1);
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.meta.total).toBe(0);
  });

  it('deve retornar 200 com lista de níveis e meta quando houver dados', async () => {
    const req = { query: { page: '1', limit: '10' } };
    const res = createMockRes();

    Nivel.count.mockResolvedValue(2);
    Nivel.findAll.mockResolvedValue([
      { id: 1, nivel: 'Júnior', dataValues: { totalDevs: 3 } },
      { id: 2, nivel: 'Pleno', dataValues: { totalDevs: 5 } }
    ]);

    await niveisController.listar(req, res);

    expect(Nivel.count).toHaveBeenCalledTimes(1);
    expect(Nivel.findAll).toHaveBeenCalledTimes(1);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.meta.total).toBe(2);
    expect(res.body.meta.current_page).toBe(1);
  });
});
