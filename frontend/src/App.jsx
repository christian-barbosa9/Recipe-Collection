import { useState } from 'react'
import RecipeList from './components/RecipeList'
import RecipeForm from './components/RecipeForm'
import axios from 'axios'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

function App() {
  const [showForm, setShowForm] = useState(false)
  const [selectedRecipe, setSelectedRecipe] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleCreateClick = () => {
    setSelectedRecipe(null)
    setShowForm(true)
  }

  const handleEditClick = (recipe) => {
    setSelectedRecipe(recipe)
    setShowForm(true)
  }

  const handleFormSubmit = async (formData) => {
    try {
      if (selectedRecipe) {
        // Update existing recipe
        const response = await axios.put(`${API_URL}/recipes/${selectedRecipe.id}`, formData)
        if (response.data.success) {
          setShowForm(false)
          setSelectedRecipe(null)
          setRefreshKey((prev) => prev + 1)
        } else {
          alert('Failed to update recipe: ' + (response.data.message || 'Unknown error'))
        }
      } else {
        // Create new recipe
        const response = await axios.post(`${API_URL}/recipes`, formData)
        if (response.data.success) {
          setShowForm(false)
          setSelectedRecipe(null)
          setRefreshKey((prev) => prev + 1)
        } else {
          alert('Failed to create recipe: ' + (response.data.message || 'Unknown error'))
        }
      }
    } catch (err) {
      console.error('Error saving recipe:', err)
      alert('Failed to save recipe: ' + (err.response?.data?.message || err.message))
    }
  }

  const handleFormCancel = () => {
    setShowForm(false)
    setSelectedRecipe(null)
  }

  const handleDeleteSuccess = () => {
    setRefreshKey((prev) => prev + 1)
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Recipe Collection</h1>
        <p>Manage your favorite recipes</p>
      </header>

      <main className="app-main">
        <div className="container">
          {showForm ? (
            <RecipeForm
              recipe={selectedRecipe}
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
            />
          ) : (
            <>
              <div className="header-actions">
                <button onClick={handleCreateClick} className="create-button">
                  + Add New Recipe
                </button>
              </div>
              <RecipeList
                key={refreshKey}
                onEdit={handleEditClick}
                onDelete={handleDeleteSuccess}
              />
            </>
          )}
        </div>
      </main>
    </div>
  )
}

export default App
