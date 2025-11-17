'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  CheckCircle2, 
  Circle, 
  Gift, 
  Loader2, 
  Sparkles, 
  Trophy,
  Target,
  Zap,
  Clock,
  TrendingUp
} from 'lucide-react'
import { toast } from 'sonner'

interface Quest {
  id: string
  key: string
  title: string
  description: string
  icon: string
  xpReward: number
  coinReward: number
  type: string
  target: number
  userProgress: {
    progress: number
    completed: boolean
    completedAt: string | null
  } | null
}

interface QuestsClientProps {
  initialQuests: Quest[]
}

export function QuestsClient({ initialQuests }: QuestsClientProps) {
  const [quests, setQuests] = useState<Quest[]>(initialQuests)
  const [claiming, setClaiming] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')

  const fetchQuests = async () => {
    try {
      const res = await fetch('/api/v1/quests')
      if (!res.ok) throw new Error('Failed to fetch quests')
      const data = await res.json()
      setQuests(data.data)
    } catch (error) {
      toast.error('Görevler yüklenemedi')
    }
  }

  const claimQuest = async (questId: string) => {
    setClaiming(questId)
    try {
      const res = await fetch('/api/v1/quests/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questId }),
      })

      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.error?.message || 'Failed to claim quest')
      }

      const xpReward = result.data?.xpReward || 0
      const coinReward = result.data?.coinReward || 0

      toast.success(`Görev ödülü alındı! 🎉 +${xpReward} XP, +${coinReward} Coin`)
      
      await fetchQuests()
      
      // Trigger navbar refresh
      window.dispatchEvent(new Event('quest-claimed'))
      localStorage.setItem('quest-claimed', Date.now().toString())
      
      // Also reload to ensure everything is fresh
      setTimeout(() => window.location.reload(), 1000)
    } catch (error: any) {
      toast.error(error.message || 'Ödül alınamadı')
    } finally {
      setClaiming(null)
    }
  }

  const resetQuests = async () => {
    try {
      const res = await fetch('/api/v1/quests/reset', {
        method: 'POST',
      })

      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.error?.message || 'Failed to reset quests')
      }

      toast.success('Görevler sıfırlandı! 🔄')
      await fetchQuests()
    } catch (error: any) {
      toast.error(error.message || 'Sıfırlama başarısız')
    }
  }



  const completedQuests = quests.filter((q) => !!q.userProgress?.completedAt)
  const activeQuests = quests.filter((q) => !q.userProgress?.completedAt)
  const claimableQuests = quests.filter(
    (q) => (q.userProgress?.progress || 0) >= q.target && q.userProgress?.completed && !q.userProgress?.completedAt
  )

  const filteredQuests = 
    filter === 'all' ? quests :
    filter === 'active' ? activeQuests :
    completedQuests

  const totalXP = quests.reduce((sum, q) => sum + q.xpReward, 0)
  const earnedXP = completedQuests.reduce((sum, q) => sum + q.xpReward, 0)
  const totalCoins = quests.reduce((sum, q) => sum + q.coinReward, 0)
  const earnedCoins = completedQuests.reduce((sum, q) => sum + q.coinReward, 0)

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Hero Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 mb-4 shadow-lg">
          <Target className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Günlük Görevler
        </h1>
        <p className="text-muted-foreground text-lg">
          Görevleri tamamla, XP ve coin kazan!
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Tamamlanan</p>
                <p className="text-3xl font-bold">{completedQuests.length}/{quests.length}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900 border-yellow-200 dark:border-yellow-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Ödül Alınabilir</p>
                <p className="text-3xl font-bold">{claimableQuests.length}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
                <Gift className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">XP Kazanıldı</p>
                <p className="text-3xl font-bold">{earnedXP}/{totalXP}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Coin Kazanıldı</p>
                <p className="text-3xl font-bold">{earnedCoins}/{totalCoins}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center">
                <span className="text-2xl">🪙</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Card */}
      <Card className="mb-8 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-2" />
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Bugünün İlerlemesi</span>
            <span className="text-2xl font-bold">
              {Math.round((completedQuests.length / quests.length) * 100)}%
            </span>
          </CardTitle>
          <CardDescription>
            {completedQuests.length === quests.length
              ? '🎉 Tüm görevleri tamamladın! Harikasın!'
              : `${quests.length - completedQuests.length} görev daha tamamlayabilirsin`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={(completedQuests.length / quests.length) * 100} className="h-3" />
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <Tabs value={filter} onValueChange={(v) => setFilter(v as any)}>
          <TabsList className="grid w-full md:w-auto grid-cols-3">
            <TabsTrigger value="all">
              Tümü ({quests.length})
            </TabsTrigger>
            <TabsTrigger value="active">
              Aktif ({activeQuests.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Tamamlanan ({completedQuests.length})
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        {claimableQuests.length > 0 && (
          <Badge variant="default" className="gap-2 px-4 py-2 text-base animate-pulse bg-green-500 hover:bg-green-600">
            <Gift className="w-4 h-4" />
            {claimableQuests.length} Ödül Alınabilir
          </Badge>
        )}

        {/* Reset Button (Development Only) */}
        {process.env.NODE_ENV === 'development' && (
          <Button
            onClick={resetQuests}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            🔄 Sıfırla
          </Button>
        )}
      </div>

      {/* Quests Grid */}
      {filteredQuests.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredQuests.map((quest) => {
            const progress = quest.userProgress?.progress || 0
            const percentage = (progress / quest.target) * 100
            const canClaim = progress >= quest.target && quest.userProgress?.completed && !quest.userProgress?.completedAt
            const isCompleted = !!quest.userProgress?.completedAt

            return (
              <Card
                key={quest.id}
                className={`group relative overflow-hidden transition-all duration-300 hover:shadow-xl ${
                  isCompleted
                    ? 'opacity-70 bg-muted/50'
                    : canClaim
                    ? 'border-green-500 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900'
                    : 'hover:scale-[1.02]'
                }`}
              >
                {/* Status Indicator */}
                {canClaim && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-emerald-500 animate-pulse" />
                )}
                {isCompleted && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gray-400 to-gray-600" />
                )}

                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div
                      className={`text-5xl transition-transform duration-300 group-hover:scale-110 ${
                        isCompleted && 'grayscale'
                      }`}
                    >
                      {quest.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-1 line-clamp-1">
                            {quest.title}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {quest.description}
                          </p>
                        </div>

                        {/* Action Button */}
                        {isCompleted ? (
                          <div className="flex flex-col items-center gap-1">
                            <CheckCircle2 className="w-8 h-8 text-green-500" />
                            <span className="text-xs text-muted-foreground">
                              {quest.userProgress?.completedAt &&
                                new Date(quest.userProgress.completedAt).toLocaleTimeString('tr-TR', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                            </span>
                          </div>
                        ) : canClaim ? (
                          <Button
                            onClick={() => claimQuest(quest.id)}
                            disabled={claiming === quest.id}
                            size="sm"
                            className="gap-2 animate-bounce"
                          >
                            {claiming === quest.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <>
                                <Gift className="w-4 h-4" />
                                Al
                              </>
                            )}
                          </Button>
                        ) : (
                          <Circle className="w-8 h-8 text-muted-foreground" />
                        )}
                      </div>

                      {/* Progress Bar */}
                      {!isCompleted && (
                        <div className="mb-3">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-muted-foreground">
                              {progress} / {quest.target}
                            </span>
                            <span className="font-medium">{percentage.toFixed(0)}%</span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                        </div>
                      )}

                      {/* Rewards */}
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary" className="gap-1">
                          <Sparkles className="w-3 h-3" />
                          +{quest.xpReward} XP
                        </Badge>
                        <Badge variant="secondary" className="gap-1">
                          <span>🪙</span>
                          +{quest.coinReward}
                        </Badge>
                        {quest.type === 'daily' && (
                          <Badge variant="outline" className="gap-1">
                            <Clock className="w-3 h-3" />
                            Günlük
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <Target className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-lg text-muted-foreground mb-2">
              {filter === 'completed'
                ? 'Henüz tamamlanmış görev yok'
                : filter === 'active'
                ? 'Henüz aktif görev yok'
                : 'Şu anda görev yok'}
            </p>
            <p className="text-sm text-muted-foreground">
              Yeni görevler yakında eklenecek!
            </p>
          </CardContent>
        </Card>
      )}

      {/* Tips Card */}
      {activeQuests.length > 0 && (
        <Card className="mt-8 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-blue-200 dark:border-blue-800">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-bold mb-2 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  İpucu
                </h3>
                <p className="text-sm text-muted-foreground">
                  Görevler her gün sıfırlanır. Tüm görevleri tamamlayarak maksimum XP ve coin kazanabilirsin!
                  {claimableQuests.length > 0 && (
                    <span className="block mt-2 text-green-600 dark:text-green-400 font-medium">
                      🎉 {claimableQuests.length} görev ödülü almaya hazır!
                    </span>
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
