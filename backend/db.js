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

// Test database connection with a simple query
const testConnection = async () => {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('Database connection test successful:', result.rows[0]);
    return true;
  } catch (err) {
    console.error('Database connection test failed:', err);
    return false;
  }
};

// Check if recipes table exists
const checkTableExists = async () => {
  try {
    const result = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'recipes'
      );
    `);
    return result.rows[0].exists;
  } catch (err) {
    console.error('Error checking table existence:', err);
    return false;
  }
};

// Export pool and functions
module.exports = {
  pool,
  connect,
  testConnection,
  checkTableExists,
};

