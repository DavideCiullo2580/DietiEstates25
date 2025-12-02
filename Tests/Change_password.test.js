const request = require('supertest');
const app = require('../server/server');
const pool = require('../server/database');
const bcrypt = require('bcrypt');

describe('POST /posts/change-password', () => {
  const username = 'TEST2';
  const oldPassword = 'TEST';
  const newPassword = 'NewPass123!';
  const email = 'test@example.com'; 
  const azienda = 'TestCompany';

  let token;

  beforeAll(async () => {
 
    const hashedPassword = await bcrypt.hash(oldPassword, 10);
    await pool.query(
      `INSERT INTO users (username, password, email, ruolo, azienda)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (username) DO NOTHING`,
      [username, hashedPassword, email, 'utente', azienda]
    );

    const loginRes = await request(app)
      .post('/posts/login')
      .send({ username, password: oldPassword });

    token = loginRes.body.token;

    if (!token) {
      throw new Error('Login fallito, token non ricevuto');
    }
  });

  afterAll(async () => {

    const hashedOldPassword = await bcrypt.hash(oldPassword, 10);
    await pool.query('UPDATE users SET password = $1 WHERE username = $2', [hashedOldPassword, username]);
    await pool.query('DELETE FROM users WHERE username = $1', [username]);
    await pool.end();
  });

  test('cambia la password correttamente e ripristina dopo', async () => {
    const res = await request(app)
      .post('/posts/change-password')
      .set('Authorization', `Bearer ${token}`)
      .send({ vecchiaPassword: oldPassword, nuovaPassword: newPassword });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Password aggiornata con successo');

    const res2 = await request(app)
      .post('/posts/change-password')
      .set('Authorization', `Bearer ${token}`)
      .send({ vecchiaPassword: newPassword, nuovaPassword: oldPassword });

    expect(res2.status).toBe(200);
    expect(res2.body.message).toBe('Password aggiornata con successo');
  });

  test('ritorna 401 se vecchia password errata', async () => {
    const res = await request(app)
      .post('/posts/change-password')
      .set('Authorization', `Bearer ${token}`)
      .send({ vecchiaPassword: 'wrongPassword', nuovaPassword: 'anything' });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Vecchia password errata');
  });

  test('ritorna 400 se mancano vecchia o nuova password', async () => {
    const res = await request(app)
      .post('/posts/change-password')
      .set('Authorization', `Bearer ${token}`)
      .send({ vecchiaPassword: oldPassword });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Vecchia o nuova password mancante');
  });
});
