'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'

interface TelafiPlanCardProps {
  confessionId: string
  action: string
  xpReward: number
}

export function TelafiPlanCard({ confessionId, action, xpReward }: TelafiPlanCardProps) {
  const [isAccepted, setIsAccepted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleAccept = async () => {
    setIsLoading(true)

    try {
      const response = await fetch(`/api/v1/confessions/${confessionId}/telafi/accept`, {
        method: 'POST'
      })

      if (!response.ok) {
        throw new Error('Telafi planı kabul edilemedi')
      }

      const data = await response.json()

      setIsAccepted(true)
      toast.success(`Telafi planı kabul edildi! +${xpReward} XP kazandınız`, {
        icon: '✨',
        description: 'Görev listenize eklendi'
      })
    } catch (error) {
      toast.error('Bir hata oluştu', {
        description: 'Lütfen daha sonra tekrar deneyin'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <Card className="p-4 mt-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-800">
        {/* Başlık */}
        <div className="flex items-center gap-2 mb-2 text-purple-700 dark:text-purple-400">
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-medium">Telafi Planı</span>
        </div>

        {/* Aksiyon */}
        <p className="text-sm mb-3 text-foreground/90">
          {action}
        </p>

        {/* XP Ödülü ve Buton */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span className="font-medium text-purple-600 dark:text-purple-400">
              +{xpReward} XP
            </span>
            <span>ödül</span>
          </div>

          {isAccepted ? (
            <div className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>Kabul Edildi</span>
            </div>
          ) : (
            <Button
              size="sm"
              onClick={handleAccept}
              disabled={isLoading}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isLoading ? 'Ekleniyor...' : 'Kabul Et'}
            </Button>
          )}
        </div>
      </Card>
    </motion.div>
  )
}
