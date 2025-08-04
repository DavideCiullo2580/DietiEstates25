const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'dietiestates25',
  password: '0801',
  port: 5432,
});

module.exports = pool;
