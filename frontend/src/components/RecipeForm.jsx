import { useState, useEffect } from 'react'
import './RecipeForm.css'

function RecipeForm({ recipe = null, onSubmit, onCancel }) {
  const isEditMode = !!recipe

  // Form state
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [ingredients, setIngredients] = useState('')
  const [instructions, setInstructions] = useState('')
  const [prepTime, setPrepTime] = useState('')
  const [cookTime, setCookTime] = useState('')
  const [servings, setServings] = useState('')
  const [errors, setErrors] = useState({})

  // Populate form if editing
  useEffect(() => {
    if (recipe) {
      setTitle(recipe.title || '')
      setDescription(recipe.description || '')
      setIngredients(
        recipe.ingredients && Array.isArray(recipe.ingredients)
          ? recipe.ingredients.join('\n')
          : recipe.ingredients || ''
      )
      setInstructions(recipe.instructions || '')
      setPrepTime(recipe.prep_time || '')
      setCookTime(recipe.cook_time || '')
      setServings(recipe.servings || '')
    }
  }, [recipe])

  const validateForm = () => {
    const newErrors = {}

    if (!title.trim()) {
      newErrors.title = 'Title is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    // Convert ingredients string to array
    const ingredientsArray = ingredients
      .split('\n')
      .map((item) => item.trim())
      .filter((item) => item)

    const formData = {
      title: title.trim(),
      description: description.trim() || null,
      ingredients: ingredientsArray.length > 0 ? ingredientsArray : null,
      instructions: instructions.trim() || null,
      prep_time: prepTime ? parseInt(prepTime) : null,
      cook_time: cookTime ? parseInt(cookTime) : null,
      servings: servings ? parseInt(servings) : null,
    }

    onSubmit(formData)
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    }
  }

  return (
    <div className="recipe-form-container">
      <form className="recipe-form" onSubmit={handleSubmit}>
        <h2>{isEditMode ? 'Edit Recipe' : 'Create New Recipe'}</h2>

        <div className="form-group">
          <label htmlFor="title">
            Title <span className="required">*</span>
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={errors.title ? 'error' : ''}
            placeholder="Enter recipe title"
          />
          {errors.title && <span className="error-message">{errors.title}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
            placeholder="Enter recipe description"
          />
        </div>

        <div className="form-group">
          <label htmlFor="ingredients">Ingredients</label>
          <textarea
            id="ingredients"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            rows="5"
            placeholder="Enter ingredients, one per line"
          />
          <small className="form-hint">Enter one ingredient per line</small>
        </div>

        <div className="form-group">
          <label htmlFor="instructions">Instructions</label>
          <textarea
            id="instructions"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            rows="6"
            placeholder="Enter cooking instructions"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="prepTime">Prep Time (minutes)</label>
            <input
              type="number"
              id="prepTime"
              value={prepTime}
              onChange={(e) => setPrepTime(e.target.value)}
              min="0"
              placeholder="0"
            />
          </div>

          <div className="form-group">
            <label htmlFor="cookTime">Cook Time (minutes)</label>
            <input
              type="number"
              id="cookTime"
              value={cookTime}
              onChange={(e) => setCookTime(e.target.value)}
              min="0"
              placeholder="0"
            />
          </div>

          <div className="form-group">
            <label htmlFor="servings">Servings</label>
            <input
              type="number"
              id="servings"
              value={servings}
              onChange={(e) => setServings(e.target.value)}
              min="1"
              placeholder="0"
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-button">
            {isEditMode ? 'Update Recipe' : 'Create Recipe'}
          </button>
          <button type="button" onClick={handleCancel} className="cancel-button">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default RecipeForm

