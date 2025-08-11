const request = require('supertest');
const app = require('../server/server'); 
const pool = require('../server/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

describe('POST /posts/login con dati reali', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('ritorna 401 se utente non esiste', async () => {
    const res = await request(app)
      .post('/posts/login')
      .send({ username: 'nonEsiste', password: 'TEST' });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Credenziali non valide');
  });

  test('ritorna 401 se password errata', async () => {
    const res = await request(app)
      .post('/posts/login')
      .send({ username: 'TEST', password: 'passwordSbagliata' }); 

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Credenziali non valide');
  });

  test('ritorna token e ruolo se login corretto', async () => {
    const res = await request(app)
      .post('/posts/login')
      .send({ username: 'TEST', password: 'TEST' }); 

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('role');
  });

  afterAll(async () => {
    await pool.end();  
  });
});
