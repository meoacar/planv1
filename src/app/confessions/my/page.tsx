import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { Navbar } from '@/components/navbar'
import { ConfessionFeed } from '@/components/confessions/ConfessionFeed'
import { ConfessionStats } from '@/components/confessions/ConfessionStats'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, TrendingUp, Heart, Trophy } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'İtiraflarım | Zayıflama Planı',
  description: 'Paylaştığınız itirafları ve istatistiklerinizi görüntüleyin.',
}

async function getUserConfessionStats(userId: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/v1/confessions/stats?userId=${userId}`, {
      cache: 'no-store',
    })

    if (!res.ok) {
      return null
    }

    const data = await res.json()
    return data.success && data.data ? data.data : null
  } catch (error) {
    console.error('İstatistikler yüklenemedi:', error)
    return null
  }
}

export default async function MyConfessionsPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/giris?callbackUrl=/confessions/my')
  }

  const stats = await getUserConfessionStats(session.user.id)

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/confessions">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              İtiraf Duvarına Dön
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">İtiraflarım 📝</h1>
          <p className="text-muted-foreground text-lg">
            Paylaştığınız itirafları ve istatistiklerinizi görüntüleyin
          </p>
        </div>

        {/* İstatistikler */}
        {stats && (
          <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Toplam İtiraf */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Toplam İtiraf
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalConfessions || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Paylaştığınız itiraf sayısı
                </p>
              </CardContent>
            </Card>

            {/* Toplam Empati */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Toplam Empati
                </CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalEmpathy || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Aldığınız empati sayısı
                </p>
              </CardContent>
            </Card>

            {/* En Popüler */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  En Popüler
                </CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.mostPopular?.empathyCount || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  En çok empati alan itirafınız
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* İtiraflar Listesi */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Tüm İtiraflarınız</h2>
          <Suspense
            fallback={
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-[200px] w-full" />
                ))}
              </div>
            }
          >
            <ConfessionFeed
              userId={session.user.id}
            />
          </Suspense>
        </div>

        {/* Bilgilendirme */}
        <div className="mt-8 p-4 rounded-lg border bg-muted/50">
          <p className="text-sm text-muted-foreground">
            💡 <strong>Not:</strong> İtiraflarınız feed'de anonim olarak görünür, ancak
            burada sizin olduğunu görebilirsiniz. Sadece siz kendi itiraflarınızı
            görebilirsiniz.
          </p>
        </div>
      </main>
    </div>
  )
}
