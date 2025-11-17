import { Metadata } from 'next'
import Link from 'next/link'
import { db as prisma } from '@/lib/db'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Görev Yönetimi | Admin',
  description: 'Günlük görevleri yönet',
}

async function getQuests() {
  return await prisma.dailyQuest.findMany({
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
  })
}

export default async function AdminQuestsPage() {
  const quests = await getQuests()

  const typeLabels: Record<string, string> = {
    daily: 'Günlük',
    weekly: 'Haftalık',
    monthly: 'Aylık',
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Görev Yönetimi</h1>
          <p className="text-muted-foreground mt-1">
            Günlük görevleri oluştur ve yönet
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/gamification/quests/new">
            <Plus className="w-4 h-4 mr-2" />
            Yeni Görev
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Toplam Görev
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{quests.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Aktif Görev
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {quests.filter((q) => q.isActive).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Günlük Görev
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {quests.filter((q) => q.type === 'daily').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Toplam Ödül
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {quests.reduce((sum, q) => sum + q.xpReward, 0)} XP
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quests List */}
      <Card>
        <CardHeader>
          <CardTitle>Görevler</CardTitle>
          <CardDescription>
            Tüm görevleri görüntüle ve düzenle
          </CardDescription>
        </CardHeader>
        <CardContent>
          {quests.length > 0 ? (
            <div className="space-y-4">
              {quests.map((quest) => (
                <div
                  key={quest.id}
                  className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  {/* Icon */}
                  <div className="text-4xl">{quest.icon}</div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="font-semibold text-lg">{quest.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {quest.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/admin/gamification/quests/${quest.id}/edit`}>
                            <Edit className="w-4 h-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>

                    {/* Meta */}
                    <div className="flex items-center gap-3 flex-wrap">
                      <Badge variant={quest.isActive ? 'default' : 'secondary'}>
                        {quest.isActive ? (
                          <>
                            <Eye className="w-3 h-3 mr-1" />
                            Aktif
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3 mr-1" />
                            Pasif
                          </>
                        )}
                      </Badge>
                      <Badge variant="outline">{typeLabels[quest.type] || quest.type}</Badge>
                      <Badge variant="secondary">Hedef: {quest.target}</Badge>
                      <Badge variant="secondary">+{quest.xpReward} XP</Badge>
                      <Badge variant="secondary">+{quest.coinReward} 🪙</Badge>
                      <span className="text-xs text-muted-foreground">
                        Sıra: {quest.sortOrder}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">Henüz görev yok</p>
              <Button asChild>
                <Link href="/admin/gamification/quests/new">
                  <Plus className="w-4 h-4 mr-2" />
                  İlk Görevi Oluştur
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
