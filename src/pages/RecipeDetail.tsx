import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { useRecipes } from '../hooks/useRecipes'
import type { Recipe } from '../types/database'
import { ArrowLeft, Clock, Users, Edit, ExternalLink, ChefHat, Check } from 'lucide-react'

export function RecipeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getRecipe } = useRecipes()
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())

  useEffect(() => {
    if (id) {
      getRecipe(id)
        .then(data => {
          setRecipe(data)
          if (!data) setError('Recipe not found')
        })
        .catch(() => setError('Failed to load recipe'))
        .finally(() => setLoading(false))
    }
  }, [id, getRecipe])

  const toggleStep = (index: number) => {
    const newCompleted = new Set(completedSteps)
    if (newCompleted.has(index)) {
      newCompleted.delete(index)
    } else {
      newCompleted.add(index)
    }
    setCompletedSteps(newCompleted)
  }

  const totalTime = (recipe?.prep_time || 0) + (recipe?.cook_time || 0)

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-warm-gray-600">Loading recipe...</p>
        </div>
      </Layout>
    )
  }

  if (error || !recipe) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-cream-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <ChefHat className="w-10 h-10 text-warm-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-warm-gray-800 mb-2">Recipe not found</h2>
          <p className="text-warm-gray-600 mb-6">{error || "This recipe doesn't exist or has been deleted."}</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Recipes
          </Link>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 text-warm-gray-600 hover:text-warm-gray-800 hover:bg-cream-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <Link
            to={`/recipe/${recipe.id}/edit`}
            className="flex items-center gap-2 px-4 py-2 text-warm-gray-600 hover:text-warm-gray-800 hover:bg-cream-100 rounded-lg transition-colors"
          >
            <Edit className="w-5 h-5" />
            Edit
          </Link>
        </div>

        {/* Hero Image */}
        {recipe.image_url && (
          <div className="aspect-[16/9] rounded-2xl overflow-hidden mb-6">
            <img
              src={recipe.image_url}
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Title & Meta */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-warm-gray-800 mb-4">
            {recipe.title}
          </h1>

          {recipe.description && (
            <p className="text-lg text-warm-gray-600 mb-4">
              {recipe.description}
            </p>
          )}

          {/* Tags */}
          {recipe.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {recipe.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-sage-100 text-sage-700 rounded-full text-sm font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Time & Servings */}
          <div className="flex flex-wrap items-center gap-6 text-warm-gray-600">
            {recipe.prep_time !== null && recipe.prep_time > 0 && (
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>Prep: {recipe.prep_time} min</span>
              </div>
            )}
            {recipe.cook_time !== null && recipe.cook_time > 0 && (
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>Cook: {recipe.cook_time} min</span>
              </div>
            )}
            {totalTime > 0 && (
              <div className="flex items-center gap-2 font-medium text-warm-gray-800">
                <Clock className="w-5 h-5" />
                <span>Total: {totalTime} min</span>
              </div>
            )}
            {recipe.servings !== null && (
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>{recipe.servings} servings</span>
              </div>
            )}
          </div>

          {/* Source Link */}
          {recipe.source_url && (
            <a
              href={recipe.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 text-orange-600 hover:text-orange-700 font-medium"
            >
              <ExternalLink className="w-4 h-4" />
              View Original Recipe
            </a>
          )}
        </div>

        <div className="grid md:grid-cols-[1fr,2fr] gap-8">
          {/* Ingredients */}
          <section className="bg-white rounded-2xl border border-cream-200 p-6 h-fit">
            <h2 className="text-xl font-semibold text-warm-gray-800 mb-4">Ingredients</h2>
            <ul className="space-y-3">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0" />
                  <span className="text-warm-gray-700">{ingredient}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Instructions */}
          <section className="bg-white rounded-2xl border border-cream-200 p-6">
            <h2 className="text-xl font-semibold text-warm-gray-800 mb-4">Instructions</h2>
            <ol className="space-y-4">
              {recipe.instructions.map((instruction, index) => (
                <li
                  key={index}
                  className={`flex gap-4 cursor-pointer group ${
                    completedSteps.has(index) ? 'opacity-50' : ''
                  }`}
                  onClick={() => toggleStep(index)}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                      completedSteps.has(index)
                        ? 'bg-sage-500 text-white'
                        : 'bg-orange-100 text-orange-600 group-hover:bg-orange-200'
                    }`}
                  >
                    {completedSteps.has(index) ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <span className="text-sm font-medium">{index + 1}</span>
                    )}
                  </div>
                  <p
                    className={`text-warm-gray-700 pt-1 ${
                      completedSteps.has(index) ? 'line-through' : ''
                    }`}
                  >
                    {instruction}
                  </p>
                </li>
              ))}
            </ol>
          </section>
        </div>

        {/* Completion Status */}
        {completedSteps.size > 0 && (
          <div className="mt-8 p-4 bg-sage-50 border border-sage-200 rounded-xl text-center">
            <p className="text-sage-700 font-medium">
              {completedSteps.size} of {recipe.instructions.length} steps completed
              {completedSteps.size === recipe.instructions.length && ' 🎉'}
            </p>
          </div>
        )}
      </div>
    </Layout>
  )
}
