

-- Create recipes table
CREATE TABLE IF NOT EXISTS recipes (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  ingredients TEXT[],
  instructions TEXT,
  prep_time INTEGER,
  cook_time INTEGER,
  servings INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on title for faster searches
CREATE INDEX IF NOT EXISTS idx_recipes_title ON recipes(title);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_recipes_updated_at 
    BEFORE UPDATE ON recipes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data (optional)
INSERT INTO recipes (title, description, ingredients, instructions, prep_time, cook_time, servings)
VALUES 
  (
    'Chocolate Chip Cookies',
    'Classic homemade chocolate chip cookies',
    ARRAY['2 cups flour', '1 cup butter', '1 cup sugar', '2 eggs', '1 cup chocolate chips'],
    '1. Mix dry ingredients. 2. Cream butter and sugar. 3. Add eggs. 4. Combine and add chocolate chips. 5. Bake at 375°F for 10-12 minutes.',
    15,
    12,
    24
  ),
  (
    'Spaghetti Carbonara',
    'Traditional Italian pasta dish',
    ARRAY['400g spaghetti', '200g pancetta', '4 eggs', '100g parmesan', 'black pepper'],
    '1. Cook pasta. 2. Fry pancetta. 3. Mix eggs and parmesan. 4. Combine hot pasta with pancetta. 5. Add egg mixture off heat. 6. Season with pepper.',
    10,
    20,
    4
  )
ON CONFLICT DO NOTHING;

