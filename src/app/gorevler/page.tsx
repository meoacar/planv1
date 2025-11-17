import { Metadata } from 'next'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { db as prisma } from '@/lib/db'
import { Navbar } from '@/components/navbar'
import { QuestsClient } from './quests-client'

export const metadata: Metadata = {
  title: 'Günlük Görevler | ZayiflamaPlan',
  description: 'Görevleri tamamla, XP ve coin kazan!',
}

async function getQuests(userId: string) {
  const quests = await prisma.dailyQuest.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
  })

  const userQuests = await prisma.userDailyQuest.findMany({
    where: {
      userId,
      date: {
        gte: new Date(new Date().setHours(0, 0, 0, 0)),
      },
    },
  })

  const questsWithProgress = quests.map((quest) => {
    const userQuest = userQuests.find((uq) => uq.questId === quest.id)
    return {
      ...quest,
      userProgress: userQuest
        ? {
            progress: userQuest.progress,
            completed: userQuest.completed,
            completedAt: userQuest.completedAt,
          }
        : null,
    }
  })

  return questsWithProgress
}

export default async function QuestsPage() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/giris?callbackUrl=/gorevler')
  }

  const quests = await getQuests(session.user.id)

  return (
    <>
      <Navbar />
      <QuestsClient initialQuests={quests} />
    </>
  )
}
