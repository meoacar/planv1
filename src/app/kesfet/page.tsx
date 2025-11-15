'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/navbar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'

type Plan = {
  id: string
  title: string
  description: string | null
  slug: string
  difficulty: 'easy' | 'medium' | 'hard'
  duration: number
  targetWeightLoss: number | null
  likesCount: number
  commentsCount: number
  views: number
  createdAt: string
  author: {
    username: string | null
    name: string | null
    image: string | null
  }
  tags: string[]
}

const difficultyLabels = {
  easy: 'Kolay',
  medium: 'Orta',
  hard: 'Zor',
}

const difficultyColors = {
  easy: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  hard: 'bg-red-100 text-red-800',
}

export default function ExplorePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  
  // Filters from URL
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [difficulty, setDifficulty] = useState<string | null>(searchParams.get('difficulty'))
  const [durationRange, setDurationRange] = useState<string | null>(searchParams.get('duration'))
  const [selectedTag, setSelectedTag] = useState<string | null>(searchParams.get('tag'))

  // Fetch plans
  const fetchPlans = async (pageNum: number, append = false) => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      params.set('page', pageNum.toString())
      params.set('limit', '12')
      
      if (searchQuery) params.set('q', searchQuery)
      if (difficulty) params.set('difficulty', difficulty)
      if (durationRange) params.set('duration', durationRange)
      if (selectedTag) params.set('tag', selectedTag)

      const response = await fetch(`/api/plans/explore?${params.toString()}`)
      const data = await response.json()

      // Check if data is valid
      if (data.plans && Array.isArray(data.plans)) {
        if (append) {
          setPlans(prev => [...prev, ...data.plans])
        } else {
          setPlans(data.plans)
        }
        setHasMore(data.hasMore || false)
      } else {
        // If no plans or error, set empty array
        if (!append) {
          setPlans([])
        }
        setHasMore(false)
      }
    } catch (error) {
      console.error('Error fetching plans:', error)
    } finally {
      setLoading(false)
    }
  }

  // Update URL params
  const updateURL = () => {
    const params = new URLSearchParams()
    if (searchQuery) params.set('q', searchQuery)
    if (difficulty) params.set('difficulty', difficulty)
    if (durationRange) params.set('duration', durationRange)
    if (selectedTag) params.set('tag', selectedTag)
    
    const queryString = params.toString()
    router.push(`/kesfet${queryString ? `?${queryString}` : ''}`, { scroll: false })
  }

  // Initial load and filter changes
  useEffect(() => {
    setPage(1)
    fetchPlans(1, false)
    updateURL()
  }, [searchQuery, difficulty, durationRange, selectedTag])

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    fetchPlans(1, false)
  }

  // Load more
  const loadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchPlans(nextPage, true)
  }

  // Filter handlers
  const handleDifficultyFilter = (value: string | null) => {
    setDifficulty(difficulty === value ? null : value)
  }

  const handleDurationFilter = (value: string | null) => {
    setDurationRange(durationRange === value ? null : value)
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Planları Keşfet 🔍</h1>
          <p className="text-muted-foreground">
            Binlerce gerçek insanın gerçek planlarını keşfet
          </p>
        </div>

        {/* Search & Filters */}
        <div className="mb-8 space-y-4">
          <form onSubmit={handleSearch} className="flex gap-4">
            <Input
              placeholder="Plan ara..."
              className="max-w-md"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button type="submit">Ara</Button>
            {searchQuery && (
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => setSearchQuery('')}
              >
                Temizle
              </Button>
            )}
          </form>

          {/* Difficulty Filters */}
          <div className="flex gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground self-center mr-2">Zorluk:</span>
            <Button 
              variant={!difficulty ? "default" : "outline"} 
              size="sm"
              onClick={() => setDifficulty(null)}
            >
              Tümü
            </Button>
            <Button 
              variant={difficulty === 'easy' ? "default" : "outline"} 
              size="sm"
              onClick={() => handleDifficultyFilter('easy')}
            >
              Kolay
            </Button>
            <Button 
              variant={difficulty === 'medium' ? "default" : "outline"} 
              size="sm"
              onClick={() => handleDifficultyFilter('medium')}
            >
              Orta
            </Button>
            <Button 
              variant={difficulty === 'hard' ? "default" : "outline"} 
              size="sm"
              onClick={() => handleDifficultyFilter('hard')}
            >
              Zor
            </Button>
          </div>

          {/* Duration Filters */}
          <div className="flex gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground self-center mr-2">Süre:</span>
            <Button 
              variant={!durationRange ? "default" : "outline"} 
              size="sm"
              onClick={() => setDurationRange(null)}
            >
              Tümü
            </Button>
            <Button 
              variant={durationRange === 'short' ? "default" : "outline"} 
              size="sm"
              onClick={() => handleDurationFilter('short')}
            >
              Kısa (1-7 gün)
            </Button>
            <Button 
              variant={durationRange === 'medium' ? "default" : "outline"} 
              size="sm"
              onClick={() => handleDurationFilter('medium')}
            >
              Orta (8-30 gün)
            </Button>
            <Button 
              variant={durationRange === 'long' ? "default" : "outline"} 
              size="sm"
              onClick={() => handleDurationFilter('long')}
            >
              Uzun (31+ gün)
            </Button>
          </div>

          {/* Active Filters Summary */}
          {(searchQuery || difficulty || durationRange || selectedTag) && (
            <div className="flex gap-2 items-center text-sm">
              <span className="text-muted-foreground">Aktif filtreler:</span>
              {searchQuery && (
                <span className="bg-primary/10 px-2 py-1 rounded">
                  Arama: {searchQuery}
                </span>
              )}
              {difficulty && (
                <span className="bg-primary/10 px-2 py-1 rounded">
                  {difficultyLabels[difficulty as keyof typeof difficultyLabels]}
                </span>
              )}
              {durationRange && (
                <span className="bg-primary/10 px-2 py-1 rounded">
                  {durationRange === 'short' ? 'Kısa' : durationRange === 'medium' ? 'Orta' : 'Uzun'}
                </span>
              )}
              {selectedTag && (
                <span className="bg-primary/10 px-2 py-1 rounded">
                  #{selectedTag}
                </span>
              )}
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  setSearchQuery('')
                  setDifficulty(null)
                  setDurationRange(null)
                  setSelectedTag(null)
                }}
              >
                Tümünü Temizle
              </Button>
            </div>
          )}
        </div>

        {/* Plans Grid */}
        {loading && page === 1 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Yükleniyor...</p>
          </div>
        ) : plans.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <Card key={plan.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          {plan.author.image ? (
                            <img src={plan.author.image} alt={plan.author.name || ''} className="w-full h-full rounded-full object-cover" />
                          ) : (
                            '👤'
                          )}
                        </div>
                        <div>
                          <Link href={`/profil/${plan.author.username}`} className="text-sm font-medium hover:underline">
                            @{plan.author.username || 'kullanici'}
                          </Link>
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(plan.createdAt), { addSuffix: true, locale: tr })}
                          </p>
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${difficultyColors[plan.difficulty]}`}>
                        {difficultyLabels[plan.difficulty]}
                      </span>
                    </div>
                    <CardTitle className="text-lg">{plan.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {plan.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <span>⏱️ {plan.duration} gün</span>
                      {plan.targetWeightLoss && (
                        <span>🎯 {plan.targetWeightLoss}kg</span>
                      )}
                    </div>
                    
                    {/* Tags */}
                    {plan.tags && Array.isArray(plan.tags) && plan.tags.length > 0 && (
                      <div className="flex gap-1 flex-wrap mb-4">
                        {plan.tags.slice(0, 3).map((tag) => (
                          <button
                            key={tag}
                            onClick={() => setSelectedTag(tag)}
                            className="text-xs bg-muted px-2 py-1 rounded hover:bg-muted/80 transition-colors"
                          >
                            #{tag}
                          </button>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between text-sm mb-4">
                      <div className="flex gap-3 text-muted-foreground">
                        <span>❤️ {plan.likesCount}</span>
                        <span>💬 {plan.commentsCount}</span>
                        <span>👁️ {plan.views}</span>
                      </div>
                    </div>
                    <Button asChild className="w-full" variant="outline">
                      <Link href={`/plan/${plan.slug}`}>Planı Gör</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Load More */}
            {hasMore && (
              <div className="text-center mt-8">
                <Button 
                  variant="outline" 
                  onClick={loadMore}
                  disabled={loading}
                >
                  {loading ? 'Yükleniyor...' : 'Daha Fazla Yükle'}
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              {searchQuery || difficulty || durationRange || selectedTag 
                ? 'Filtrelere uygun plan bulunamadı' 
                : 'Henüz yayınlanmış plan yok'}
            </p>
            <Button asChild>
              <Link href="/plan-ekle">İlk Planı Sen Oluştur</Link>
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
