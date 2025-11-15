import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { Navbar } from '@/components/navbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Users, UserMinus, TrendingUp } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'

export default async function FollowingPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/giris')
  }

  // Takip edilen kullanıcıları çek
  const following = await db.follow.findMany({
    where: { userId: session.user.id },
    include: {
      target: {
        select: {
          id: true,
          username: true,
          name: true,
          image: true,
          bio: true,
          currentWeight: true,
          targetWeight: true,
          createdAt: true,
          _count: {
            select: {
              plans: { where: { status: 'published' } },
              followers: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-muted/20">
      <Navbar />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Users className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">Takip Ettiklerim</h1>
          </div>
          <p className="text-muted-foreground">
            Takip ettiğin {following.length} kişi
          </p>
        </div>

        {following.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {following.map(({ target }) => {
              const weightDiff = target.currentWeight && target.targetWeight
                ? target.currentWeight - target.targetWeight
                : null

              return (
                <Card key={target.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        {target.image ? (
                          <img
                            src={target.image}
                            alt={target.name || ''}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-2xl">👤</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/profil/${target.username}`}
                          className="font-bold text-lg hover:text-primary transition-colors line-clamp-1"
                        >
                          {target.name || `@${target.username}`}
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          @{target.username}
                        </p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {target.bio && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {target.bio}
                      </p>
                    )}

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Planlar</p>
                        <p className="text-xl font-bold">{target._count.plans}</p>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Takipçi</p>
                        <p className="text-xl font-bold">{target._count.followers}</p>
                      </div>
                    </div>

                    {/* Weight Info */}
                    {target.currentWeight && (
                      <div className="p-3 bg-primary/5 rounded-lg">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Mevcut Kilo</span>
                          <span className="font-semibold">{target.currentWeight} kg</span>
                        </div>
                        {weightDiff && weightDiff > 0 && (
                          <div className="flex items-center justify-between text-xs mt-1">
                            <span className="text-muted-foreground">Hedefe Kalan</span>
                            <span className="text-orange-600 font-medium flex items-center gap-1">
                              <TrendingUp className="h-3 w-3" />
                              {weightDiff.toFixed(1)} kg
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button asChild className="flex-1" size="sm">
                        <Link href={`/profil/${target.username}`}>
                          Profili Gör
                        </Link>
                      </Button>
                    </div>

                    <p className="text-xs text-muted-foreground text-center">
                      {formatDistanceToNow(new Date(target.createdAt), {
                        addSuffix: true,
                        locale: tr,
                      })}{' '}
                      katıldı
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-muted-foreground">
                <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">Henüz kimseyi takip etmiyorsun</p>
                <p className="text-sm mb-6">
                  Planları keşfet ve ilham veren kişileri takip et!
                </p>
                <Button asChild>
                  <Link href="/kesfet">Keşfet</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
