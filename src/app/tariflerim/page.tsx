import { redirect } from 'next/navigation'
import Link from 'next/link'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { RecipeCard } from '@/components/recipe-card'
import { Plus } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default async function MyRecipesPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/giris')
  }

  // Fetch user's recipes
  const [published, pending, draft, rejected] = await Promise.all([
    db.recipe.findMany({
      where: {
        authorId: session.user.id,
        status: 'published',
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    db.recipe.findMany({
      where: {
        authorId: session.user.id,
        status: 'pending',
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    db.recipe.findMany({
      where: {
        authorId: session.user.id,
        status: 'draft',
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    db.recipe.findMany({
      where: {
        authorId: session.user.id,
        status: 'rejected',
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
  ])

  const totalRecipes = published.length + pending.length + draft.length + rejected.length

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Tariflerim 🍳</h1>
            <p className="text-muted-foreground">
              Toplam {totalRecipes} tarif
            </p>
          </div>
          <Button asChild>
            <Link href="/tarif-ekle">
              <Plus className="w-4 h-4 mr-2" />
              Yeni Tarif Ekle
            </Link>
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="published" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="published">
              Yayında ({published.length})
            </TabsTrigger>
            <TabsTrigger value="pending">
              Onay Bekliyor ({pending.length})
            </TabsTrigger>
            <TabsTrigger value="draft">
              Taslak ({draft.length})
            </TabsTrigger>
            <TabsTrigger value="rejected">
              Reddedilen ({rejected.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="published">
            {published.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {published.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg mb-4">
                  Henüz yayınlanmış tarifiniz yok
                </p>
                <Button asChild>
                  <Link href="/tarif-ekle">İlk Tarifini Ekle</Link>
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="pending">
            {pending.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pending.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  Onay bekleyen tarifiniz yok
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="draft">
            {draft.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {draft.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  Taslak tarifiniz yok
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="rejected">
            {rejected.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rejected.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  Reddedilen tarifiniz yok
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
