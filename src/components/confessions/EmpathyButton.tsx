'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface EmpathyButtonProps {
  confessionId: string
  initialCount: number
  hasEmpathized: boolean
  onToggle?: (confessionId: string) => void
}

export function EmpathyButton({
  confessionId,
  initialCount,
  hasEmpathized: initialHasEmpathized,
  onToggle
}: EmpathyButtonProps) {
  const [count, setCount] = useState(initialCount)
  const [hasEmpathized, setHasEmpathized] = useState(initialHasEmpathized)
  const [isAnimating, setIsAnimating] = useState(false)

  const handleToggle = async () => {
    if (isAnimating) return

    // Optimistic update
    const newHasEmpathized = !hasEmpathized
    const newCount = newHasEmpathized ? count + 1 : count - 1

    setHasEmpathized(newHasEmpathized)
    setCount(newCount)
    setIsAnimating(true)

    // Animasyon için kısa bir süre bekle
    setTimeout(() => setIsAnimating(false), 600)

    // Callback çağır
    if (onToggle) {
      onToggle(confessionId)
    }

    // Toast bildirimi
    if (newHasEmpathized) {
      toast.success('Empati gösterildi! +2 XP kazandınız', {
        icon: '❤️'
      })
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={hasEmpathized ? 'default' : 'outline'}
        size="sm"
        onClick={handleToggle}
        disabled={isAnimating}
        className={cn(
          'relative transition-all',
          hasEmpathized && 'bg-red-500 hover:bg-red-600 text-white'
        )}
      >
        {/* Kalp İkonu */}
        <motion.div
          animate={isAnimating ? {
            scale: [1, 1.3, 1],
            rotate: [0, -10, 10, -10, 0]
          } : {}}
          transition={{ duration: 0.6 }}
        >
          <Heart
            className={cn(
              'w-4 h-4 transition-all',
              hasEmpathized && 'fill-current'
            )}
          />
        </motion.div>

        {/* Sayı */}
        <AnimatePresence mode="wait">
          <motion.span
            key={count}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="ml-1"
          >
            {count}
          </motion.span>
        </AnimatePresence>

        {/* Animasyon Efekti - Kalpler */}
        {isAnimating && hasEmpathized && (
          <>
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  opacity: 1, 
                  scale: 0.5,
                  x: 0,
                  y: 0
                }}
                animate={{ 
                  opacity: 0, 
                  scale: 1.5,
                  x: (i - 1) * 20,
                  y: -30
                }}
                transition={{ 
                  duration: 0.6,
                  delay: i * 0.1
                }}
                className="absolute pointer-events-none"
              >
                <Heart className="w-3 h-3 fill-red-500 text-red-500" />
              </motion.div>
            ))}
          </>
        )}
      </Button>

      <span className="text-sm text-muted-foreground">
        Benimki de vardı
      </span>
    </div>
  )
}
