import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { 
  getModerationStats, 
  getPendingContent, 
  getBannedUsers,
  getRecentModerationActions 
} from './actions'
import { 
  Clock, 
  AlertTriangle, 
  Ban, 
  CheckCircle,
  XCircle,
  Eye,
  Shield,
  TrendingUp,
} from 'lucide-react'
import Link from 'next/link'

export default async function AdminModerationPage() {
  const [stats, pendingContent, bannedUsers, recentActions] = await Promise.all([
    getModerationStats(),
    getPendingContent(),
    getBannedUsers(),
    getRecentModerationActions(),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Moderasyon Merkezi</h1>
        <p className="text-muted-foreground">
          İçerik moderasyonu ve kullanıcı yönetimi
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Bekleyen Planlar</CardDescription>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pendingPlans}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Onay bekliyor
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Bekleyen Yorumlar</CardDescription>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pendingComments}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Moderasyon gerekli
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Raporlanan İçerik</CardDescription>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.reportedContent}</div>
            <p className="text-xs text-muted-foreground mt-1">
              İnceleme gerekli
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Yasaklı Kullanıcılar</CardDescription>
            <Ban className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.bannedUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Aktif yasak
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Son 7 Gün - Moderasyon İstatistikleri</CardTitle>
          <CardDescription>Gerçekleştirilen moderasyon işlemleri</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-green-50 dark:bg-green-950">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{recentActions.approvedPlans}</p>
                <p className="text-sm text-muted-foreground">Plan Onaylandı</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-red-50 dark:bg-red-950">
              <XCircle className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-2xl font-bold">{recentActions.rejectedPlans}</p>
                <p className="text-sm text-muted-foreground">Plan Reddedildi</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-yellow-50 dark:bg-yellow-950">
              <Eye className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">{recentActions.hiddenComments}</p>
                <p className="text-sm text-muted-foreground">Yorum Gizlendi</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">
            Bekleyen İçerik
            <Badge variant="warning" className="ml-2">
              {stats.pendingPlans + stats.pendingComments}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="banned">
            Yasaklı Kullanıcılar
            <Badge variant="destructive" className="ml-2">
              {stats.bannedUsers}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="rules">Moderasyon Kuralları</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {/* Pending Plans */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Bekleyen Planlar</CardTitle>
                  <CardDescription>{stats.pendingPlans} plan onay bekliyor</CardDescription>
                </div>
                <Button asChild>
                  <Link href="/admin/planlar?status=pending">
                    Tümünü Gör
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {pendingContent.pendingPlans.length > 0 ? (
                <div className="space-y-4">
                  {pendingContent.pendingPlans.map((plan) => (
                    <div key={plan.id} className="flex items-start gap-4 p-4 rounded-lg border">
                      <Clock className="h-5 w-5 text-yellow-600 mt-1" />
                      <div className="flex-1">
                        <p className="font-medium">{plan.title}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {plan.description?.substring(0, 100)}...
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-muted-foreground">
                            @{plan.author.username || plan.author.name}
                          </span>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(plan.createdAt).toLocaleDateString('tr-TR')}
                          </span>
                        </div>
                      </div>
                      <Button size="sm" asChild>
                        <Link href={`/admin/planlar?status=pending`}>
                          İncele
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  Bekleyen plan yok
                </p>
              )}
            </CardContent>
          </Card>

          {/* Pending Comments */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Bekleyen Yorumlar</CardTitle>
                  <CardDescription>{stats.pendingComments} yorum moderasyon bekliyor</CardDescription>
                </div>
                <Button asChild>
                  <Link href="/admin/yorumlar">
                    Tümünü Gör
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {pendingContent.pendingComments.length > 0 ? (
                <div className="space-y-4">
                  {pendingContent.pendingComments.map((comment) => (
                    <div key={comment.id} className="flex items-start gap-4 p-4 rounded-lg border">
                      <Clock className="h-5 w-5 text-yellow-600 mt-1" />
                      <div className="flex-1">
                        <p className="text-sm">{comment.body}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-muted-foreground">
                            @{comment.author.username || comment.author.name}
                          </span>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">
                            {comment.plan?.title}
                          </span>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(comment.createdAt).toLocaleDateString('tr-TR')}
                          </span>
                        </div>
                      </div>
                      <Button size="sm" asChild>
                        <Link href="/admin/yorumlar">
                          İncele
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  Bekleyen yorum yok
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="banned">
          <Card>
            <CardHeader>
              <CardTitle>Yasaklı Kullanıcılar</CardTitle>
              <CardDescription>Platformdan yasaklanan kullanıcılar</CardDescription>
            </CardHeader>
            <CardContent>
              {bannedUsers.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Kullanıcı</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Yorum</TableHead>
                      <TableHead>Yasaklanma</TableHead>
                      <TableHead className="text-right">İşlem</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bannedUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{user.name || 'İsimsiz'}</p>
                            <p className="text-xs text-muted-foreground">
                              @{user.username || user.email?.split('@')[0]}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user._count.plans}</TableCell>
                        <TableCell>{user._count.comments}</TableCell>
                        <TableCell>
                          {new Date(user.updatedAt).toLocaleDateString('tr-TR')}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="outline" asChild>
                            <Link href={`/admin/kullanicilar/${user.id}`}>
                              Görüntüle
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  Yasaklı kullanıcı yok
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules">
          <Card>
            <CardHeader>
              <CardTitle>Moderasyon Kuralları</CardTitle>
              <CardDescription>Platform içerik kuralları ve yönergeleri</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  İçerik Kuralları
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Planlar sağlık açısından zararlı içerik içermemelidir</li>
                  <li>• Aşırı kısıtlayıcı diyetler (günlük 800 kalori altı) reddedilir</li>
                  <li>• Tıbbi tavsiye içeren planlar moderasyona alınır</li>
                  <li>• Spam ve reklam içeriği yasaktır</li>
                  <li>• Telif hakkı ihlali yapan içerikler kaldırılır</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Yorum Kuralları
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Hakaret ve küfür içeren yorumlar gizlenir</li>
                  <li>• Spam yorumlar otomatik olarak filtrelenir</li>
                  <li>• Kişisel bilgi paylaşımı yasaktır</li>
                  <li>• Reklam ve link spam'i kaldırılır</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Ban className="h-4 w-4" />
                  Yasaklama Kriterleri
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• 3 kez uyarı alan kullanıcılar geçici yasaklanır</li>
                  <li>• Ciddi kural ihlalleri kalıcı yasak gerektirir</li>
                  <li>• Spam hesaplar anında yasaklanır</li>
                  <li>• Sahte hesaplar ve botlar kaldırılır</li>
                </ul>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm">
                  <strong>Not:</strong> Moderasyon kararları platform yönergeleri ve topluluk standartlarına göre alınır. 
                  Kullanıcılar itiraz hakkına sahiptir.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
