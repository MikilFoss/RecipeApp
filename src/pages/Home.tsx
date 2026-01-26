import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useRecipes } from '../hooks/useRecipes'
import { Layout } from '../components/Layout'
import { RecipeCard } from '../components/RecipeCard'
import { Plus, ChefHat, Search } from 'lucide-react'
import { useState } from 'react'

export function Home() {
  const { user } = useAuth()
  const { recipes, loading, error } = useRecipes()
  const [searchQuery, setSearchQuery] = useState('')

  const filteredRecipes = recipes.filter(recipe =>
    recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    recipe.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  if (!user) {
    return (
      <Layout>
        <div className="text-center py-16">
          <ChefHat className="w-20 h-20 text-orange-500 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-warm-gray-800 mb-4">
            Your recipes, all in one place
          </h1>
          <p className="text-xl text-warm-gray-600 mb-8 max-w-lg mx-auto">
            Save, organize, and share your favorite recipes. From family traditions to new discoveries.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              to="/signup"
              className="px-6 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
            >
              Get Started Free
            </Link>
            <Link
              to="/login"
              className="px-6 py-3 text-warm-gray-700 hover:text-warm-gray-900 font-medium transition-colors"
            >
              Sign In
            </Link>
          </div>

          {/* Features */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="p-6 bg-white rounded-2xl border border-cream-200">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl">📝</span>
              </div>
              <h3 className="font-semibold text-warm-gray-800 mb-2">Save Recipes</h3>
              <p className="text-warm-gray-600 text-sm">
                Add recipes manually, paste from URLs, or upload images
              </p>
            </div>
            <div className="p-6 bg-white rounded-2xl border border-cream-200">
              <div className="w-12 h-12 bg-sage-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl">🗂️</span>
              </div>
              <h3 className="font-semibold text-warm-gray-800 mb-2">Stay Organized</h3>
              <p className="text-warm-gray-600 text-sm">
                Tag and search recipes to find exactly what you need
              </p>
            </div>
            <div className="p-6 bg-white rounded-2xl border border-cream-200">
              <div className="w-12 h-12 bg-cream-200 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl">👥</span>
              </div>
              <h3 className="font-semibold text-warm-gray-800 mb-2">Share with Friends</h3>
              <p className="text-warm-gray-600 text-sm">
                Share your favorite recipes with family and friends
              </p>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-warm-gray-800">My Recipes</h1>
            <p className="text-warm-gray-600 mt-1">
              {recipes.length} {recipes.length === 1 ? 'recipe' : 'recipes'} saved
            </p>
          </div>
          <Link
            to="/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Recipe
          </Link>
        </div>

        {/* Search */}
        {recipes.length > 0 && (
          <div className="mt-6 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-warm-gray-400" />
            <input
              type="text"
              placeholder="Search recipes by title or tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-cream-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            />
          </div>
        )}
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-warm-gray-600">Loading recipes...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12 text-red-600">
          <p>{error}</p>
        </div>
      ) : filteredRecipes.length === 0 ? (
        <div className="text-center py-16">
          {recipes.length === 0 ? (
            <>
              <div className="w-20 h-20 bg-cream-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <ChefHat className="w-10 h-10 text-warm-gray-400" />
              </div>
              <h2 className="text-xl font-semibold text-warm-gray-800 mb-2">No recipes yet</h2>
              <p className="text-warm-gray-600 mb-6">Start building your recipe collection!</p>
              <Link
                to="/new"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add Your First Recipe
              </Link>
            </>
          ) : (
            <>
              <p className="text-warm-gray-600">No recipes match "{searchQuery}"</p>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </Layout>
  )
}
