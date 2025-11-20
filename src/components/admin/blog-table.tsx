'use client'

import { useState } from 'react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { 
  MoreVertical, 
  Eye, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle,
  Star,
  StarOff,
  Clock,
  MessageSquare,
} from 'lucide-react'
import { toast } from 'sonner'
import {
  deleteBlogPost,
  publishBlogPost,
  unpublishBlogPost,
  toggleFeaturedBlogPost,
} from '@/app/admin/blog/actions'

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

interface BlogTableProps {
  posts: BlogPost[]
  selectedPosts: string[]
  onSelectPost: (postId: string) => void
  onSelectAll: (selected: boolean) => void
}

export function BlogTable({
  posts,
  selectedPosts,
  onSelectPost,
  onSelectAll,
}: BlogTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [postToDelete, setPostToDelete] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const allSelected = posts.length > 0 && selectedPosts.length === posts.length

  const handleDelete = async () => {
    if (!postToDelete) return

    setIsLoading(true)
    try {
      await deleteBlogPost(postToDelete)
      toast.success('Blog yazısı silindi')
      setDeleteDialogOpen(false)
      setPostToDelete(null)
      window.location.reload()
    } catch (error: any) {
      toast.error(error.message || 'Bir hata oluştu')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePublish = async (postId: string) => {
    try {
      await publishBlogPost(postId)
      toast.success('Blog yazısı yayınlandı')
      window.location.reload()
    } catch (error: any) {
      toast.error(error.message || 'Bir hata oluştu')
    }
  }

  const handleUnpublish = async (postId: string) => {
    try {
      await unpublishBlogPost(postId)
      toast.success('Blog yazısı taslağa alındı')
      window.location.reload()
    } catch (error: any) {
      toast.error(error.message || 'Bir hata oluştu')
    }
  }

  const handleToggleFeatured = async (postId: string, featured: boolean) => {
    try {
      await toggleFeaturedBlogPost(postId, !featured)
      toast.success(featured ? 'Öne çıkarmadan kaldırıldı' : 'Öne çıkarıldı')
      window.location.reload()
    } catch (error: any) {
      toast.error(error.message || 'Bir hata oluştu')
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return <Badge variant="default">Yayında</Badge>
      case 'DRAFT':
        return <Badge variant="secondary">Taslak</Badge>
      case 'ARCHIVED':
        return <Badge variant="outline">Arşiv</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <>
      <Table aria-label="Blog yazıları tablosu">
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={allSelected}
                onCheckedChange={onSelectAll}
                aria-label={allSelected ? "Tüm seçimleri kaldır" : "Tümünü seç"}
              />
            </TableHead>
            <TableHead>Blog Yazısı</TableHead>
            <TableHead>Kategori</TableHead>
            <TableHead>Durum</TableHead>
            <TableHead>Görüntülenme</TableHead>
            <TableHead>Yorum</TableHead>
            <TableHead>Tarih</TableHead>
            <TableHead className="text-right">İşlemler</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.length > 0 ? (
            posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedPosts.includes(post.id)}
                    onCheckedChange={() => onSelectPost(post.id)}
                    aria-label={`${post.title} seç`}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-start gap-3">
                    {post.coverImage && (
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/blog/${post.slug}`}
                          className="font-medium hover:underline line-clamp-1"
                          target="_blank"
                        >
                          {post.title}
                        </Link>
                        {post.featured && (
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">
                          @{post.author.username || post.author.name}
                        </span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {post.readingTime} dk
                        </span>
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    style={{
                      borderColor: post.category.color || undefined,
                      color: post.category.color || undefined,
                    }}
                  >
                    {post.category.name}
                  </Badge>
                </TableCell>
                <TableCell>{getStatusBadge(post.status)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    <span>{post.viewCount}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    <span>{post._count.comments}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(post.createdAt), {
                      addSuffix: true,
                      locale: tr,
                    })}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        aria-label={`${post.title} için işlemler menüsü`}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/blog/${post.slug}`} target="_blank">
                          <Eye className="h-4 w-4 mr-2" />
                          Görüntüle
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/blog/${post.id}/edit`}>
                          <Edit className="h-4 w-4 mr-2" />
                          Düzenle
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {post.status === 'PUBLISHED' ? (
                        <DropdownMenuItem onClick={() => handleUnpublish(post.id)}>
                          <XCircle className="h-4 w-4 mr-2" />
                          Taslağa Al
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem onClick={() => handlePublish(post.id)}>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Yayınla
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={() => handleToggleFeatured(post.id, post.featured)}
                      >
                        {post.featured ? (
                          <>
                            <StarOff className="h-4 w-4 mr-2" />
                            Öne Çıkarmadan Kaldır
                          </>
                        ) : (
                          <>
                            <Star className="h-4 w-4 mr-2" />
                            Öne Çıkar
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => {
                          setPostToDelete(post.id)
                          setDeleteDialogOpen(true)
                        }}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Sil
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8">
                <div role="status" aria-label="Blog yazısı bulunamadı">
                  <p className="text-muted-foreground">Blog yazısı bulunamadı</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Blog yazısını silmek istediğinize emin misiniz?</AlertDialogTitle>
            <AlertDialogDescription>
              Bu işlem geri alınamaz. Blog yazısı kalıcı olarak silinecektir.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>İptal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoading ? 'Siliniyor...' : 'Sil'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
