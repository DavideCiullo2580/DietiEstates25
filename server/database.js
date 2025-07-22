const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'dietestate25',
  password: 'progetto',
  port: 2580,
});

module.exports = pool;
