'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'
import { motion } from 'framer-motion'

type Plan = {
  id: string
  slug: string
  title: string
  description: string
  duration: number
  targetWeightLoss: number | null
  difficulty: 'easy' | 'medium' | 'hard'
  likesCount: number
  commentsCount: number
  views: number
  averageRating: number
  ratingCount: number
  publishedAt: Date | null
  createdAt: Date
  author: {
    id: string
    name: string | null
    username: string | null
    image: string | null
  }
}

interface FavoritesClientProps {
  savedPlans: Plan[]
  likedPlans: Plan[]
  savedPlanIds: string[]
}

export function FavoritesClient({ savedPlans, likedPlans, savedPlanIds }: FavoritesClientProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'saved' | 'liked'>('all')

  // Combine and deduplicate
  const allPlans = [...savedPlans]
  likedPlans.forEach(plan => {
    if (!allPlans.find(p => p.id === plan.id)) {
      allPlans.push(plan)
    }
  })

  const displayPlans = 
    activeTab === 'all' ? allPlans :
    activeTab === 'saved' ? savedPlans :
    likedPlans

  return (
    <>
      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'all'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          Tümü ({allPlans.length})
        </button>
        <button
          onClick={() => setActiveTab('saved')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'saved'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          ⭐ Kaydedilenler ({savedPlans.length})
        </button>
        <button
          onClick={() => setActiveTab('liked')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'liked'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          ❤️ Beğenilenler ({likedPlans.length})
        </button>
      </div>

      {/* Plans List */}
      {displayPlans.length > 0 ? (
        <div className="space-y-4">
          {displayPlans.map((plan, index) => {
            const isSaved = savedPlanIds.includes(plan.id)
            const isLiked = likedPlans.some(p => p.id === plan.id)
            
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <Link
                            href={`/profil/${plan.author.username}`}
                            className="flex items-center gap-2 hover:underline"
                          >
                            {plan.author.image && (
                              <img
                                src={plan.author.image}
                                alt={plan.author.name || ''}
                                className="w-6 h-6 rounded-full"
                              />
                            )}
                            <span className="text-sm text-muted-foreground">
                              {plan.author.name || plan.author.username}
                            </span>
                          </Link>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(plan.publishedAt || plan.createdAt), {
                              addSuffix: true,
                              locale: tr,
                            })}
                          </span>
                          {/* Badges */}
                          {isSaved && (
                            <span className="text-xs bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 px-2 py-0.5 rounded-full font-medium">
                              ⭐ Kaydedildi
                            </span>
                          )}
                          {isLiked && (
                            <span className="text-xs bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300 px-2 py-0.5 rounded-full font-medium">
                              ❤️ Beğenildi
                            </span>
                          )}
                        </div>
                        <CardTitle className="text-xl mb-2">
                          <Link href={`/plan/${plan.slug}`} className="hover:underline">
                            {plan.title}
                          </Link>
                        </CardTitle>
                        <CardDescription className="line-clamp-2">
                          {plan.description}
                        </CardDescription>
                      </div>
                      <Button variant="outline" size="sm" asChild className="flex-shrink-0">
                        <Link href={`/plan/${plan.slug}`}>Görüntüle</Link>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground flex-wrap">
                      <span>⏱️ {plan.duration} gün</span>
                      {plan.targetWeightLoss && (
                        <span>🎯 {plan.targetWeightLoss}kg hedef</span>
                      )}
                      <span>
                        {plan.difficulty === 'easy' && '🟢 Kolay'}
                        {plan.difficulty === 'medium' && '🟡 Orta'}
                        {plan.difficulty === 'hard' && '🔴 Zor'}
                      </span>
                      <span>❤️ {plan.likesCount} beğeni</span>
                      <span>💬 {plan.commentsCount} yorum</span>
                      <span>👁️ {plan.views} görüntülenme</span>
                      {plan.averageRating > 0 && (
                        <span>⭐ {plan.averageRating.toFixed(1)} ({plan.ratingCount})</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="text-6xl mb-4">
              {activeTab === 'saved' ? '⭐' : activeTab === 'liked' ? '❤️' : '📋'}
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {activeTab === 'saved' && 'Henüz kayıtlı plan yok'}
              {activeTab === 'liked' && 'Henüz beğenilen plan yok'}
              {activeTab === 'all' && 'Henüz favori yok'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {activeTab === 'saved' && 'Planları kaydet, kolayca ulaş!'}
              {activeTab === 'liked' && 'Beğendiğin planları buradan takip et!'}
              {activeTab === 'all' && 'Beğendiğin ve kaydettiğin planlar burada görünecek!'}
            </p>
            <Button asChild>
              <Link href="/kesfet">Planları Keşfet</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </>
  )
}
