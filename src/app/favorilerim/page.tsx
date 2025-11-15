import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/navbar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'

export default async function FavoritesPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/giris')
  }

  // Fetch user's liked plans
  const likes = await db.like.findMany({
    where: {
      userId: session.user.id,
      targetType: 'plan',
    },
    include: {
      plan: {
        include: {
          author: {
            select: {
              id: true,
              name: true,
              username: true,
              image: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  const favoritePlans = likes.map(like => like.plan).filter(plan => plan.status === 'published')

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Favorilerim ❤️</h1>
          <p className="text-muted-foreground">
            Beğendiğin ve kaydettiğin planlar
          </p>
        </div>

        {/* Stats */}
        {favoritePlans.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{favoritePlans.length}</div>
                <div className="text-sm text-muted-foreground">Favori Plan</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">
                  {favoritePlans.reduce((sum, plan) => sum + plan.duration, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Toplam Gün</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">
                  {favoritePlans.reduce((sum, plan) => sum + (plan.targetWeightLoss || 0), 0).toFixed(1)}kg
                </div>
                <div className="text-sm text-muted-foreground">Toplam Hedef</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Favorites List */}
        {favoritePlans.length > 0 ? (
          <div className="space-y-4">
            {favoritePlans.map((plan) => (
              <Card key={plan.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Link
                          href={`/profil/${plan.author.username}`}
                          className="flex items-center gap-2 hover:underline"
                        >
                          {plan.author.image && (
                            <img
                              src={plan.author.image}
                              alt={plan.author.name || ''}
                              className="w-6 h-6 rounded-full"
                            />
                          )}
                          <span className="text-sm text-muted-foreground">
                            {plan.author.name || plan.author.username}
                          </span>
                        </Link>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(plan.publishedAt || plan.createdAt), {
                            addSuffix: true,
                            locale: tr,
                          })}
                        </span>
                      </div>
                      <CardTitle className="text-xl mb-2">
                        <Link href={`/plan/${plan.slug}`} className="hover:underline">
                          {plan.title}
                        </Link>
                      </CardTitle>
                      <CardDescription className="line-clamp-2">
                        {plan.description}
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/plan/${plan.slug}`}>Görüntüle</Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-6 text-sm text-muted-foreground flex-wrap">
                    <span>⏱️ {plan.duration} gün</span>
                    {plan.targetWeightLoss && (
                      <span>🎯 {plan.targetWeightLoss}kg hedef</span>
                    )}
                    <span>
                      {plan.difficulty === 'easy' && '🟢 Kolay'}
                      {plan.difficulty === 'medium' && '🟡 Orta'}
                      {plan.difficulty === 'hard' && '🔴 Zor'}
                    </span>
                    <span>❤️ {plan.likesCount} beğeni</span>
                    <span>💬 {plan.commentsCount} yorum</span>
                    <span>👁️ {plan.views} görüntülenme</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="text-6xl mb-4">❤️</div>
              <h3 className="text-xl font-semibold mb-2">Henüz favori yok</h3>
              <p className="text-muted-foreground mb-6">
                Beğendiğin planları favorilerine ekle, kolayca ulaş!
              </p>
              <Button asChild>
                <Link href="/kesfet">Planları Keşfet</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
