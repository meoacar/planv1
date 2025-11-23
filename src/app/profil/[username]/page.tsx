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
      email: true,
      image: true,
      bio: true,
      role: true,
      currentWeight: true,
      targetWeight: true,
      height: true,
      createdAt: true,
      level: true,
      xp: true,
      coins: true,
      streak: true,
      isPremium: true,
      premiumUntil: true,
      premiumType: true,
      _count: {
        select: {
          plans: { where: { status: 'published' } },
          followers: true,
          following: true,
          likes: true,
          comments: true,
          badges: true,
        },
      },
    },
  })

  if (!user) {
    notFound()
  }

  // Type assertion for cosmetic fields
  const userWithCosmetics = user as any

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
  
  // Total engagement: both received and given
  const totalEngagement = totalLikes + totalComments + user._count.likes + user._count.comments

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-purple-950/30">
      <Navbar />

      {/* Hero Cover - Minimal & Modern */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.15),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.1),transparent_70%)]" />
        <div className="h-48 md:h-56" />
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-12 max-w-6xl">
        {/* Profile Header - Clean & Elevated */}
        <div className="relative -mt-24 mb-8">
          <Card className="shadow-xl border-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl">
          <CardContent className="pt-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Avatar - Clean & Modern */}
              <div className="relative">
                <div className={`w-32 h-32 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 shadow-lg flex items-center justify-center overflow-hidden transition-all hover:scale-105 ${
                  userWithCosmetics.profileFrame === 'gold' ? 'ring-4 ring-yellow-500/50' :
                  userWithCosmetics.profileFrame === 'silver' ? 'ring-4 ring-gray-400/50' :
                  userWithCosmetics.profileFrame === 'diamond' ? 'ring-4 ring-cyan-400/50 animate-pulse' :
                  userWithCosmetics.profileFrame === 'rainbow' ? 'ring-4 ring-purple-500/50' :
                  userWithCosmetics.profileFrame === 'fire' ? 'ring-4 ring-orange-500/50' :
                  userWithCosmetics.profileFrame === 'ice' ? 'ring-4 ring-blue-400/50' :
                  'ring-2 ring-purple-200/50 dark:ring-purple-800/50'
                }`}>
                  <div className="w-full h-full rounded-2xl overflow-hidden">
                    {user.image ? (
                      <img src={user.image} alt={user.name || ''} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-5xl">👤</span>
                    )}
                  </div>
                </div>
                {membershipDays < 30 && (
                  <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-500 to-orange-500 shadow-lg text-xs">
                    ✨ Yeni
                  </Badge>
                )}
                {userWithCosmetics.profileFrame && (
                  <div className="absolute -bottom-2 -right-2 text-2xl">
                    {userWithCosmetics.profileFrame === 'gold' && '🏆'}
                    {userWithCosmetics.profileFrame === 'silver' && '🥈'}
                    {userWithCosmetics.profileFrame === 'diamond' && '💎'}
                    {userWithCosmetics.profileFrame === 'rainbow' && '🌈'}
                    {userWithCosmetics.profileFrame === 'fire' && '🔥'}
                    {userWithCosmetics.profileFrame === 'ice' && '❄️'}
                  </div>
                )}
              </div>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <h1 className={`text-2xl md:text-3xl font-bold truncate ${
                        userWithCosmetics.nameColor === 'rainbow' ? 'bg-gradient-to-r from-red-500 via-yellow-500 to-purple-500 bg-clip-text text-transparent' :
                        userWithCosmetics.nameColor === 'gold' ? 'text-yellow-600' :
                        userWithCosmetics.nameColor === 'red' ? 'text-red-600' :
                        userWithCosmetics.nameColor === 'blue' ? 'text-blue-600' :
                        userWithCosmetics.nameColor === 'purple' ? 'text-purple-600' :
                        'text-slate-900 dark:text-white'
                      }`}>
                        {user.name || `@${user.username}`}
                      </h1>
                      {user.isPremium && user.premiumUntil && new Date() < new Date(user.premiumUntil) && (
                        <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 shadow-lg">
                          👑 Premium
                        </Badge>
                      )}
                      {userWithCosmetics.activeTitle && (
                        <Badge variant="secondary" className="text-xs">
                          {userWithCosmetics.activeTitle}
                        </Badge>
                      )}
                      {userWithCosmetics.customEmoji && (
                        <span className="text-xl">{userWithCosmetics.customEmoji}</span>
                      )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">
                      @{user.username}
                    </p>

                    {user.bio && (
                      <p className="text-sm text-slate-700 dark:text-slate-300 mb-4 max-w-2xl">
                        {user.bio}
                      </p>
                    )}

                    {/* Stats Row - Compact */}
                    <div className="flex flex-wrap gap-4 text-sm">
                      <Link href="#plans" className="hover:text-purple-600 transition-colors">
                        <span className="font-bold text-slate-900 dark:text-white">{user._count.plans}</span>
                        <span className="text-muted-foreground ml-1">Plan</span>
                      </Link>
                      <div className="hover:text-purple-600 transition-colors cursor-pointer">
                        <span className="font-bold text-slate-900 dark:text-white">{user._count.followers}</span>
                        <span className="text-muted-foreground ml-1">Takipçi</span>
                      </div>
                      <div className="hover:text-purple-600 transition-colors cursor-pointer">
                        <span className="font-bold text-slate-900 dark:text-white">{user._count.following}</span>
                        <span className="text-muted-foreground ml-1">Takip</span>
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white">{totalViews.toLocaleString('tr-TR')}</span>
                        <span className="text-muted-foreground ml-1">Görüntülenme</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2 shrink-0">
                    {session?.user && isOwnProfile ? (
                      <Link href="/ayarlar">
                        <Button size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
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
              </div>
            </div>
          </CardContent>
        </Card>
        </div>

        {/* Gamification Stats - Clean Cards */}
        {(user.level > 1 || user.coins > 0 || user.streak > 0 || user._count.badges > 0) && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {/* Level Card */}
            <Card className="hover:shadow-lg transition-all border-purple-200 dark:border-purple-900/50 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-3xl">⭐</span>
                  <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">LEVEL</span>
                </div>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                  {user.level}
                </p>
                <p className="text-xs text-muted-foreground">
                  {user.xp.toLocaleString('tr-TR')} XP
                </p>
              </CardContent>
            </Card>

            {/* Coins Card */}
            <Card className="hover:shadow-lg transition-all border-yellow-200 dark:border-yellow-900/50 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-3xl">🪙</span>
                  <span className="text-xs font-semibold text-yellow-600 dark:text-yellow-400">COINS</span>
                </div>
                <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-1">
                  {user.coins.toLocaleString('tr-TR')}
                </p>
                <p className="text-xs text-muted-foreground">
                  Toplam bakiye
                </p>
              </CardContent>
            </Card>

            {/* Streak Card */}
            <Card className="hover:shadow-lg transition-all border-orange-200 dark:border-orange-900/50 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-3xl">🔥</span>
                  <span className="text-xs font-semibold text-orange-600 dark:text-orange-400">STREAK</span>
                </div>
                <p className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-1">
                  {user.streak}
                </p>
                <p className="text-xs text-muted-foreground">
                  {user.streak === 0 ? 'Başla!' : 'gün üst üste'}
                </p>
              </CardContent>
            </Card>

            {/* Badges Card */}
            <Card className="hover:shadow-lg transition-all border-blue-200 dark:border-blue-900/50 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-3xl">🏆</span>
                  <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">BADGES</span>
                </div>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                  {user._count.badges}
                </p>
                <p className="text-xs text-muted-foreground">
                  Kazanılan rozet
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Stats Grid - Clean & Modern */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Weight Stats */}
          <Card className="hover:shadow-lg transition-all">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                  <Target className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <span className="text-xs font-semibold text-muted-foreground uppercase">Mevcut Kilo</span>
              </div>
              <p className="text-4xl font-bold text-slate-900 dark:text-white mb-1">
                {user.currentWeight ? `${user.currentWeight}` : '--'}
                {user.currentWeight && <span className="text-xl ml-1 text-muted-foreground">kg</span>}
              </p>
              {user.targetWeight && (
                <p className="text-sm text-muted-foreground">
                  🎯 Hedef: {user.targetWeight} kg
                </p>
              )}
            </CardContent>
          </Card>

          {/* Weight Loss */}
          <Card className="hover:shadow-lg transition-all">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <TrendingDown className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-xs font-semibold text-muted-foreground uppercase">Toplam Kayıp</span>
              </div>
              {totalWeightLoss && totalWeightLoss > 0 ? (
                <>
                  <p className="text-4xl font-bold text-green-600 dark:text-green-400 mb-1">
                    {totalWeightLoss.toFixed(1)}
                    <span className="text-xl ml-1">kg</span>
                  </p>
                  {weightLogs.length > 0 && (
                    <p className="text-sm text-muted-foreground">
                      📊 {weightLogs.length} kayıt
                    </p>
                  )}
                </>
              ) : (
                <p className="text-4xl font-bold text-muted-foreground">--</p>
              )}
            </CardContent>
          </Card>

          {/* Engagement */}
          <Card className="hover:shadow-lg transition-all">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 rounded-lg bg-pink-100 dark:bg-pink-900/30">
                  <Heart className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                </div>
                <span className="text-xs font-semibold text-muted-foreground uppercase">Toplam Etkileşim</span>
              </div>
              <p className="text-4xl font-bold text-slate-900 dark:text-white mb-1">
                {totalEngagement}
              </p>
              <p className="text-sm text-muted-foreground">
                📥 {totalLikes + totalComments} aldı • 📤 {user._count.likes + user._count.comments} verdi
              </p>
            </CardContent>
          </Card>

          {/* Activity */}
          <Card className="hover:shadow-lg transition-all">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                  <Calendar className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <span className="text-xs font-semibold text-muted-foreground uppercase">Üyelik</span>
              </div>
              <p className="text-4xl font-bold text-slate-900 dark:text-white mb-1">
                {membershipDays}
              </p>
              <p className="text-sm text-muted-foreground">
                gündür üye
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Content - Clean Design */}
        <Tabs defaultValue="plans" className="space-y-6">
          <TabsList className="inline-flex h-11 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
            <TabsTrigger value="plans" className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-900">
              <Award className="h-4 w-4" />
              <span className="hidden sm:inline">Planlar</span>
              <Badge variant="secondary" className="ml-1 text-xs">{user._count.plans}</Badge>
            </TabsTrigger>
            <TabsTrigger value="photos" className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-900">
              <Camera className="h-4 w-4" />
              <span className="hidden sm:inline">Fotoğraflar</span>
              <Badge variant="secondary" className="ml-1 text-xs">{progressPhotos.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-900">
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">Aktivite</span>
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-900">
              <TrendingDown className="h-4 w-4" />
              <span className="hidden sm:inline">İstatistikler</span>
            </TabsTrigger>
          </TabsList>

          {/* Photos Tab */}
          <TabsContent value="photos">
            {progressPhotos.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {progressPhotos.map((photo) => (
                  <Card key={photo.id} className="overflow-hidden group hover:shadow-lg transition-all">
                    <div className="relative aspect-[3/4] bg-slate-100 dark:bg-slate-800">
                      <img
                        src={photo.photoUrl}
                        alt={photo.caption || 'İlerleme fotoğrafı'}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 left-2">
                        <Badge variant="secondary" className="text-xs backdrop-blur-sm bg-white/90 dark:bg-slate-900/90">
                          {photo.type === 'before' ? '📸 Başlangıç' : photo.type === 'after' ? '✨ Sonuç' : '📊 İlerleme'}
                        </Badge>
                      </div>
                      {photo.weight && (
                        <div className="absolute bottom-2 right-2 backdrop-blur-sm bg-black/70 text-white px-2 py-1 rounded-lg text-xs font-medium">
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
                <CardContent className="text-center py-16">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <Camera className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-lg font-semibold mb-2">Henüz fotoğraf yok</p>
                  {isOwnProfile && (
                    <>
                      <p className="text-sm text-muted-foreground mb-4">
                        İlerlemenizi fotoğraflarla takip edin
                      </p>
                      <Button asChild className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {plans.map((plan) => (
                  <Link key={plan.id} href={`/plan/${plan.slug}`}>
                    <Card className="h-full hover:shadow-lg transition-all hover:border-purple-300 dark:hover:border-purple-700 group">
                      <CardHeader className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary" className={difficultyColors[plan.difficulty]}>
                            {difficultyLabels[plan.difficulty]}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {plan.publishedAt 
                              ? formatDistanceToNow(new Date(plan.publishedAt), { addSuffix: true, locale: tr })
                              : formatDistanceToNow(new Date(plan.createdAt), { addSuffix: true, locale: tr })}
                          </span>
                        </div>
                        <CardTitle className="text-lg line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                          {plan.title}
                        </CardTitle>
                        <CardDescription className="line-clamp-2 text-sm">
                          {plan.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {plan.duration}g
                          </span>
                          {plan.targetWeightLoss && (
                            <span className="flex items-center gap-1">
                              <Target className="h-3.5 w-3.5" />
                              {plan.targetWeightLoss}kg
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2 border-t">
                          <span className="flex items-center gap-1">
                            <Heart className="h-3.5 w-3.5" />
                            {plan.likesCount}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="h-3.5 w-3.5" />
                            {plan.commentsCount}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="h-3.5 w-3.5" />
                            {plan.views}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-16">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <Award className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-lg font-semibold mb-2">Henüz plan yok</p>
                  {isOwnProfile && (
                    <>
                      <p className="text-sm text-muted-foreground mb-4">
                        İlk planını oluştur ve topluluğa katıl
                      </p>
                      <Button asChild className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                        <Link href="/plan-ekle">Plan Oluştur</Link>
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Recent Comments */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                      <MessageSquare className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    Son Yorumlar
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {recentComments.length > 0 ? (
                    <div className="space-y-4">
                      {recentComments.map((comment) => (
                        <div key={comment.id} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                          <Link 
                            href={`/plan/${comment.plan.slug}`}
                            className="text-sm font-medium hover:text-purple-600 dark:hover:text-purple-400 line-clamp-1 block mb-2"
                          >
                            {comment.plan.title}
                          </Link>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                            "{comment.body}"
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: tr })}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        <MessageSquare className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground">Henüz yorum yok</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Likes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <div className="p-2 rounded-lg bg-pink-100 dark:bg-pink-900/30">
                      <Heart className="h-4 w-4 text-pink-600 dark:text-pink-400" />
                    </div>
                    Son Beğeniler
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {recentLikes.length > 0 ? (
                    <div className="space-y-3">
                      {recentLikes.map((like, i) => (
                        <div key={i} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                          <div className="flex items-start justify-between gap-3">
                            <Link 
                              href={`/plan/${like.plan.slug}`}
                              className="text-sm hover:text-purple-600 dark:hover:text-purple-400 line-clamp-2 flex-1"
                            >
                              {like.plan.title}
                            </Link>
                            <span className="text-xs text-muted-foreground shrink-0">
                              {formatDistanceToNow(new Date(like.createdAt), { addSuffix: true, locale: tr })}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        <Heart className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground">Henüz beğeni yok</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Stats Tab */}
          <TabsContent value="stats">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Weight Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                      <TrendingDown className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    Kilo İlerlemesi
                  </CardTitle>
                  <CardDescription>Son 30 günlük kayıtlar</CardDescription>
                </CardHeader>
                <CardContent>
                  {weightLogs.length > 0 ? (
                    <div className="space-y-6">
                      <div className="h-48 flex items-end gap-1 bg-gradient-to-t from-purple-50 to-transparent dark:from-purple-950/30 rounded-xl p-4 border border-purple-100 dark:border-purple-900/50">
                        {weightLogs.slice(0, 30).reverse().map((log, i) => {
                          const maxWeight = Math.max(...weightLogs.map(l => l.weight))
                          const minWeight = Math.min(...weightLogs.map(l => l.weight))
                          const range = maxWeight - minWeight || 1
                          const height = ((log.weight - minWeight) / range) * 100
                          
                          return (
                            <div
                              key={log.id}
                              className="flex-1 bg-gradient-to-t from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-t transition-all cursor-pointer relative group"
                              style={{ height: `${Math.max(height, 10)}%` }}
                              title={`${format(new Date(log.date), 'dd MMM', { locale: tr })}: ${log.weight}kg`}
                            >
                              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
                                {log.weight}kg
                              </div>
                            </div>
                          )
                        })}
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                          <p className="text-xs text-muted-foreground mb-1">Başlangıç</p>
                          <p className="text-xl font-bold">{startWeight ? `${startWeight}kg` : '--'}</p>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800">
                          <p className="text-xs text-muted-foreground mb-1">Şu An</p>
                          <p className="text-xl font-bold text-purple-600 dark:text-purple-400">{user.currentWeight ? `${user.currentWeight}kg` : '--'}</p>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                          <p className="text-xs text-muted-foreground mb-1">Hedef</p>
                          <p className="text-xl font-bold">{user.targetWeight ? `${user.targetWeight}kg` : '--'}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        <TrendingDown className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground">Henüz kilo kaydı yok</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Overall Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                      <Activity className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    Genel İstatistikler
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <span className="text-sm font-medium">Toplam Plan</span>
                    <span className="font-bold text-lg">{user._count.plans}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <span className="text-sm font-medium">Toplam Görüntülenme</span>
                    <span className="font-bold text-lg">{totalViews.toLocaleString('tr-TR')}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <span className="text-sm font-medium">Toplam Beğeni</span>
                    <span className="font-bold text-lg">{totalLikes}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <span className="text-sm font-medium">Toplam Yorum</span>
                    <span className="font-bold text-lg">{totalComments}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <span className="text-sm font-medium">Verilen Yorum</span>
                    <span className="font-bold text-lg">{user._count.comments}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <span className="text-sm font-medium">Verilen Beğeni</span>
                    <span className="font-bold text-lg">{user._count.likes}</span>
                  </div>
                  {bmi && (
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border border-purple-200 dark:border-purple-800">
                      <span className="text-sm font-medium">BMI</span>
                      <span className="font-bold text-lg text-purple-600 dark:text-purple-400">{bmi.toFixed(1)}</span>
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
