import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { Navbar } from '@/components/navbar'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'
import { 
  Shield, 
  Users, 
  FileText, 
  MessageSquare, 
  Flag,
  TrendingUp,
  Activity,
  Settings,
  Crown,
  Zap,
  BarChart3,
  UserCog,
  Database,
  Bell
} from 'lucide-react'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'

export const metadata = {
  title: 'Admin Profil',
  description: 'Admin kontrol paneli ve profil sayfası',
}

export default async function AdminProfilePage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/giris')
  }

  // Check if user is admin
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: {
      _count: {
        select: {
          plans: true,
          followers: true,
          following: true,
          badges: true,
        },
      },
    },
  })

  if (!user || user.role !== 'ADMIN') {
    redirect('/profil/' + user?.username)
  }

  // Fetch admin statistics - simplified for performance
  const totalUsers = await db.user.count()
  const totalPlans = await db.plan.count({ where: { status: 'published' } })
  const totalComments = await db.comment.count({ where: { status: 'visible' } })
  
  const recentUsers = await db.user.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      username: true,
      image: true,
      createdAt: true,
    },
  })
  
  const recentPlans = await db.plan.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      slug: true,
      status: true,
      createdAt: true,
      author: {
        select: {
          name: true,
          username: true,
        },
      },
    },
  })
  
  const systemStats = await db.user.aggregate({
    _avg: { xp: true, level: true, coins: true },
    _sum: { xp: true, coins: true },
  })

  const pendingAppeals = 0 // Appeal modeli olmadığı için 0 olarak ayarlandı

  const adminSince = Math.floor(
    (Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-background to-pink-50 dark:from-purple-950/20 dark:via-background dark:to-pink-950/20">
      <Navbar />

      {/* Admin Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 opacity-10" />
        <div className="absolute inset-0 bg-grid-white/10" />
        
        <div className="container mx-auto px-4 py-12 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
            {/* Admin Avatar */}
            <div className="relative">
              <div className={`w-32 h-32 rounded-full bg-background shadow-2xl flex items-center justify-center overflow-hidden border-4 border-purple-500 ring-4 ring-purple-500/30 animate-pulse`}>
                <div className="w-full h-full rounded-full overflow-hidden bg-background">
                  {user.image ? (
                    <img src={user.image} alt={user.name || ''} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-5xl">👤</span>
                  )}
                </div>
              </div>
              <div className="absolute -top-2 -right-2 text-3xl animate-bounce">
                <Crown className="h-10 w-10 text-yellow-500 fill-yellow-500" />
              </div>
              <Badge className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                <Shield className="h-3 w-3 mr-1" />
                Admin
              </Badge>
            </div>

            {/* Admin Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                <h1 className={`text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent`}>
                  {user.name || `@${user.username}`}
                </h1>
                {(user as any).activeTitle && (
                  <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                    {(user as any).activeTitle}
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground mb-4">
                @{user.username} • {user.email}
              </p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-purple-600" />
                  <span className="text-sm">Admin {adminSince} gündür</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">{user._count.followers} Takipçi</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-green-600" />
                  <span className="text-sm">{user._count.plans} Plan</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col gap-2">
              <Button asChild className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                <Link href="/admin">
                  <Settings className="h-4 w-4 mr-2" />
                  Admin Panel
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/profil/adminuser">
                  <UserCog className="h-4 w-4 mr-2" />
                  Herkese Açık Profil
                </Link>
              </Button>
            </div>
          </div>

          {/* Admin Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-200 dark:border-purple-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  <span className="text-sm text-muted-foreground">Toplam Kullanıcı</span>
                </div>
                <p className="text-3xl font-bold">{totalUsers.toLocaleString('tr-TR')}</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-200 dark:border-blue-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <span className="text-sm text-muted-foreground">Toplam Plan</span>
                </div>
                <p className="text-3xl font-bold">{totalPlans.toLocaleString('tr-TR')}</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-200 dark:border-green-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="h-5 w-5 text-green-600" />
                  <span className="text-sm text-muted-foreground">Toplam Yorum</span>
                </div>
                <p className="text-3xl font-bold">{totalComments.toLocaleString('tr-TR')}</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-200 dark:border-orange-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Flag className="h-5 w-5 text-orange-600" />
                  <span className="text-sm text-muted-foreground">Bekleyen İtiraz</span>
                </div>
                <p className="text-3xl font-bold">{pendingAppeals}</p>
                {pendingAppeals > 0 && (
                  <Button asChild size="sm" variant="link" className="p-0 h-auto text-orange-600">
                    <Link href="/admin/appeals">İncele →</Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Genel Bakış
            </TabsTrigger>
            <TabsTrigger value="personal" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Kişisel
            </TabsTrigger>
            <TabsTrigger value="recent" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Son Aktiviteler
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Sistem
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-600" />
                    Hızlı İşlemler
                  </CardTitle>
                  <CardDescription>Sık kullanılan admin işlemleri</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button asChild className="w-full justify-start" variant="outline">
                    <Link href="/admin/users">
                      <Users className="h-4 w-4 mr-2" />
                      Kullanıcı Yönetimi
                    </Link>
                  </Button>
                  <Button asChild className="w-full justify-start" variant="outline">
                    <Link href="/admin/plans">
                      <FileText className="h-4 w-4 mr-2" />
                      Plan Yönetimi
                    </Link>
                  </Button>
                  <Button asChild className="w-full justify-start" variant="outline">
                    <Link href="/admin/comments">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Yorum Moderasyonu
                    </Link>
                  </Button>
                  <Button asChild className="w-full justify-start" variant="outline">
                    <Link href="/admin/appeals">
                      <Flag className="h-4 w-4 mr-2" />
                      İtiraz Yönetimi
                      {pendingAppeals > 0 && (
                        <Badge className="ml-auto bg-red-500">{pendingAppeals}</Badge>
                      )}
                    </Link>
                  </Button>
                  <Button asChild className="w-full justify-start" variant="outline">
                    <Link href="/admin/settings">
                      <Settings className="h-4 w-4 mr-2" />
                      Site Ayarları
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* System Health */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-green-600" />
                    Sistem Sağlığı
                  </CardTitle>
                  <CardDescription>Platform istatistikleri</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="text-sm">Ortalama Kullanıcı Seviyesi</span>
                    <span className="font-bold">{systemStats._avg.level?.toFixed(1) || '0'}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="text-sm">Ortalama XP</span>
                    <span className="font-bold">{systemStats._avg.xp?.toFixed(0) || '0'}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="text-sm">Toplam Coin Dolaşımda</span>
                    <span className="font-bold">{systemStats._sum.coins?.toLocaleString('tr-TR') || '0'}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="text-sm">Toplam XP Kazanıldı</span>
                    <span className="font-bold">{systemStats._sum.xp?.toLocaleString('tr-TR') || '0'}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                    <span className="text-sm text-green-700 dark:text-green-400">Sistem Durumu</span>
                    <Badge className="bg-green-500">Çevrimiçi</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Personal Tab */}
          <TabsContent value="personal" className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">⭐</span>
                    <span className="text-sm text-muted-foreground">Seviye</span>
                  </div>
                  <p className="text-2xl font-bold">{user.level}</p>
                  <p className="text-xs text-muted-foreground">{user.xp} XP</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">🪙</span>
                    <span className="text-sm text-muted-foreground">Coin</span>
                  </div>
                  <p className="text-2xl font-bold">{user.coins.toLocaleString('tr-TR')}</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">🔥</span>
                    <span className="text-sm text-muted-foreground">Seri</span>
                  </div>
                  <p className="text-2xl font-bold">{user.streak}</p>
                  <p className="text-xs text-muted-foreground">gün</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">🏆</span>
                    <span className="text-sm text-muted-foreground">Rozet</span>
                  </div>
                  <p className="text-2xl font-bold">{user._count.badges}</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Profil Özelleştirmeleri</CardTitle>
                <CardDescription>Aktif kozmetik öğeleriniz</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">Profil Çerçevesi</p>
                    <p className="font-medium">{(user as any).profileFrame || 'Varsayılan'}</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">İsim Rengi</p>
                    <p className="font-medium">{(user as any).nameColor || 'Varsayılan'}</p>
                  </div>
                </div>
                <Button asChild className="w-full">
                  <Link href="/magaza">
                    <Zap className="h-4 w-4 mr-2" />
                    Mağazayı Ziyaret Et
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Recent Activity Tab */}
          <TabsContent value="recent" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Users */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Son Kayıt Olan Kullanıcılar
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentUsers.map((recentUser) => (
                      <Link
                        key={recentUser.id}
                        href={`/profil/${recentUser.username}`}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                      >
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                          {recentUser.image ? (
                            <img src={recentUser.image} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <span>👤</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{recentUser.name || recentUser.username}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(recentUser.createdAt), 'dd MMM yyyy', { locale: tr })}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Plans */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Son Oluşturulan Planlar
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentPlans.map((plan) => (
                      <Link
                        key={plan.id}
                        href={`/plan/${plan.slug}`}
                        className="block p-3 rounded-lg hover:bg-muted transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p className="font-medium line-clamp-1">{plan.title}</p>
                          <Badge variant={plan.status === 'published' ? 'default' : 'secondary'}>
                            {plan.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {plan.author.name || plan.author.username} • {format(new Date(plan.createdAt), 'dd MMM yyyy', { locale: tr })}
                        </p>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* System Tab */}
          <TabsContent value="system" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Veritabanı İstatistikleri
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Toplam Kullanıcı</p>
                    <p className="text-2xl font-bold">{totalUsers.toLocaleString('tr-TR')}</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Toplam Plan</p>
                    <p className="text-2xl font-bold">{totalPlans.toLocaleString('tr-TR')}</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Toplam Yorum</p>
                    <p className="text-2xl font-bold">{totalComments.toLocaleString('tr-TR')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Sistem Bildirimleri
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pendingAppeals > 0 && (
                    <div className="flex items-start gap-3 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                      <Flag className="h-5 w-5 text-orange-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium text-orange-900 dark:text-orange-100">
                          {pendingAppeals} bekleyen itiraz var
                        </p>
                        <p className="text-sm text-orange-700 dark:text-orange-300">
                          İtirazları incelemek için admin paneline gidin
                        </p>
                      </div>
                      <Button asChild size="sm" variant="outline">
                        <Link href="/admin/appeals">İncele</Link>
                      </Button>
                    </div>
                  )}
                  
                  <div className="flex items-start gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <Activity className="h-5 w-5 text-green-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-green-900 dark:text-green-100">
                        Sistem normal çalışıyor
                      </p>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        Tüm servisler aktif ve sağlıklı
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
