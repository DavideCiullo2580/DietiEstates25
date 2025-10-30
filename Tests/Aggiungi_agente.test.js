const request = require('supertest');
const app = require('../server/server');
const pool = require('../server/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'Token';

describe('POST /posts/add-agent', () => {
  let creator;
  let creatorToken;

  beforeAll(async () => {

    creator = {
      username: 'creatoreTest',
      password: await bcrypt.hash('password123', 10),
      email: 'creatore@example.com',
      telefono: '1234567890',
      ruolo: 'amministratore',
      azienda: 'TestCompany'
    };

    await pool.query(
      `INSERT INTO users (username, password, email, telefono, ruolo, azienda)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT DO NOTHING`,
      [creator.username, creator.password, creator.email, creator.telefono, creator.ruolo, creator.azienda]
    );

    creatorToken = jwt.sign({ username: creator.username }, JWT_SECRET);
  });

  afterAll(async () => {

    await pool.query('DELETE FROM users WHERE username IN ($1, $2, $3)', ['creatoreTest', 'agente1', 'agente2']);
    await pool.end();
  });

  test('ritorna 400 se campi mancanti', async () => {
    const res = await request(app)
      .post('/posts/add-agent')
      .set('Authorization', `Bearer ${creatorToken}`)
      .send({ nome: '', email: '', password: '', confermaPassword: '' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Tutti i campi sono obbligatori');
  });

  test('ritorna 400 se password non corrispondono', async () => {
    const res = await request(app)
      .post('/posts/add-agent')
      .set('Authorization', `Bearer ${creatorToken}`)
      .send({ nome: 'agente1', email: 'agente1@example.com', password: '1234', confermaPassword: '5678' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Le password non corrispondono');
  });

  test('ritorna 400 se username già esistente', async () => {

    await pool.query(
      `INSERT INTO users (username, password, email, telefono, ruolo, azienda)
       VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT DO NOTHING`,
      ['agente1', 'hashedpass', 'agente1@example.com', null, 'agente', 'TestCompany']
    );

    const res = await request(app)
      .post('/posts/add-agent')
      .set('Authorization', `Bearer ${creatorToken}`)
      .send({ nome: 'agente1', email: 'agente1@example.com', password: '1234', confermaPassword: '1234' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Username già utilizzato.');
  });

  test('crea correttamente un agente', async () => {
    const res = await request(app)
      .post('/posts/add-agent')
      .set('Authorization', `Bearer ${creatorToken}`)
      .send({ nome: 'agente2', email: 'agente2@example.com', password: '1234', confermaPassword: '1234' });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe('Agente agente2 registrato con successo.');

    const result = await pool.query('SELECT * FROM users WHERE username = $1', ['agente2']);
    expect(result.rows.length).toBe(1);
    expect(result.rows[0].ruolo).toBe('agente');
  });
});
