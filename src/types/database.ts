export interface Recipe {
  id: string
  user_id: string
  title: string
  description: string | null
  ingredients: string[]
  instructions: string[]
  prep_time: number | null
  cook_time: number | null
  servings: number | null
  image_url: string | null
  source_url: string | null
  tags: string[]
  is_public: boolean
  created_at: string
  updated_at: string
}

export type RecipeInsert = Omit<Recipe, 'id' | 'created_at' | 'updated_at'> & {
  id?: string
  created_at?: string
  updated_at?: string
}

export type RecipeUpdate = Partial<RecipeInsert>

export interface Profile {
  id: string
  email: string
  display_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

// Database type for Supabase client (simplified)
export interface Database {
  public: {
    Tables: {
      recipes: {
        Row: Recipe
        Insert: RecipeInsert
        Update: RecipeUpdate
      }
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'created_at' | 'updated_at'>
        Update: Partial<Omit<Profile, 'created_at' | 'updated_at'>>
      }
    }
  }
}
