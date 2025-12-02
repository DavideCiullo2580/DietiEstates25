const request = require('supertest');
const app = require('../server/server');
const pool = require('../server/database');
const bcrypt = require('bcrypt');

describe('GET /posts/NomeAzienda', () => {
let token;
const username = 'TEST';
const password = 'TEST';
const email = '[test@example.com](mailto:test@example.com)'; 
const azienda = 'TestCompany';

beforeAll(async () => {

const hashedPassword = await bcrypt.hash(password, 10);
await pool.query(
`INSERT INTO users (username, password, email, ruolo, azienda)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (username) DO NOTHING`,
[username, hashedPassword, email, 'utente', azienda]
);



const res = await request(app)
  .post('/posts/login')
  .send({ username, password });

if (!res.body.token) {
  throw new Error('Login fallito, token non ricevuto');
}

token = res.body.token;


});

afterAll(async () => {

await pool.query('DELETE FROM users WHERE username = $1', [username]);
await pool.end();
});

test("ritorna il nome dell'azienda per l'utente autenticato", async () => {
const res = await request(app)
.get('/posts/NomeAzienda')
.set('Authorization', `Bearer ${token}`);


expect(res.status).toBe(200);
expect(res.body).toHaveProperty('azienda', azienda);


});

test('ritorna 401 senza token', async () => {
const res = await request(app).get('/posts/NomeAzienda');
expect(res.status).toBe(401);
});
});
