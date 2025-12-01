import { useState, useEffect } from 'react'
import axios from 'axios'
import RecipeCard from './RecipeCard'
import './RecipeList.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

function RecipeList({ onEdit, onDelete }) {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchRecipes()
  }, [])

  const fetchRecipes = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await axios.get(`${API_URL}/recipes`)
      
      if (response.data.success) {
        setRecipes(response.data.data)
      } else {
        setError('Failed to fetch recipes')
      }
    } catch (err) {
      console.error('Error fetching recipes:', err)
      setError(err.response?.data?.message || 'Failed to load recipes. Please check if the server is running.')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteRecipe = async (recipeId) => {
    try {
      const response = await axios.delete(`${API_URL}/recipes/${recipeId}`)
      
      if (response.data.success) {
        await fetchRecipes()
        if (onDelete) {
          onDelete()
        }
      } else {
        alert('Failed to delete recipe: ' + (response.data.message || 'Unknown error'))
      }
    } catch (err) {
      console.error('Error deleting recipe:', err)
      alert('Failed to delete recipe: ' + (err.response?.data?.message || err.message))
    }
  }

  const handleEditClick = (recipe) => {
    if (onEdit) {
      onEdit(recipe)
    }
  }

  if (loading) {
    return <div className="loading">Loading recipes...</div>
  }

  if (error) {
    return (
      <div className="error-state">
        <p className="error-message">{error}</p>
        <button onClick={fetchRecipes} className="retry-button">
          Retry
        </button>
      </div>
    )
  }

  if (recipes.length === 0) {
    return (
      <div className="empty-state">
        <p>No recipes yet. Add your first recipe!</p>
      </div>
    )
  }

  return (
    <div className="recipe-list">
      <div className="recipes-grid">
        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onEdit={handleEditClick}
            onDelete={handleDeleteRecipe}
          />
        ))}
      </div>
    </div>
  )
}

export default RecipeList

