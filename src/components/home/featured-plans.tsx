'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Heart, 
  MessageCircle, 
  TrendingUp, 
  Clock, 
  Flame,
  ArrowRight,
  Star,
  Users,
  Calendar
} from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

interface Plan {
  id: string
  title: string
  slug: string
  description: string
  duration: number
  difficulty: string
  caloriesPerDay: number
  mealsPerDay: number
  author: {
    name: string | null
    username: string
    image: string | null
  }
  _count?: {
    likes?: number
    comments?: number
  }
  likesCount?: number
  commentsCount?: number
  createdAt: string
}

export function FeaturedPlans() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPlans() {
      try {
        const response = await fetch('/api/plans/explore?limit=3&sort=popular')
        if (response.ok) {
          const data = await response.json()
          console.log('API Response:', data) // Debug
          
          // API'den gelen veriyi normalize et
          const normalizedPlans = (data.plans || []).map((plan: any) => ({
            ...plan,
            _count: plan._count || { likes: 0, comments: 0 },
            likesCount: plan.likesCount || plan._count?.likes || 0,
            commentsCount: plan.commentsCount || plan._count?.comments || 0
          }))
          
          setPlans(normalizedPlans)
        }
      } catch (error) {
        console.error('Planlar yüklenemedi:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPlans()
  }, [])

  if (loading) {
    return (
      <section className="py-12 md:py-20 bg-gradient-to-b from-white via-purple-50/30 to-white dark:from-slate-950 dark:via-purple-950/10 dark:to-slate-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <Skeleton className="h-8 w-48 mx-auto mb-4" />
            <Skeleton className="h-12 w-96 mx-auto mb-2" />
            <Skeleton className="h-6 w-64 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-7xl mx-auto">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4 md:p-6">
                  <Skeleton className="h-48 w-full mb-4" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (plans.length === 0) {
    return null
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'kolay':
      case 'easy':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
      case 'orta':
      case 'medium':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
      case 'zor':
      case 'hard':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300'
    }
  }

  const translateDifficulty = (difficulty: string) => {
    const translations: { [key: string]: string } = {
      'easy': 'Kolay',
      'medium': 'Orta',
      'hard': 'Zor',
      'kolay': 'Kolay',
      'orta': 'Orta',
      'zor': 'Zor'
    }
    return translations[difficulty.toLowerCase()] || difficulty
  }

  return (
    <section className="py-12 md:py-20 bg-gradient-to-b from-white via-purple-50/30 to-white dark:from-slate-950 dark:via-purple-950/10 dark:to-slate-950 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-64 h-64 bg-purple-300/10 dark:bg-purple-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-pink-300/10 dark:bg-pink-600/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Badge className="mb-3 md:mb-4 px-3 md:px-4 py-1.5 md:py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 text-xs md:text-sm">
            <TrendingUp className="w-3 h-3 md:w-4 md:h-4 mr-1.5 md:mr-2" />
            Popüler Planlar
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-3 md:mb-4 px-4">
            <span className="bg-gradient-to-r from-purple-700 via-pink-700 to-orange-700 dark:from-purple-300 dark:via-pink-300 dark:to-orange-300 bg-clip-text text-transparent drop-shadow-sm">
              Gerçek İnsanlar, Gerçek Sonuçlar
            </span>{' '}
            <span className="text-4xl md:text-5xl lg:text-6xl">🎯</span>
          </h2>
          <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 font-medium max-w-2xl mx-auto px-4">
            Binlerce kullanıcının başarıyla uyguladığı planları keşfet. 
            <span className="hidden md:inline"> Hemen şimdi sen de başla!</span>
          </p>
        </div>

        {/* Plans Grid - Mobile Optimized */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-7xl mx-auto mb-8 md:mb-12">
          {plans.map((plan, index) => (
            <Card 
              key={plan.id} 
              className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-2 overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-4 md:p-6">
                {/* Author Info - Mobile Optimized */}
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="w-10 h-10 md:w-12 md:h-12 ring-2 ring-purple-200 dark:ring-purple-800">
                    <AvatarImage src={plan.author.image || undefined} />
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-sm md:text-base">
                      {plan.author.name?.[0] || plan.author.username[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm md:text-base truncate">
                      {plan.author.name || plan.author.username}
                    </p>
                    <p className="text-xs md:text-sm text-muted-foreground truncate">
                      @{plan.author.username}
                    </p>
                  </div>
                  <Badge variant="outline" className={`${getDifficultyColor(plan.difficulty)} text-xs shrink-0`}>
                    {translateDifficulty(plan.difficulty)}
                  </Badge>
                </div>

                {/* Plan Title - Mobile Optimized */}
                <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3 line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  {plan.title}
                </h3>

                {/* Description - Mobile Optimized */}
                <p className="text-sm md:text-base text-muted-foreground mb-4 line-clamp-2">
                  {plan.description}
                </p>

                {/* Stats Grid - Mobile Optimized */}
                <div className="grid grid-cols-2 gap-2 md:gap-3 mb-4 p-3 md:p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-xl">
                  <div className="flex items-center gap-1.5 md:gap-2">
                    <Flame className="w-4 h-4 md:w-5 md:h-5 text-orange-500 shrink-0" />
                    <div>
                      <p className="text-xs md:text-sm font-bold">{plan.caloriesPerDay}</p>
                      <p className="text-xs text-muted-foreground">kcal/gün</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 md:gap-2">
                    <Clock className="w-4 h-4 md:w-5 md:h-5 text-blue-500 shrink-0" />
                    <div>
                      <p className="text-xs md:text-sm font-bold">{plan.mealsPerDay}</p>
                      <p className="text-xs text-muted-foreground">öğün</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 md:gap-2">
                    <Calendar className="w-4 h-4 md:w-5 md:h-5 text-green-500 shrink-0" />
                    <div>
                      <p className="text-xs md:text-sm font-bold">{plan.duration}</p>
                      <p className="text-xs text-muted-foreground">gün</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 md:gap-2">
                    <Star className="w-4 h-4 md:w-5 md:h-5 text-yellow-500 shrink-0" />
                    <div>
                      <p className="text-xs md:text-sm font-bold">4.8</p>
                      <p className="text-xs text-muted-foreground">puan</p>
                    </div>
                  </div>
                </div>

                {/* Engagement - Mobile Optimized */}
                <div className="flex items-center justify-between mb-4 text-xs md:text-sm text-muted-foreground">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 md:w-4 md:h-4 text-pink-500" />
                      <span className="font-semibold">{plan._count?.likes || plan.likesCount || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-500" />
                      <span className="font-semibold">{plan._count?.comments || plan.commentsCount || 0}</span>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    <Users className="w-3 h-3 mr-1" />
                    Popüler
                  </Badge>
                </div>

                {/* CTA Button - Mobile Optimized */}
                <Button 
                  asChild 
                  className="w-full h-10 md:h-11 text-sm md:text-base font-bold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all group"
                >
                  <Link href={`/plan/${plan.slug}`}>
                    Planı İncele
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA - Mobile Optimized */}
        <div className="text-center animate-in fade-in slide-in-from-bottom-12 duration-700 delay-300">
          <p className="text-sm md:text-base text-muted-foreground mb-4 px-4">
            <span className="font-semibold text-purple-600 dark:text-purple-400">2,500+</span> aktif plan arasından senin için en uygun olanı bul!
          </p>
          <Button 
            asChild 
            size="lg" 
            variant="outline" 
            className="h-12 md:h-14 px-6 md:px-8 text-sm md:text-base font-bold border-2 hover:bg-purple-50 dark:hover:bg-purple-950/20 group"
          >
            <Link href="/kesfet">
              Tüm Planları Keşfet
              <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
