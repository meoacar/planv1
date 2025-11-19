import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { db as prisma } from '@/lib/db'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { QuestForm } from '../../quest-form'

export const metadata: Metadata = {
  title: 'Görev Düzenle | Admin',
  description: 'Görevi düzenle',
}

async function getQuest(id: string) {
  return await prisma.dailyQuest.findUnique({
    where: { id },
  })
}

export default async function EditQuestPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const quest = await getQuest(id)

  if (!quest) {
    notFound()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/gamification/quests">
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Görev Düzenle</h1>
          <p className="text-muted-foreground mt-1">
            {quest.title}
          </p>
        </div>
      </div>

      {/* Form */}
      <QuestForm quest={quest} />
    </div>
  )
}
