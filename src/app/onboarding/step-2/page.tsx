'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { ArrowRight, ArrowLeft, Activity, Droplets, Moon } from 'lucide-react'

const ACTIVITY_LEVELS = [
  { value: 'sedentary', label: 'Hareketsiz', emoji: '🛋️', desc: 'Çoğunlukla oturarak çalışıyorum' },
  { value: 'light', label: 'Az Aktif', emoji: '🚶', desc: 'Haftada 1-2 gün egzersiz' },
  { value: 'moderate', label: 'Aktif', emoji: '🏃', desc: 'Haftada 3-5 gün egzersiz' },
  { value: 'very_active', label: 'Çok Aktif', emoji: '💪', desc: 'Haftada 6-7 gün egzersiz' },
]

const WATER_GOALS = [
  { value: 2, label: '2 Litre', emoji: '💧' },
  { value: 2.5, label: '2.5 Litre', emoji: '💧💧' },
  { value: 3, label: '3 Litre', emoji: '💧💧💧' },
  { value: 3.5, label: '3.5 Litre', emoji: '💧💧💧💧' },
]

const SLEEP_OPTIONS = [
  { value: 'less_6', label: '6 saatten az', emoji: '😴', desc: 'Genelde az uyuyorum' },
  { value: '6_8', label: '6-8 saat', emoji: '😊', desc: 'Normal uyku düzenim var' },
  { value: 'more_8', label: '8 saatten fazla', emoji: '😌', desc: 'Bol bol uyuyorum' },
]

export default function OnboardingStep2() {
  const router = useRouter()
  const [activityLevel, setActivityLevel] = useState('')
  const [waterGoal, setWaterGoal] = useState<number | null>(null)
  const [sleep, setSleep] = useState('')

  const handleNext = () => {
    if (!activityLevel || !waterGoal || !sleep) {
      alert('Lütfen tüm alanları doldurun')
      return
    }

    localStorage.setItem('onboarding_step2', JSON.stringify({
      activityLevel,
      dailyWaterGoal: waterGoal,
      averageSleep: sleep,
    }))

    router.push('/onboarding/step-3')
  }

  return (
    <div className="container max-w-2xl mx-auto px-4 py-12">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Adım 2 / 3</span>
          <span className="text-sm text-muted-foreground">Yaşam Tarzı</span>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-purple-600 to-pink-600 w-2/3 transition-all" />
        </div>
      </div>

      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Yaşam Tarzın 🏃
          </CardTitle>
          <CardDescription className="text-base">
            Günlük rutinini anlayarak sana daha iyi öneriler sunabiliriz
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Activity Level */}
          <div className="space-y-3">
            <Label className="text-base font-semibold flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Aktivite Seviyesi
            </Label>
            <div className="grid gap-3">
              {ACTIVITY_LEVELS.map((level) => (
                <button
                  key={level.value}
                  onClick={() => setActivityLevel(level.value)}
                  className={`p-4 rounded-xl border-2 text-left transition-all hover:scale-[1.02] ${
                    activityLevel === level.value
                      ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/20'
                      : 'border-gray-200 dark:border-gray-800 hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{level.emoji}</span>
                    <div className="flex-1">
                      <div className="font-semibold">{level.label}</div>
                      <div className="text-sm text-muted-foreground">{level.desc}</div>
                    </div>
                    {activityLevel === level.value && (
                      <div className="text-purple-600 text-xl">✓</div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Water Goal */}
          <div className="space-y-3">
            <Label className="text-base font-semibold flex items-center gap-2">
              <Droplets className="w-5 h-5" />
              Günlük Su Hedefi
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {WATER_GOALS.map((goal) => (
                <button
                  key={goal.value}
                  onClick={() => setWaterGoal(goal.value)}
                  className={`p-4 rounded-xl border-2 text-center transition-all hover:scale-[1.05] ${
                    waterGoal === goal.value
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/20'
                      : 'border-gray-200 dark:border-gray-800 hover:border-blue-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{goal.emoji}</div>
                  <div className="font-semibold text-sm">{goal.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Sleep */}
          <div className="space-y-3">
            <Label className="text-base font-semibold flex items-center gap-2">
              <Moon className="w-5 h-5" />
              Uyku Ortalaması
            </Label>
            <div className="grid gap-3">
              {SLEEP_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSleep(option.value)}
                  className={`p-4 rounded-xl border-2 text-left transition-all hover:scale-[1.02] ${
                    sleep === option.value
                      ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/20'
                      : 'border-gray-200 dark:border-gray-800 hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{option.emoji}</span>
                    <div className="flex-1">
                      <div className="font-semibold">{option.label}</div>
                      <div className="text-sm text-muted-foreground">{option.desc}</div>
                    </div>
                    {sleep === option.value && (
                      <div className="text-purple-600 text-xl">✓</div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => router.push('/onboarding/step-1')}
              className="flex-1"
            >
              <ArrowLeft className="mr-2 w-4 h-4" />
              Geri
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
