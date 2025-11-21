'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Sparkles, Users, Shield, Target, ArrowRight } from 'lucide-react'

interface Recommendation {
  plans: any[]
  groups: any[]
  guild: any
}

export default function OnboardingResults() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [recommendations, setRecommendations] = useState<Recommendation | null>(null)

  useEffect(() => {
    fetchRecommendations()
  }, [])

  const fetchRecommendations = async () => {
    try {
      const response = await fetch('/api/onboarding/recommendations')
      if (response.ok) {
        const data = await response.json()
        setRecommendations(data)
      }
    } catch (error) {
      console.error('Failed to fetch recommendations:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <Skeleton className="h-12 w-64 mx-auto mb-4" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>
        <div className="grid gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full mb-4">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <span className="font-semibold text-purple-600 dark:text-purple-400">
            Hazır!
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
          Senin İçin Hazırladık! 🎉
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Hedeflerine göre özel olarak seçilmiş planlar, gruplar ve lonca önerileri
        </p>
      </div>

      <div className="space-y-6">
        {/* Recommended Plans */}
        <Card className="overflow-hidden border-2 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
            <div className="flex items-center gap-3">
              <Target className="w-6 h-6" />
              <div>
                <h2 className="text-2xl font-bold">Önerilen Planlar</h2>
                <p className="text-purple-100">Hedefine uygun başarı hikayeleri</p>
              </div>
            </div>
          </div>
          <CardContent className="p-6">
            {recommendations?.plans && recommendations.plans.length > 0 ? (
              <div className="grid gap-4">
                {recommendations.plans.slice(0, 3).map((plan: any) => (
                  <Link
                    key={plan.id}
                    href={`/plan/${plan.slug}`}
                    className="p-4 rounded-xl border-2 hover:border-purple-600 transition-all hover:shadow-lg group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg group-hover:text-purple-600 transition-colors">
                          {plan.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                          {plan.description}
                        </p>
                        <div className="flex items-center gap-3 mt-3">
                          <Badge variant="secondary">{plan.duration} gün</Badge>
                          <Badge variant="secondary">❤️ {plan.likesCount}</Badge>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>Henüz plan önerisi yok</p>
                <Button asChild className="mt-4" variant="outline">
                  <Link href="/kesfet">Planları Keşfet</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recommended Groups */}
        <Card className="overflow-hidden border-2 animate-in fade-in slide-in-from-bottom-12 duration-700 delay-100">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6 text-white">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6" />
              <div>
                <h2 className="text-2xl font-bold">Önerilen Gruplar</h2>
                <p className="text-blue-100">Benzer hedefleri olan kişilerle tanış</p>
              </div>
            </div>
          </div>
          <CardContent className="p-6">
            {recommendations?.groups && recommendations.groups.length > 0 ? (
              <div className="grid gap-4">
                {recommendations.groups.slice(0, 2).map((group: any) => (
                  <Link
                    key={group.id}
                    href={`/gruplar/${group.slug}`}
                    className="p-4 rounded-xl border-2 hover:border-blue-600 transition-all hover:shadow-lg group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg group-hover:text-blue-600 transition-colors">
                          {group.name}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                          {group.description}
                        </p>
                        <div className="flex items-center gap-3 mt-3">
                          <Badge variant="secondary">👥 {group.memberCount} üye</Badge>
                          <Badge variant="secondary">📝 {group.postCount} gönderi</Badge>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>Henüz grup önerisi yok</p>
                <Button asChild className="mt-4" variant="outline">
                  <Link href="/gruplar">Grupları Keşfet</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recommended Guild */}
        {recommendations?.guild && (
          <Card className="overflow-hidden border-2 animate-in fade-in slide-in-from-bottom-16 duration-700 delay-200">
            <div className="bg-gradient-to-r from-orange-600 to-red-600 p-6 text-white">
              <div className="flex items-center gap-3">
                <Shield className="w-6 h-6" />
                <div>
                  <h2 className="text-2xl font-bold">Önerilen Lonca</h2>
                  <p className="text-orange-100">Güçlü bir topluluğa katıl</p>
                </div>
              </div>
            </div>
            <CardContent className="p-6">
              <Link
                href={`/lonca/${recommendations.guild.slug}`}
                className="p-4 rounded-xl border-2 hover:border-orange-600 transition-all hover:shadow-lg group block"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg group-hover:text-orange-600 transition-colors">
                      {recommendations.guild.name}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {recommendations.guild.description}
                    </p>
                    <div className="flex items-center gap-3 mt-3">
                      <Badge variant="secondary">👥 {recommendations.guild.memberCount} üye</Badge>
                      <Badge variant="secondary">⭐ Level {recommendations.guild.level}</Badge>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-orange-600 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>

      {/* CTA */}
      <div className="text-center mt-12 animate-in fade-in slide-in-from-bottom-20 duration-700 delay-300">
        <Button
          onClick={() => router.push('/dashboard')}
          size="lg"
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg px-8 py-6 h-auto"
        >
          Hadi Başlayalım! 🚀
        </Button>
        <p className="text-sm text-muted-foreground mt-4">
          Dashboard'a giderek yolculuğuna başlayabilirsin
        </p>
      </div>
    </div>
  )
}
