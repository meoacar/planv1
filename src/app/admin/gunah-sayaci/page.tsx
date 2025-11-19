import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Flame,
  MessageSquare,
  Trophy,
  Target,
  Users,
  TrendingUp,
  BarChart3,
  Settings,
} from 'lucide-react'

async function getSinStats() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/admin/sin-stats`, {
      cache: 'no-store',
    })
    if (!res.ok) return null
    return res.json()
  } catch (error) {
    return null
  }
}

export default async function GunahSayaciAdminPage() {
  const stats = await getSinStats()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 p-8 text-white shadow-2xl">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Flame className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Günah Sayacı Yönetimi</h1>
              <p className="text-white/90 mt-1">
                Mizahi yanıtlar, rozetler ve challenge'ları yönet 🍰
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription className="text-orange-700 dark:text-orange-300 font-medium">
                Toplam Günah
              </CardDescription>
              <Flame className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-900 dark:text-orange-100">
                {stats.totalSins}
              </div>
              <p className="text-xs text-orange-600 dark:text-orange-400 mt-2">
                Tüm kullanıcılar
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription className="text-blue-700 dark:text-blue-300 font-medium">
                Aktif Kullanıcı
              </CardDescription>
              <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                {stats.totalUsers}
              </div>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                En az 1 günah ekledi
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription className="text-yellow-700 dark:text-yellow-300 font-medium">
                Kazanılan Rozet
              </CardDescription>
              <Trophy className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-900 dark:text-yellow-100">
                {stats.totalBadgesEarned}
              </div>
              <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2">
                Tüm rozetler
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription className="text-purple-700 dark:text-purple-300 font-medium">
                Challenge Katılımı
              </CardDescription>
              <Target className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-900 dark:text-purple-100">
                {stats.totalChallengeParticipants}
              </div>
              <p className="text-xs text-purple-600 dark:text-purple-400 mt-2">
                Aktif katılımcı
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="border-0 shadow-xl hover:shadow-2xl transition-shadow">
          <CardHeader className="bg-gradient-to-r from-orange-500/10 to-orange-500/5 border-b">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-orange-600" />
              <CardTitle>Mizahi Yanıtlar</CardTitle>
            </div>
            <CardDescription>Günah eklendiğinde gösterilen mesajlar</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Button asChild className="w-full" size="lg">
              <Link href="/admin/gunah-sayaci/reactions">
                <Settings className="h-4 w-4 mr-2" />
                Yanıtları Yönet
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl hover:shadow-2xl transition-shadow">
          <CardHeader className="bg-gradient-to-r from-yellow-500/10 to-yellow-500/5 border-b">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-600" />
              <CardTitle>Rozetler</CardTitle>
            </div>
            <CardDescription>Kullanıcıların kazanabileceği başarı rozetleri</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Button asChild className="w-full" size="lg">
              <Link href="/admin/gunah-sayaci/badges">
                <Settings className="h-4 w-4 mr-2" />
                Rozetleri Yönet
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl hover:shadow-2xl transition-shadow">
          <CardHeader className="bg-gradient-to-r from-purple-500/10 to-purple-500/5 border-b">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-600" />
              <CardTitle>Challenge'lar</CardTitle>
            </div>
            <CardDescription>Kullanıcıların katılabileceği hedefler</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Button asChild className="w-full" size="lg">
              <Link href="/admin/gunah-sayaci/challenges">
                <Settings className="h-4 w-4 mr-2" />
                Challenge'ları Yönet
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Sin Type Distribution */}
      {stats?.sinsByType && stats.sinsByType.length > 0 && (
        <Card className="border-0 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-indigo-500/10 to-indigo-500/5 border-b">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-indigo-600" />
              <CardTitle>Günah Türü Dağılımı</CardTitle>
            </div>
            <CardDescription>Hangi tür günahlar daha çok ekleniyor?</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {stats.sinsByType.map((item: any) => {
                const total = stats.totalSins
                const percentage = ((item._count / total) * 100).toFixed(1)
                
                const typeLabels: Record<string, { label: string; emoji: string; color: string }> = {
                  tatli: { label: 'Tatlı', emoji: '🍰', color: 'bg-pink-500' },
                  fastfood: { label: 'Fast Food', emoji: '🍔', color: 'bg-orange-500' },
                  gazli: { label: 'Gazlı İçecek', emoji: '🥤', color: 'bg-blue-500' },
                  alkol: { label: 'Alkol', emoji: '🍺', color: 'bg-purple-500' },
                  diger: { label: 'Diğer', emoji: '🍕', color: 'bg-gray-500' },
                }
                
                const type = typeLabels[item.sinType] || typeLabels.diger
                
                return (
                  <div key={item.sinType}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{type.emoji}</span>
                        <span className="font-medium">{type.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{item._count}</Badge>
                        <span className="text-sm text-muted-foreground">{percentage}%</span>
                      </div>
                    </div>
                    <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${type.color} transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top Users */}
      {stats?.topUsers && stats.topUsers.length > 0 && (
        <Card className="border-0 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-green-500/10 to-green-500/5 border-b">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <CardTitle>En Aktif Kullanıcılar</CardTitle>
            </div>
            <CardDescription>En çok günah ekleyen kullanıcılar (dürüstlük ödülü 🏆)</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-3">
              {stats.topUsers.map((item: any, index: number) => (
                <div
                  key={item.user.id}
                  className="flex items-center gap-4 p-4 rounded-xl border bg-gradient-to-r from-muted/50 to-muted/20"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{item.user.name}</p>
                    <p className="text-sm text-muted-foreground">@{item.user.username}</p>
                  </div>
                  <Badge variant="secondary" className="text-base px-3 py-1">
                    {item.count} günah
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
