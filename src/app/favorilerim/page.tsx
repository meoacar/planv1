import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/navbar'
import { Card, CardContent } from '@/components/ui/card'
import { FavoritesClient } from './favorites-client'

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

  // Fetch user's saved/bookmarked plans
  const savedPlans = await db.favorite.findMany({
    where: {
      userId: session.user.id,
      targetType: 'plan',
    },
    include: {
      user: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  // Get plan details for saved plans
  const savedPlanIds = savedPlans.map((fav: any) => fav.targetId)
  const savedPlanDetails = await db.plan.findMany({
    where: {
      id: { in: savedPlanIds },
      status: 'published',
    },
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
  })

  const likedPlans = likes.map(like => like.plan).filter((plan: any) => plan.status === 'published')
  
  // Combine and deduplicate (prioritize saved plans)
  const allFavoritePlans = [...savedPlanDetails]
  likedPlans.forEach(plan => {
    if (!allFavoritePlans.find(p => p.id === plan.id)) {
      allFavoritePlans.push(plan)
    }
  })

  const favoritePlans = allFavoritePlans

  const allPlans = [...savedPlanDetails]
  likedPlans.forEach(plan => {
    if (!allPlans.find(p => p.id === plan.id)) {
      allPlans.push(plan)
    }
  })

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
        {allPlans.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{allPlans.length}</div>
                <div className="text-sm text-muted-foreground">Toplam Plan</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{savedPlanDetails.length}</div>
                <div className="text-sm text-muted-foreground">⭐ Kaydedilen</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{likedPlans.length}</div>
                <div className="text-sm text-muted-foreground">❤️ Beğenilen</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">
                  {allPlans.reduce((sum, plan) => sum + plan.duration, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Toplam Gün</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Favorites with Tabs */}
        <FavoritesClient 
          savedPlans={savedPlanDetails as any}
          likedPlans={likedPlans as any}
          savedPlanIds={savedPlanIds}
        />
      </main>
    </div>
  )
}
