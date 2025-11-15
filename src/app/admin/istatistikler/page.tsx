import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getStatistics, getUserStats, getContentStats, getEngagementStats } from './actions'
import { TrendingUp, Users, FileText, MessageSquare, Eye, Heart } from 'lucide-react'

export default async function AdminStatsPage() {
  const [stats, userStats, contentStats, engagementStats] = await Promise.all([
    getStatistics(),
    getUserStats(),
    getContentStats(),
    getEngagementStats(),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">İstatistikler & Analytics</h1>
        <p className="text-muted-foreground">
          Platform performansı ve kullanıcı davranışları
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
          <TabsTrigger value="users">Kullanıcılar</TabsTrigger>
          <TabsTrigger value="content">İçerik</TabsTrigger>
          <TabsTrigger value="engagement">Etkileşim</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardDescription>Toplam Kullanıcı</CardDescription>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <p className="text-xs text-green-600 mt-1">
                  +{stats.newUsersThisWeek} bu hafta
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardDescription>Toplam Plan</CardDescription>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalPlans}</div>
                <p className="text-xs text-green-600 mt-1">
                  +{stats.newPlansThisWeek} bu hafta
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardDescription>Toplam Görüntülenme</CardDescription>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Tüm planlar
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardDescription>Toplam Etkileşim</CardDescription>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalEngagement}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Beğeni + Yorum
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Popüler Planlar</CardTitle>
              <CardDescription>En çok görüntülenen planlar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.topPlans.map((plan, index) => (
                  <div key={plan.id} className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{plan.title}</p>
                      <p className="text-xs text-muted-foreground">
                        @{plan.author.username || plan.author.name}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{plan.views} görüntülenme</p>
                      <p className="text-xs text-muted-foreground">{plan.likesCount} beğeni</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Aktif Kullanıcılar</CardTitle>
                <CardDescription>Son 7 gün</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{userStats.activeUsers}</div>
                <p className="text-xs text-muted-foreground mt-2">
                  %{stats.totalUsers > 0 
                    ? ((userStats.activeUsers / stats.totalUsers) * 100).toFixed(1)
                    : '0'
                  } aktif
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Yeni Kayıtlar</CardTitle>
                <CardDescription>Bu ay</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{userStats.newUsersThisMonth}</div>
                <p className="text-xs text-muted-foreground mt-2">
                  Günlük ort: {(userStats.newUsersThisMonth / 30).toFixed(1)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ortalama Plan</CardTitle>
                <CardDescription>Kullanıcı başına</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{userStats.avgPlansPerUser.toFixed(1)}</div>
                <p className="text-xs text-muted-foreground mt-2">
                  Plan oluşturma oranı
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>En Aktif Kullanıcılar</CardTitle>
              <CardDescription>En çok plan oluşturan kullanıcılar</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sıra</TableHead>
                    <TableHead>Kullanıcı</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Görüntülenme</TableHead>
                    <TableHead>Beğeni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userStats.topUsers.map((user, index) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center font-bold text-xs">
                          {index + 1}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{user.name || 'İsimsiz'}</p>
                          <p className="text-xs text-muted-foreground">
                            @{user.username || user.email?.split('@')[0]}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{user._count.plans}</TableCell>
                      <TableCell>{user.totalViews}</TableCell>
                      <TableCell>{user.totalLikes}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Yayında</CardTitle>
                <CardDescription>Onaylanmış planlar</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{contentStats.publishedPlans}</div>
                <p className="text-xs text-muted-foreground mt-2">
                  %{stats.totalPlans > 0
                    ? ((contentStats.publishedPlans / stats.totalPlans) * 100).toFixed(1)
                    : '0'
                  } oranı
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Bekleyen</CardTitle>
                <CardDescription>Onay bekliyor</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-600">{contentStats.pendingPlans}</div>
                <p className="text-xs text-muted-foreground mt-2">
                  Moderasyon gerekli
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ortalama Süre</CardTitle>
                <CardDescription>Plan uzunluğu</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{contentStats.avgPlanDuration} gün</div>
                <p className="text-xs text-muted-foreground mt-2">
                  Plan başına
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Zorluk Dağılımı</CardTitle>
              <CardDescription>Planların zorluk seviyesi</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contentStats.plansByDifficulty.map((item) => (
                  <div key={item.difficulty} className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium capitalize">{item.difficulty}</span>
                        <span className="text-sm text-muted-foreground">{item._count} plan</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${(item._count / stats.totalPlans) * 100}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-medium">
                      {((item._count / stats.totalPlans) * 100).toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Toplam Beğeni</CardTitle>
                <CardDescription>Tüm planlar</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{engagementStats.totalLikes}</div>
                <p className="text-xs text-muted-foreground mt-2">
                  Plan başına: {stats.totalPlans > 0
                    ? (engagementStats.totalLikes / stats.totalPlans).toFixed(1)
                    : '0'
                  }
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Toplam Yorum</CardTitle>
                <CardDescription>Tüm planlar</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{engagementStats.totalComments}</div>
                <p className="text-xs text-muted-foreground mt-2">
                  Plan başına: {stats.totalPlans > 0
                    ? (engagementStats.totalComments / stats.totalPlans).toFixed(1)
                    : '0'
                  }
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Etkileşim Oranı</CardTitle>
                <CardDescription>Görüntülenme başına</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {stats.totalViews > 0 
                    ? ((stats.totalEngagement / stats.totalViews) * 100).toFixed(2)
                    : '0.00'
                  }%
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Beğeni + Yorum / Görüntülenme
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>En Çok Etkileşim Alan Planlar</CardTitle>
              <CardDescription>Beğeni + yorum toplamı</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sıra</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Beğeni</TableHead>
                    <TableHead>Yorum</TableHead>
                    <TableHead>Toplam</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {engagementStats.topEngagedPlans.map((plan, index) => (
                    <TableRow key={plan.id}>
                      <TableCell>
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center font-bold text-xs">
                          {index + 1}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{plan.title}</p>
                          <p className="text-xs text-muted-foreground">
                            @{plan.author.username || plan.author.name}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{plan.likesCount}</TableCell>
                      <TableCell>{plan._count.comments}</TableCell>
                      <TableCell className="font-bold">
                        {plan.likesCount + plan._count.comments}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
