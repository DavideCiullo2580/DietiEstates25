const request = require('supertest');
const app = require('../server/server'); 
const pool = require('../server/database');

describe('GET /posts/NomeAzienda', () => {
  let token;

  const username = 'TEST';
  const password = 'TEST'; 

  beforeAll(async () => {
  
    const res = await request(app)
      .post('/posts/login')  
      .send({ username, password });

    if (!res.body.token) {
      throw new Error('Login fallito, token non ricevuto');
    }
    token = res.body.token;
  });

  afterAll(async () => {
    await pool.end(); 
  });

  test('ritorna il nome dell\'azienda per l\'utente autenticato', async () => {
    const res = await request(app)
      .get('/posts/NomeAzienda')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('azienda');
  });

  test('ritorna 401 senza token', async () => {
    const res = await request(app).get('/posts/NomeAzienda');
    expect(res.status).toBe(401);
  });
});
