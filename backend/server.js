const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test database connection
db.connect()
  .then(async () => {
    console.log('Database connected successfully');
    // Run connection test
    await db.testConnection();
    // Check if table exists
    const tableExists = await db.checkTableExists();
    if (!tableExists) {
      console.warn('⚠ Warning: recipes table does not exist. Run database.sql to create it.');
    }
  })
  .catch((err) => {
    console.error('Database connection error:', err);
  });

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Recipe Collection API is running' });
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// GET all recipes
app.get('/api/recipes', async (req, res) => {
  try {
    const result = await db.pool.query(
      'SELECT * FROM recipes ORDER BY created_at DESC'
    );
    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (err) {
    console.error('Error fetching recipes:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch recipes',
      message: err.message,
    });
  }
});

// GET single recipe by ID
app.get('/api/recipes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.pool.query(
      'SELECT * FROM recipes WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Recipe not found',
        message: `No recipe found with id ${id}`,
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (err) {
    console.error('Error fetching recipe:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch recipe',
      message: err.message,
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

