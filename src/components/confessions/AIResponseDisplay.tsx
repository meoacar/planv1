'use client'

import { AITone } from '@/types/confession'
import { Card } from '@/components/ui/card'
import { Sparkles, Heart, TrendingUp, Target } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface AIResponseDisplayProps {
  response: string
  tone?: AITone | null
}

// Ton bazlı stil ve ikon konfigürasyonu
const toneConfig: Record<AITone, { 
  icon: React.ReactNode
  bgColor: string
  borderColor: string
  textColor: string
  label: string
}> = {
  empathetic: {
    icon: <Heart className="w-4 h-4" />,
    bgColor: 'bg-pink-50 dark:bg-pink-950/20',
    borderColor: 'border-pink-200 dark:border-pink-800',
    textColor: 'text-pink-700 dark:text-pink-400',
    label: 'Empatik Yanıt'
  },
  humorous: {
    icon: <Sparkles className="w-4 h-4" />,
    bgColor: 'bg-yellow-50 dark:bg-yellow-950/20',
    borderColor: 'border-yellow-200 dark:border-yellow-800',
    textColor: 'text-yellow-700 dark:text-yellow-400',
    label: 'Esprili Yanıt'
  },
  motivational: {
    icon: <TrendingUp className="w-4 h-4" />,
    bgColor: 'bg-blue-50 dark:bg-blue-950/20',
    borderColor: 'border-blue-200 dark:border-blue-800',
    textColor: 'text-blue-700 dark:text-blue-400',
    label: 'Motivasyonel Yanıt'
  },
  realistic: {
    icon: <Target className="w-4 h-4" />,
    bgColor: 'bg-green-50 dark:bg-green-950/20',
    borderColor: 'border-green-200 dark:border-green-800',
    textColor: 'text-green-700 dark:text-green-400',
    label: 'Gerçekçi Yanıt'
  }
}

export function AIResponseDisplay({ response, tone }: AIResponseDisplayProps) {
  // Varsayılan ton: empathetic
  const currentTone = tone || 'empathetic'
  const config = toneConfig[currentTone]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <Card 
        className={cn(
          'p-4 border-l-4 mt-3',
          config.bgColor,
          config.borderColor
        )}
      >
        {/* Başlık */}
        <div className={cn('flex items-center gap-2 mb-2', config.textColor)}>
          {config.icon}
          <span className="text-sm font-medium">{config.label}</span>
          <Sparkles className="w-3 h-3 ml-auto" />
        </div>

        {/* AI Yanıtı */}
        <p className="text-sm leading-relaxed text-foreground/90">
          {response}
        </p>
      </Card>
    </motion.div>
  )
}
