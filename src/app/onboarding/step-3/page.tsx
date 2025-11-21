'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Loader2 } from 'lucide-react'

const CHALLENGES = [
  { value: 'sweets', label: 'Tatlı Düşkünlüğü', emoji: '🍰', desc: 'Tatlıya dayanamıyorum' },
  { value: 'night_snacking', label: 'Gece Atıştırma', emoji: '🌙', desc: 'Geceleri açlık hissediyorum' },
  { value: 'motivation', label: 'Motivasyon', emoji: '💪', desc: 'Motivasyonumu koruyamıyorum' },
  { value: 'eating_out', label: 'Dışarı Yemek', emoji: '🍕', desc: 'Sık sık dışarıda yiyorum' },
  { value: 'time_management', label: 'Zaman Yönetimi', emoji: '⏰', desc: 'Yemek hazırlamaya vaktim yok' },
]

export default function OnboardingStep3() {
  const router = useRouter()
  const [challenge, setChallenge] = useState('')
  const [loading, setLoading] = useState(false)

  const handleComplete = async () => {
    if (!challenge) {
      alert('Lütfen bir zorluk seçin')
      return
    }

    setLoading(true)

    try {
      // Get all onboarding data
      const step1 = JSON.parse(localStorage.getItem('onboarding_step1') || '{}')
      const step2 = JSON.parse(localStorage.getItem('onboarding_step2') || '{}')

      const onboardingData = {
        ...step1,
        ...step2,
        biggestChallenge: challenge,
      }

      // Save to database
      const response = await fetch('/api/onboarding/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(onboardingData),
      })

      if (!response.ok) {
        throw new Error('Failed to save onboarding data')
      }

      // Clear localStorage
      localStorage.removeItem('onboarding_step1')
      localStorage.removeItem('onboarding_step2')

      // Redirect to results
      router.push('/onboarding/results')
    } catch (error) {
      console.error('Onboarding error:', error)
      alert('Bir hata oluştu, lütfen tekrar deneyin')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container max-w-2xl mx-auto px-4 py-12">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Adım 3 / 3</span>
          <span className="text-sm text-muted-foreground">En Büyük Zorluk</span>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-purple-600 to-pink-600 w-full transition-all" />
        </div>
      </div>

      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            En Büyük Zorluğun 🎯
          </CardTitle>
          <CardDescription className="text-base">
            Sana en uygun grup ve lonca önerilerini hazırlayalım
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label className="text-base font-semibold">
              Zayıflama yolculuğunda en çok neyle zorlanıyorsun?
            </Label>
            <div className="grid gap-3">
              {CHALLENGES.map((item) => (
                <button
                  key={item.value}
                  onClick={() => setChallenge(item.value)}
                  className={`p-4 rounded-xl border-2 text-left transition-all hover:scale-[1.02] ${
                    challenge === item.value
                      ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/20'
                      : 'border-gray-200 dark:border-gray-800 hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{item.emoji}</span>
                    <div className="flex-1">
                      <div className="font-semibold text-lg">{item.label}</div>
                      <div className="text-sm text-muted-foreground">{item.desc}</div>
                    </div>
                    {challenge === item.value && (
                      <div className="text-purple-600 text-xl">✓</div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-xl border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-2">
              <span className="text-xl">💡</span>
              <div className="text-sm">
                <div className="font-semibold mb-1">Neden soruyoruz?</div>
                <div className="text-muted-foreground">
                  Seçtiğin zorluğa göre sana benzer hedefleri olan kişilerle bir araya gelebilir,
                  deneyimlerini paylaşabilir ve birlikte motive olabilirsin!
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => router.push('/onboarding/step-2')}
              className="flex-1"
              disabled={loading}
            >
              <ArrowLeft className="mr-2 w-4 h-4" />
              Geri
            </Button>
            <Button
              onClick={handleComplete}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                  Hazırlanıyor...
                </>
              ) : (
                'Tamamla 🎉'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
