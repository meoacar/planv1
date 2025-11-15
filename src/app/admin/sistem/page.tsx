import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  getSystemMetrics, 
  getServiceStatus, 
  getDatabaseStats,
  getBackupInfo,
  getRedisStats,
  getRedisKeys,
} from './actions'
import { 
  Cpu, 
  HardDrive, 
  Activity,
  Database,
  Server,
  Mail,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Download,
} from 'lucide-react'
import { SystemActions } from '@/components/admin/system-actions'

export default async function AdminSystemPage() {
  const [metrics, services, dbStats, backupInfo, redisStats, redisKeys] = await Promise.all([
    getSystemMetrics(),
    getServiceStatus(),
    getDatabaseStats(),
    getBackupInfo(),
    getRedisStats(),
    getRedisKeys('*', 50),
  ])

  const getStatusIcon = (status: string) => {
    if (status === 'healthy' || status === 'configured') {
      return <CheckCircle className="h-4 w-4 text-green-600" />
    }
    if (status === 'not_configured') {
      return <AlertTriangle className="h-4 w-4 text-yellow-600" />
    }
    return <XCircle className="h-4 w-4 text-red-600" />
  }

  const getStatusBadge = (status: string) => {
    if (status === 'healthy' || status === 'configured') {
      return <Badge variant="success">Çalışıyor</Badge>
    }
    if (status === 'not_configured') {
      return <Badge variant="warning">Yapılandırılmamış</Badge>
    }
    return <Badge variant="destructive">Hata</Badge>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Sistem Yönetimi</h1>
          <p className="text-muted-foreground">
            Sunucu durumu ve sistem metrikleri
          </p>
        </div>
        <SystemActions />
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>CPU Kullanımı</CardDescription>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.cpu.usage}%</div>
            <Progress value={parseFloat(metrics.cpu.usage)} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {metrics.cpu.cores} çekirdek • {metrics.cpu.model.substring(0, 30)}...
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>RAM Kullanımı</CardDescription>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.memory.usage}%</div>
            <Progress value={parseFloat(metrics.memory.usage)} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {metrics.memory.used} GB / {metrics.memory.total} GB kullanımda
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Sistem Uptime</CardDescription>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.uptime.formatted.split(',')[0]}</div>
            <p className="text-xs text-muted-foreground mt-2">
              {metrics.uptime.formatted}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {metrics.platform.type} {metrics.platform.arch}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Service Status */}
      <Card>
        <CardHeader>
          <CardTitle>Servis Durumu</CardTitle>
          <CardDescription>Platform servislerinin sağlık kontrolü</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div className="flex items-center gap-3">
              <Database className="h-8 w-8 text-blue-600" />
              <div>
                <p className="font-medium">Database ({services.database.type})</p>
                <p className="text-sm text-muted-foreground">
                  Latency: {services.database.latency}ms
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon(services.database.status)}
              {getStatusBadge(services.database.status)}
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div className="flex items-center gap-3">
              <Server className="h-8 w-8 text-red-600" />
              <div>
                <p className="font-medium">Redis Cache ({services.redis.type})</p>
                <p className="text-sm text-muted-foreground">
                  Rate limiting ve cache {services.redis.status === 'not_configured' && '(Opsiyonel)'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon(services.redis.status)}
              {getStatusBadge(services.redis.status)}
            </div>
          </div>

          {services.redis.status === 'not_configured' && (
            <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                ℹ️ Redis Kurulumu (Opsiyonel)
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                Redis rate limiting ve cache için kullanılır. Kurulum seçenekleri:
              </p>
              
              <div className="space-y-3">
                <div className="bg-white dark:bg-gray-900 p-3 rounded border border-blue-200 dark:border-blue-700">
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
                    🌐 Canlı Ortam (Önerilen)
                  </p>
                  <ol className="text-sm text-blue-700 dark:text-blue-300 space-y-1 list-decimal list-inside">
                    <li>
                      <a href="https://upstash.com/" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600">
                        Upstash.com
                      </a> hesabı oluştur (ücretsiz)
                    </li>
                    <li>Redis database oluştur (Europe/Frankfurt)</li>
                    <li>REDIS_URL değerini kopyala</li>
                    <li>Vercel Environment Variables'a ekle</li>
                    <li>Redeploy yap</li>
                  </ol>
                </div>

                <div className="bg-white dark:bg-gray-900 p-3 rounded border border-blue-200 dark:border-blue-700">
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
                    💻 Geliştirme Ortamı
                  </p>
                  <ol className="text-sm text-blue-700 dark:text-blue-300 space-y-1 list-decimal list-inside">
                    <li>Redis'i indir ve kur (Windows için Redis-x64)</li>
                    <li>.env dosyasına ekle: REDIS_URL="redis://localhost:6379"</li>
                    <li>Redis servisini başlat</li>
                    <li>Sayfayı yenile</li>
                  </ol>
                </div>

                <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                  📖 Detaylı kurulum için <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">REDIS_YONETIM.md</code> dosyasına bakın
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div className="flex items-center gap-3">
              <Mail className="h-8 w-8 text-green-600" />
              <div>
                <p className="font-medium">Email Service ({services.email.provider})</p>
                <p className="text-sm text-muted-foreground">
                  Bildirim ve email gönderimi
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon(services.email.status)}
              {getStatusBadge(services.email.status)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Redis Stats */}
      {redisStats.available && redisStats.stats && (
        <Card>
          <CardHeader>
            <CardTitle>Redis Cache İstatistikleri</CardTitle>
            <CardDescription>Cache ve rate limiting metrikleri</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Versiyon</p>
                <p className="font-medium">{redisStats.stats.version}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Uptime</p>
                <p className="font-medium">{redisStats.stats.uptimeFormatted}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Bağlı İstemciler</p>
                <p className="font-medium">{redisStats.stats.connectedClients}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Toplam Key</p>
                <p className="font-medium">{redisStats.stats.totalKeys.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Kullanılan Bellek</p>
                <p className="font-medium">{redisStats.stats.usedMemory}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Peak Bellek</p>
                <p className="font-medium">{redisStats.stats.usedMemoryPeak}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">İşlem/Saniye</p>
                <p className="font-medium">{redisStats.stats.opsPerSec.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Hit Rate</p>
                <p className="font-medium">{redisStats.stats.hitRate}%</p>
              </div>
            </div>

            {redisKeys.length > 0 && (
              <div className="pt-4 border-t">
                <p className="text-sm font-medium mb-3">Aktif Cache Keys (İlk 50)</p>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {redisKeys.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs p-2 rounded bg-muted/50">
                      <span className="font-mono truncate flex-1">{item.key}</span>
                      <div className="flex items-center gap-2 ml-2">
                        <Badge variant="outline" className="text-xs">
                          {item.type}
                        </Badge>
                        <span className="text-muted-foreground">
                          {item.ttl === -1 ? '∞' : item.ttl === -2 ? 'expired' : `${item.ttl}s`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Database Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Database İstatistikleri</CardTitle>
            <CardDescription>Veritabanı kullanım bilgileri</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Toplam Boyut</span>
              <span className="font-bold">{dbStats.size.mb} MB</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Kullanıcılar</span>
              <span className="font-medium">{dbStats.tables.users.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Planlar</span>
              <span className="font-medium">{dbStats.tables.plans.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Yorumlar</span>
              <span className="font-medium">{dbStats.tables.comments.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Beğeniler</span>
              <span className="font-medium">{dbStats.tables.likes.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Bildirimler</span>
              <span className="font-medium">{dbStats.tables.notifications.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Yedekleme Bilgileri</CardTitle>
            <CardDescription>Database yedekleme durumu</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Son Yedekleme</span>
              <span className="font-medium">
                {backupInfo.lastBackup 
                  ? new Date(backupInfo.lastBackup).toLocaleString('tr-TR')
                  : 'Henüz yedek alınmadı'
                }
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Otomatik Yedekleme</span>
              <Badge variant={backupInfo.autoBackup ? 'success' : 'secondary'}>
                {backupInfo.autoBackup ? 'Aktif' : 'Pasif'}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Sıklık</span>
              <span className="font-medium capitalize">{backupInfo.frequency}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Saklama Süresi</span>
              <span className="font-medium">{backupInfo.retention}</span>
            </div>

            <div className="pt-4 border-t">
              <Button className="w-full" asChild>
                <a href="/api/admin/backup" target="_blank">
                  <Download className="h-4 w-4 mr-2" />
                  Manuel Yedekleme Al
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Info */}
      <Card>
        <CardHeader>
          <CardTitle>Sistem Bilgileri</CardTitle>
          <CardDescription>Sunucu ve platform detayları</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">İşletim Sistemi</p>
              <p className="font-medium">{metrics.platform.type} {metrics.platform.release}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Mimari</p>
              <p className="font-medium">{metrics.platform.arch}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Hostname</p>
              <p className="font-medium">{metrics.platform.hostname}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Node.js</p>
              <p className="font-medium">{process.version}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
