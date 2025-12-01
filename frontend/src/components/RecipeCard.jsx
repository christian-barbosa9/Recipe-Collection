import './RecipeCard.css'

function RecipeCard({ recipe, onEdit, onDelete }) {
  const formatTime = (minutes) => {
    if (!minutes) return 'N/A'
    if (minutes < 60) return `${minutes} min`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
  }

  const handleEdit = () => {
    if (onEdit) {
      onEdit(recipe)
    }
  }

  const handleDelete = () => {
    if (onDelete && window.confirm(`Are you sure you want to delete "${recipe.title}"?`)) {
      onDelete(recipe.id)
    }
  }

  return (
    <div className="recipe-card">
      <div className="recipe-card-header">
        <h3 className="recipe-title">{recipe.title}</h3>
        <div className="recipe-actions">
          <button onClick={handleEdit} className="edit-button" title="Edit recipe">
            ✏️
          </button>
          <button onClick={handleDelete} className="delete-button" title="Delete recipe">
            🗑️
          </button>
        </div>
      </div>
      
      {recipe.description && (
        <p className="recipe-description">{recipe.description}</p>
      )}

      <div className="recipe-meta">
        {recipe.prep_time && (
          <span className="meta-item">
            <span className="meta-label">Prep:</span> {formatTime(recipe.prep_time)}
          </span>
        )}
        {recipe.cook_time && (
          <span className="meta-item">
            <span className="meta-label">Cook:</span> {formatTime(recipe.cook_time)}
          </span>
        )}
        {recipe.servings && (
          <span className="meta-item">
            <span className="meta-label">Serves:</span> {recipe.servings}
          </span>
        )}
      </div>

      {recipe.ingredients && recipe.ingredients.length > 0 && (
        <div className="recipe-ingredients">
          <h4>Ingredients:</h4>
          <ul>
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </div>
      )}

      {recipe.instructions && (
        <div className="recipe-instructions">
          <h4>Instructions:</h4>
          <p>{recipe.instructions}</p>
        </div>
      )}
    </div>
  )
}

export default RecipeCard

