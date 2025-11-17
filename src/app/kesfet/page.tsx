'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/navbar'
import { FooterClient } from '@/components/layout/footer-client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'
import { Search, TrendingUp, Clock, Heart, MessageCircle, Eye, Grid3x3, List, Filter, X, Sparkles } from 'lucide-react'

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
  
  // New UI states
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<string>('popular')
  const [activeTab, setActiveTab] = useState<string>('all')
  const [showFilters, setShowFilters] = useState(false)

  // Fetch plans
  const fetchPlans = async (pageNum: number, append = false) => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      params.set('page', pageNum.toString())
      params.set('limit', '12')
      params.set('sort', sortBy)
      
      if (searchQuery) params.set('q', searchQuery)
      if (difficulty) params.set('difficulty', difficulty)
      if (durationRange) params.set('duration', durationRange)
      if (selectedTag) params.set('tag', selectedTag)
      if (activeTab !== 'all') params.set('filter', activeTab)

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
  }, [searchQuery, difficulty, durationRange, selectedTag, sortBy, activeTab])

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

  // Skeleton loader component
  const SkeletonCard = () => (
    <Card className="animate-pulse">
      <CardHeader>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-full bg-muted" />
          <div className="flex-1">
            <div className="h-4 bg-muted rounded w-24 mb-2" />
            <div className="h-3 bg-muted rounded w-16" />
          </div>
        </div>
        <div className="h-6 bg-muted rounded w-3/4 mb-2" />
        <div className="h-4 bg-muted rounded w-full" />
      </CardHeader>
      <CardContent>
        <div className="h-20 bg-muted rounded" />
      </CardContent>
    </Card>
  )

  const clearAllFilters = () => {
    setSearchQuery('')
    setDifficulty(null)
    setDurationRange(null)
    setSelectedTag(null)
  }

  const hasActiveFilters = searchQuery || difficulty || durationRange || selectedTag

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            <span>Binlerce kişi hedeflerine ulaştı</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Planları Keşfet
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Gerçek insanların gerçek başarı hikayelerini keşfet ve senin için en uygun planı bul
          </p>
        </div>

        {/* Tabs & Controls */}
        <div className="mb-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <TabsList className="grid w-full md:w-auto grid-cols-3 md:grid-cols-4">
                <TabsTrigger value="all" className="gap-2">
                  <Grid3x3 className="w-4 h-4" />
                  Tümü
                </TabsTrigger>
                <TabsTrigger value="trending" className="gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Trend
                </TabsTrigger>
                <TabsTrigger value="popular" className="gap-2">
                  <Heart className="w-4 h-4" />
                  Popüler
                </TabsTrigger>
                <TabsTrigger value="new" className="gap-2">
                  <Clock className="w-4 h-4" />
                  Yeni
                </TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-2">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sırala" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">En Popüler</SelectItem>
                    <SelectItem value="newest">En Yeni</SelectItem>
                    <SelectItem value="likes">En Çok Beğenilen</SelectItem>
                    <SelectItem value="views">En Çok Görüntülenen</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex border rounded-md">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="icon"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid3x3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="icon"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>

                <Button
                  variant={showFilters ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setShowFilters(!showFilters)}
                  className="relative"
                >
                  <Filter className="w-4 h-4" />
                  {hasActiveFilters && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full" />
                  )}
                </Button>
              </div>
            </div>
          </Tabs>
        </div>

        {/* Search & Filters Panel */}
        {showFilters && (
          <Card className="mb-6 border-2 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filtreler
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowFilters(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Search */}
              <div>
                <label className="text-sm font-medium mb-2 block">Arama</label>
                <form onSubmit={handleSearch} className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Plan, kullanıcı veya etiket ara..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button type="submit">Ara</Button>
                </form>
              </div>

              {/* Difficulty Filters */}
              <div>
                <label className="text-sm font-medium mb-2 block">Zorluk Seviyesi</label>
                <div className="flex gap-2 flex-wrap">
                  <Badge
                    variant={!difficulty ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary/90 transition-colors"
                    onClick={() => setDifficulty(null)}
                  >
                    Tümü
                  </Badge>
                  <Badge
                    variant={difficulty === 'easy' ? "default" : "outline"}
                    className="cursor-pointer hover:bg-green-600 transition-colors bg-green-500"
                    onClick={() => handleDifficultyFilter('easy')}
                  >
                    🟢 Kolay
                  </Badge>
                  <Badge
                    variant={difficulty === 'medium' ? "default" : "outline"}
                    className="cursor-pointer hover:bg-yellow-600 transition-colors bg-yellow-500"
                    onClick={() => handleDifficultyFilter('medium')}
                  >
                    🟡 Orta
                  </Badge>
                  <Badge
                    variant={difficulty === 'hard' ? "default" : "outline"}
                    className="cursor-pointer hover:bg-red-600 transition-colors bg-red-500"
                    onClick={() => handleDifficultyFilter('hard')}
                  >
                    🔴 Zor
                  </Badge>
                </div>
              </div>

              {/* Duration Filters */}
              <div>
                <label className="text-sm font-medium mb-2 block">Plan Süresi</label>
                <div className="flex gap-2 flex-wrap">
                  <Badge
                    variant={!durationRange ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary/90 transition-colors"
                    onClick={() => setDurationRange(null)}
                  >
                    Tümü
                  </Badge>
                  <Badge
                    variant={durationRange === 'short' ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary/90 transition-colors"
                    onClick={() => handleDurationFilter('short')}
                  >
                    ⚡ Kısa (1-7 gün)
                  </Badge>
                  <Badge
                    variant={durationRange === 'medium' ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary/90 transition-colors"
                    onClick={() => handleDurationFilter('medium')}
                  >
                    📅 Orta (8-30 gün)
                  </Badge>
                  <Badge
                    variant={durationRange === 'long' ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary/90 transition-colors"
                    onClick={() => handleDurationFilter('long')}
                  >
                    🎯 Uzun (31+ gün)
                  </Badge>
                </div>
              </div>

              {/* Active Filters Summary */}
              {hasActiveFilters && (
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium">Aktif Filtreler</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearAllFilters}
                      className="h-8"
                    >
                      <X className="w-3 h-3 mr-1" />
                      Tümünü Temizle
                    </Button>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {searchQuery && (
                      <Badge variant="secondary" className="gap-1">
                        🔍 {searchQuery}
                        <X
                          className="w-3 h-3 cursor-pointer hover:text-destructive"
                          onClick={() => setSearchQuery('')}
                        />
                      </Badge>
                    )}
                    {difficulty && (
                      <Badge variant="secondary" className="gap-1">
                        {difficultyLabels[difficulty as keyof typeof difficultyLabels]}
                        <X
                          className="w-3 h-3 cursor-pointer hover:text-destructive"
                          onClick={() => setDifficulty(null)}
                        />
                      </Badge>
                    )}
                    {durationRange && (
                      <Badge variant="secondary" className="gap-1">
                        {durationRange === 'short' ? '⚡ Kısa' : durationRange === 'medium' ? '📅 Orta' : '🎯 Uzun'}
                        <X
                          className="w-3 h-3 cursor-pointer hover:text-destructive"
                          onClick={() => setDurationRange(null)}
                        />
                      </Badge>
                    )}
                    {selectedTag && (
                      <Badge variant="secondary" className="gap-1">
                        #{selectedTag}
                        <X
                          className="w-3 h-3 cursor-pointer hover:text-destructive"
                          onClick={() => setSelectedTag(null)}
                        />
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Plans Grid/List */}
        {loading && page === 1 ? (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : plans.length > 0 ? (
          <>
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {plans.map((plan) => (
                <Card 
                  key={plan.id} 
                  className={`group hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border-2 hover:border-primary/50 ${
                    viewMode === 'list' ? 'flex flex-row' : ''
                  }`}
                >
                  {viewMode === 'grid' ? (
                    <>
                      <CardHeader className="space-y-3">
                        <div className="flex items-start justify-between">
                          <Link href={`/profil/${plan.author.username}`} className="flex items-center gap-3 group/author">
                            <div className="relative">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center ring-2 ring-primary/10 group-hover/author:ring-primary/30 transition-all">
                                {plan.author.image ? (
                                  <img 
                                    src={plan.author.image} 
                                    alt={plan.author.name || ''} 
                                    className="w-full h-full rounded-full object-cover" 
                                  />
                                ) : (
                                  <span className="text-xl">👤</span>
                                )}
                              </div>
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold group-hover/author:text-primary transition-colors truncate">
                                @{plan.author.username || 'kullanici'}
                              </p>
                              <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatDistanceToNow(new Date(plan.createdAt), { addSuffix: true, locale: tr })}
                              </p>
                            </div>
                          </Link>
                          <Badge 
                            variant="secondary"
                            className={`${
                              plan.difficulty === 'easy' ? 'bg-green-100 text-green-700 hover:bg-green-200' :
                              plan.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' :
                              'bg-red-100 text-red-700 hover:bg-red-200'
                            } font-medium`}
                          >
                            {difficultyLabels[plan.difficulty]}
                          </Badge>
                        </div>
                        
                        <div>
                          <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors line-clamp-2">
                            {plan.title}
                          </CardTitle>
                          <CardDescription className="line-clamp-2 text-sm">
                            {plan.description || 'Açıklama bulunmuyor'}
                          </CardDescription>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            <span className="font-medium">{plan.duration} gün</span>
                          </div>
                          {plan.targetWeightLoss && (
                            <div className="flex items-center gap-1.5 text-primary font-medium">
                              <span>🎯</span>
                              <span>{plan.targetWeightLoss}kg hedef</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Tags */}
                        {plan.tags && Array.isArray(plan.tags) && plan.tags.length > 0 && (
                          <div className="flex gap-1.5 flex-wrap">
                            {plan.tags.slice(0, 3).map((tag) => (
                              <Badge
                                key={tag}
                                variant="outline"
                                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors text-xs"
                                onClick={() => setSelectedTag(tag)}
                              >
                                #{tag}
                              </Badge>
                            ))}
                            {plan.tags.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{plan.tags.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between pt-3 border-t">
                          <div className="flex gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1.5 hover:text-red-500 transition-colors cursor-pointer">
                              <Heart className="w-4 h-4" />
                              <span className="font-medium">{plan.likesCount}</span>
                            </div>
                            <div className="flex items-center gap-1.5 hover:text-blue-500 transition-colors cursor-pointer">
                              <MessageCircle className="w-4 h-4" />
                              <span className="font-medium">{plan.commentsCount}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Eye className="w-4 h-4" />
                              <span className="font-medium">{plan.views}</span>
                            </div>
                          </div>
                        </div>
                        
                        <Button asChild className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all" variant="outline">
                          <Link href={`/plan/${plan.slug}`}>
                            Planı İncele
                            <TrendingUp className="w-4 h-4 ml-2" />
                          </Link>
                        </Button>
                      </CardContent>
                    </>
                  ) : (
                    // List View
                    <>
                      <div className="flex-1">
                        <CardHeader>
                          <div className="flex items-start justify-between mb-3">
                            <Link href={`/profil/${plan.author.username}`} className="flex items-center gap-2">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                {plan.author.image ? (
                                  <img src={plan.author.image} alt={plan.author.name || ''} className="w-full h-full rounded-full object-cover" />
                                ) : (
                                  '👤'
                                )}
                              </div>
                              <div>
                                <p className="text-sm font-medium">@{plan.author.username || 'kullanici'}</p>
                                <p className="text-xs text-muted-foreground">
                                  {formatDistanceToNow(new Date(plan.createdAt), { addSuffix: true, locale: tr })}
                                </p>
                              </div>
                            </Link>
                            <Badge variant="secondary" className={difficultyColors[plan.difficulty]}>
                              {difficultyLabels[plan.difficulty]}
                            </Badge>
                          </div>
                          <CardTitle className="text-lg mb-1">{plan.title}</CardTitle>
                          <CardDescription className="line-clamp-1">{plan.description}</CardDescription>
                        </CardHeader>
                      </div>
                      <CardContent className="flex items-center gap-4">
                        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                          <span>⏱️ {plan.duration} gün</span>
                          <div className="flex gap-3">
                            <span>❤️ {plan.likesCount}</span>
                            <span>💬 {plan.commentsCount}</span>
                          </div>
                        </div>
                        <Button asChild variant="outline">
                          <Link href={`/plan/${plan.slug}`}>Gör</Link>
                        </Button>
                      </CardContent>
                    </>
                  )}
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

      <FooterClient />
    </div>
  )
}
