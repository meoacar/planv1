'use client'

import { ConfessionCategory, ConfessionWithUser } from '@/types/confession'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Flag, Clock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'
import { motion } from 'framer-motion'
import { AIResponseDisplay } from './AIResponseDisplay'
import { TelafiPlanCard } from './TelafiPlanCard'
import { EmpathyButton } from './EmpathyButton'

// Re-export for convenience
export type { ConfessionWithUser }

interface ConfessionCardProps {
  confession: ConfessionWithUser
  showAuthor?: boolean
  onEmpathy?: (confessionId: string) => void
  onReport?: (confessionId: string) => void
}

// Kategori ikonları ve renkleri
const categoryConfig: Record<ConfessionCategory, { icon: string; label: string; color: string }> = {
  night_attack: {
    icon: '🌙',
    label: 'Gece Saldırısı',
    color: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400'
  },
  special_occasion: {
    icon: '🎉',
    label: 'Özel Gün',
    color: 'bg-pink-500/10 text-pink-700 dark:text-pink-400'
  },
  stress_eating: {
    icon: '😰',
    label: 'Stres Yeme',
    color: 'bg-orange-500/10 text-orange-700 dark:text-orange-400'
  },
  social_pressure: {
    icon: '👥',
    label: 'Sosyal Baskı',
    color: 'bg-purple-500/10 text-purple-700 dark:text-purple-400'
  },
  no_regrets: {
    icon: '😎',
    label: 'Pişman Değilim',
    color: 'bg-green-500/10 text-green-700 dark:text-green-400'
  },
  seasonal: {
    icon: '🎊',
    label: 'Sezonluk',
    color: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400'
  }
}

export function ConfessionCard({ 
  confession, 
  showAuthor = false, 
  onEmpathy,
  onReport 
}: ConfessionCardProps) {
  const categoryInfo = categoryConfig[confession.category]
  const empathyCount = confession._count?.empathies ?? confession.empathyCount
  const hasEmpathized = confession.hasEmpathized ?? false

  // Telafi planını parse et
  let telafiBudget = null
  if (confession.telafiBudget) {
    try {
      telafiBudget = JSON.parse(confession.telafiBudget)
    } catch (e) {
      // Parse hatası durumunda null bırak
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        {/* Kategori Badge - Sol Üst */}
        <div className="p-4 pb-0">
          <Badge className={categoryInfo.color}>
            <span className="mr-1">{categoryInfo.icon}</span>
            {categoryInfo.label}
          </Badge>
        </div>

        <CardContent className="p-4 pt-3">
          {/* İtiraf Metni */}
          <div className="mb-4">
            <p className="text-base leading-relaxed whitespace-pre-wrap">
              {confession.content}
            </p>
          </div>

          {/* Yazar Bilgisi (sadece showAuthor true ise) */}
          {showAuthor && (
            <div className="mb-3 text-sm text-muted-foreground">
              <span className="font-medium">
                {confession.user.name || confession.user.username || 'Anonim'}
              </span>
            </div>
          )}

          {/* AI Yanıtı */}
          {confession.aiResponse && (
            <AIResponseDisplay 
              response={confession.aiResponse}
              tone={confession.aiTone}
            />
          )}

          {/* Telafi Planı */}
          {telafiBudget && (
            <TelafiPlanCard 
              confessionId={confession.id}
              action={telafiBudget.action}
              xpReward={telafiBudget.xpReward}
            />
          )}

          {/* Popüler Badge */}
          {confession.isPopular && (
            <div className="mt-3">
              <Badge variant="secondary" className="bg-amber-500/10 text-amber-700 dark:text-amber-400">
                🔥 Popüler İtiraf
              </Badge>
            </div>
          )}
        </CardContent>

        <CardFooter className="p-4 pt-0 flex items-center justify-between">
          {/* Sol: Empati Butonu */}
          <EmpathyButton
            confessionId={confession.id}
            initialCount={empathyCount}
            hasEmpathized={hasEmpathized}
            onToggle={onEmpathy}
          />

          {/* Sağ: Zaman ve Rapor */}
          <div className="flex items-center gap-3">
            {/* Zaman Damgası */}
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>
                {formatDistanceToNow(new Date(confession.createdAt), {
                  addSuffix: true,
                  locale: tr
                })}
              </span>
            </div>

            {/* Rapor Butonu */}
            {onReport && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onReport(confession.id)}
                className="text-muted-foreground hover:text-destructive"
              >
                <Flag className="w-4 h-4" />
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
