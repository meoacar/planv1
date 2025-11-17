'use client'

import { useState, useMemo } from 'react'
import { Badge, Trophy, Star, Award, Lock, Search, Filter, Sparkles } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface BadgeWithStatus {
  id: string
  name: string
  description: string
  icon: string
  category: string
  rarity: string
  xpReward: number
  coinReward: number
  earned: boolean
  earnedAt: Date | null
}

interface BadgesClientProps {
  badges: BadgeWithStatus[]
  user: {
    level: number
    xp: number
    coins: number
  } | null
  earnedCount: number
}

const categoryIcons: Record<string, any> = {
  achievement: Trophy,
  milestone: Star,
  social: Badge,
  special: Award,
}

const categoryNames: Record<string, string> = {
  achievement: 'Başarılar',
  milestone: 'Kilometre Taşları',
  social: 'Sosyal',
  special: 'Özel',
}

const rarityColors: Record<string, string> = {
  common: 'from-gray-400 to-gray-600',
  rare: 'from-blue-400 to-blue-600',
  epic: 'from-purple-400 to-purple-600',
  legendary: 'from-yellow-400 to-yellow-600',
}

const rarityNames: Record<string, string> = {
  common: 'Yaygın',
  rare: 'Nadir',
  epic: 'Epik',
  legendary: 'Efsanevi',
}

export function BadgesClient({ badges, user, earnedCount }: BadgesClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'earned' | 'locked'>('all')
  const [filterCategory, setFilterCategory] = useState<string>('all')

  const totalBadges = badges.length
  const progress = (earnedCount / totalBadges) * 100

  // Filtreleme
  const filteredBadges = useMemo(() => {
    return badges.filter((badge) => {
      // Arama filtresi
      if (searchQuery && !badge.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !badge.description.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }

      // Durum filtresi
      if (filterStatus === 'earned' && !badge.earned) return false
      if (filterStatus === 'locked' && badge.earned) return false

      // Kategori filtresi
      if (filterCategory !== 'all' && badge.category !== filterCategory) return false

      return true
    })
  }, [badges, searchQuery, filterStatus, filterCategory])

  // Kategoriye göre grupla
  const badgesByCategory = filteredBadges.reduce((acc, badge) => {
    if (!acc[badge.category]) {
      acc[badge.category] = []
    }
    acc[badge.category].push(badge)
    return acc
  }, {} as Record<string, typeof filteredBadges>)

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Hero Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 mb-4 shadow-lg">
          <Trophy className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
          Rozetler
        </h1>
        <p className="text-muted-foreground text-lg">
          Başarılarını kutla ve yeni rozetler kazan!
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Seviye</p>
                <p className="text-3xl font-bold">{user?.level || 0}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Star className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Toplam XP</p>
                <p className="text-3xl font-bold">{user?.xp || 0}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900 border-yellow-200 dark:border-yellow-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Coin</p>
                <p className="text-3xl font-bold">{user?.coins || 0}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
                <span className="text-2xl">🪙</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Rozetler</p>
                <p className="text-3xl font-bold">{earnedCount}/{totalBadges}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Card */}
      <Card className="mb-8 overflow-hidden">
        <div className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 h-2" />
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Koleksiyon İlerlemesi</span>
            <span className="text-2xl font-bold">{Math.round(progress)}%</span>
          </CardTitle>
          <CardDescription>
            {earnedCount} rozet kazandın, {totalBadges - earnedCount} rozet daha kazanabilirsin!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={progress} className="h-3" />
        </CardContent>
      </Card>

      {/* Filters */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rozet ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <Tabs value={filterStatus} onValueChange={(v) => setFilterStatus(v as any)} className="w-full md:w-auto">
              <TabsList className="grid w-full md:w-auto grid-cols-3">
                <TabsTrigger value="all">Tümü</TabsTrigger>
                <TabsTrigger value="earned">Kazanılan</TabsTrigger>
                <TabsTrigger value="locked">Kilitli</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Category Filter */}
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Kategoriler</SelectItem>
                <SelectItem value="achievement">Başarılar</SelectItem>
                <SelectItem value="milestone">Kilometre Taşları</SelectItem>
                <SelectItem value="social">Sosyal</SelectItem>
                <SelectItem value="special">Özel</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      {searchQuery && (
        <div className="mb-4 text-sm text-muted-foreground">
          {filteredBadges.length} rozet bulundu
        </div>
      )}

      {/* Badges by Category */}
      {Object.keys(badgesByCategory).length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-lg text-muted-foreground">Rozet bulunamadı</p>
            <p className="text-sm text-muted-foreground mt-2">
              Farklı filtreler deneyin
            </p>
          </CardContent>
        </Card>
      ) : (
        Object.entries(badgesByCategory).map(([category, categoryBadges]) => {
          const Icon = categoryIcons[category] || Badge
          const earnedInCategory = categoryBadges.filter((b) => b.earned).length
          
          return (
            <div key={category} className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{categoryNames[category] || category}</h2>
                  <p className="text-sm text-muted-foreground">
                    {earnedInCategory}/{categoryBadges.length} kazanıldı
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {categoryBadges.map((badge) => (
                  <Card
                    key={badge.id}
                    className={`group relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer ${
                      badge.earned
                        ? 'border-primary bg-gradient-to-br from-primary/5 to-primary/10'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    {/* Rarity Indicator */}
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${rarityColors[badge.rarity]}`} />
                    
                    <CardContent className="p-4">
                      {!badge.earned && (
                        <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                          <Lock className="w-4 h-4 text-muted-foreground" />
                        </div>
                      )}
                      
                      <div className="text-center">
                        {/* Icon */}
                        <div className={`text-5xl mb-3 transition-transform duration-300 group-hover:scale-110 ${
                          !badge.earned && 'grayscale'
                        }`}>
                          {badge.icon}
                        </div>
                        
                        {/* Name */}
                        <h3 className="font-bold mb-1 text-sm line-clamp-1">
                          {badge.name}
                        </h3>
                        
                        {/* Rarity */}
                        <div className={`text-xs font-medium mb-2 bg-gradient-to-r ${rarityColors[badge.rarity]} bg-clip-text text-transparent`}>
                          {rarityNames[badge.rarity]}
                        </div>
                        
                        {/* Description */}
                        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                          {badge.description}
                        </p>
                        
                        {/* Earned Date or Rewards */}
                        {badge.earned && badge.earnedAt ? (
                          <div className="flex items-center justify-center gap-1 text-xs text-primary font-medium">
                            <Trophy className="w-3 h-3" />
                            {new Date(badge.earnedAt).toLocaleDateString('tr-TR', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground">
                            {badge.xpReward > 0 && (
                              <span className="flex items-center gap-1">
                                <Sparkles className="w-3 h-3" />
                                +{badge.xpReward} XP
                              </span>
                            )}
                            {badge.coinReward > 0 && (
                              <span className="flex items-center gap-1">
                                🪙 +{badge.coinReward}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}
