'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Flame, Calendar } from 'lucide-react'
import { toast } from 'sonner'

interface CheckInClientProps {
  streak: number
  lastCheckIn: Date | null
  hasCheckedInToday: boolean
}

export function CheckInClient({ streak, lastCheckIn, hasCheckedInToday }: CheckInClientProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleCheckIn = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/v1/check-in', {
        method: 'POST',
      })

      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.error?.message || 'Check-in başarısız')
      }

      toast.success('Check-in başarılı! 🎉')
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || 'Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Hero */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-red-500 mb-4 shadow-lg">
          <Flame className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
          Günlük Check-in
        </h1>
        <p className="text-muted-foreground text-lg">
          Her gün check-in yap, streak'ini koru!
        </p>
      </div>

      {/* Streak Card */}
      <Card className="mb-6 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950 border-orange-200 dark:border-orange-800">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="text-6xl font-black mb-2 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              {streak}
            </div>
            <div className="text-muted-foreground font-medium flex items-center justify-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              Günlük Seri
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Check-in Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Bugün
          </CardTitle>
          <CardDescription>
            {hasCheckedInToday
              ? 'Bugün check-in yaptın! Yarın tekrar gel.'
              : 'Bugün henüz check-in yapmadın.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {hasCheckedInToday ? (
            <div className="flex items-center justify-center gap-3 p-6 bg-green-50 dark:bg-green-950 rounded-lg border-2 border-green-200 dark:border-green-800">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
              <div>
                <div className="font-bold text-green-600">Check-in Tamamlandı!</div>
                <div className="text-sm text-muted-foreground">
                  {lastCheckIn && new Date(lastCheckIn).toLocaleString('tr-TR')}
                </div>
              </div>
            </div>
          ) : (
            <Button
              onClick={handleCheckIn}
              disabled={loading}
              size="lg"
              className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
            >
              {loading ? 'Check-in yapılıyor...' : 'Check-in Yap'}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Info */}
      <Card className="mt-6">
        <CardContent className="pt-6">
          <div className="text-sm text-muted-foreground space-y-2">
            <p>💡 <strong>İpucu:</strong> Her gün check-in yaparak streak'ini artır!</p>
            <p>🔥 7, 30 ve 100 günlük streak'lerde özel rozetler kazanırsın!</p>
            <p>✅ Check-in yaptığında günlük görev de tamamlanır!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
