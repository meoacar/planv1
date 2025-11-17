import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { ConfessionCard } from '@/components/confessions/ConfessionCard'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { ConfessionWithUser, ConfessionCategory } from '@/types/confession'

interface PageProps {
  params: {
    id: string
  }
}

async function getConfession(id: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/v1/confessions/${id}`, {
      cache: 'no-store',
    })

    if (!res.ok) {
      return null
    }

    const data = await res.json()
    return data.success && data.data ? data.data : null
  } catch (error) {
    console.error('İtiraf yüklenemedi:', error)
    return null
  }
}

async function getSimilarConfessions(category: ConfessionCategory, excludeId: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const res = await fetch(
      `${baseUrl}/api/v1/confessions?category=${category}&limit=3`,
      {
        cache: 'no-store',
      }
    )

    if (!res.ok) {
      return []
    }

    const data = await res.json()
    const confessions = data.success && data.data?.items ? data.data.items : []
    
    // Mevcut itirafı hariç tut
    return confessions.filter((c: ConfessionWithUser) => c.id !== excludeId)
  } catch (error) {
    console.error('Benzer itiraflar yüklenemedi:', error)
    return []
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const confession = await getConfession(params.id)

  if (!confession) {
    return {
      title: 'İtiraf Bulunamadı | Zayıflama Planı',
    }
  }

  // İtiraf içeriğinden kısa bir açıklama oluştur
  const description = confession.content.length > 150
    ? confession.content.substring(0, 150) + '...'
    : confession.content

  return {
    title: `İtiraf | Zayıflama Planı`,
    description,
    openGraph: {
      title: 'İtiraf Duvarı | Zayıflama Planı',
      description,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'İtiraf Duvarı | Zayıflama Planı',
      description,
    },
  }
}

export default async function ConfessionDetailPage({ params }: PageProps) {
  const confession = await getConfession(params.id)

  if (!confession) {
    notFound()
  }

  const similarConfessions = await getSimilarConfessions(
    confession.category,
    confession.id
  )

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

        {/* Main Content - Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* İtiraf Detayı - 2/3 width */}
          <div className="lg:col-span-2">
            <ConfessionCard confession={confession} />
          </div>

          {/* Sidebar - 1/3 width */}
          <div className="space-y-6">
            {/* Benzer İtiraflar */}
            {similarConfessions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Benzer İtiraflar</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {similarConfessions.map((similar: ConfessionWithUser) => (
                    <Link key={similar.id} href={`/confessions/${similar.id}`}>
                      <div className="p-3 rounded-lg border hover:bg-accent transition-colors cursor-pointer">
                        <p className="text-sm line-clamp-3 mb-2">
                          {similar.content}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>❤️ {similar._count?.empathies || similar.empathyCount}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Bilgilendirme */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">💡 Bilgi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>
                  Bu itiraf anonim olarak paylaşılmıştır. Kimlik bilgileri gizlidir.
                </p>
                <p>
                  "Benimki de vardı" butonuna tıklayarak empati gösterebilir ve
                  +2 XP kazanabilirsiniz.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Yeni İtiraf CTA */}
        <div className="mt-8 p-6 rounded-lg border bg-card text-center">
          <h3 className="text-xl font-semibold mb-2">
            Sizin de bir itirafınız mı var?
          </h3>
          <p className="text-muted-foreground mb-4">
            Anonim olarak paylaşın, AI yanıtı alın ve ödül kazanın!
          </p>
          <Link href="/confessions/create">
            <Button size="lg">
              Yeni İtiraf Yap
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
