'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowRight, Target, Weight, Ruler } from 'lucide-react'

const GOALS = [
  { value: 'lose_weight', label: 'Kilo Vermek', emoji: '🎯', desc: 'Sağlıklı şekilde kilo vermek istiyorum' },
  { value: 'maintain', label: 'Form Korumak', emoji: '⚖️', desc: 'Mevcut kilomu korumak istiyorum' },
  { value: 'gain_muscle', label: 'Kas Kazanmak', emoji: '💪', desc: 'Kas kütlemi artırmak istiyorum' },
]

export default function OnboardingStep1() {
  const router = useRouter()
  const [selectedGoal, setSelectedGoal] = useState('')
  const [currentWeight, setCurrentWeight] = useState('')
  const [targetWeight, setTargetWeight] = useState('')
  const [height, setHeight] = useState('')

  const handleNext = () => {
    if (!selectedGoal || !currentWeight || !targetWeight || !height) {
      alert('Lütfen tüm alanları doldurun')
      return
    }

    // Save to localStorage temporarily
    localStorage.setItem('onboarding_step1', JSON.stringify({
      goal: selectedGoal,
      currentWeight: parseFloat(currentWeight),
      targetWeight: parseFloat(targetWeight),
      height: parseFloat(height),
    }))

    router.push('/onboarding/step-2')
  }

  return (
    <div className="container max-w-2xl mx-auto px-4 py-12">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Adım 1 / 3</span>
          <span className="text-sm text-muted-foreground">Hedef & Vücut Bilgileri</span>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-purple-600 to-pink-600 w-1/3 transition-all" />
        </div>
      </div>

      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Hedefini Belirle 🎯
          </CardTitle>
          <CardDescription className="text-base">
            Sana özel plan ve öneriler hazırlayabilmemiz için birkaç bilgiye ihtiyacımız var
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Goal Selection */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Hedefin Nedir?</Label>
            <div className="grid gap-3">
              {GOALS.map((goal) => (
                <button
                  key={goal.value}
                  onClick={() => setSelectedGoal(goal.value)}
                  className={`p-4 rounded-xl border-2 text-left transition-all hover:scale-[1.02] ${
                    selectedGoal === goal.value
                      ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/20'
                      : 'border-gray-200 dark:border-gray-800 hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{goal.emoji}</span>
                    <div className="flex-1">
                      <div className="font-semibold text-lg">{goal.label}</div>
                      <div className="text-sm text-muted-foreground">{goal.desc}</div>
                    </div>
                    {selectedGoal === goal.value && (
                      <div className="text-purple-600 text-xl">✓</div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Body Metrics */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currentWeight" className="flex items-center gap-2">
                <Weight className="w-4 h-4" />
                Mevcut Kilo
              </Label>
              <div className="relative">
                <Input
                  id="currentWeight"
                  type="number"
                  step="0.1"
                  placeholder="75.5"
                  value={currentWeight}
                  onChange={(e) => setCurrentWeight(e.target.value)}
                  className="pr-12"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                  kg
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetWeight" className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                Hedef Kilo
              </Label>
              <div className="relative">
                <Input
                  id="targetWeight"
                  type="number"
                  step="0.1"
                  placeholder="65.0"
                  value={targetWeight}
                  onChange={(e) => setTargetWeight(e.target.value)}
                  className="pr-12"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                  kg
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="height" className="flex items-center gap-2">
                <Ruler className="w-4 h-4" />
                Boy
              </Label>
              <div className="relative">
                <Input
                  id="height"
                  type="number"
                  placeholder="170"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="pr-12"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                  cm
                </span>
              </div>
            </div>
          </div>

          {/* Info Box */}
          {currentWeight && targetWeight && height && (
            <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-xl border border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">📊</span>
                <span className="font-semibold">Hedef Özeti</span>
              </div>
              <div className="text-sm text-muted-foreground">
                {Math.abs(parseFloat(currentWeight) - parseFloat(targetWeight)).toFixed(1)} kg{' '}
                {parseFloat(currentWeight) > parseFloat(targetWeight) ? 'vermek' : 'almak'} istiyorsun
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => router.push('/dashboard')}
              className="flex-1"
            >
              Şimdilik Atla
            </Button>
            <Button
              onClick={handleNext}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              Devam Et
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
