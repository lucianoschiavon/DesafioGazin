// Luciano Eugênio Schiavon
// 12-11-2025
// Testes unitários dos validadores de payload

const {
  validateNivelPayload,
  validateDevPayload
} = require('../validators/payloadValidators');

describe('validateNivelPayload', () => {
  it('deve falhar quando nivel não é informado', () => {
    const { ok, erros } = validateNivelPayload({});
    expect(ok).toBe(false);
    expect(erros).toHaveProperty('nivel');
  });

  it('deve passar quando nivel é informado corretamente', () => {
    const { ok, erros } = validateNivelPayload({ nivel: 'Júnior' });
    expect(ok).toBe(true);
    expect(erros).toEqual({});
  });
});

describe('validateDevPayload', () => {
  it('deve falhar quando campos obrigatórios estão ausentes', () => {
    const { ok, erros } = validateDevPayload({});
    expect(ok).toBe(false);
    expect(erros).toHaveProperty('nivel_id');
    expect(erros).toHaveProperty('nome');
    expect(erros).toHaveProperty('sexo');
    expect(erros).toHaveProperty('data_nascimento');
    expect(erros).toHaveProperty('hobby');
  });

  it('deve falhar quando sexo é inválido', () => {
    const { ok, erros } = validateDevPayload({
      nivel_id: 1,
      nome: 'Fulano',
      sexo: 'X',
      data_nascimento: '1990-01-01',
      hobby: 'Programar'
    });

    expect(ok).toBe(false);
    expect(erros).toHaveProperty('sexo');
  });

  it('deve passar com dados corretos', () => {
    const { ok, erros } = validateDevPayload({
      nivel_id: 1,
      nome: 'Fulano',
      sexo: 'M',
      data_nascimento: '1990-01-01',
      hobby: 'Programar'
    });

    expect(ok).toBe(true);
    expect(erros).toEqual({});
  });
});
