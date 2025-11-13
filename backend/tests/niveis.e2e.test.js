// Teste de integração básico com Supertest
// Valida GET /api/niveis retornando 200 e objeto com data e meta
const request = require('supertest');
const app = require('../app');

describe('GET /api/niveis', () => {
  it('deve responder com 200 e payload paginado', async () => {
    const res = await request(app).get('/api/niveis').query({ page: 1, limit: 5 });

    // Aceita 200 sempre. Caso sua versão retorne 404 quando vazio, ajuste aqui.
    expect([200]).toContain(res.status);

    // Verificações defensivas do formato
    expect(res.body).toHaveProperty('data');
    expect(res.body).toHaveProperty('meta');
    expect(res.body.meta).toHaveProperty('per_page');
    expect(res.body.meta).toHaveProperty('current_page');
    expect(res.body.meta).toHaveProperty('last_page');
  });
});
