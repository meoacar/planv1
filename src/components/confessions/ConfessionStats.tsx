'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageSquare, Heart, TrendingUp, Users } from 'lucide-react'
import { motion } from 'framer-motion'

interface ConfessionStatsProps {
  totalConfessions: number
  totalEmpathy: number
  averageEmpathy: number
  categoryBreakdown?: Record<string, number>
}

const categoryLabels: Record<string, string> = {
  night_attack: 'Gece Saldırıları',
  special_occasion: 'Özel Gün',
  stress_eating: 'Stres Yeme',
  social_pressure: 'Sosyal Baskı',
  no_regrets: 'Pişman Değilim',
  seasonal: 'Sezonluk'
}

export function ConfessionStats({
  totalConfessions,
  totalEmpathy,
  averageEmpathy,
  categoryBreakdown
}: ConfessionStatsProps) {
  const stats = [
    {
      label: 'Toplam İtiraf',
      value: totalConfessions,
      icon: MessageSquare,
      color: 'text-blue-600 dark:text-blue-400'
    },
    {
      label: 'Toplam Empati',
      value: totalEmpathy,
      icon: Heart,
      color: 'text-red-600 dark:text-red-400'
    },
    {
      label: 'Ortalama Empati',
      value: averageEmpathy.toFixed(1),
      icon: TrendingUp,
      color: 'text-green-600 dark:text-green-400'
    }
  ]

  return (
    <div className="space-y-4">
      {/* Ana İstatistikler */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold">
                      {stat.value}
                    </p>
                  </div>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Kategori Dağılımı */}
      {categoryBreakdown && Object.keys(categoryBreakdown).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="w-5 h-5" />
                Kategori Dağılımı
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(categoryBreakdown)
                  .sort(([, a], [, b]) => b - a)
                  .map(([category, count]) => {
                    const percentage = (count / totalConfessions) * 100
                    return (
                      <div key={category}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">
                            {categoryLabels[category] || category}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {count} ({percentage.toFixed(0)}%)
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="bg-primary h-2 rounded-full"
                          />
                        </div>
                      </div>
                    )
                  })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
