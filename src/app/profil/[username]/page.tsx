import Link from 'next/link'
import { notFound } from 'next/navigation'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Navbar } from '@/components/navbar'
import { FollowButton, MessageButton } from './profile-client'
import { formatDistanceToNow, format, subDays } from 'date-fns'
import { tr } from 'date-fns/locale'
import { 
  Calendar,
  Heart,
  MessageSquare,
  Eye,
  TrendingDown,
  TrendingUp,
  Award,
  Target,
  Activity,
  Flame,
  Camera
} from 'lucide-react'
import { Metadata } from 'next'
import { getSetting } from '@/lib/settings'

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const { username } = await params
  
  const user = await db.user.findUnique({
    where: { username },
    select: {
      name: true,
      username: true,
      bio: true,
      image: true,
      _count: {
        select: {
          plans: { where: { status: 'published' } },
          followers: true,
        },
      },
    },
  })

  if (!user) {
    return {
      title: 'Kullanıcı Bulunamadı',
    }
  }

  const siteUrl = await getSetting('siteUrl', 'https://zayiflamaplan.com')
  const displayName = user.name || user.username || 'Anonim'
  const description = user.bio 
    ? `${user.bio} | ${user._count.plans} plan, ${user._count.followers} takipçi`
    : `@${user.username} - ${user._count.plans} plan, ${user._count.followers} takipçi`

  return {
    title: `${displayName} (@${user.username})`,
    description: description,
    openGraph: {
      type: 'profile',
      locale: 'tr_TR',
      url: `${siteUrl}/profil/${username}`,
      title: `${displayName} (@${user.username})`,
      description: description,
      siteName: 'ZayiflamaPlan',
      images: user.image ? [
        {
          url: user.image,
          width: 400,
          height: 400,
          alt: displayName,
        },
      ] : [],
    },
    twitter: {
      card: 'summary',
      title: `${displayName} (@${user.username})`,
      description: description,
      images: user.image ? [user.image] : [],
    },
    alternates: {
      canonical: `/profil/${username}`,
    },
  }
}

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params
  const session = await auth()

  // Fetch user data with more details
  const user = await db.user.findUnique({
    where: { username },
    select: {
      id: true,
      name: true,
      username: true,
      bio: true,
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
        },
      },
    },
  })

  if (!user) {
    notFound()
  }

  const isOwnProfile = session?.user?.id === user.id

  // Check if current user is following this profile
  let isFollowing = false
  if (session?.user?.id && !isOwnProfile) {
    const follow = await db.follow.findUnique({
      where: {
        userId_targetId: {
          userId: session.user.id,
          targetId: user.id,
        },
      },
    })
    isFollowing = !!follow
  }

  // Fetch user's published plans with more stats
  const plans = await db.plan.findMany({
    where: {
      authorId: user.id,
      status: 'published',
    },
    orderBy: { publishedAt: 'desc' },
    take: 12,
    select: {
      id: true,
      slug: true,
      title: true,
      description: true,
      duration: true,
      targetWeightLoss: true,
      difficulty: true,
      likesCount: true,
      commentsCount: true,
      views: true,
      createdAt: true,
      publishedAt: true,
    },
  })

  // Fetch weight logs for progress tracking
  const weightLogs = await db.weightLog.findMany({
    where: { userId: user.id },
    orderBy: { date: 'desc' },
    take: 30,
  })

  // Fetch recent activity
  const recentComments = await db.comment.findMany({
    where: { 
      authorId: user.id,
      status: 'visible'
    },
    orderBy: { createdAt: 'desc' },
    take: 5,
    select: {
      id: true,
      body: true,
      createdAt: true,
      plan: {
        select: {
          slug: true,
          title: true,
        }
      }
    }
  })

  const recentLikes = await db.like.findMany({
    where: { userId: user.id },
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
  })

  // Fetch progress photos
  const progressPhotos = await db.progressPhoto.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    take: 12,
    select: {
      id: true,
      photoUrl: true,
      weight: true,
      type: true,
      caption: true,
      createdAt: true,
    },
  })

  // Calculate stats
  const weightLoss = user.currentWeight && user.targetWeight 
    ? user.currentWeight - user.targetWeight 
    : null

  const startWeight = weightLogs.length > 0 ? weightLogs[weightLogs.length - 1].weight : user.currentWeight
  const totalWeightLoss = startWeight && user.currentWeight ? startWeight - user.currentWeight : null

  const membershipDays = Math.floor(
    (Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)
  )

  const totalViews = plans.reduce((sum, plan) => sum + plan.views, 0)
  const totalLikes = plans.reduce((sum, plan) => sum + plan.likesCount, 0)
  const totalComments = plans.reduce((sum, plan) => sum + plan.commentsCount, 0)

  const bmi = user.height && user.currentWeight 
    ? user.currentWeight / Math.pow(user.height / 100, 2)
    : null

  const difficultyLabels = {
    easy: 'Kolay',
    medium: 'Orta',
    hard: 'Zor',
  }

  const difficultyColors = {
    easy: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    hard: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-muted/20">
      <Navbar />

      {/* Cover Image Area */}
      <div className="h-48 bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20 relative z-0">
        <div className="absolute inset-0 bg-grid-white/10" />
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 -mt-20 pb-8 max-w-7xl relative z-10">
        {/* Profile Header Card */}
        <Card className="mb-8 shadow-xl relative z-10">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
              {/* Avatar */}
              <div className="relative -mt-20">
                <div className="w-32 h-32 rounded-full bg-background border-4 border-background shadow-xl flex items-center justify-center overflow-hidden">
                  {user.image ? (
                    <img src={user.image} alt={user.name || ''} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-5xl">👤</span>
                  )}
                </div>
                {membershipDays < 30 && (
                  <Badge className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-500 to-orange-500">
                    Yeni Üye
                  </Badge>
                )}
              </div>

              {/* User Info */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-1">
                      {user.name || `@${user.username}`}
                    </h1>
                    <p className="text-muted-foreground flex items-center gap-2">
                      @{user.username}
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(user.createdAt), 'MMMM yyyy', { locale: tr })} tarihinde katıldı
                      </span>
                    </p>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {session?.user && isOwnProfile ? (
                      <Link href="/ayarlar">
                        <Button variant="default" size="default">
                          <Activity className="h-4 w-4 mr-2" />
                          Profili Düzenle
                        </Button>
                      </Link>
                    ) : (
                      <>
                        <FollowButton 
                          targetUserId={user.id} 
                          initialIsFollowing={isFollowing}
                          isOwnProfile={isOwnProfile}
                        />
                        <MessageButton userId={user.id} username={user.username!} isOwnProfile={isOwnProfile} />
                      </>
                    )}
                  </div>
                </div>

                {/* Bio */}
                {user.bio && (
                  <p className="text-muted-foreground mb-4 max-w-2xl">
                    {user.bio}
                  </p>
                )}

                {/* Stats Row */}
                <div className="flex flex-wrap gap-6">
                  <Link href="#plans" className="hover:text-primary transition-colors">
                    <span className="text-2xl font-bold">{user._count.plans}</span>
                    <span className="text-sm text-muted-foreground ml-1">Plan</span>
                  </Link>
                  <div className="cursor-pointer hover:text-primary transition-colors">
                    <span className="text-2xl font-bold">{user._count.followers}</span>
                    <span className="text-sm text-muted-foreground ml-1">Takipçi</span>
                  </div>
                  <div className="cursor-pointer hover:text-primary transition-colors">
                    <span className="text-2xl font-bold">{user._count.following}</span>
                    <span className="text-sm text-muted-foreground ml-1">Takip</span>
                  </div>
                  <div>
                    <span className="text-2xl font-bold">{totalViews.toLocaleString('tr-TR')}</span>
                    <span className="text-sm text-muted-foreground ml-1">Görüntülenme</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Weight Stats */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Mevcut Kilo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold mb-1">
                {user.currentWeight ? `${user.currentWeight} kg` : '--'}
              </p>
              {user.targetWeight && (
                <p className="text-xs text-muted-foreground">
                  Hedef: {user.targetWeight} kg
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <TrendingDown className="h-4 w-4" />
                Toplam Kayıp
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold mb-1 text-green-600 flex items-center gap-2">
                {totalWeightLoss && totalWeightLoss > 0 ? (
                  <>
                    <TrendingDown className="h-6 w-6" />
                    {totalWeightLoss.toFixed(1)} kg
                  </>
                ) : '--'}
              </p>
              {weightLogs.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  {weightLogs.length} kayıt
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                Etkileşim
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold mb-1">
                {totalLikes + totalComments}
              </p>
              <p className="text-xs text-muted-foreground">
                {totalLikes} beğeni • {totalComments} yorum
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <Flame className="h-4 w-4" />
                Aktivite
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold mb-1">
                {membershipDays}
              </p>
              <p className="text-xs text-muted-foreground">
                gündür üye
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Content */}
        <Tabs defaultValue="plans" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-[500px]">
            <TabsTrigger value="plans" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              Planlar ({user._count.plans})
            </TabsTrigger>
            <TabsTrigger value="photos" className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Fotoğraflar ({progressPhotos.length})
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Aktivite
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4" />
              İstatistikler
            </TabsTrigger>
          </TabsList>

          {/* Photos Tab */}
          <TabsContent value="photos">
            {progressPhotos.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {progressPhotos.map((photo) => (
                  <Card key={photo.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
                    <div className="relative aspect-[3/4] bg-muted">
                      <img
                        src={photo.photoUrl}
                        alt={photo.caption || 'İlerleme fotoğrafı'}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2">
                        <Badge variant="secondary" className="text-xs">
                          {photo.type === 'before' ? 'Başlangıç' : photo.type === 'after' ? 'Sonuç' : 'İlerleme'}
                        </Badge>
                      </div>
                      {photo.weight && (
                        <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                          {photo.weight} kg
                        </div>
                      )}
                    </div>
                    {photo.caption && (
                      <CardContent className="p-3">
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {photo.caption}
                        </p>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Camera className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-lg font-medium mb-2">Henüz fotoğraf yok</p>
                  {isOwnProfile && (
                    <>
                      <p className="text-sm text-muted-foreground mb-4">
                        İlerlemenizi fotoğraflarla takip edin
                      </p>
                      <Button asChild>
                        <Link href="/fotograflar">Fotoğraf Yükle</Link>
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Plans Tab */}
          <TabsContent value="plans" id="plans">
            {plans.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plans.map((plan) => (
                  <Card key={plan.id} className="hover:shadow-xl transition-all hover:-translate-y-1">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <Badge className={difficultyColors[plan.difficulty]}>
                          {difficultyLabels[plan.difficulty]}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {plan.publishedAt 
                            ? formatDistanceToNow(new Date(plan.publishedAt), { addSuffix: true, locale: tr })
                            : formatDistanceToNow(new Date(plan.createdAt), { addSuffix: true, locale: tr })}
                        </span>
                      </div>
                      <CardTitle className="text-lg line-clamp-1 hover:text-primary transition-colors">
                        <Link href={`/plan/${plan.slug}`}>
                          {plan.title}
                        </Link>
                      </CardTitle>
                      <CardDescription className="line-clamp-2">
                        {plan.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {plan.duration} gün
                        </span>
                        {plan.targetWeightLoss && (
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <Target className="h-3 w-3" />
                            {plan.targetWeightLoss}kg
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          {plan.likesCount}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          {plan.commentsCount}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {plan.views}
                        </span>
                      </div>
                      <Button asChild className="w-full" variant="outline">
                        <Link href={`/plan/${plan.slug}`}>Planı Görüntüle</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Award className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-lg font-medium mb-2">Henüz yayınlanmış plan yok</p>
                  {isOwnProfile && (
                    <>
                      <p className="text-sm text-muted-foreground mb-4">
                        İlk planını oluştur ve topluluğa katıl!
                      </p>
                      <Button asChild>
                        <Link href="/plan-ekle">İlk Planını Oluştur</Link>
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Comments */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Son Yorumlar
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {recentComments.length > 0 ? (
                    <div className="space-y-4">
                      {recentComments.map((comment) => (
                        <div key={comment.id} className="border-b pb-3 last:border-0">
                          <Link 
                            href={`/plan/${comment.plan.slug}`}
                            className="text-sm font-medium hover:text-primary line-clamp-1"
                          >
                            {comment.plan.title}
                          </Link>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            "{comment.body}"
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: tr })}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      Henüz yorum yok
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Recent Likes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Son Beğeniler
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {recentLikes.length > 0 ? (
                    <div className="space-y-3">
                      {recentLikes.map((like, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <Link 
                            href={`/plan/${like.plan.slug}`}
                            className="text-sm hover:text-primary line-clamp-1 flex-1"
                          >
                            {like.plan.title}
                          </Link>
                          <span className="text-xs text-muted-foreground ml-2">
                            {formatDistanceToNow(new Date(like.createdAt), { addSuffix: true, locale: tr })}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      Henüz beğeni yok
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Stats Tab */}
          <TabsContent value="stats">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Weight Progress */}
              <Card>
                <CardHeader>
                  <CardTitle>Kilo İlerlemesi</CardTitle>
                  <CardDescription>Son 30 günlük kayıtlar</CardDescription>
                </CardHeader>
                <CardContent>
                  {weightLogs.length > 0 ? (
                    <div className="space-y-4">
                      <div className="h-48 flex items-end gap-1 bg-muted/30 rounded-lg p-4">
                        {weightLogs.slice(0, 30).reverse().map((log, i) => {
                          const maxWeight = Math.max(...weightLogs.map(l => l.weight))
                          const minWeight = Math.min(...weightLogs.map(l => l.weight))
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
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-xs text-muted-foreground">Başlangıç</p>
                          <p className="text-lg font-bold">{startWeight ? `${startWeight}kg` : '--'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Şu An</p>
                          <p className="text-lg font-bold">{user.currentWeight ? `${user.currentWeight}kg` : '--'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Hedef</p>
                          <p className="text-lg font-bold">{user.targetWeight ? `${user.targetWeight}kg` : '--'}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-12">
                      Henüz kilo kaydı yok
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Overall Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Genel İstatistikler</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="text-sm">Toplam Plan</span>
                    <span className="font-bold">{user._count.plans}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="text-sm">Toplam Görüntülenme</span>
                    <span className="font-bold">{totalViews.toLocaleString('tr-TR')}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="text-sm">Toplam Beğeni</span>
                    <span className="font-bold">{totalLikes}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="text-sm">Toplam Yorum</span>
                    <span className="font-bold">{totalComments}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="text-sm">Verilen Yorum</span>
                    <span className="font-bold">{user._count.comments}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="text-sm">Verilen Beğeni</span>
                    <span className="font-bold">{user._count.likes}</span>
                  </div>
                  {bmi && (
                    <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
                      <span className="text-sm">BMI</span>
                      <span className="font-bold">{bmi.toFixed(1)}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
