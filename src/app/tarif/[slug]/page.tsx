import Link from 'next/link'
import { notFound } from 'next/navigation'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/navbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LikeButton, CommentForm, ShareButton } from './recipe-client'
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'
import { Clock, Users, Flame, ChefHat } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import AppealButton from '@/components/appeal-button'

const categoryLabels: Record<string, string> = {
  breakfast: 'Kahvaltı',
  lunch: 'Öğle Yemeği',
  dinner: 'Akşam Yemeği',
  snack: 'Atıştırmalık',
  dessert: 'Tatlı',
  drink: 'İçecek',
  main: 'Ana Yemek',
  side: 'Yan Yemek',
  salad: 'Salata',
  soup: 'Çorba',
}

const difficultyLabels: Record<string, string> = {
  easy: 'Kolay',
  medium: 'Orta',
  hard: 'Zor',
}

const difficultyColors: Record<string, string> = {
  easy: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  hard: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
}

export default async function RecipeDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const session = await auth()

  const recipe = await db.recipe.findUnique({
    where: { slug },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
        },
      },
      comments: {
        where: { status: 'visible' },
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: {
          author: {
            select: {
              name: true,
              username: true,
              image: true,
            },
          },
        },
      },
    },
  })

  if (!recipe) {
    notFound()
  }

  // Check access permissions
  const isAdmin = session?.user?.role === 'ADMIN'
  const isAuthor = session?.user?.id === recipe.authorId
  const isPublished = recipe.status === 'published'

  if (!isPublished && !isAuthor && !isAdmin) {
    notFound()
  }

  // Check if user liked this recipe
  let isLiked = false
  if (session?.user?.id) {
    const like = await db.recipeLike.findUnique({
      where: {
        userId_recipeId: {
          userId: session.user.id,
          recipeId: recipe.id,
        },
      },
    })
    isLiked = !!like
  }

  const ingredients = JSON.parse(recipe.ingredients)
  const tags = recipe.tags ? JSON.parse(recipe.tags) : []
  const images = recipe.images ? JSON.parse(recipe.images) : []
  const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0)

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Button asChild variant="ghost" className="mb-4">
          <Link href="/tarifler">← Geri</Link>
        </Button>

        {/* Status Banner */}
        {!isPublished && (
          <div className={`mb-6 rounded-xl border-2 p-6 ${
            recipe.status === 'pending' ? 'border-amber-300 bg-amber-50 dark:bg-amber-950/30' :
            recipe.status === 'draft' ? 'border-blue-300 bg-blue-50 dark:bg-blue-950/30' :
            'border-red-300 bg-red-50 dark:bg-red-950/30'
          }`}>
            <h3 className="font-bold mb-2">
              {recipe.status === 'pending' && '⏳ Tarif Onay Bekliyor'}
              {recipe.status === 'draft' && '📝 Taslak Tarif'}
              {recipe.status === 'rejected' && '❌ Tarif Reddedildi'}
            </h3>
            <p className="text-sm mb-4">
              {recipe.status === 'pending' && 'Tarifiniz inceleme aşamasında. Admin onayından sonra yayınlanacak.'}
              {recipe.status === 'draft' && 'Bu tarif henüz yayınlanmadı.'}
              {recipe.status === 'rejected' && 'Tarifiniz reddedildi. Düzenleyip tekrar gönderebilirsiniz.'}
            </p>
            {recipe.status === 'rejected' && isAuthor && !isAdmin && (
              <AppealButton
                contentType="recipe"
                contentId={recipe.id}
                isRejected={true}
              />
            )}
          </div>
        )}

        {/* Recipe Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
              {recipe.author.image ? (
                <img src={recipe.author.image} alt={recipe.author.name || ''} className="w-full h-full object-cover" />
              ) : (
                '👤'
              )}
            </div>
            <div>
              <Link href={`/profil/${recipe.author.username}`} className="font-medium hover:underline">
                @{recipe.author.username || 'kullanici'}
              </Link>
              <p className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(recipe.createdAt), { addSuffix: true, locale: tr })}
              </p>
            </div>
          </div>

          <h1 className="text-4xl font-bold mb-4">{recipe.title}</h1>

          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <Badge className={difficultyColors[recipe.difficulty]}>
              {difficultyLabels[recipe.difficulty]}
            </Badge>
            <Badge variant="secondary">
              {categoryLabels[recipe.category]}
            </Badge>
            {tags.slice(0, 3).map((tag: string) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>

          <p className="text-lg text-muted-foreground mb-6">{recipe.description}</p>

          <div className="flex gap-2 mb-6">
            {session?.user ? (
              <LikeButton recipeId={recipe.id} isLiked={isLiked} likesCount={recipe.likesCount} />
            ) : (
              <Button asChild variant="outline">
                <Link href="/giris">🤍 Beğen ({recipe.likesCount})</Link>
              </Button>
            )}
            <ShareButton title={recipe.title} description={recipe.description} />
          </div>
        </div>

        {/* Recipe Images */}
        {images.length > 0 && (
          <div className="mb-8">
            {images.length === 1 ? (
              <div className="relative aspect-video rounded-lg overflow-hidden">
                <Image
                  src={images[0]}
                  alt={recipe.title}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className={`grid gap-4 ${
                images.length === 2 ? 'grid-cols-2' :
                images.length === 3 ? 'grid-cols-3' :
                'grid-cols-2'
              }`}>
                {images.map((img: string, index: number) => (
                  <div 
                    key={index} 
                    className={`relative rounded-lg overflow-hidden ${
                      images.length === 4 && index === 0 ? 'col-span-2 aspect-video' : 'aspect-square'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${recipe.title} - ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Recipe Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {totalTime > 0 && (
            <Card>
              <CardContent className="p-4 text-center">
                <Clock className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Toplam Süre</p>
                <p className="text-xl font-bold">{totalTime} dk</p>
              </CardContent>
            </Card>
          )}
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Porsiyon</p>
              <p className="text-xl font-bold">{recipe.servings}</p>
            </CardContent>
          </Card>
          {recipe.calories && (
            <Card>
              <CardContent className="p-4 text-center">
                <Flame className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Kalori</p>
                <p className="text-xl font-bold">{Math.round(recipe.calories)}</p>
              </CardContent>
            </Card>
          )}
          <Card>
            <CardContent className="p-4 text-center">
              <ChefHat className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Zorluk</p>
              <p className="text-xl font-bold">{difficultyLabels[recipe.difficulty]}</p>
            </CardContent>
          </Card>
        </div>

        {/* Nutrition Info */}
        {(recipe.protein || recipe.carbs || recipe.fat || recipe.fiber) && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Besin Değerleri (Porsiyon Başına)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {recipe.protein && (
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Protein</p>
                    <p className="text-lg font-bold">{recipe.protein}g</p>
                  </div>
                )}
                {recipe.carbs && (
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Karbonhidrat</p>
                    <p className="text-lg font-bold">{recipe.carbs}g</p>
                  </div>
                )}
                {recipe.fat && (
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Yağ</p>
                    <p className="text-lg font-bold">{recipe.fat}g</p>
                  </div>
                )}
                {recipe.fiber && (
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Lif</p>
                    <p className="text-lg font-bold">{recipe.fiber}g</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Ingredients */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Malzemeler</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {ingredients.map((ingredient: any, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    <strong>{ingredient.amount}</strong> {ingredient.unit} {ingredient.name}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Yapılışı</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="whitespace-pre-wrap">{recipe.instructions}</div>
          </CardContent>
        </Card>

        {/* Comments */}
        <Card>
          <CardHeader>
            <CardTitle>Yorumlar ({recipe.commentsCount})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {session?.user ? (
              <CommentForm recipeId={recipe.id} />
            ) : (
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">
                  Yorum yapmak için giriş yapmalısınız
                </p>
                <Button asChild size="sm">
                  <Link href="/giris">Giriş Yap</Link>
                </Button>
              </div>
            )}

            {recipe.comments.length > 0 ? (
              <div className="space-y-4">
                {recipe.comments.map((comment) => (
                  <div key={comment.id} className="border-t pt-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {comment.author.image ? (
                          <img src={comment.author.image} alt={comment.author.name || ''} className="w-full h-full object-cover" />
                        ) : (
                          '👤'
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Link href={`/profil/${comment.author.username}`} className="font-medium text-sm hover:underline">
                            @{comment.author.username || 'kullanici'}
                          </Link>
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: tr })}
                          </p>
                        </div>
                        <p className="text-sm whitespace-pre-wrap">{comment.body}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>Henüz yorum yok</p>
                <p className="text-sm mt-2">İlk yorumu sen yap!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
