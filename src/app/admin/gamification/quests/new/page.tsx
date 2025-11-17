import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { QuestForm } from '../quest-form'

export const metadata: Metadata = {
  title: 'Yeni Görev | Admin',
  description: 'Yeni görev oluştur',
}

export default function NewQuestPage() {
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
          <h1 className="text-3xl font-bold">Yeni Görev</h1>
          <p className="text-muted-foreground mt-1">
            Yeni bir günlük görev oluştur
          </p>
        </div>
      </div>

      {/* Form */}
      <QuestForm />
    </div>
  )
}
