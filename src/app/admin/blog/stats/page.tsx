'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { 
  FileText, 
  Eye, 
  MessageSquare, 
  Clock, 
  TrendingUp,
  Calendar,
  BarChart3
} from 'lucide-react'
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts'

interface BlogStats {
  overview: {
    totalBlogs: number
    publishedBlogs: number
    draftBlogs: number
    totalComments: number
    pendingComments: number
    approvedComments: number
    totalViews: number
    avgReadingTime: number
  }
  trends: {
    last7Days: number
    last30Days: number
  }
  mostReadPosts: Array<{
    id: string
    title: string
    slug: string
    viewCount: number
    publishedAt: string
    category: {
      name: string
      color: string | null
    }
  }>
  mostCommentedPosts: Array<{
    id: string
    title: string
    slug: string
    commentCount: number
  }>
  categoryDistribution: Array<{
    id: string
    name: string
    slug: string
    color: string | null
    icon: string | null
    postCount: number
  }>
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

export default function BlogStatsPage() {
  const [stats, setStats] = useState<BlogStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/admin/blog/stats')
      if (!response.ok) {
        throw new Error('İstatistikler yüklenemedi')
      }
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Error loading stats:', error)
      setError('İstatistikler yüklenirken bir hata oluştu')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Blog İstatistikleri</h1>
          <p className="text-muted-foreground">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Blog İstatistikleri</h1>
          <p className="text-destructive">{error || 'Bir hata oluştu'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Blog İstatistikleri</h1>
        <p className="text-muted-foreground">
          Blog performansını ve metrikleri görüntüle
        </p>
      </div>

      {/* Genel Metrikler */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Toplam Blog</CardDescription>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.overview.totalBlogs}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.overview.publishedBlogs} yayında, {stats.overview.draftBlogs} taslak
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Toplam Görüntülenme</CardDescription>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.overview.totalViews.toLocaleString('tr-TR')}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Tüm blog yazıları
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Toplam Yorum</CardDescription>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.overview.totalComments}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.overview.approvedComments} onaylı, {stats.overview.pendingComments} bekliyor
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Ort. Okuma Süresi</CardDescription>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.overview.avgReadingTime} dk</div>
            <p className="text-xs text-muted-foreground mt-1">
              Ortalama süre
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Trend Metrikleri */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Son 7 Gün</CardDescription>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.trends.last7Days}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Yayınlanan blog sayısı
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Son 30 Gün</CardDescription>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.trends.last30Days}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Yayınlanan blog sayısı
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="views" className="space-y-4">
        <TabsList>
          <TabsTrigger value="views">
            <Eye className="h-4 w-4 mr-2" />
            En Çok Okunan
          </TabsTrigger>
          <TabsTrigger value="comments">
            <MessageSquare className="h-4 w-4 mr-2" />
            En Çok Yorumlanan
          </TabsTrigger>
          <TabsTrigger value="categories">
            <BarChart3 className="h-4 w-4 mr-2" />
            Kategori Dağılımı
          </TabsTrigger>
        </TabsList>

        {/* En Çok Okunan Yazılar */}
        <TabsContent value="views" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>En Çok Okunan Blog Yazıları</CardTitle>
              <CardDescription>
                En yüksek görüntülenme sayısına sahip yazılar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={stats.mostReadPosts}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="title" 
                    angle={-45}
                    textAnchor="end"
                    height={120}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload
                        return (
                          <div className="bg-background border rounded-lg p-3 shadow-lg">
                            <p className="font-semibold text-sm mb-1">{data.title}</p>
                            <p className="text-xs text-muted-foreground mb-1">
                              Kategori: {data.category.name}
                            </p>
                            <p className="text-sm">
                              Görüntülenme: <span className="font-bold">{data.viewCount.toLocaleString('tr-TR')}</span>
                            </p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Legend />
                  <Bar dataKey="viewCount" fill="#0088FE" name="Görüntülenme" />
                </BarChart>
              </ResponsiveContainer>

              {/* Liste Görünümü */}
              <div className="mt-6 space-y-3">
                {stats.mostReadPosts.map((post, index) => (
                  <div 
                    key={post.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{post.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge 
                            variant="secondary" 
                            style={{ 
                              backgroundColor: post.category.color || undefined 
                            }}
                            className="text-xs"
                          >
                            {post.category.name}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(post.publishedAt).toLocaleDateString('tr-TR')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Eye className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold">
                        {post.viewCount.toLocaleString('tr-TR')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* En Çok Yorumlanan Yazılar */}
        <TabsContent value="comments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>En Çok Yorumlanan Blog Yazıları</CardTitle>
              <CardDescription>
                En fazla yorum alan yazılar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.mostCommentedPosts} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis 
                    dataKey="title" 
                    type="category" 
                    width={200}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload
                        return (
                          <div className="bg-background border rounded-lg p-3 shadow-lg">
                            <p className="font-semibold text-sm mb-1">{data.title}</p>
                            <p className="text-sm">
                              Yorum: <span className="font-bold">{data.commentCount}</span>
                            </p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Legend />
                  <Bar dataKey="commentCount" fill="#00C49F" name="Yorum Sayısı" />
                </BarChart>
              </ResponsiveContainer>

              {/* Liste Görünümü */}
              <div className="mt-6 space-y-3">
                {stats.mostCommentedPosts.map((post, index) => (
                  <div 
                    key={post.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                        {index + 1}
                      </div>
                      <p className="font-medium truncate">{post.title}</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold">{post.commentCount}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Kategori Dağılımı */}
        <TabsContent value="categories" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Kategori Dağılımı</CardTitle>
                <CardDescription>
                  Blog yazılarının kategorilere göre dağılımı
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={stats.categoryDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => 
                        `${name} (${(percent * 100).toFixed(0)}%)`
                      }
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="postCount"
                    >
                      {stats.categoryDistribution.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.color || COLORS[index % COLORS.length]} 
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Kategori Detayları</CardTitle>
                <CardDescription>
                  Her kategorideki blog sayısı
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats.categoryDistribution
                    .sort((a, b) => b.postCount - a.postCount)
                    .map((category, index) => (
                      <div 
                        key={category.id}
                        className="flex items-center justify-between p-3 rounded-lg border bg-card"
                      >
                        <div className="flex items-center gap-3">
                          {category.icon && (
                            <span className="text-2xl">{category.icon}</span>
                          )}
                          <div>
                            <p className="font-medium">{category.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {category.postCount} blog yazısı
                            </p>
                          </div>
                        </div>
                        <Badge 
                          style={{ 
                            backgroundColor: category.color || undefined 
                          }}
                        >
                          {category.postCount}
                        </Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Kategori Karşılaştırması</CardTitle>
              <CardDescription>
                Kategorilerdeki blog sayılarının karşılaştırması
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.categoryDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="postCount" fill="#8884d8" name="Blog Sayısı" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
