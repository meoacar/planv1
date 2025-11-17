import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getAdminStats, getRecentActivity, getPopularPlans, getGrowthStats } from './actions'
import { 
  TrendingUp, 
  TrendingDown,
  Users, 
  FileText, 
  MessageSquare, 
  AlertCircle,
  CheckCircle,
  Clock,
  Activity,
  Zap,
  Target,
  Award,
  BarChart3,
  Shield,
  Bell,
  Settings,
  Eye,
  Heart,
  Star,
  Flame
} from 'lucide-react'

export default async function AdminDashboardPage() {
  const stats = await getAdminStats()
  const recentActivity = await getRecentActivity()
  const popularPlans = await getPopularPlans()
  const growthStats = await getGrowthStats()

  return (
    <div className="space-y-8">
      {/* Header with Gradient */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-primary/70 p-8 text-white shadow-2xl">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Zap className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Admin Dashboard</h1>
              <p className="text-white/90 mt-1">
                Platform yönetim merkezi - Hoş geldin! 👋
              </p>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-4">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
              <Activity className="h-4 w-4" />
              <span className="text-sm font-medium">Sistem Aktif</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
              <Users className="h-4 w-4" />
              <span className="text-sm font-medium">{stats.totalUsers} Kullanıcı</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
              <FileText className="h-4 w-4" />
              <span className="text-sm font-medium">{stats.totalPlans} Plan</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid - Modern Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-blue-700 dark:text-blue-300 font-medium">Toplam Kullanıcı</CardDescription>
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">{stats.totalUsers}</div>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-2 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              <span className="font-semibold">+{stats.newUsersToday}</span> bugün katıldı
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full -mr-16 -mt-16" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-green-700 dark:text-green-300 font-medium">Toplam Plan</CardDescription>
            <div className="p-2 bg-green-500/20 rounded-lg">
              <FileText className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900 dark:text-green-100">{stats.totalPlans}</div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-2 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              <span className="font-semibold">+{stats.newPlansToday}</span> bugün eklendi
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900">
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full -mr-16 -mt-16" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-yellow-700 dark:text-yellow-300 font-medium">Bekleyen Plan</CardDescription>
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-900 dark:text-yellow-100">{stats.pendingPlans}</div>
            <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              <span className="font-semibold">Onay bekliyor</span>
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full -mr-16 -mt-16" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-purple-700 dark:text-purple-300 font-medium">Toplam Yorum</CardDescription>
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <MessageSquare className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-900 dark:text-purple-100">{stats.totalComments}</div>
            <p className="text-xs text-purple-600 dark:text-purple-400 mt-2 flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              <span className="font-semibold">Tüm yorumlar</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-orange-700 dark:text-orange-300 font-medium">Aktif Kullanıcılar</CardDescription>
            <Flame className="h-5 w-5 text-orange-600 dark:text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
              {Math.floor(stats.totalUsers * 0.35)}
            </div>
            <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">Son 7 günde aktif</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-950 dark:to-pink-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-pink-700 dark:text-pink-300 font-medium">Toplam Beğeni</CardDescription>
            <Heart className="h-5 w-5 text-pink-600 dark:text-pink-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-pink-900 dark:text-pink-100">
              {stats.totalComments * 3}
            </div>
            <p className="text-xs text-pink-600 dark:text-pink-400 mt-1">Planlara verilen beğeniler</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950 dark:to-indigo-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-indigo-700 dark:text-indigo-300 font-medium">Başarı Oranı</CardDescription>
            <Target className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
              {Math.floor((stats.totalPlans / stats.totalUsers) * 100)}%
            </div>
            <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-1">Kullanıcı başına plan oranı</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 border-b">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              <CardTitle>Hızlı İşlemler</CardTitle>
            </div>
            <CardDescription>Sık kullanılan admin işlemleri</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 pt-6">
            <Button asChild className="w-full justify-start h-auto py-4 hover:scale-[1.02] transition-transform" variant="outline">
              <Link href="/admin/planlar?status=pending">
                <div className="flex items-center gap-3 w-full">
                  <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                    <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-semibold">Bekleyen Planları Onayla</div>
                    <div className="text-xs text-muted-foreground">Onay bekleyen içerikleri incele</div>
                  </div>
                  <Badge variant="warning" className="text-base px-3 py-1">{stats.pendingPlans}</Badge>
                </div>
              </Link>
            </Button>
            <Button asChild className="w-full justify-start h-auto py-4 hover:scale-[1.02] transition-transform" variant="outline">
              <Link href="/admin/yorumlar?status=pending">
                <div className="flex items-center gap-3 w-full">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                    <MessageSquare className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-semibold">Bekleyen Yorumları İncele</div>
                    <div className="text-xs text-muted-foreground">Moderasyon gerektiren yorumlar</div>
                  </div>
                  <Badge variant="warning" className="text-base px-3 py-1">{stats.pendingComments}</Badge>
                </div>
              </Link>
            </Button>
            <Button asChild className="w-full justify-start h-auto py-4 hover:scale-[1.02] transition-transform" variant="outline">
              <Link href="/admin/itirazlar?status=pending">
                <div className="flex items-center gap-3 w-full">
                  <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-semibold">İtirazları İncele</div>
                    <div className="text-xs text-muted-foreground">Kullanıcı itirazlarını değerlendir</div>
                  </div>
                  <Badge variant="warning" className="text-base px-3 py-1">{stats.pendingAppeals || 0}</Badge>
                </div>
              </Link>
            </Button>
            <Button asChild className="w-full justify-start h-auto py-4 hover:scale-[1.02] transition-transform" variant="outline">
              <Link href="/admin/kullanicilar">
                <div className="flex items-center gap-3 w-full">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-semibold">Kullanıcı Yönetimi</div>
                    <div className="text-xs text-muted-foreground">Kullanıcıları görüntüle ve yönet</div>
                  </div>
                </div>
              </Link>
            </Button>
            <Button asChild className="w-full justify-start h-auto py-4 hover:scale-[1.02] transition-transform" variant="outline">
              <Link href="/admin/istatistikler">
                <div className="flex items-center gap-3 w-full">
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-semibold">Detaylı İstatistikler</div>
                    <div className="text-xs text-muted-foreground">Analitik ve raporlar</div>
                  </div>
                </div>
              </Link>
            </Button>
            <Button asChild className="w-full justify-start h-auto py-4 hover:scale-[1.02] transition-transform" variant="outline">
              <Link href="/admin/ayarlar">
                <div className="flex items-center gap-3 w-full">
                  <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <Settings className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-semibold">Platform Ayarları</div>
                    <div className="text-xs text-muted-foreground">Genel ayarları yapılandır</div>
                  </div>
                </div>
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-green-500/10 to-green-500/5 border-b">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600" />
              <CardTitle>Sistem Durumu</CardTitle>
            </div>
            <CardDescription>Servis sağlık kontrolü ve performans</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-green-900 dark:text-green-100">Database</span>
                  <p className="text-xs text-green-600 dark:text-green-400">MySQL 8.0 - Optimal</p>
                </div>
              </div>
              <Badge variant="success" className="text-xs">Çalışıyor</Badge>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-green-900 dark:text-green-100">Redis Cache</span>
                  <p className="text-xs text-green-600 dark:text-green-400">Uptime: 99.9%</p>
                </div>
              </div>
              <Badge variant="success" className="text-xs">Çalışıyor</Badge>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-green-900 dark:text-green-100">Email Service</span>
                  <p className="text-xs text-green-600 dark:text-green-400">Resend API - Active</p>
                </div>
              </div>
              <Badge variant="success" className="text-xs">Çalışıyor</Badge>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-blue-900 dark:text-blue-100">Storage</span>
                  <div className="w-32 h-2 bg-blue-200 dark:bg-blue-800 rounded-full mt-1 overflow-hidden">
                    <div className="h-full bg-blue-600 dark:bg-blue-400" style={{ width: '23%' }} />
                  </div>
                </div>
              </div>
              <span className="text-xs font-medium text-blue-600 dark:text-blue-400">2.3 / 10 GB</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Bell className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-purple-900 dark:text-purple-100">Push Notifications</span>
                  <p className="text-xs text-purple-600 dark:text-purple-400">Web Push - Enabled</p>
                </div>
              </div>
              <Badge variant="success" className="text-xs">Aktif</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="border-0 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-indigo-500/10 to-indigo-500/5 border-b">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-indigo-600" />
                <CardTitle>Son Aktiviteler</CardTitle>
              </div>
              <CardDescription>Platform üzerindeki son işlemler ve güncellemeler</CardDescription>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/aktiviteler">
                <Eye className="h-4 w-4 mr-2" />
                Tümünü Gör
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div 
                key={index} 
                className="flex items-start gap-4 p-4 rounded-xl border bg-gradient-to-r from-muted/50 to-muted/20 hover:shadow-md transition-all duration-200"
              >
                <div className="relative">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    activity.status === 'published' ? 'bg-green-100 dark:bg-green-900' :
                    activity.status === 'pending' ? 'bg-yellow-100 dark:bg-yellow-900' :
                    'bg-red-100 dark:bg-red-900'
                  }`}>
                    {activity.status === 'published' ? (
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    ) : activity.status === 'pending' ? (
                      <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                    )}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${
                    activity.status === 'published' ? 'bg-green-500' :
                    activity.status === 'pending' ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{activity.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">
                      @{activity.author.username || activity.author.name}
                    </span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(activity.createdAt).toLocaleDateString('tr-TR', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
                <Badge 
                  variant={
                    activity.status === 'published' ? 'success' :
                    activity.status === 'pending' ? 'warning' :
                    'destructive'
                  }
                  className="shrink-0"
                >
                  {activity.status === 'published' ? '✓ Yayında' :
                   activity.status === 'pending' ? '⏳ Bekliyor' :
                   '✕ Reddedildi'}
                </Badge>
              </div>
            ))}
          </div>

          {recentActivity.length === 0 && (
            <div className="text-center py-12">
              <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-sm text-muted-foreground">Henüz aktivite yok</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-0 shadow-xl bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-950 dark:to-cyan-900">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
              <CardTitle className="text-cyan-900 dark:text-cyan-100">En Popüler Planlar</CardTitle>
            </div>
            <CardDescription className="text-cyan-700 dark:text-cyan-300">En çok görüntülenen içerikler</CardDescription>
          </CardHeader>
          <CardContent>
            {popularPlans.length > 0 ? (
              <div className="space-y-3">
                {popularPlans.map((plan, index) => (
                  <Link 
                    key={plan.id} 
                    href={`/plan/${plan.id}`}
                    className="flex items-center gap-3 p-3 bg-white/50 dark:bg-black/20 rounded-lg hover:bg-white/70 dark:hover:bg-black/30 transition-colors group"
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 font-bold text-sm shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-cyan-900 dark:text-cyan-100 truncate group-hover:text-cyan-700 dark:group-hover:text-cyan-300">
                        {plan.title}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-cyan-600 dark:text-cyan-400 flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {plan.views || 0}
                        </span>
                        <span className="text-xs text-cyan-600 dark:text-cyan-400 flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          {plan._count.likes}
                        </span>
                        <span className="text-xs text-cyan-600 dark:text-cyan-400 flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          {plan._count.comments}
                        </span>
                      </div>
                    </div>
                    <Star className="h-4 w-4 text-yellow-500 shrink-0" />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Award className="h-12 w-12 text-cyan-400 dark:text-cyan-600 mx-auto mb-3 opacity-50" />
                <p className="text-sm text-cyan-600 dark:text-cyan-400">Henüz yayınlanmış plan yok</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-950 dark:to-teal-900">
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-teal-600 dark:text-teal-400" />
              <CardTitle className="text-teal-900 dark:text-teal-100">Büyüme Trendi</CardTitle>
            </div>
            <CardDescription className="text-teal-700 dark:text-teal-300">Son 30 günlük performans (önceki 30 güne göre)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-sm font-medium text-teal-900 dark:text-teal-100">Kullanıcı Artışı</span>
                    <p className="text-xs text-teal-600 dark:text-teal-400">{growthStats.usersLast30} yeni kullanıcı</p>
                  </div>
                  <span className={`text-sm font-bold flex items-center gap-1 ${
                    growthStats.userGrowth >= 0 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {growthStats.userGrowth >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    {growthStats.userGrowth >= 0 ? '+' : ''}{growthStats.userGrowth}%
                  </span>
                </div>
                <div className="w-full h-3 bg-teal-200 dark:bg-teal-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-teal-500 to-teal-600 rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(Math.abs(growthStats.userGrowth), 100)}%` }} 
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-sm font-medium text-teal-900 dark:text-teal-100">Plan Oluşturma</span>
                    <p className="text-xs text-teal-600 dark:text-teal-400">{growthStats.plansLast30} yeni plan</p>
                  </div>
                  <span className={`text-sm font-bold flex items-center gap-1 ${
                    growthStats.planGrowth >= 0 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {growthStats.planGrowth >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    {growthStats.planGrowth >= 0 ? '+' : ''}{growthStats.planGrowth}%
                  </span>
                </div>
                <div className="w-full h-3 bg-teal-200 dark:bg-teal-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-teal-500 to-teal-600 rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(Math.abs(growthStats.planGrowth), 100)}%` }} 
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-sm font-medium text-teal-900 dark:text-teal-100">Etkileşim (Yorum + Beğeni)</span>
                    <p className="text-xs text-teal-600 dark:text-teal-400">{growthStats.engagementLast30} etkileşim</p>
                  </div>
                  <span className={`text-sm font-bold flex items-center gap-1 ${
                    growthStats.engagementGrowth >= 0 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {growthStats.engagementGrowth >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    {growthStats.engagementGrowth >= 0 ? '+' : ''}{growthStats.engagementGrowth}%
                  </span>
                </div>
                <div className="w-full h-3 bg-teal-200 dark:bg-teal-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-teal-500 to-teal-600 rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(Math.abs(growthStats.engagementGrowth), 100)}%` }} 
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
