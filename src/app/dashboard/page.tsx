import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { checkUserBan } from '@/lib/check-ban'
import { db } from '@/lib/db'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Navbar } from '@/components/navbar'
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
  const totalComments = userPlans.reduce((sum, plan) => sum + plan.commentsCount, 0)

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
    <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-muted/20">
      <Navbar />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Welcome Section */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Merhaba, {user?.name || 'Kullanıcı'}! 👋
            </h1>
            <p className="text-muted-foreground flex items-center gap-2">
              <Flame className="h-4 w-4 text-orange-500" />
              {streak > 0 ? `${streak} günlük seri devam ediyor!` : 'Bugün hedeflerine bir adım daha yaklaş!'}
            </p>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <Button asChild size="lg" className="shadow-lg">
              <Link href="/plan-ekle">
                <Award className="h-4 w-4 mr-2" />
                Yeni Plan Oluştur
              </Link>
            </Button>
          </div>
        </div>

        {/* Hero Stats - Kilo Takibi */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Ana Kilo Kartı */}
          <Card className="lg:col-span-2 border-2 shadow-lg bg-gradient-to-br from-card to-muted/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardDescription className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Kilo Takibi
                  </CardDescription>
                  <CardTitle className="text-5xl mt-2">
                    {user?.currentWeight ? `${user.currentWeight} kg` : '--'}
                  </CardTitle>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href="/kilo-takibi">Güncelle</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Hedef</p>
                  <p className="text-2xl font-bold">
                    {user?.targetWeight ? `${user.targetWeight} kg` : '--'}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Kalan</p>
                  <p className="text-2xl font-bold text-orange-600 flex items-center gap-1">
                    {weightDiff && weightDiff > 0 ? (
                      <>
                        <TrendingDown className="h-5 w-5" />
                        {weightDiff.toFixed(1)} kg
                      </>
                    ) : '--'}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Bu Hafta</p>
                  <p className={`text-2xl font-bold flex items-center gap-1 ${
                    weightChange && weightChange < 0 ? 'text-green-600' : 
                    weightChange && weightChange > 0 ? 'text-red-600' : ''
                  }`}>
                    {weightChange ? (
                      <>
                        {weightChange < 0 ? <TrendingDown className="h-5 w-5" /> : <TrendingUp className="h-5 w-5" />}
                        {Math.abs(weightChange).toFixed(1)} kg
                      </>
                    ) : '--'}
                  </p>
                </div>
              </div>
              
              {/* Progress Bar */}
              {user?.currentWeight && user?.targetWeight && (
                <div className="mt-6">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-muted-foreground">İlerleme</span>
                    <span className="font-medium">
                      {weightDiff && weightDiff > 0 
                        ? `%${Math.max(0, Math.min(100, ((1 - (weightDiff / (user.currentWeight - user.targetWeight))) * 100))).toFixed(0)}`
                        : '100%'}
                    </span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-600 transition-all duration-500"
                      style={{ 
                        width: weightDiff && weightDiff > 0 
                          ? `${Math.max(0, Math.min(100, ((1 - (weightDiff / (user.currentWeight - user.targetWeight))) * 100)))}%`
                          : '100%'
                      }}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* BMI Kartı */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardDescription className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Vücut Kitle İndeksi
              </CardDescription>
              <CardTitle className="text-4xl">
                {bmi ? bmi.toFixed(1) : '--'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {bmiCategory && (
                <div className="space-y-4">
                  <div>
                    <Badge className={bmiCategory.color}>
                      {bmiCategory.label}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Boy</p>
                    <p className="text-lg font-semibold">
                      {user?.height ? `${user.height} cm` : '--'}
                    </p>
                  </div>
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link href="/ayarlar">Bilgileri Güncelle</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* İstatistik Kartları */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2 text-xs">
                <Eye className="h-3 w-3" />
                Toplam Görüntülenme
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{totalViews.toLocaleString('tr-TR')}</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2 text-xs">
                <Heart className="h-3 w-3" />
                Toplam Beğeni
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-red-600">{totalLikes}</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2 text-xs">
                <MessageSquare className="h-3 w-3" />
                Toplam Yorum
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-600">{totalComments}</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2 text-xs">
                <Users className="h-3 w-3" />
                Takipçi
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-purple-600">{user?._count.followers || 0}</p>
            </CardContent>
          </Card>
        </div>

        {/* Ana İçerik Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Sol Kolon - Planlarım ve Aktiviteler */}
          <div className="lg:col-span-2 space-y-6">
            {/* Planlarım */}
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Planlarım
                    </CardTitle>
                    <CardDescription>Son oluşturduğun planlar</CardDescription>
                  </div>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/planlarim">Tümünü Gör</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {userPlans.length > 0 ? (
                  <div className="space-y-3">
                    {userPlans.map((plan) => (
                      <Link
                        key={plan.id}
                        href={`/plan/${plan.slug}`}
                        className="block p-4 rounded-lg border hover:border-primary hover:shadow-md transition-all group"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold group-hover:text-primary transition-colors line-clamp-1">
                            {plan.title}
                          </h4>
                          <Badge variant={
                            plan.status === 'published' ? 'default' :
                            plan.status === 'pending' ? 'secondary' :
                            'outline'
                          }>
                            {plan.status === 'published' ? 'Yayında' :
                             plan.status === 'pending' ? 'Bekliyor' :
                             plan.status === 'draft' ? 'Taslak' : 'Reddedildi'}
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
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">Henüz plan oluşturmadın</p>
                    <Button asChild>
                      <Link href="/plan-ekle">İlk Planını Oluştur</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Topluluk Akışı */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Topluluk Akışı
                </CardTitle>
                <CardDescription>
                  Takip ettiğin kişilerin son aktiviteleri
                </CardDescription>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>
          </div>

          {/* Sağ Kolon - Hızlı İşlemler ve Son Aktiviteler */}
          <div className="space-y-6">
            {/* Gamification Widget */}
            <GamificationWidget />
            
            {/* İlerleme Fotoğrafları */}
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Camera className="h-5 w-5" />
                      İlerleme Fotoğrafları
                    </CardTitle>
                    <CardDescription>
                      Değişimini görselleştir
                    </CardDescription>
                  </div>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/fotograflar">Tümü</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {progressPhotos.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {progressPhotos.map((photo) => (
                      <Link
                        key={photo.id}
                        href="/fotograflar"
                        className="relative aspect-square rounded-lg overflow-hidden group"
                      >
                        <img
                          src={photo.photoUrl}
                          alt="İlerleme fotoğrafı"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                        {photo.weight && (
                          <div className="absolute bottom-1 right-1 bg-black/70 text-white px-1.5 py-0.5 rounded text-xs">
                            {photo.weight}kg
                          </div>
                        )}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Camera className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                    <p className="text-sm text-muted-foreground mb-3">
                      Henüz fotoğraf yok
                    </p>
                    <Button asChild size="sm">
                      <Link href="/fotograflar">
                        <Camera className="h-4 w-4 mr-2" />
                        İlk Fotoğrafı Yükle
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Hızlı İşlemler */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Hızlı İşlemler</CardTitle>
                <CardDescription>
                  Bugün ne yapmak istersin?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button asChild className="w-full justify-start" variant="outline">
                  <Link href="/plan-ekle">
                    <Award className="h-4 w-4 mr-2" />
                    Yeni Plan Oluştur
                  </Link>
                </Button>
                <Button asChild className="w-full justify-start" variant="outline">
                  <Link href="/kilo-takibi">
                    <Target className="h-4 w-4 mr-2" />
                    Kilo Kaydet
                  </Link>
                </Button>
                <Button asChild className="w-full justify-start" variant="outline">
                  <Link href="/fotograflar">
                    <Camera className="h-4 w-4 mr-2" />
                    Fotoğraf Yükle
                  </Link>
                </Button>
                <Button asChild className="w-full justify-start" variant="outline">
                  <Link href="/kesfet">
                    <Users className="h-4 w-4 mr-2" />
                    Planları Keşfet
                  </Link>
                </Button>
                <Button asChild className="w-full justify-start" variant="outline">
                  <Link href="/gruplar">
                    👥
                    <span className="ml-2">Gruplara Katıl</span>
                  </Link>
                </Button>
                <Button asChild className="w-full justify-start" variant="outline">
                  <Link href={`/profil/${user?.username}`}>
                    <Activity className="h-4 w-4 mr-2" />
                    Profilimi Görüntüle
                  </Link>
                </Button>
                <Button asChild className="w-full justify-start" variant="outline">
                  <Link href="/dashboard/itirazlarim">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    İtirazlarım
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Son Aktivitelerim */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Son Aktivitelerim</CardTitle>
                <CardDescription>
                  Platformdaki son hareketlerin
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm">
                  {userLikes.length > 0 && (
                    <div>
                      <p className="font-medium mb-2 flex items-center gap-2">
                        <Heart className="h-4 w-4 text-red-500" />
                        Son Beğeniler
                      </p>
                      <div className="space-y-2 pl-6">
                        {userLikes.slice(0, 3).map((like, i) => (
                          <Link
                            key={i}
                            href={`/plan/${like.plan.slug}`}
                            className="block text-xs text-muted-foreground hover:text-primary line-clamp-1"
                          >
                            {like.plan.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {userComments.length > 0 && (
                    <div>
                      <p className="font-medium mb-2 flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-blue-500" />
                        Son Yorumlar
                      </p>
                      <div className="space-y-2 pl-6">
                        {userComments.slice(0, 3).map((comment, i) => (
                          <Link
                            key={i}
                            href={`/plan/${comment.plan.slug}`}
                            className="block text-xs text-muted-foreground hover:text-primary line-clamp-2"
                          >
                            "{comment.body}"
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {userLikes.length === 0 && userComments.length === 0 && (
                    <p className="text-center text-muted-foreground py-4">
                      Henüz aktivite yok
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Motivasyon */}
            <Card className="shadow-lg bg-gradient-to-br from-primary/10 to-purple-500/10 border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg">💪 Motivasyon</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm italic text-muted-foreground">
                  "Başarı, küçük çabaların günlük tekrarıdır."
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Bugün de harika gidiyorsun! 🌟
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

      </main>
    </div>
  )
}
