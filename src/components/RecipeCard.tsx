import { Link } from 'react-router-dom'
import type { Recipe } from '../types/database'
import { Clock, Users, ChefHat } from 'lucide-react'

interface RecipeCardProps {
  recipe: Recipe
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const totalTime = (recipe.prep_time || 0) + (recipe.cook_time || 0)

  return (
    <Link
      to={`/recipe/${recipe.id}`}
      className="group block bg-white rounded-2xl border border-cream-200 overflow-hidden hover:shadow-lg hover:border-orange-200 transition-all"
    >
      {/* Image */}
      <div className="aspect-[4/3] bg-cream-100 relative overflow-hidden">
        {recipe.image_url ? (
          <img
            src={recipe.image_url}
            alt={recipe.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ChefHat className="w-12 h-12 text-warm-gray-300" />
          </div>
        )}
        {recipe.tags.length > 0 && (
          <div className="absolute top-3 left-3 flex flex-wrap gap-1">
            {recipe.tags.slice(0, 2).map((tag, i) => (
              <span
                key={i}
                className="px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-medium text-warm-gray-700 rounded-full"
              >
                {tag}
              </span>
            ))}
            {recipe.tags.length > 2 && (
              <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-medium text-warm-gray-500 rounded-full">
                +{recipe.tags.length - 2}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-warm-gray-800 group-hover:text-orange-600 transition-colors line-clamp-2">
          {recipe.title}
        </h3>
        
        {recipe.description && (
          <p className="mt-2 text-sm text-warm-gray-600 line-clamp-2">
            {recipe.description}
          </p>
        )}

        {/* Meta */}
        <div className="mt-3 flex items-center gap-4 text-sm text-warm-gray-500">
          {totalTime > 0 && (
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {totalTime} min
            </span>
          )}
          {recipe.servings && (
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {recipe.servings}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
