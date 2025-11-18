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
import { 
  getStatistics, 
  getUserStats, 
  getContentStats, 
  getEngagementStats,
  getRecipeStats,
  getGamificationStats,
  getGuildStats,
  getGroupStats,
  getMessagingStats,
  getSeasonStats,
  getAppealStats,
  getReferralStats,
} from './actions'
import { 
  TrendingUp, 
  Users, 
  FileText, 
  MessageSquare, 
  Eye, 
  Heart,
  ChefHat,
  Trophy,
  Shield,
  UsersRound,
  Mail,
  Calendar,
  AlertCircle,
  UserPlus,
  Coins,
  Store,
  Award,
  Target,
} from 'lucide-react'

export default async function AdminStatsPage() {
  const [
    stats, 
    userStats, 
    contentStats, 
    engagementStats,
    recipeStats,
    gamificationStats,
    guildStats,
    groupStats,
    messagingStats,
    seasonStats,
    appealStats,
    referralStats,
  ] = await Promise.all([
    getStatistics(),
    getUserStats(),
    getContentStats(),
    getEngagementStats(),
    getRecipeStats(),
    getGamificationStats(),
    getGuildStats(),
    getGroupStats(),
    getMessagingStats(),
    getSeasonStats(),
    getAppealStats(),
    getReferralStats(),
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
        <TabsList className="grid grid-cols-4 lg:grid-cols-8 w-full">
          <TabsTrigger value="overview">Genel</TabsTrigger>
          <TabsTrigger value="users">Kullanıcılar</TabsTrigger>
          <TabsTrigger value="content">Planlar</TabsTrigger>
          <TabsTrigger value="engagement">Etkileşim</TabsTrigger>
          <TabsTrigger value="recipes">Tarifler</TabsTrigger>
          <TabsTrigger value="gamification">Oyunlaştırma</TabsTrigger>
          <TabsTrigger value="social">Sosyal</TabsTrigger>
          <TabsTrigger value="system">Sistem</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardDescription>Kullanıcılar</CardDescription>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <p className="text-xs text-green-600 mt-1">+{stats.newUsersThisWeek} bu hafta</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardDescription>Planlar</CardDescription>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalPlans}</div>
                <p className="text-xs text-green-600 mt-1">+{stats.newPlansThisWeek} bu hafta</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardDescription>Tarifler</CardDescription>
                <ChefHat className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalRecipes}</div>
                <p className="text-xs text-muted-foreground mt-1">Toplam tarif</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardDescription>Loncalar</CardDescription>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalGuilds}</div>
                <p className="text-xs text-muted-foreground mt-1">Aktif lonca</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardDescription>Gruplar</CardDescription>
                <UsersRound className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalGroups}</div>
                <p className="text-xs text-muted-foreground mt-1">Toplam grup</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardDescription>Rozetler</CardDescription>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalBadges}</div>
                <p className="text-xs text-muted-foreground mt-1">Rozet türü</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardDescription>Toplam Görüntülenme</CardDescription>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">Tüm planlar</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardDescription>Toplam Etkileşim</CardDescription>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalEngagement.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">Beğeni + Yorum</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardDescription>Mağaza Ürünleri</CardDescription>
                <Store className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalShopItems}</div>
                <p className="text-xs text-muted-foreground mt-1">Satışta</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardDescription>Aktif Sezonlar</CardDescription>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{seasonStats.activeSeasons}</div>
                <p className="text-xs text-muted-foreground mt-1">Şu anda aktif</p>
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

        <TabsContent value="recipes" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Toplam Tarif</CardTitle>
                <CardDescription>Tüm tarifler</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{recipeStats.totalRecipes}</div>
                <p className="text-xs text-green-600 mt-2">+{recipeStats.newRecipesThisWeek} bu hafta</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Yayında</CardTitle>
                <CardDescription>Onaylanmış</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{recipeStats.publishedRecipes}</div>
                <p className="text-xs text-muted-foreground mt-2">
                  %{recipeStats.totalRecipes > 0 
                    ? ((recipeStats.publishedRecipes / recipeStats.totalRecipes) * 100).toFixed(1)
                    : '0'
                  } oranı
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Beğeniler</CardTitle>
                <CardDescription>Toplam</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{recipeStats.totalRecipeLikes}</div>
                <p className="text-xs text-muted-foreground mt-2">
                  Tarif başına: {recipeStats.totalRecipes > 0
                    ? (recipeStats.totalRecipeLikes / recipeStats.totalRecipes).toFixed(1)
                    : '0'
                  }
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Yorumlar</CardTitle>
                <CardDescription>Toplam</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{recipeStats.totalRecipeComments}</div>
                <p className="text-xs text-muted-foreground mt-2">
                  Tarif başına: {recipeStats.totalRecipes > 0
                    ? (recipeStats.totalRecipeComments / recipeStats.totalRecipes).toFixed(1)
                    : '0'
                  }
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>En Popüler Tarifler</CardTitle>
              <CardDescription>En çok görüntülenen tarifler</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sıra</TableHead>
                    <TableHead>Tarif</TableHead>
                    <TableHead>Görüntülenme</TableHead>
                    <TableHead>Beğeni</TableHead>
                    <TableHead>Yorum</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recipeStats.topRecipes.map((recipe, index) => (
                    <TableRow key={recipe.id}>
                      <TableCell>
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center font-bold text-xs">
                          {index + 1}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{recipe.title}</p>
                          <p className="text-xs text-muted-foreground">
                            @{recipe.author.username || recipe.author.name}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{recipe.views}</TableCell>
                      <TableCell>{recipe._count.likes}</TableCell>
                      <TableCell>{recipe._count.comments}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gamification" className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardDescription>Rozetler</CardDescription>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{gamificationStats.totalBadges}</div>
                <p className="text-xs text-muted-foreground mt-1">Rozet türü</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardDescription>Kazanılan</CardDescription>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{gamificationStats.totalUserBadges}</div>
                <p className="text-xs text-muted-foreground mt-1">Toplam kazanım</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardDescription>Görevler</CardDescription>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{gamificationStats.totalQuests}</div>
                <p className="text-xs text-muted-foreground mt-1">Aktif görev</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardDescription>Tamamlanan</CardDescription>
                <Target className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{gamificationStats.completedQuests}</div>
                <p className="text-xs text-muted-foreground mt-1">Görev tamamlama</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Toplam Coin</CardTitle>
                <CardDescription>Dolaşımdaki</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold flex items-center gap-2">
                  <Coins className="h-8 w-8 text-yellow-500" />
                  {gamificationStats.totalCoins.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground mt-2">Toplam kazanılan coin</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mağaza Ürünleri</CardTitle>
                <CardDescription>Satışta</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{gamificationStats.totalShopItems}</div>
                <p className="text-xs text-muted-foreground mt-2">Satın alınabilir ürün</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Satın Alımlar</CardTitle>
                <CardDescription>Toplam</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{gamificationStats.totalPurchases}</div>
                <p className="text-xs text-muted-foreground mt-2">Tamamlanan alışveriş</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>En Popüler Rozetler</CardTitle>
              <CardDescription>En çok kazanılan rozetler</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {gamificationStats.topBadges.map((badge, index) => (
                  <div key={badge.id} className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{badge.name}</p>
                      <p className="text-xs text-muted-foreground">{badge.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{badge._count.users} kullanıcı</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardDescription>Loncalar</CardDescription>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{guildStats.totalGuilds}</div>
                <p className="text-xs text-muted-foreground mt-1">Aktif lonca</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardDescription>Lonca Üyeleri</CardDescription>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{guildStats.totalMembers}</div>
                <p className="text-xs text-muted-foreground mt-1">Toplam üye</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardDescription>Bekleyen</CardDescription>
                <AlertCircle className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{guildStats.pendingRequests}</div>
                <p className="text-xs text-muted-foreground mt-1">Katılım talebi</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardDescription>Gruplar</CardDescription>
                <UsersRound className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{groupStats.totalGroups}</div>
                <p className="text-xs text-muted-foreground mt-1">Toplam grup</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>En Büyük Loncalar</CardTitle>
                <CardDescription>Üye sayısına göre</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {guildStats.topGuilds.map((guild, index) => (
                    <div key={guild.id} className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{guild.name}</p>
                        <p className="text-xs text-muted-foreground">{guild.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{guild._count.members} üye</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>En Aktif Gruplar</CardTitle>
                <CardDescription>Üye ve gönderi sayısı</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {groupStats.topGroups.map((group, index) => (
                    <div key={group.id} className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{group.name}</p>
                        <p className="text-xs text-muted-foreground">{group.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{group._count.members} üye</p>
                        <p className="text-xs text-muted-foreground">{group._count.posts} gönderi</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Grup Üyeleri</CardTitle>
                <CardDescription>Toplam</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{groupStats.totalGroupMembers}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Grup Gönderileri</CardTitle>
                <CardDescription>Toplam</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{groupStats.totalGroupPosts}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Bekleyen Gruplar</CardTitle>
                <CardDescription>Onay bekliyor</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-600">{groupStats.pendingGroups}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mesajlaşma</CardTitle>
                <CardDescription>Bu hafta</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{messagingStats.messagesThisWeek}</div>
                <p className="text-xs text-muted-foreground mt-2">Yeni mesaj</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardDescription>Sezonlar</CardDescription>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{seasonStats.totalSeasons}</div>
                <p className="text-xs text-green-600 mt-1">{seasonStats.activeSeasons} aktif</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardDescription>Ligler</CardDescription>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{seasonStats.totalLeagues}</div>
                <p className="text-xs text-muted-foreground mt-1">Toplam lig</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardDescription>Battle Pass</CardDescription>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{seasonStats.totalBattlePasses}</div>
                <p className="text-xs text-green-600 mt-1">{seasonStats.activeBattlePasses} aktif</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardDescription>İtirazlar</CardDescription>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{appealStats.totalAppeals}</div>
                <p className="text-xs text-yellow-600 mt-1">{appealStats.pendingAppeals} bekliyor</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>İtiraz Durumları</CardTitle>
                <CardDescription>İtiraz sistemi istatistikleri</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Bekleyen</span>
                    <span className="text-lg font-bold text-yellow-600">{appealStats.pendingAppeals}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Onaylanan</span>
                    <span className="text-lg font-bold text-green-600">{appealStats.approvedAppeals}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Reddedilen</span>
                    <span className="text-lg font-bold text-red-600">{appealStats.rejectedAppeals}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-sm font-medium">Toplam</span>
                    <span className="text-lg font-bold">{appealStats.totalAppeals}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Referans Sistemi</CardTitle>
                <CardDescription>Davet ve referans istatistikleri</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Referans Kodları</span>
                    <span className="text-lg font-bold">{referralStats.totalReferralCodes}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Toplam Davet</span>
                    <span className="text-lg font-bold">{referralStats.totalReferrals}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Başarılı Davet</span>
                    <span className="text-lg font-bold text-green-600">{referralStats.successfulReferrals}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-sm font-medium">Başarı Oranı</span>
                    <span className="text-lg font-bold">
                      {referralStats.totalReferrals > 0
                        ? ((referralStats.successfulReferrals / referralStats.totalReferrals) * 100).toFixed(1)
                        : '0'
                      }%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Mesajlaşma İstatistikleri</CardTitle>
                <CardDescription>Kullanıcı iletişimi</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Toplam Konuşma</span>
                    <span className="text-lg font-bold">{messagingStats.totalConversations}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Toplam Mesaj</span>
                    <span className="text-lg font-bold">{messagingStats.totalMessages.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Bu Hafta</span>
                    <span className="text-lg font-bold text-green-600">{messagingStats.messagesThisWeek}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-sm font-medium">Aktif Konuşma</span>
                    <span className="text-lg font-bold">{messagingStats.activeConversations}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>En Çok Davet Yapanlar</CardTitle>
                <CardDescription>Top 5 referrer</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {referralStats.topReferrers.slice(0, 5).map((user, index) => (
                    <div key={user.id} className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{user.name || 'İsimsiz'}</p>
                        <p className="text-xs text-muted-foreground">
                          @{user.username || user.email?.split('@')[0]}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium flex items-center gap-1">
                          <UserPlus className="h-3 w-3" />
                          {user._count.referrals}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
