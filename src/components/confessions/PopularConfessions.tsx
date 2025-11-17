'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Flame, Heart } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ConfessionCategory } from '@/types/confession'

interface PopularConfession {
  id: string
  content: string
  category: ConfessionCategory
  empathyCount: number
}

interface PopularConfessionsProps {
  confessions: PopularConfession[]
}

const categoryIcons: Record<ConfessionCategory, string> = {
  night_attack: '🌙',
  special_occasion: '🎉',
  stress_eating: '😰',
  social_pressure: '👥',
  no_regrets: '😎',
  seasonal: '🎊'
}

export function PopularConfessions({ confessions }: PopularConfessionsProps) {
  if (confessions.length === 0) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500" />
            Popüler İtiraflar
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {confessions.map((confession, index) => (
            <motion.div
              key={confession.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Link href={`/confessions/${confession.id}`}>
                <div className="p-3 rounded-lg border hover:bg-accent transition-colors cursor-pointer">
                  {/* Kategori İkonu */}
                  <div className="flex items-start gap-2 mb-2">
                    <span className="text-lg">
                      {categoryIcons[confession.category]}
                    </span>
                    <p className="text-sm line-clamp-3 flex-1">
                      {confession.content}
                    </p>
                  </div>

                  {/* Empati Sayısı */}
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Heart className="w-3 h-3 fill-red-500 text-red-500" />
                    <span className="font-medium">{confession.empathyCount}</span>
                    <span>empati</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}

          {/* Tümünü Gör Linki */}
          <Link href="/confessions?popular=true">
            <div className="text-center pt-2">
              <span className="text-sm text-primary hover:underline">
                Tümünü Gör →
              </span>
            </div>
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  )
}
