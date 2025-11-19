import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { checkUserBan } from '@/lib/check-ban'
import { db } from '@/lib/db'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/layout/footer'
import { GamificationWidget } from '@/components/gamification-widget'
import Link from 'next/link'
import { formatDistanceToNow, startOfWeek, endOfWeek, subDays } from 'date-fns'
import { tr } from 'date-fns/locale'
import { 
  TrendingUp, 
  TrendingDown,
  Target,
  Calendar,
  Users,
  Heart,
  MessageSquare,
  Eye,
  Award,
  Flame,
  Activity,
  Camera
} from 'lucide-react'

export default async function DashboardPage() {
  const session = await checkUserBan()

  if (!session?.user) {
    redirect('/giris')
  }

  const now = new Date()
  const weekStart = startOfWeek(now, { locale: tr })
  const weekEnd = endOfWeek(now, { locale: tr })
  const last7Days = subDays(now, 7)

  // Kullanıcı verilerini veritabanından çek
  const [user, userPlans, userLikes, userComments, weightLogs, followingIds, progressPhotos] = await Promise.all([
    db.user.findUnique({
      where: { id: session.user.id },
      select: {
        name: true,
        username: true,
        image: true,
        currentWeight: true,
        targetWeight: true,
        height: true,
        createdAt: true,
        _count: {
          select: {
            plans: { where: { status: 'published' } },
            followers: true,
            following: true,
            likes: true,
            comments: true,
          }
        }
      }
    }),
    // Kullanıcının planları
    db.plan.findMany({
      where: { authorId: session.user.id },
      select: {
        id: true,
        slug: true,
        title: true,
        status: true,
        likesCount: true,
        commentsCount: true,
        views: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    // Son beğeniler
    db.like.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        createdAt: true,
        plan: {
          select: {
            slug: true,
            title: true,
          }
        }
      }
    }),
    // Son yorumlar
    db.comment.findMany({
      where: { authorId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        createdAt: true,
        body: true,
        plan: {
          select: {
            slug: true,
            title: true,
          }
        }
      }
    }),
    // Kilo kayıtları (son 7 gün)
    db.weightLog.findMany({
      where: {
        userId: session.user.id,
        date: { gte: last7Days }
      },
      orderBy: { date: 'desc' },
      take: 7,
    }),
    // Takip edilenler
    db.follow.findMany({
      where: { userId: session.user.id },
      select: { targetId: true },
    }),
    // İlerleme fotoğrafları
    db.progressPhoto.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 4,
      select: {
        id: true,
        photoUrl: true,
        type: true,
        weight: true,
        createdAt: true,
      },
    }),
  ])

  // Takip edilen kişilerin son aktivitelerini çek
  const recentActivity = followingIds.length > 0 
    ? await db.plan.findMany({
        where: {
          authorId: { in: followingIds.map(f => f.targetId) },
          status: 'published',
        },
        orderBy: { publishedAt: 'desc' },
        take: 5,
        select: {
          id: true,
          slug: true,
          title: true,
          description: true,
          publishedAt: true,
          likesCount: true,
          commentsCount: true,
          author: {
            select: {
              username: true,
              name: true,
              image: true,
            },
          },
        },
      })
    : []

  // İstatistikler
  const weightDiff = user?.currentWeight && user?.targetWeight 
    ? user.currentWeight - user.targetWeight 
    : null

  const bmi = user?.height && user?.currentWeight 
    ? user.currentWeight / Math.pow(user.height / 100, 2)
    : null

  const totalViews = userPlans.reduce((sum, plan) => sum + plan.views, 0)
  const totalLikes = userPlans.reduce((sum, plan) => sum + plan.likesCount, 0)
  const totalCommentsReceived = userPlans.reduce((sum, plan) => sum + plan.commentsCount, 0)
  const totalCommentsGiven = userComments.length

  // Kilo değişimi (son 7 gün)
  const weightChange = weightLogs.length >= 2 
    ? weightLogs[0].weight - weightLogs[weightLogs.length - 1].weight
    : null

  // Streak hesaplama (basit versiyon)
  const streak = weightLogs.length

  // BMI kategorisi
  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { label: 'Zayıf', color: 'text-blue-600' }
    if (bmi < 25) return { label: 'Normal', color: 'text-green-600' }
    if (bmi < 30) return { label: 'Fazla Kilolu', color: 'text-yellow-600' }
    return { label: 'Obez', color: 'text-red-600' }
  }

  const bmiCategory = bmi ? getBMICategory(bmi) : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/30 dark:from-slate-950 dark:via-purple-950/20 dark:to-pink-950/20">
      <Navbar />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 md:py-8 max-w-7xl">
        {/* Hero Welcome Section */}
        <div className="mb-8 relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 p-8 md:p-10 shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_70%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.05),transparent_70%)]" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-4">
              <Link href={`/profil/${user?.username}`} className="group">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl md:text-5xl border-2 border-white/30 group-hover:border-white/60 transition-all group-hover:scale-105 cursor-pointer">
                  {user?.image ? (
                    <img src={user.image} alt="" className="w-full h-full rounded-2xl object-cover" />
                  ) : (
                    '👤'
                  )}
                </div>
              </Link>
              <div>
                <Link href={`/profil/${user?.username}`} className="group">
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-1 group-hover:text-white/90 transition-colors">
                    Hoş geldin, {user?.name || 'Kullanıcı'}! 👋
                  </h1>
                </Link>
                <p className="text-white/90 flex items-center gap-2 text-sm md:text-base">
                  {streak > 0 ? (
                    <>
                      <Flame className="h-5 w-5" />
                      <span className="font-semibold">{streak} günlük</span> seri devam ediyor! 🔥
                    </>
                  ) : (
                    'Bugün hedeflerine bir adım daha yaklaş! 💪'
                  )}
                </p>
              </div>
            </div>
            <Button asChild size="lg" className="bg-white text-purple-600 hover:bg-white/90 shadow-xl hover:shadow-2xl transition-all hover:scale-105 font-semibold">
              <Link href="/plan-ekle">
                <Award className="h-5 w-5 mr-2" />
                Yeni Plan Oluştur
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Overview - Modern Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Kilo Kartı */}
          <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-emerald-500 to-green-600">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.1),transparent_50%)]" />
            <CardContent className="pt-6 pb-6 relative">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <Button asChild size="sm" variant="ghost" className="text-white hover:bg-white/20 h-8">
                  <Link href="/kilo-takibi">Güncelle</Link>
                </Button>
              </div>
              <p className="text-white/80 text-xs font-medium mb-1">Mevcut Kilo</p>
              <p className="text-4xl font-black text-white mb-1">
                {user?.currentWeight || '--'}
                <span className="text-xl ml-1">kg</span>
              </p>
              <p className="text-white/70 text-xs">
                Hedef: {user?.targetWeight || '--'} kg
              </p>
            </CardContent>
          </Card>

          {/* BMI Kartı */}
          <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-blue-500 to-cyan-600">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.1),transparent_50%)]" />
            <CardContent className="pt-6 pb-6 relative">
              <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm mb-4 w-fit">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <p className="text-white/80 text-xs font-medium mb-1">BMI</p>
              <p className="text-4xl font-black text-white mb-2">
                {bmi ? bmi.toFixed(1) : '--'}
              </p>
              {bmiCategory && (
                <Badge className="bg-white/20 text-white border-0 hover:bg-white/30">
                  {bmiCategory.label}
                </Badge>
              )}
            </CardContent>
          </Card>

          {/* İlerleme Kartı */}
          <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-purple-500 to-pink-600">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.1),transparent_50%)]" />
            <CardContent className="pt-6 pb-6 relative">
              <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm mb-4 w-fit">
                <TrendingDown className="h-6 w-6 text-white" />
              </div>
              <p className="text-white/80 text-xs font-medium mb-1">Kalan</p>
              <p className="text-4xl font-black text-white mb-1">
                {weightDiff && weightDiff > 0 ? weightDiff.toFixed(1) : '--'}
                <span className="text-xl ml-1">kg</span>
              </p>
              <p className="text-white/70 text-xs">
                Hedefe ulaşmak için
              </p>
            </CardContent>
          </Card>

          {/* Streak Kartı */}
          <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-orange-500 to-red-600">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.1),transparent_50%)]" />
            <CardContent className="pt-6 pb-6 relative">
              <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm mb-4 w-fit">
                <Flame className="h-6 w-6 text-white" />
              </div>
              <p className="text-white/80 text-xs font-medium mb-1">Streak</p>
              <p className="text-4xl font-black text-white mb-1">
                {streak}
                <span className="text-xl ml-1">gün</span>
              </p>
              <p className="text-white/70 text-xs">
                Devam ediyor! 🔥
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats - Glassmorphism */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="group relative overflow-hidden rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 p-5 hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <Eye className="h-5 w-5 text-purple-600 dark:text-purple-400 mb-3" />
              <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{totalViews.toLocaleString('tr-TR')}</p>
              <p className="text-xs text-muted-foreground font-medium">Görüntülenme</p>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 p-5 hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <Heart className="h-5 w-5 text-red-600 dark:text-red-400 mb-3" />
              <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{totalLikes}</p>
              <p className="text-xs text-muted-foreground font-medium">Beğeni</p>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 p-5 hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400 mb-3" />
              <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{totalCommentsReceived + totalCommentsGiven}</p>
              <p className="text-xs text-muted-foreground font-medium">Yorum</p>
              <p className="text-[10px] text-muted-foreground mt-1">↓{totalCommentsReceived} ↑{totalCommentsGiven}</p>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 p-5 hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <Users className="h-5 w-5 text-pink-600 dark:text-pink-400 mb-3" />
              <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{user?._count.followers || 0}</p>
              <p className="text-xs text-muted-foreground font-medium">Takipçi</p>
              <p className="text-[10px] text-muted-foreground mt-1">{user?._count.following || 0} takip</p>
            </div>
          </div>
        </div>

        {/* Ana İçerik Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Sol Kolon - Planlarım ve Aktiviteler */}
          <div className="lg:col-span-2 space-y-6">
            {/* Planlarım */}
            <div className="relative overflow-hidden rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 p-6 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600">
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Planlarım</h3>
                    <p className="text-xs text-muted-foreground">Son oluşturduğun planlar</p>
                  </div>
                </div>
                <Button asChild variant="outline" size="sm" className="rounded-xl">
                  <Link href="/planlarim">Tümünü Gör</Link>
                </Button>
              </div>
              {userPlans.length > 0 ? (
                <div className="space-y-3">
                  {userPlans.map((plan) => (
                    <Link
                      key={plan.id}
                      href={`/plan/${plan.slug}`}
                      className="block p-4 rounded-xl bg-white/40 dark:bg-slate-800/40 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 hover:bg-white/60 dark:hover:bg-slate-800/60 hover:shadow-lg transition-all group"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-1">
                          {plan.title}
                        </h4>
                        <Badge variant={
                          plan.status === 'published' ? 'default' :
                          plan.status === 'pending' ? 'secondary' :
                          'outline'
                        } className="shrink-0">
                          {plan.status === 'published' ? '✓ Yayında' :
                           plan.status === 'pending' ? '⏳ Bekliyor' :
                           plan.status === 'draft' ? '📝 Taslak' : '✗ Reddedildi'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {plan.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          {plan.likesCount}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          {plan.commentsCount}
                        </span>
                        <span className="ml-auto">
                          {formatDistanceToNow(new Date(plan.createdAt), { addSuffix: true, locale: tr })}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                    <Calendar className="h-8 w-8 text-white" />
                  </div>
                  <p className="text-muted-foreground mb-4">Henüz plan oluşturmadın</p>
                  <Button asChild className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                    <Link href="/plan-ekle">İlk Planını Oluştur</Link>
                  </Button>
                </div>
              )}
            </div>

            {/* Topluluk Akışı */}
            <div className="relative overflow-hidden rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Topluluk Akışı</h3>
                  <p className="text-xs text-muted-foreground">Takip ettiğin kişilerin son aktiviteleri</p>
                </div>
              </div>
              {recentActivity.length > 0 ? (
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-4 pb-4 border-b last:border-0">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          {activity.author.image ? (
                            <img 
                              src={activity.author.image} 
                              alt={activity.author.name || ''} 
                              className="w-full h-full rounded-full object-cover" 
                            />
                          ) : (
                            '👤'
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Link 
                              href={`/profil/${activity.author.username}`}
                              className="font-medium text-sm hover:underline"
                            >
                              @{activity.author.username || 'kullanici'}
                            </Link>
                            <span className="text-xs text-muted-foreground">
                              yeni plan paylaştı
                            </span>
                            <span className="text-xs text-muted-foreground">
                              • {activity.publishedAt 
                                  ? formatDistanceToNow(new Date(activity.publishedAt), { addSuffix: true, locale: tr })
                                  : 'yakın zamanda'}
                            </span>
                          </div>
                          <Link 
                            href={`/plan/${activity.slug}`}
                            className="block group"
                          >
                            <h4 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">
                              {activity.title}
                            </h4>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                              {activity.description}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>❤️ {activity.likesCount}</span>
                              <span>💬 {activity.commentsCount}</span>
                            </div>
                          </Link>
                        </div>
                      </div>
                    ))}
                    
                    <div className="text-center pt-2">
                      <Button asChild variant="outline" size="sm">
                        <Link href="/kesfet">Daha Fazla Keşfet</Link>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Henüz aktivite yok</p>
                    <p className="text-sm mt-2">
                      Başkalarını takip et, onların ilerlemelerini gör!
                    </p>
                    <Button asChild className="mt-4" variant="outline">
                      <Link href="/kesfet">Keşfet</Link>
                    </Button>
                  </div>
                )}
            </div>
          </div>

          {/* Sağ Kolon - Hızlı İşlemler ve Son Aktiviteler */}
          <div className="space-y-6">
            {/* Gamification Widget */}
            <div className="relative overflow-hidden rounded-2xl">
              <GamificationWidget />
            </div>
            
            {/* İlerleme Fotoğrafları */}
            <div className="relative overflow-hidden rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 p-6 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600">
                    <Camera className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Fotoğraflar</h3>
                    <p className="text-xs text-muted-foreground">Değişimini görselleştir</p>
                  </div>
                </div>
                <Button asChild variant="outline" size="sm" className="rounded-xl">
                  <Link href="/fotograflar">Tümü</Link>
                </Button>
              </div>
              {progressPhotos.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {progressPhotos.map((photo) => (
                    <Link
                      key={photo.id}
                      href="/fotograflar"
                      className="relative aspect-square rounded-xl overflow-hidden group"
                    >
                      <img
                        src={photo.photoUrl}
                        alt="İlerleme fotoğrafı"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      {photo.weight && (
                        <div className="absolute bottom-2 right-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-slate-900 dark:text-white px-2 py-1 rounded-lg text-xs font-semibold">
                          {photo.weight}kg
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
                    <Camera className="h-8 w-8 text-white" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Henüz fotoğraf yok
                  </p>
                  <Button asChild size="sm" className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700">
                    <Link href="/fotograflar">
                      <Camera className="h-4 w-4 mr-2" />
                      İlk Fotoğrafı Yükle
                    </Link>
                  </Button>
                </div>
              )}
            </div>

            {/* Hızlı İşlemler */}
            <div className="relative overflow-hidden rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 p-6 shadow-xl">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Hızlı İşlemler</h3>
              <div className="grid grid-cols-2 gap-3">
                <Link href={`/profil/${user?.username}`} className="group p-4 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 hover:shadow-lg transition-all hover:scale-105">
                  <Activity className="h-6 w-6 text-white mb-2" />
                  <p className="text-xs font-semibold text-white">Profilim</p>
                </Link>
                <Link href="/kilo-takibi" className="group p-4 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 hover:shadow-lg transition-all hover:scale-105">
                  <Target className="h-6 w-6 text-white mb-2" />
                  <p className="text-xs font-semibold text-white">Kilo Kaydet</p>
                </Link>
                <Link href="/fotograflar" className="group p-4 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 hover:shadow-lg transition-all hover:scale-105">
                  <Camera className="h-6 w-6 text-white mb-2" />
                  <p className="text-xs font-semibold text-white">Fotoğraf</p>
                </Link>
                <Link href="/kesfet" className="group p-4 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 hover:shadow-lg transition-all hover:scale-105">
                  <Users className="h-6 w-6 text-white mb-2" />
                  <p className="text-xs font-semibold text-white">Keşfet</p>
                </Link>
                <Link href="/gunah-sayaci" className="group p-4 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 hover:shadow-lg transition-all hover:scale-105">
                  <span className="text-2xl mb-2 block">😈</span>
                  <p className="text-xs font-semibold text-white">Günah Sayacı</p>
                </Link>
              </div>
            </div>

            {/* Son Aktivitelerim */}
            <div className="relative overflow-hidden rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 p-6 shadow-xl">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Son Aktivitelerim</h3>
              <div className="space-y-4 text-sm">
                {userLikes.length > 0 && (
                  <div>
                    <div className="font-semibold mb-3 flex items-center gap-2 text-slate-900 dark:text-white">
                      <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
                        <Heart className="h-4 w-4 text-red-600 dark:text-red-400" />
                      </div>
                      Son Beğeniler
                    </div>
                    <div className="space-y-2">
                      {userLikes.slice(0, 3).map((like, i) => (
                        <Link
                          key={i}
                          href={`/plan/${like.plan.slug}`}
                          className="block p-2 rounded-lg bg-white/40 dark:bg-slate-800/40 text-xs text-slate-700 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-800/60 transition-all line-clamp-1"
                        >
                          {like.plan.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
                
                {userComments.length > 0 && (
                  <div>
                    <div className="font-semibold mb-3 flex items-center gap-2 text-slate-900 dark:text-white">
                      <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                        <MessageSquare className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      Son Yorumlar
                    </div>
                    <div className="space-y-2">
                      {userComments.slice(0, 3).map((comment, i) => (
                        <Link
                          key={i}
                          href={`/plan/${comment.plan.slug}`}
                          className="block p-2 rounded-lg bg-white/40 dark:bg-slate-800/40 text-xs text-slate-700 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-800/60 transition-all line-clamp-2"
                        >
                          "{comment.body}"
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {userLikes.length === 0 && userComments.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    Henüz aktivite yok
                  </div>
                )}
              </div>
            </div>

            {/* Motivasyon */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 p-6 shadow-xl">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_70%)]" />
              <div className="relative">
                <p className="text-3xl mb-3">💪</p>
                <p className="text-base italic text-white leading-relaxed mb-3 font-medium">
                  "Başarı, küçük çabaların günlük tekrarıdır."
                </p>
                <p className="text-sm text-white/80">
                  Bugün de harika gidiyorsun! 🌟
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
