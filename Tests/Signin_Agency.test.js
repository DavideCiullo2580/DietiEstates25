jest.mock('nodemailer', () => ({
  createTransport: () => ({
    sendMail: jest.fn().mockResolvedValue(true), 
  }),
}));

const request = require('supertest');
const pool = require('../server/database');
const app = require('../server/server');

describe('POST /posts/register-agency', () => {
  const testAgency = {
    societa: 'testagency_test_name',
    pec: 'testagency@example.com',
    telefono: '1234567890',
  };

  beforeAll(async () => {
    await pool.query('DELETE FROM users WHERE username = $1', [testAgency.societa]);
  });

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

  test('registra azienda', async () => {
    const timestamp = Date.now();
    const newAgency = {
      societa: `testagency_${timestamp}`,
      pec: `testagency_${timestamp}@example.com`,
      telefono: '0987654321',
    };

    await pool.query('DELETE FROM users WHERE username = $1', [newAgency.societa]);

    const res = await request(app).post('/posts/register-agency').send(newAgency);

    expect(res.status).toBe(201);
    expect(res.body.message).toBe(
      "Azienda registrata con successo. Controlla l'email per la password."
    );

    await pool.query('DELETE FROM users WHERE username = $1', [newAgency.societa]);
  });
});
