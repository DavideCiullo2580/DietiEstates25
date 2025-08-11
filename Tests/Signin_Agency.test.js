beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
});

afterAll(() => {
  console.log.mockRestore();
});

const request = require('supertest');
const app = require('../server/server');
const pool = require('../server/database');

describe('POST /posts/register-agency', () => {
  const testAgency = {
    societa: 'testagency',
    pec: 'testagency@example.com',
    telefono: '1234567890',
  };

  afterAll(async () => {
    await pool.query('DELETE FROM users WHERE username = $1', [testAgency.societa]);
    await pool.end(); 
  });

  test('ritorna 400 se dati mancanti', async () => {
    const res = await request(app)
      .post('/posts/register-agency')
      .send({ societa: '', pec: '', telefono: '' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Dati mancanti');
  });

  test('ritorna 409 se azienda già esiste', async () => {

    await pool.query(
      `INSERT INTO users (username, password, email, telefono, ruolo, azienda)
       VALUES ($1, 'hashedpass', $2, $3, 'amministratore', $1)
       ON CONFLICT DO NOTHING`,
      [testAgency.societa, testAgency.pec, testAgency.telefono]
    );

    const res = await request(app).post('/posts/register-agency').send(testAgency);

    expect(res.status).toBe(409);
    expect(res.body.error).toBe('Società già registrata');
  });

  test('registra azienda correttamente e invia mail', async () => {

    const newAgency = {
      societa: 'testagency2',
      pec: 'testagency2@example.com',
      telefono: '0987654321',
    };


    await pool.query('DELETE FROM users WHERE username = $1', [newAgency.societa]);

    const res = await request(app).post('/posts/register-agency').send(newAgency);

    expect(res.status).toBe(201);
    expect(res.body.message).toBe('Azienda registrata con successo. Controlla l\'email per la password.');

    await pool.query('DELETE FROM users WHERE username = $1', [newAgency.societa]);
  });
});
