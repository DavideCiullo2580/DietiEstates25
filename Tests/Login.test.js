const request = require('supertest');
const app = require('../server/server');
const pool = require('../server/database');
const bcrypt = require('bcrypt');

describe('POST /posts/login con dati reali', () => {
  const username = 'TEST1';
  const password = 'TEST';
  const email = 'test@example.com';
  const azienda = 'TestCompany';
  const ruolo = 'utente';

  beforeAll(async () => {
 
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      `INSERT INTO users (username, password, email, ruolo, azienda)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (username) DO NOTHING`,
      [username, hashedPassword, email, ruolo, azienda]
    );
  });

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
      .send({ username, password: 'passwordSbagliata' });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Credenziali non valide');
  });

  test('ritorna token e ruolo se login corretto', async () => {
    const res = await request(app)
      .post('/posts/login')
      .send({ username, password });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('role');
  });

  afterAll(async () => {
 
    await pool.query('DELETE FROM users WHERE username = $1', [username]);
    await pool.end();
  });
});
