import { useState } from 'react'
import './App.css'

function App() {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(false)

  return (
    <div className="app">
      <header className="app-header">
        <h1>Recipe Collection</h1>
        <p>Manage your favorite recipes</p>
      </header>

      <main className="app-main">
        <div className="container">
          {loading ? (
            <div className="loading">Loading recipes...</div>
          ) : (
            <div className="recipes-section">
              {recipes.length === 0 ? (
                <div className="empty-state">
                  <p>No recipes yet. Add your first recipe!</p>
                </div>
              ) : (
                <div className="recipes-grid">
                  {/* Recipes will be displayed here */}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default App
