'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Calculator, TrendingUp } from 'lucide-react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'

interface NutritionCalculatorProps {
  planSlug: string
}

export function NutritionCalculator({ planSlug }: NutritionCalculatorProps) {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<any>(null)
  const [showDetails, setShowDetails] = useState(false)

  const fetchNutrition = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/v1/plans/${planSlug}/nutrition`)
      const result = await res.json()

      if (result.success) {
        setData(result.data)
        toast.success('Besin değerleri hesaplandı!')
      } else {
        toast.error(result.error || 'Bir hata oluştu')
      }
    } catch (error) {
      toast.error('Besin değerleri hesaplanamadı')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Besin Değerleri
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!data ? (
          <Button
            onClick={fetchNutrition}
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Hesaplanıyor...
              </>
            ) : (
              <>
                <Calculator className="h-4 w-4 mr-2" />
                Besin Değerlerini Hesapla
              </>
            )}
          </Button>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-lg p-4 border-2 border-green-200 dark:border-green-800">
              <p className="text-sm font-semibold mb-3 text-green-900 dark:text-green-100">
                Günlük Ortalama
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/50 dark:bg-slate-900/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Kalori</p>
                  <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                    {data.averages.calories}
                  </p>
                  <p className="text-xs text-muted-foreground">kcal</p>
                </div>
                <div className="bg-white/50 dark:bg-slate-900/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Protein</p>
                  <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                    {data.averages.protein}g
                  </p>
                </div>
                <div className="bg-white/50 dark:bg-slate-900/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Karbonhidrat</p>
                  <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">
                    {data.averages.carbs}g
                  </p>
                </div>
                <div className="bg-white/50 dark:bg-slate-900/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Yağ</p>
                  <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                    {data.averages.fat}g
                  </p>
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
              className="w-full"
            >
              {showDetails ? 'Detayları Gizle' : 'Günlük Detayları Göster'}
            </Button>

            <AnimatePresence>
              {showDetails && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2 max-h-96 overflow-y-auto"
                >
                  {data.daily.map((day: any) => (
                    <div
                      key={day.day}
                      className="bg-muted rounded-lg p-3 text-sm"
                    >
                      <p className="font-semibold mb-2">Gün {day.day}</p>
                      <div className="grid grid-cols-4 gap-2 text-xs">
                        <div>
                          <p className="text-muted-foreground">Kalori</p>
                          <p className="font-bold">{day.total.calories}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Protein</p>
                          <p className="font-bold">{day.total.protein}g</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Karb</p>
                          <p className="font-bold">{day.total.carbs}g</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Yağ</p>
                          <p className="font-bold">{day.total.fat}g</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            <p className="text-xs text-muted-foreground italic">
              {data.note}
            </p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}
