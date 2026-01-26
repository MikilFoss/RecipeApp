import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import type { Recipe, RecipeInsert, RecipeUpdate } from '../types/database'

export function useRecipes() {
  const { user } = useAuth()
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRecipes = useCallback(async () => {
    if (!user) {
      setRecipes([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setRecipes((data as Recipe[]) || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch recipes')
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchRecipes()
  }, [fetchRecipes])

  const createRecipe = async (recipe: Omit<RecipeInsert, 'user_id'>): Promise<Recipe> => {
    if (!user) throw new Error('Must be logged in to create recipes')

    const { data, error } = await supabase
      .from('recipes')
      .insert({
        ...recipe,
        user_id: user.id,
      })
      .select()
      .single()

    if (error) throw error
    const newRecipe = data as Recipe
    setRecipes(prev => [newRecipe, ...prev])
    return newRecipe
  }

  const updateRecipe = async (id: string, updates: RecipeUpdate): Promise<Recipe> => {
    const { data, error } = await supabase
      .from('recipes')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    const updatedRecipe = data as Recipe
    setRecipes(prev => prev.map(r => r.id === id ? updatedRecipe : r))
    return updatedRecipe
  }

  const deleteRecipe = async (id: string) => {
    const { error } = await supabase
      .from('recipes')
      .delete()
      .eq('id', id)

    if (error) throw error
    setRecipes(prev => prev.filter(r => r.id !== id))
  }

  const getRecipe = async (id: string): Promise<Recipe | null> => {
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data as Recipe
  }

  return {
    recipes,
    loading,
    error,
    fetchRecipes,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    getRecipe,
  }
}
