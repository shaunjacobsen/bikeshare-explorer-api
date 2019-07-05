const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.PG_DB_URI });

console.log(process.env.PG_DB_URI)

module.exports = { pool };
