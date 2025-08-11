const request = require('supertest');
const app = require('../server/server');
const pool = require('../server/database');

describe('POST /posts/register', () => {
  const testUser = {
    username: 'testuser',
    email: 'testuser@example.com',
    password: 'password123',
  };

  afterAll(async () => {

    await pool.query('DELETE FROM users WHERE username = $1', [testUser.username]);
    await pool.end(); 
  });

  test('ritorna 400 se mancano dati', async () => {
    const res = await request(app).post('/posts/register').send({
      username: '',
      email: '',
      password: '',
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Missing username, email or password');
  });

  test('ritorna 409 se username già esiste', async () => {

    await pool.query(
      "INSERT INTO users (username, password, email, telefono, ruolo) VALUES ($1, 'hashed', $2, null, 'utente') ON CONFLICT DO NOTHING",
      [testUser.username, testUser.email]
    );

    const res = await request(app).post('/posts/register').send(testUser);

    expect(res.status).toBe(409);
    expect(res.body.error).toBe('Username già esistente');
  });

  test('registra utente correttamente', async () => {

    const newUser = {
      username: 'testuser2',
      email: 'testuser2@example.com',
      password: 'password123',
    };

    await pool.query('DELETE FROM users WHERE username = $1', [newUser.username]);

    const res = await request(app).post('/posts/register').send(newUser);

    expect(res.status).toBe(201);
    expect(res.body.message).toBe('Utente registrato con successo');

    await pool.query('DELETE FROM users WHERE username = $1', [newUser.username]);
  });
});
