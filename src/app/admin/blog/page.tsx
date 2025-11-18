'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { BlogTable } from '@/components/admin/blog-table'
import { BlogFilters } from '@/components/admin/blog-filters'
import { BlogBulkActions } from '@/components/admin/blog-bulk-actions'
import { Plus, FileText, Eye, MessageSquare, Clock } from 'lucide-react'
import { getBlogsForAdmin, getBlogCategories } from './actions'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  coverImage: string | null
  status: string
  featured: boolean
  viewCount: number
  readingTime: number
  publishedAt: Date | null
  createdAt: Date
  author: {
    id: string
    name: string | null
    username: string | null
    image: string | null
  }
  category: {
    id: string
    name: string
    slug: string
    color: string | null
  }
  blog_tags: Array<{
    id: string
    name: string
    slug: string
  }>
  _count: {
    comments: number
  }
}

interface Category {
  id: string
  name: string
  slug: string
  _count: {
    posts: number
  }
}

export default function AdminBlogPage() {
  const searchParams = useSearchParams()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [total, setTotal] = useState(0)
  const [selectedPosts, setSelectedPosts] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const status = searchParams.get('status') || 'all'
  const categoryId = searchParams.get('categoryId') || 'all'
  const page = parseInt(searchParams.get('page') || '1')
  const search = searchParams.get('search') || undefined

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [blogsData, categoriesData] = await Promise.all([
        getBlogsForAdmin(status, categoryId, page, search),
        getBlogCategories(),
      ])
      setPosts(blogsData.posts)
      setTotal(blogsData.total)
      setCategories(categoriesData)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [status, categoryId, page, search])

  const handleSelectPost = (postId: string) => {
    setSelectedPosts((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId]
    )
  }

  const handleSelectAll = (selected: boolean) => {
    setSelectedPosts(selected ? posts.map((post) => post.id) : [])
  }

  const handleClearSelection = () => {
    setSelectedPosts([])
  }

  // Stats
  const publishedCount = posts.filter((p) => p.status === 'PUBLISHED').length
  const draftCount = posts.filter((p) => p.status === 'DRAFT').length
  const totalViews = posts.reduce((sum, p) => sum + p.viewCount, 0)
  const totalComments = posts.reduce((sum, p) => sum + p._count.comments, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Blog Yönetimi</h1>
          <p className="text-muted-foreground">
            Blog yazılarını yönet, düzenle ve yayınla
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/blog/new">
            <Plus className="h-4 w-4 mr-2" />
            Yeni Blog Yazısı
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Toplam Blog</CardDescription>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{total}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {publishedCount} yayında, {draftCount} taslak
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Toplam Görüntülenme</CardDescription>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalViews.toLocaleString('tr-TR')}</div>
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
            <div className="text-2xl font-bold">{totalComments}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Onaylı yorumlar
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Kategoriler</CardDescription>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Aktif kategoriler
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Blog Yazıları</CardTitle>
              <CardDescription>Toplam {total} blog yazısı</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/blog/categories">
                  Kategoriler
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/blog/comments">
                  Yorumlar
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/blog/stats">
                  İstatistikler
                </Link>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <BlogFilters categories={categories} />

          <BlogBulkActions
            selectedPosts={selectedPosts}
            onClearSelection={handleClearSelection}
          />

          <Tabs value={status} className="space-y-4">
            <TabsList>
              <TabsTrigger value="all" asChild>
                <Link href="/admin/blog?status=all" className="cursor-pointer">
                  Tümü
                  <Badge variant="secondary" className="ml-2">
                    {total}
                  </Badge>
                </Link>
              </TabsTrigger>
              <TabsTrigger value="published" asChild>
                <Link href="/admin/blog?status=published" className="cursor-pointer">
                  Yayında
                  <Badge variant="secondary" className="ml-2">
                    {publishedCount}
                  </Badge>
                </Link>
              </TabsTrigger>
              <TabsTrigger value="draft" asChild>
                <Link href="/admin/blog?status=draft" className="cursor-pointer">
                  Taslak
                  <Badge variant="secondary" className="ml-2">
                    {draftCount}
                  </Badge>
                </Link>
              </TabsTrigger>
            </TabsList>

            <TabsContent value={status} className="space-y-4">
              {isLoading ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Yükleniyor...</p>
                </div>
              ) : (
                <BlogTable
                  posts={posts}
                  selectedPosts={selectedPosts}
                  onSelectPost={handleSelectPost}
                  onSelectAll={handleSelectAll}
                />
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
