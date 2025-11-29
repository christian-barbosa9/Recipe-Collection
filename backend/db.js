const { Pool } = require('pg');
require('dotenv').config();

// Create connection pool
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Test connection
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Connect function
const connect = async () => {
  try {
    const client = await pool.connect();
    console.log('Database pool created successfully');
    client.release();
    return pool;
  } catch (err) {
    console.error('Error connecting to database:', err);
    throw err;
  }
};

// Export pool and connect function
module.exports = {
  pool,
  connect,
};

