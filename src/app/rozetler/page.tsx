import { Metadata } from 'next'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { db as prisma } from '@/lib/db'
import { Navbar } from '@/components/navbar'
import { BadgesClient } from './badges-client'

export const metadata: Metadata = {
  title: 'Rozetler | ZayiflamaPlan',
  description: 'Kazandığın rozetleri gör ve yeni rozetler kazan',
}

async function getBadgesData(userId: string) {
  const [allBadges, userBadges, user] = await Promise.all([
    prisma.badge.findMany({
      where: { isActive: true },
      orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }],
    }),
    prisma.userBadge.findMany({
      where: { userId },
      include: { badge: true },
    }),
    prisma.user.findUnique({
      where: { id: userId },
      select: { xp: true, level: true, coins: true },
    }),
  ])

  const earnedBadgeIds = new Set(userBadges.map((ub) => ub.badgeId))

  const badgesWithStatus = allBadges.map((badge) => {
    const userBadge = userBadges.find((ub) => ub.badgeId === badge.id)
    return {
      ...badge,
      earned: earnedBadgeIds.has(badge.id),
      earnedAt: userBadge?.earnedAt || null,
    }
  })

  return { badges: badgesWithStatus, user, earnedCount: userBadges.length }
}

export default async function BadgesPage() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/giris?callbackUrl=/rozetler')
  }

  const { badges, user, earnedCount } = await getBadgesData(session.user.id)

  return (
    <>
      <Navbar />
      <BadgesClient badges={badges} user={user} earnedCount={earnedCount} />
    </>
  )
}
