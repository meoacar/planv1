import { Suspense } from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/layout/footer'
import { ConfessionFeed } from '@/components/confessions/ConfessionFeed'
import { ConfessionFilters } from '@/components/confessions/ConfessionFilters'
import { PopularConfessions } from '@/components/confessions/PopularConfessions'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ConfessionCategory } from '@/types/confession'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'İtiraf Duvarı | Zayıflama Planı',
  description: 'Diyet sürecindeki "hatalarınızı" anonim olarak paylaşın, AI destekli yanıtlar alın ve topluluktan empati gösterin.',
  openGraph: {
    title: 'İtiraf Duvarı | Zayıflama Planı',
    description: 'Diyet sürecindeki "hatalarınızı" anonim olarak paylaşın, AI destekli yanıtlar alın ve topluluktan empati gösterin.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'İtiraf Duvarı | Zayıflama Planı',
    description: 'Diyet sürecindeki "hatalarınızı" anonim olarak paylaşın, AI destekli yanıtlar alın ve topluluktan empati gösterin.',
  }
}

async function getPopularConfessions() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/v1/confessions?popular=true&limit=5`, {
      cache: 'no-store',
      next: { revalidate: 3600 } // 1 saat cache
    })

    if (!res.ok) {
      return []
    }

    const data = await res.json()
    return data.success && data.data?.items ? data.data.items : []
  } catch (error) {
    console.error('Popüler itiraflar yüklenemedi:', error)
    return []
  }
}

export default async function ConfessionsPage({
  searchParams,
}: {
  searchParams: { category?: string; popular?: string }
}) {
  const popularConfessions = await getPopularConfessions()

  const category = searchParams.category as ConfessionCategory | undefined
  const showPopular = searchParams.popular === 'true'

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">İtiraf Duvarı 💭</h1>
              <p className="text-muted-foreground text-lg">
                Diyet sürecindeki "hatalarınızı" anonim olarak paylaşın
              </p>
            </div>
            <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 hover:from-purple-700 hover:via-pink-700 hover:to-orange-700 shadow-lg">
              <Link href="/confessions/create">
                <Plus className="mr-2 h-5 w-5" />
                Yeni İtiraf
              </Link>
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <Suspense fallback={<Skeleton className="h-[120px] w-full" />}>
            <ConfessionFilters
              selectedCategory={category || 'all'}
              showPopular={showPopular}
            />
          </Suspense>
        </div>

        {/* Main Content - Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Feed - 2/3 width */}
          <div className="lg:col-span-2">
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
                category={category}
                popular={showPopular}
              />
            </Suspense>
          </div>

          {/* Sidebar - 1/3 width */}
          <div className="space-y-6">
            {/* Popüler İtiraflar */}
            {popularConfessions.length > 0 && (
              <PopularConfessions confessions={popularConfessions} />
            )}
          </div>
        </div>

        {/* Floating Action Button - Yeni İtiraf (Mobile Only) */}
        <Link href="/confessions/create" className="lg:hidden">
          <Button
            size="lg"
            className="fixed bottom-8 right-8 rounded-full shadow-2xl h-16 w-16 p-0 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 hover:from-purple-700 hover:via-pink-700 hover:to-orange-700 z-50"
          >
            <Plus className="h-7 w-7" />
          </Button>
        </Link>
      </main>

      <Footer />
    </div>
  )
}
