const request = require('supertest');
const app = require('./app');
const pool = require('./db');

const URL_TESTE = 'https://example.com/teste-automatizado';

afterAll(async () => {
    await pool.execute('DELETE FROM links WHERE url_original = ?', [URL_TESTE]);
    await pool.end();
});

test('POST /links devolve um código de 6 caracteres', async () => {
    const resposta = await request(app)
    .post('/links')
    .send({ url: URL_TESTE});

    expect(resposta.status).toBe(201);
  expect(resposta.body.codigo).toHaveLength(6);
});
test('GET /:codigo responde 302 com Location igual à URL original', async () => {
  const criado = await request(app)
    .post('/links')
    .send({ url: URL_TESTE });
  const codigo = criado.body.codigo;

  const resposta = await request(app).get(`/${codigo}`);

  expect(resposta.status).toBe(302);
  expect(resposta.headers.location).toBe(URL_TESTE);
});