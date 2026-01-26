import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { ChefHat, Plus, LogOut, User, Book } from 'lucide-react'

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, signOut } = useAuth()
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Header */}
      <header className="bg-white border-b border-cream-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 text-orange-600 hover:text-orange-700 transition-colors">
              <ChefHat className="w-8 h-8" />
              <span className="text-xl font-semibold text-warm-gray-800">RecipeBox</span>
            </Link>

            {/* Navigation */}
            {user && (
              <nav className="hidden sm:flex items-center gap-6">
                <Link
                  to="/"
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    isActive('/') 
                      ? 'bg-orange-100 text-orange-700' 
                      : 'text-warm-gray-600 hover:text-warm-gray-800 hover:bg-cream-100'
                  }`}
                >
                  <Book className="w-5 h-5" />
                  <span>My Recipes</span>
                </Link>
                <Link
                  to="/new"
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    isActive('/new')
                      ? 'bg-orange-100 text-orange-700'
                      : 'text-warm-gray-600 hover:text-warm-gray-800 hover:bg-cream-100'
                  }`}
                >
                  <Plus className="w-5 h-5" />
                  <span>Add Recipe</span>
                </Link>
              </nav>
            )}

            {/* User Menu */}
            {user ? (
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-2 text-warm-gray-600">
                  <User className="w-5 h-5" />
                  <span className="text-sm">{user.email}</span>
                </div>
                <button
                  onClick={() => signOut()}
                  className="flex items-center gap-2 px-3 py-2 text-warm-gray-600 hover:text-warm-gray-800 hover:bg-cream-100 rounded-lg transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-warm-gray-600 hover:text-warm-gray-800 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      {user && (
        <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-cream-200 z-50">
          <div className="flex items-center justify-around py-2">
            <Link
              to="/"
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg ${
                isActive('/') ? 'text-orange-600' : 'text-warm-gray-500'
              }`}
            >
              <Book className="w-6 h-6" />
              <span className="text-xs">Recipes</span>
            </Link>
            <Link
              to="/new"
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg ${
                isActive('/new') ? 'text-orange-600' : 'text-warm-gray-500'
              }`}
            >
              <Plus className="w-6 h-6" />
              <span className="text-xs">Add</span>
            </Link>
            <button
              onClick={() => signOut()}
              className="flex flex-col items-center gap-1 px-4 py-2 text-warm-gray-500"
            >
              <LogOut className="w-6 h-6" />
              <span className="text-xs">Sign Out</span>
            </button>
          </div>
        </nav>
      )}

      {/* Main Content */}
      <main className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${user ? 'pb-24 sm:pb-8' : ''}`}>
        {children}
      </main>
    </div>
  )
}
