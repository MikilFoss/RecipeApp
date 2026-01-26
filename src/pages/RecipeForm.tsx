import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { useRecipes } from '../hooks/useRecipes'
import { ArrowLeft, Plus, X, Save, Trash2, AlertCircle } from 'lucide-react'
import type { RecipeInsert } from '../types/database'

export function RecipeForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { createRecipe, updateRecipe, deleteRecipe, getRecipe } = useRecipes()
  const isEditing = Boolean(id)

  const [loading, setLoading] = useState(false)
  const [loadingRecipe, setLoadingRecipe] = useState(isEditing)
  const [error, setError] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [ingredients, setIngredients] = useState<string[]>([''])
  const [instructions, setInstructions] = useState<string[]>([''])
  const [prepTime, setPrepTime] = useState('')
  const [cookTime, setCookTime] = useState('')
  const [servings, setServings] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [sourceUrl, setSourceUrl] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [isPublic, setIsPublic] = useState(false)

  useEffect(() => {
    if (id) {
      setLoadingRecipe(true)
      getRecipe(id)
        .then(recipe => {
          if (recipe) {
            setTitle(recipe.title)
            setDescription(recipe.description || '')
            setIngredients(recipe.ingredients.length > 0 ? recipe.ingredients : [''])
            setInstructions(recipe.instructions.length > 0 ? recipe.instructions : [''])
            setPrepTime(recipe.prep_time?.toString() || '')
            setCookTime(recipe.cook_time?.toString() || '')
            setServings(recipe.servings?.toString() || '')
            setImageUrl(recipe.image_url || '')
            setSourceUrl(recipe.source_url || '')
            setTags(recipe.tags)
            setIsPublic(recipe.is_public)
          }
        })
        .catch(() => setError('Failed to load recipe'))
        .finally(() => setLoadingRecipe(false))
    }
  }, [id, getRecipe])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const recipeData: Omit<RecipeInsert, 'user_id'> = {
      title: title.trim(),
      description: description.trim() || null,
      ingredients: ingredients.filter(i => i.trim()),
      instructions: instructions.filter(i => i.trim()),
      prep_time: prepTime ? parseInt(prepTime) : null,
      cook_time: cookTime ? parseInt(cookTime) : null,
      servings: servings ? parseInt(servings) : null,
      image_url: imageUrl.trim() || null,
      source_url: sourceUrl.trim() || null,
      tags: tags,
      is_public: isPublic,
    }

    try {
      if (isEditing && id) {
        await updateRecipe(id, recipeData)
        navigate(`/recipe/${id}`)
      } else {
        const newRecipe = await createRecipe(recipeData)
        navigate(`/recipe/${newRecipe.id}`)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save recipe')
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!id) return
    setLoading(true)
    try {
      await deleteRecipe(id)
      navigate('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete recipe')
      setLoading(false)
    }
  }

  const addIngredient = () => setIngredients([...ingredients, ''])
  const removeIngredient = (index: number) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index))
    }
  }
  const updateIngredient = (index: number, value: string) => {
    const updated = [...ingredients]
    updated[index] = value
    setIngredients(updated)
  }

  const addInstruction = () => setInstructions([...instructions, ''])
  const removeInstruction = (index: number) => {
    if (instructions.length > 1) {
      setInstructions(instructions.filter((_, i) => i !== index))
    }
  }
  const updateInstruction = (index: number, value: string) => {
    const updated = [...instructions]
    updated[index] = value
    setInstructions(updated)
  }

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase()
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag])
      setTagInput('')
    }
  }
  const removeTag = (tag: string) => setTags(tags.filter(t => t !== tag))

  if (loadingRecipe) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-warm-gray-600">Loading recipe...</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 text-warm-gray-600 hover:text-warm-gray-800 hover:bg-cream-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-warm-gray-800">
            {isEditing ? 'Edit Recipe' : 'Add New Recipe'}
          </h1>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <section className="bg-white rounded-2xl border border-cream-200 p-6">
            <h2 className="text-lg font-semibold text-warm-gray-800 mb-4">Basic Info</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-warm-gray-700 mb-2">
                  Recipe Title *
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Grandma's Chocolate Chip Cookies"
                  required
                  className="w-full px-4 py-3 bg-cream-50 border border-cream-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-warm-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="A short description of your recipe..."
                  rows={3}
                  className="w-full px-4 py-3 bg-cream-50 border border-cream-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label htmlFor="prepTime" className="block text-sm font-medium text-warm-gray-700 mb-2">
                    Prep (min)
                  </label>
                  <input
                    id="prepTime"
                    type="number"
                    min="0"
                    value={prepTime}
                    onChange={(e) => setPrepTime(e.target.value)}
                    placeholder="15"
                    className="w-full px-4 py-3 bg-cream-50 border border-cream-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="cookTime" className="block text-sm font-medium text-warm-gray-700 mb-2">
                    Cook (min)
                  </label>
                  <input
                    id="cookTime"
                    type="number"
                    min="0"
                    value={cookTime}
                    onChange={(e) => setCookTime(e.target.value)}
                    placeholder="30"
                    className="w-full px-4 py-3 bg-cream-50 border border-cream-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="servings" className="block text-sm font-medium text-warm-gray-700 mb-2">
                    Servings
                  </label>
                  <input
                    id="servings"
                    type="number"
                    min="1"
                    value={servings}
                    onChange={(e) => setServings(e.target.value)}
                    placeholder="4"
                    className="w-full px-4 py-3 bg-cream-50 border border-cream-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Ingredients */}
          <section className="bg-white rounded-2xl border border-cream-200 p-6">
            <h2 className="text-lg font-semibold text-warm-gray-800 mb-4">Ingredients</h2>
            
            <div className="space-y-3">
              {ingredients.map((ingredient, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={ingredient}
                    onChange={(e) => updateIngredient(index, e.target.value)}
                    placeholder={`Ingredient ${index + 1}`}
                    className="flex-1 px-4 py-3 bg-cream-50 border border-cream-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => removeIngredient(index)}
                    disabled={ingredients.length === 1}
                    className="p-3 text-warm-gray-400 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addIngredient}
                className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Ingredient
              </button>
            </div>
          </section>

          {/* Instructions */}
          <section className="bg-white rounded-2xl border border-cream-200 p-6">
            <h2 className="text-lg font-semibold text-warm-gray-800 mb-4">Instructions</h2>
            
            <div className="space-y-3">
              {instructions.map((instruction, index) => (
                <div key={index} className="flex gap-2">
                  <span className="w-8 h-12 flex items-center justify-center text-warm-gray-400 font-medium">
                    {index + 1}.
                  </span>
                  <textarea
                    value={instruction}
                    onChange={(e) => updateInstruction(index, e.target.value)}
                    placeholder={`Step ${index + 1}`}
                    rows={2}
                    className="flex-1 px-4 py-3 bg-cream-50 border border-cream-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                  />
                  <button
                    type="button"
                    onClick={() => removeInstruction(index)}
                    disabled={instructions.length === 1}
                    className="p-3 text-warm-gray-400 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addInstruction}
                className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium ml-10"
              >
                <Plus className="w-4 h-4" />
                Add Step
              </button>
            </div>
          </section>

          {/* Tags */}
          <section className="bg-white rounded-2xl border border-cream-200 p-6">
            <h2 className="text-lg font-semibold text-warm-gray-800 mb-4">Tags</h2>
            
            <div className="flex flex-wrap gap-2 mb-3">
              {tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-sage-100 text-sage-700 rounded-full text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:text-sage-900"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addTag()
                  }
                }}
                placeholder="Add a tag (e.g., dessert, vegetarian)"
                className="flex-1 px-4 py-3 bg-cream-50 border border-cream-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-3 bg-sage-100 text-sage-700 rounded-lg hover:bg-sage-200 transition-colors"
              >
                Add
              </button>
            </div>
          </section>

          {/* Additional Info */}
          <section className="bg-white rounded-2xl border border-cream-200 p-6">
            <h2 className="text-lg font-semibold text-warm-gray-800 mb-4">Additional Info</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="imageUrl" className="block text-sm font-medium text-warm-gray-700 mb-2">
                  Image URL
                </label>
                <input
                  id="imageUrl"
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-3 bg-cream-50 border border-cream-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="sourceUrl" className="block text-sm font-medium text-warm-gray-700 mb-2">
                  Source URL
                </label>
                <input
                  id="sourceUrl"
                  type="url"
                  value={sourceUrl}
                  onChange={(e) => setSourceUrl(e.target.value)}
                  placeholder="Where did you find this recipe?"
                  className="w-full px-4 py-3 bg-cream-50 border border-cream-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="w-5 h-5 rounded border-cream-300 text-orange-500 focus:ring-orange-500"
                />
                <span className="text-warm-gray-700">Make this recipe public (others can view it)</span>
              </label>
            </div>
          </section>

          {/* Actions */}
          <div className="flex items-center justify-between">
            {isEditing && (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-5 h-5" />
                Delete Recipe
              </button>
            )}
            <div className={`flex gap-3 ${!isEditing ? 'ml-auto' : ''}`}>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-3 text-warm-gray-600 hover:text-warm-gray-800 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !title.trim()}
                className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Save className="w-5 h-5" />
                {loading ? 'Saving...' : 'Save Recipe'}
              </button>
            </div>
          </div>
        </form>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full">
              <h3 className="text-xl font-semibold text-warm-gray-800 mb-2">Delete Recipe?</h3>
              <p className="text-warm-gray-600 mb-6">
                Are you sure you want to delete "{title}"? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 text-warm-gray-600 hover:text-warm-gray-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 disabled:opacity-50"
                >
                  {loading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
