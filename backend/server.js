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

// POST create new recipe
app.post('/api/recipes', async (req, res) => {
  try {
    const { title, description, ingredients, instructions, prep_time, cook_time, servings } = req.body;

    // Validation: title is required
    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        message: 'Title is required',
      });
    }

    // Convert ingredients to array if it's a string or ensure it's an array
    let ingredientsArray = [];
    if (ingredients) {
      if (Array.isArray(ingredients)) {
        ingredientsArray = ingredients;
      } else if (typeof ingredients === 'string') {
        // Split by comma or newline if it's a string
        ingredientsArray = ingredients.split(/[,\n]/).map(item => item.trim()).filter(item => item);
      }
    }

    // Insert new recipe into database
    const result = await db.pool.query(
      `INSERT INTO recipes (title, description, ingredients, instructions, prep_time, cook_time, servings)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        title.trim(),
        description || null,
        ingredientsArray.length > 0 ? ingredientsArray : null,
        instructions || null,
        prep_time || null,
        cook_time || null,
        servings || null,
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Recipe created successfully',
      data: result.rows[0],
    });
  } catch (err) {
    console.error('Error creating recipe:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to create recipe',
      message: err.message,
    });
  }
});

// PUT update existing recipe
app.put('/api/recipes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, ingredients, instructions, prep_time, cook_time, servings } = req.body;

    // First, check if recipe exists
    const checkResult = await db.pool.query(
      'SELECT * FROM recipes WHERE id = $1',
      [id]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Recipe not found',
        message: `No recipe found with id ${id}`,
      });
    }

    // Validation: if title is provided, it cannot be empty
    if (title !== undefined && (!title || title.trim() === '')) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        message: 'Title cannot be empty',
      });
    }

    // Convert ingredients to array if provided
    let ingredientsArray = null;
    if (ingredients !== undefined) {
      if (Array.isArray(ingredients)) {
        ingredientsArray = ingredients.length > 0 ? ingredients : null;
      } else if (typeof ingredients === 'string') {
        // Split by comma or newline if it's a string
        ingredientsArray = ingredients.split(/[,\n]/).map(item => item.trim()).filter(item => item);
        ingredientsArray = ingredientsArray.length > 0 ? ingredientsArray : null;
      } else if (ingredients === null) {
        ingredientsArray = null;
      }
    }

    // Update recipe in database
    // Use existing values if new ones are not provided
    const existingRecipe = checkResult.rows[0];
    const result = await db.pool.query(
      `UPDATE recipes 
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           ingredients = COALESCE($3, ingredients),
           instructions = COALESCE($4, instructions),
           prep_time = COALESCE($5, prep_time),
           cook_time = COALESCE($6, cook_time),
           servings = COALESCE($7, servings)
       WHERE id = $8
       RETURNING *`,
      [
        title !== undefined ? title.trim() : null,
        description !== undefined ? (description || null) : null,
        ingredientsArray,
        instructions !== undefined ? (instructions || null) : null,
        prep_time !== undefined ? (prep_time || null) : null,
        cook_time !== undefined ? (cook_time || null) : null,
        servings !== undefined ? (servings || null) : null,
        id,
      ]
    );

    res.json({
      success: true,
      message: 'Recipe updated successfully',
      data: result.rows[0],
    });
  } catch (err) {
    console.error('Error updating recipe:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to update recipe',
      message: err.message,
    });
  }
});

// DELETE remove recipe
app.delete('/api/recipes/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // First, check if recipe exists
    const checkResult = await db.pool.query(
      'SELECT * FROM recipes WHERE id = $1',
      [id]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Recipe not found',
        message: `No recipe found with id ${id}`,
      });
    }

    // Delete recipe from database
    await db.pool.query(
      'DELETE FROM recipes WHERE id = $1',
      [id]
    );

    res.json({
      success: true,
      message: 'Recipe deleted successfully',
      data: {
        id: parseInt(id),
        deleted: true,
      },
    });
  } catch (err) {
    console.error('Error deleting recipe:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to delete recipe',
      message: err.message,
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

