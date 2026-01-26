# 🍳 RecipeBox

Your personal recipe collection in one place. Save, organize, and share your favorite recipes.

![RecipeBox](https://img.shields.io/badge/RecipeBox-v0.1.0-orange)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-4-teal)

## Features

- 📝 **Recipe Storage** — Save recipes with title, ingredients, instructions, images
- 🏷️ **Tags & Search** — Organize and find recipes easily
- 🔒 **User Accounts** — Secure authentication with Supabase
- 📱 **Responsive Design** — Works beautifully on mobile and desktop
- ✅ **Cooking Mode** — Track your progress step-by-step

## Tech Stack

- **Frontend:** React 19 + Vite + TypeScript
- **Styling:** Tailwind CSS 4
- **Backend:** Supabase (Auth, Database, Storage)
- **Icons:** Lucide React
- **Routing:** React Router DOM

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase account ([create one free](https://supabase.com))

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/MikilFoss/RecipeApp.git
   cd RecipeApp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Supabase:
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to SQL Editor and run the contents of `supabase/schema.sql`
   - Copy your project URL and anon key from Settings > API

4. Configure environment:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:5173](http://localhost:5173)

## Project Structure

```
src/
├── components/      # Reusable UI components
├── contexts/        # React contexts (Auth)
├── hooks/           # Custom hooks (useRecipes)
├── lib/             # Utilities (Supabase client)
├── pages/           # Page components
├── types/           # TypeScript types
└── index.css        # Global styles & theme
```

## Design System

RecipeBox uses a warm, inviting color palette:

- **Cream** — Background tones
- **Orange** — Primary accent (buttons, links)
- **Sage Green** — Secondary accent (tags, success states)
- **Warm Gray** — Text and neutral elements

## Roadmap

### Phase 1 (MVP) ✅
- [x] Project setup
- [x] Supabase auth (signup/login)
- [x] Recipe CRUD
- [x] Manual text entry
- [x] Recipe list & detail views
- [x] Responsive design

### Phase 2
- [ ] URL import (scrape recipes from websites)
- [ ] Image upload to Supabase Storage
- [ ] Image OCR for recipe extraction
- [ ] Bulk import

### Phase 3
- [ ] Social sharing between users
- [ ] Recipe collections/folders
- [ ] PWA support
- [ ] Meal planning

## Contributing

Contributions are welcome! Please open an issue or PR.

## License

MIT
