import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Navbar } from '@/components/navbar'
import { WeightForm } from './weight-form'
import { formatDistanceToNow, format, subDays } from 'date-fns'
import { tr } from 'date-fns/locale'
import { 
  TrendingUp, 
  TrendingDown, 
  Target,
  Calendar,
  Award,
  Minus
} from 'lucide-react'

export default async function WeightTrackingPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/giris')
  }

  // Kullanıcı bilgilerini çek
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      currentWeight: true,
      targetWeight: true,
    },
  })

  // Kilo kayıtlarını çek (son 90 gün)
  const last90Days = subDays(new Date(), 90)
  const weightLogs = await db.weightLog.findMany({
    where: {
      userId: session.user.id,
      date: { gte: last90Days },
    },
    orderBy: { date: 'desc' },
  })

  // İstatistikler
  const currentWeight = user?.currentWeight || null
  const targetWeight = user?.targetWeight || null
  const startWeight = weightLogs.length > 0 ? weightLogs[weightLogs.length - 1].weight : currentWeight
  
  const totalLoss = startWeight && currentWeight ? startWeight - currentWeight : null
  const remaining = currentWeight && targetWeight ? currentWeight - targetWeight : null
  
  // Son 7 gün değişimi
  const last7Days = weightLogs.filter(log => 
    log.date >= subDays(new Date(), 7)
  )
  const weekChange = last7Days.length >= 2 
    ? last7Days[0].weight - last7Days[last7Days.length - 1].weight
    : null

  // Son 30 gün değişimi
  const last30Days = weightLogs.filter(log => 
    log.date >= subDays(new Date(), 30)
  )
  const monthChange = last30Days.length >= 2 
    ? last30Days[0].weight - last30Days[last30Days.length - 1].weight
    : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-muted/20">
      <Navbar />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <Target className="h-10 w-10 text-primary" />
              Kilo Takibi
            </h1>
            <p className="text-muted-foreground">
              Kilonu düzenli kaydet, ilerlemeni gör!
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/dashboard">← Dashboard'a Dön</Link>
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-lg border-2">
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Mevcut Kilo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">
                {currentWeight ? `${currentWeight} kg` : '--'}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                Toplam Kayıp
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className={`text-4xl font-bold flex items-center gap-2 ${
                totalLoss && totalLoss > 0 ? 'text-green-600' : ''
              }`}>
                {totalLoss && totalLoss > 0 ? (
                  <>
                    <TrendingDown className="h-6 w-6" />
                    {totalLoss.toFixed(1)} kg
                  </>
                ) : totalLoss && totalLoss < 0 ? (
                  <>
                    <TrendingUp className="h-6 w-6 text-red-600" />
                    {Math.abs(totalLoss).toFixed(1)} kg
                  </>
                ) : '--'}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader className="pb-3">
              <CardDescription>Bu Hafta</CardDescription>
            </CardHeader>
            <CardContent>
              <p className={`text-4xl font-bold flex items-center gap-2 ${
                weekChange && weekChange < 0 ? 'text-green-600' : 
                weekChange && weekChange > 0 ? 'text-red-600' : ''
              }`}>
                {weekChange ? (
                  <>
                    {weekChange < 0 ? <TrendingDown className="h-6 w-6" /> : <TrendingUp className="h-6 w-6" />}
                    {Math.abs(weekChange).toFixed(1)} kg
                  </>
                ) : (
                  <>
                    <Minus className="h-6 w-6" />
                    --
                  </>
                )}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader className="pb-3">
              <CardDescription>Hedefe Kalan</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-orange-600">
                {remaining && remaining > 0 ? `${remaining.toFixed(1)} kg` : '--'}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Form */}
          <div className="lg:col-span-1 space-y-6">
            {/* Add Weight Form */}
            <Card className="shadow-lg border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Yeni Kayıt Ekle
                </CardTitle>
                <CardDescription>Bugünkü kilonu kaydet</CardDescription>
              </CardHeader>
              <CardContent>
                <WeightForm />
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Özet</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="text-sm text-muted-foreground">Başlangıç</span>
                  <span className="font-semibold">{startWeight ? `${startWeight} kg` : '--'}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="text-sm text-muted-foreground">Hedef</span>
                  <span className="font-semibold">{targetWeight ? `${targetWeight} kg` : '--'}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
                  <span className="text-sm font-medium">Bu Ay</span>
                  <span className={`font-bold ${
                    monthChange && monthChange < 0 ? 'text-green-600' : 
                    monthChange && monthChange > 0 ? 'text-red-600' : ''
                  }`}>
                    {monthChange ? `${monthChange > 0 ? '+' : ''}${monthChange.toFixed(1)} kg` : '--'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="text-sm text-muted-foreground">Toplam Kayıt</span>
                  <span className="font-semibold">{weightLogs.length}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Chart & History */}
          <div className="lg:col-span-2 space-y-6">
            {/* Weight Chart - Basit görselleştirme */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Kilo Grafiği</CardTitle>
                <CardDescription>Son 30 günlük ilerleme</CardDescription>
              </CardHeader>
              <CardContent>
                {weightLogs.length > 0 ? (
                  <div className="space-y-4">
                    {/* Basit çizgi grafik simülasyonu */}
                    <div className="h-64 flex items-end gap-1 bg-muted/30 rounded-lg p-4">
                      {last30Days.slice(0, 30).reverse().map((log, i) => {
                        const maxWeight = Math.max(...last30Days.map(l => l.weight))
                        const minWeight = Math.min(...last30Days.map(l => l.weight))
                        const range = maxWeight - minWeight || 1
                        const height = ((log.weight - minWeight) / range) * 100
                        
                        return (
                          <div
                            key={log.id}
                            className="flex-1 bg-primary/70 hover:bg-primary rounded-t transition-all cursor-pointer relative group"
                            style={{ height: `${Math.max(height, 10)}%` }}
                            title={`${format(new Date(log.date), 'dd MMM', { locale: tr })}: ${log.weight}kg`}
                          >
                            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
                              {log.weight}kg
                            </div>
                          </div>
                        )
                      })}
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>30 gün önce</span>
                      <span>Bugün</span>
                    </div>
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
                    <div className="text-center text-muted-foreground">
                      <p className="text-4xl mb-2">📊</p>
                      <p className="font-medium">Henüz kayıt yok</p>
                      <p className="text-sm mt-1">İlk kilonu kaydet, grafiğin oluşsun!</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Weight History */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Kilo Geçmişi</CardTitle>
                <CardDescription>Tüm kayıtların ({weightLogs.length})</CardDescription>
              </CardHeader>
              <CardContent>
                {weightLogs.length > 0 ? (
                  <div className="space-y-3">
                    {weightLogs.slice(0, 10).map((log, index) => {
                      const prevLog = weightLogs[index + 1]
                      const diff = prevLog ? log.weight - prevLog.weight : null
                      
                      return (
                        <div key={log.id} className="flex items-center justify-between p-4 border rounded-lg hover:border-primary transition-colors">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                              <p className="text-2xl font-bold">{log.weight} kg</p>
                              {diff !== null && (
                                <span className={`text-sm font-medium flex items-center gap-1 ${
                                  diff < 0 ? 'text-green-600' : diff > 0 ? 'text-red-600' : 'text-muted-foreground'
                                }`}>
                                  {diff < 0 ? <TrendingDown className="h-3 w-3" /> : diff > 0 ? <TrendingUp className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
                                  {diff !== 0 ? `${diff > 0 ? '+' : ''}${diff.toFixed(1)} kg` : 'Değişim yok'}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(log.date), 'dd MMMM yyyy, EEEE', { locale: tr })}
                              {' • '}
                              {formatDistanceToNow(new Date(log.date), { addSuffix: true, locale: tr })}
                            </p>
                            {log.note && (
                              <p className="text-sm text-muted-foreground mt-1 italic">
                                💭 {log.note}
                              </p>
                            )}
                          </div>
                        </div>
                      )
                    })}

                    {weightLogs.length > 10 && (
                      <div className="text-center py-4">
                        <p className="text-sm text-muted-foreground">
                          {weightLogs.length - 10} kayıt daha var
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <p className="text-4xl mb-4">⚖️</p>
                    <p className="font-medium mb-2">Henüz kayıt yok</p>
                    <p className="text-sm">Sol taraftaki formu kullanarak ilk kilonu kaydet!</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="shadow-lg bg-gradient-to-br from-primary/5 to-purple-500/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  💡 İpuçları
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Kilonu her gün aynı saatte ölç (tercihen sabah aç karnına)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Günlük dalgalanmalar normal, haftalık ortalamaya bak</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Haftada 0.5-1kg kayıp sağlıklı kabul edilir</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Sadece kiloya odaklanma, ölçülerini de takip et</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Fotoğraf çekerek görsel ilerleme kaydet</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
