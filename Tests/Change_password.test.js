const request = require('supertest');
const app = require('../server/server');
const pool = require('../server/database');
const bcrypt = require('bcrypt');

describe('POST /posts/change-password', () => {
  const username = 'TEST';
  const oldPassword = 'TEST';
  const newPassword = 'NewPass123!';

  let token;

  beforeAll(async () => {
    // Login per ottenere token reale
    const loginRes = await request(app)
      .post('/posts/login')               // usa l'endpoint reale di login
      .send({ username, password: oldPassword });

    token = loginRes.body.token;    // supponendo che il token arrivi così

    if (!token) {
      throw new Error('Login fallito, token non ricevuto');
    }
  });

  afterAll(async () => {
    // Ripristina la password originale per non lasciare effetti collaterali
    const hashedOldPassword = await bcrypt.hash(oldPassword, 10);
    await pool.query('UPDATE users SET password = $1 WHERE username = $2', [hashedOldPassword, username]);
    await pool.end();
  });

  test('cambia la password correttamente e ripristina dopo', async () => {
    // Cambia password da oldPassword a newPassword
    const res = await request(app)
      .post('/posts/change-password')
      .set('Authorization', `Bearer ${token}`)
      .send({ vecchiaPassword: oldPassword, nuovaPassword: newPassword });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Password aggiornata con successo');

    // Cambia password da newPassword a oldPassword per ripristinare
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
      .send({ vecchiaPassword: oldPassword }); // manca nuovaPassword

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Vecchia o nuova password mancante');
  });
});
