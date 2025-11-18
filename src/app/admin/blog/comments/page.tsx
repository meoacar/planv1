'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { CommentModeration } from '@/components/admin/comment-moderation'
import { ArrowLeft, MessageSquare, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'

interface BlogComment {
  id: string
  content: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SPAM'
  createdAt: Date
  updatedAt: Date
  user: {
    id: string
    name: string | null
    username: string | null
    image: string | null
    email: string | null
  }
  post: {
    id: string
    title: string
    slug: string
  }
}

interface CommentsResponse {
  success: boolean
  data: BlogComment[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export default function AdminBlogCommentsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [comments, setComments] = useState<BlogComment[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  const status = searchParams.get('status') || 'PENDING'
  const page = parseInt(searchParams.get('page') || '1')
  const postId = searchParams.get('postId') || undefined

  useEffect(() => {
    loadComments()
  }, [status, page, postId])

  const loadComments = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        status,
        page: page.toString(),
        limit: '20',
      })

      if (postId) {
        params.append('postId', postId)
      }

      const response = await fetch(`/api/admin/blog/comments?${params}`)
      const data: CommentsResponse = await response.json()

      if (data.success) {
        setComments(data.data)
        setTotal(data.pagination.total)
      }
    } catch (error) {
      console.error('Error loading comments:', error)
      toast.error('Yorumlar yüklenirken bir hata oluştu')
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = async (commentId: string, newStatus: 'APPROVED' | 'REJECTED' | 'SPAM') => {
    try {
      const response = await fetch(`/api/admin/blog/comments/${commentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success(data.message)
        loadComments()
      } else {
        toast.error(data.error || 'Bir hata oluştu')
      }
    } catch (error) {
      console.error('Error updating comment:', error)
      toast.error('Yorum güncellenirken bir hata oluştu')
    }
  }

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('status', value)
    params.set('page', '1')
    router.push(`/admin/blog/comments?${params}`)
  }

  // Stats
  const pendingCount = comments.filter((c) => c.status === 'PENDING').length
  const approvedCount = comments.filter((c) => c.status === 'APPROVED').length
  const rejectedCount = comments.filter((c) => c.status === 'REJECTED').length
  const spamCount = comments.filter((c) => c.status === 'SPAM').length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/blog">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Blog Yönetimi
              </Link>
            </Button>
          </div>
          <h1 className="text-3xl font-bold mb-2">Yorum Moderasyonu</h1>
          <p className="text-muted-foreground">
            Blog yorumlarını onayla, reddet veya spam olarak işaretle
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Bekleyen</CardDescription>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Moderasyon bekliyor
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Onaylı</CardDescription>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Yayında
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Reddedilen</CardDescription>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rejectedCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Reddedildi
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Spam</CardDescription>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{spamCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Spam işaretli
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Yorumlar</CardTitle>
          <CardDescription>Toplam {total} yorum</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs value={status} onValueChange={handleTabChange} className="space-y-4">
            <TabsList>
              <TabsTrigger value="PENDING">
                Bekleyen
                <Badge variant="secondary" className="ml-2">
                  {pendingCount}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="APPROVED">
                Onaylı
                <Badge variant="secondary" className="ml-2">
                  {approvedCount}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="REJECTED">
                Reddedilen
                <Badge variant="secondary" className="ml-2">
                  {rejectedCount}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="SPAM">
                Spam
                <Badge variant="secondary" className="ml-2">
                  {spamCount}
                </Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value={status} className="space-y-4">
              {isLoading ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Yükleniyor...</p>
                </div>
              ) : comments.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {status === 'PENDING' && 'Bekleyen yorum yok'}
                    {status === 'APPROVED' && 'Onaylı yorum yok'}
                    {status === 'REJECTED' && 'Reddedilen yorum yok'}
                    {status === 'SPAM' && 'Spam işaretli yorum yok'}
                  </p>
                </div>
              ) : (
                <CommentModeration
                  comments={comments}
                  onStatusChange={handleStatusChange}
                />
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
