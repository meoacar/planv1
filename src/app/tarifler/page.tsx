import { Suspense } from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { RecipeCard } from '@/components/recipe-card'
import { RecipeFilters } from './recipe-filters'
import { RecipeWithAuthor } from '@/types'
import { Button } from '@/components/ui/button'

async function getRecipes(searchParams: any) {
  const params = new URLSearchParams()
  
  if (searchParams.search) params.append('search', searchParams.search)
  if (searchParams.category) params.append('category', searchParams.category)
  if (searchParams.mealType) params.append('mealType', searchParams.mealType)
  if (searchParams.difficulty) params.append('difficulty', searchParams.difficulty)
  if (searchParams.maxCalories) params.append('maxCalories', searchParams.maxCalories)
  if (searchParams.page) params.append('page', searchParams.page)

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const res = await fetch(`${baseUrl}/api/v1/recipes?${params.toString()}`, {
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error('Tarifler yüklenemedi')
  }

  return res.json()
}

export default async function RecipesPage({
  searchParams,
}: {
  searchParams: any
}) {
  const data = await getRecipes(searchParams)
  const recipes: RecipeWithAuthor[] = data.data || []
  const pagination = data.meta

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Tarifler 🍳</h1>
            <p className="text-muted-foreground text-lg">
              Sağlıklı ve lezzetli tarifler keşfedin
            </p>
          </div>
          <Link href="/ekle/tarif">
            <Button size="lg" className="gap-2">
              <Plus className="h-5 w-5" />
              Tarif Ekle
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Suspense fallback={<div>Yükleniyor...</div>}>
          <RecipeFilters />
        </Suspense>

        {/* Results */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            {pagination?.total || 0} tarif bulundu
          </p>
        </div>

        {/* Recipe Grid */}
        {recipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              Henüz tarif bulunmuyor
            </p>
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
              <a
                key={page}
                href={`?page=${page}`}
                className={`px-4 py-2 rounded-md ${
                  page === pagination.page
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                {page}
              </a>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
