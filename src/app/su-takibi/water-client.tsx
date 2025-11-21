'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Droplet, Plus, Minus, RotateCcw } from 'lucide-react'
import { toast } from 'sonner'

export function WaterClient() {
  const [glasses, setGlasses] = useState(0)
  const [loading, setLoading] = useState(false)
  const target = 8

  // Load from localStorage
  useEffect(() => {
    const today = new Date().toDateString()
    const saved = localStorage.getItem('water_' + today)
    if (saved) {
      setGlasses(parseInt(saved))
    }
  }, [])

  // Save to localStorage
  useEffect(() => {
    const today = new Date().toDateString()
    localStorage.setItem('water_' + today, glasses.toString())
  }, [glasses])

  const addGlass = async () => {
    if (glasses >= target) {
      toast.info('Hedefine ulaştın! 🎉')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/v1/water', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ increment: 1 }),
      })

      if (!res.ok) {
        throw new Error('Su kaydı başarısız')
      }

      setGlasses(prev => prev + 1)
      
      if (glasses + 1 === target) {
        toast.success('Günlük hedefini tamamladın! 🎉')
      } else {
        toast.success('Bir bardak su içtin! 💧')
      }
    } catch (error: any) {
      toast.error(error.message || 'Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const removeGlass = () => {
    if (glasses > 0) {
      setGlasses(prev => prev - 1)
    }
  }

  const reset = () => {
    setGlasses(0)
    toast.info('Sıfırlandı')
  }

  const percentage = (glasses / target) * 100

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/50 to-white dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-2xl">
        {/* Hero */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 mb-3 sm:mb-4 shadow-lg">
            <Droplet className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 sm:mb-3 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Su Takibi
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg">
            Günlük 8 bardak su hedefini tamamla!
          </p>
        </div>

        {/* Progress Card */}
        <Card className="mb-4 sm:mb-6 shadow-lg">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="flex items-center justify-between text-lg sm:text-xl">
              <span>Bugünün İlerlemesi</span>
              <span className="text-2xl sm:text-3xl font-bold text-blue-600">{glasses}/{target}</span>
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              {glasses >= target
                ? '🎉 Harika! Günlük hedefini tamamladın!'
                : `${target - glasses} bardak daha içmelisin`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6">
            <Progress value={percentage} className="h-3 sm:h-4" />
            
            {/* Water Glasses Visual */}
            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              {Array.from({ length: target }).map((_, i) => (
                <div
                  key={i}
                  className={`aspect-square rounded-lg flex items-center justify-center text-3xl sm:text-4xl transition-all duration-300 ${
                    i < glasses
                      ? 'bg-gradient-to-br from-blue-400 to-cyan-500 scale-105 sm:scale-110 shadow-md'
                      : 'bg-muted'
                  }`}
                >
                  {i < glasses ? '💧' : '🤍'}
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-2 sm:gap-3">
              <Button
                onClick={addGlass}
                disabled={loading || glasses >= target}
                size="lg"
                className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 h-12 sm:h-14 text-sm sm:text-base"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                <span className="hidden xs:inline">Bardak </span>Ekle
              </Button>
              <Button
                onClick={removeGlass}
                disabled={glasses === 0}
                variant="outline"
                size="lg"
                className="h-12 sm:h-14 px-3 sm:px-4"
              >
                <Minus className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
              <Button
                onClick={reset}
                disabled={glasses === 0}
                variant="outline"
                size="lg"
                className="h-12 sm:h-14 px-3 sm:px-4"
              >
                <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Info */}
        <Card className="shadow-lg">
          <CardContent className="pt-4 sm:pt-6">
            <div className="text-xs sm:text-sm text-muted-foreground space-y-2">
              <p className="flex items-start gap-2">
                <span className="text-base sm:text-lg">💧</span>
                <span><strong>Hedef:</strong> Günde 8 bardak (yaklaşık 2 litre) su</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-base sm:text-lg">✅</span>
                <span>8 bardağı tamamladığında günlük görev tamamlanır!</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-base sm:text-lg">💡</span>
                <span><strong>İpucu:</strong> Her saat başı bir bardak su içmeyi hedefle!</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
