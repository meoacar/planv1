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
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Hero */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 mb-4 shadow-lg">
          <Droplet className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
          Su Takibi
        </h1>
        <p className="text-muted-foreground text-lg">
          Günlük 8 bardak su hedefini tamamla!
        </p>
      </div>

      {/* Progress Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Bugünün İlerlemesi</span>
            <span className="text-3xl font-bold">{glasses}/{target}</span>
          </CardTitle>
          <CardDescription>
            {glasses >= target
              ? '🎉 Harika! Günlük hedefini tamamladın!'
              : `${target - glasses} bardak daha içmelisin`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={percentage} className="h-4 mb-4" />
          
          {/* Water Glasses Visual */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            {Array.from({ length: target }).map((_, i) => (
              <div
                key={i}
                className={`aspect-square rounded-lg flex items-center justify-center text-4xl transition-all duration-300 ${
                  i < glasses
                    ? 'bg-gradient-to-br from-blue-400 to-cyan-500 scale-110'
                    : 'bg-muted'
                }`}
              >
                {i < glasses ? '💧' : '🤍'}
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={addGlass}
              disabled={loading || glasses >= target}
              size="lg"
              className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
            >
              <Plus className="w-5 h-5 mr-2" />
              Bardak Ekle
            </Button>
            <Button
              onClick={removeGlass}
              disabled={glasses === 0}
              variant="outline"
              size="lg"
            >
              <Minus className="w-5 h-5" />
            </Button>
            <Button
              onClick={reset}
              disabled={glasses === 0}
              variant="outline"
              size="lg"
            >
              <RotateCcw className="w-5 h-5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Info */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-sm text-muted-foreground space-y-2">
            <p>💧 <strong>Hedef:</strong> Günde 8 bardak (yaklaşık 2 litre) su</p>
            <p>✅ 8 bardağı tamamladığında günlük görev tamamlanır!</p>
            <p>💡 <strong>İpucu:</strong> Her saat başı bir bardak su içmeyi hedefle!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
