// Database setup script
// Usage: node setup-db.js

require('dotenv').config();
const { pool, testConnection, checkTableExists } = require('./db');

async function setup() {
  console.log('Testing database connection...');
  
  // Test connection
  const isConnected = await testConnection();
  if (!isConnected) {
    console.error('Failed to connect to database. Please check your .env file.');
    process.exit(1);
  }

  // Check if recipes table exists
  console.log('Checking if recipes table exists...');
  const tableExists = await checkTableExists();
  
  if (tableExists) {
    console.log('✓ Recipes table exists');
    
    // Count recipes
    try {
      const result = await pool.query('SELECT COUNT(*) FROM recipes');
      console.log(`✓ Found ${result.rows[0].count} recipes in database`);
    } catch (err) {
      console.error('Error counting recipes:', err);
    }
  } else {
    console.log('⚠ Recipes table does not exist');
    console.log('Please run the SQL script in database.sql to create the table:');
    console.log('  psql -U postgres -d api -f backend/database.sql');
  }

  await pool.end();
  console.log('Database setup check complete.');
}

setup().catch((err) => {
  console.error('Setup error:', err);
  process.exit(1);
});

