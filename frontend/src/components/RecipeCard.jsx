import './RecipeCard.css'

function RecipeCard({ recipe }) {
  const formatTime = (minutes) => {
    if (!minutes) return 'N/A'
    if (minutes < 60) return `${minutes} min`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
  }

  return (
    <div className="recipe-card">
      <div className="recipe-card-header">
        <h3 className="recipe-title">{recipe.title}</h3>
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

