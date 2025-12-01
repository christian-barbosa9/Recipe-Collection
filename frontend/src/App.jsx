import RecipeList from './components/RecipeList'
import './App.css'

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Recipe Collection</h1>
        <p>Manage your favorite recipes</p>
      </header>

      <main className="app-main">
        <div className="container">
          <RecipeList />
        </div>
      </main>
    </div>
  )
}

export default App
