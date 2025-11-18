'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
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
import { CheckCircle, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { bulkPublishBlogPosts, bulkDeleteBlogPosts } from '@/app/admin/blog/actions'

interface BlogBulkActionsProps {
  selectedPosts: string[]
  onClearSelection: () => void
}

export function BlogBulkActions({ selectedPosts, onClearSelection }: BlogBulkActionsProps) {
  const [publishDialogOpen, setPublishDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleBulkPublish = async () => {
    setIsLoading(true)
    try {
      await bulkPublishBlogPosts(selectedPosts)
      toast.success(`${selectedPosts.length} blog yazısı yayınlandı`)
      setPublishDialogOpen(false)
      onClearSelection()
      window.location.reload()
    } catch (error: any) {
      toast.error(error.message || 'Bir hata oluştu')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBulkDelete = async () => {
    setIsLoading(true)
    try {
      await bulkDeleteBlogPosts(selectedPosts)
      toast.success(`${selectedPosts.length} blog yazısı silindi`)
      setDeleteDialogOpen(false)
      onClearSelection()
      window.location.reload()
    } catch (error: any) {
      toast.error(error.message || 'Bir hata oluştu')
    } finally {
      setIsLoading(false)
    }
  }

  if (selectedPosts.length === 0) {
    return null
  }

  return (
    <>
      <div className="flex items-center gap-2 p-4 bg-muted rounded-lg">
        <span className="text-sm font-medium">
          {selectedPosts.length} yazı seçildi
        </span>
        <div className="flex-1" />
        <Button
          size="sm"
          variant="outline"
          onClick={() => setPublishDialogOpen(true)}
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          Toplu Yayınla
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={() => setDeleteDialogOpen(true)}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Toplu Sil
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={onClearSelection}
        >
          İptal
        </Button>
      </div>

      <AlertDialog open={publishDialogOpen} onOpenChange={setPublishDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {selectedPosts.length} blog yazısını yayınlamak istediğinize emin misiniz?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Seçili blog yazıları yayınlanacak ve kullanıcılar tarafından görülebilir olacaktır.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>İptal</AlertDialogCancel>
            <AlertDialogAction onClick={handleBulkPublish} disabled={isLoading}>
              {isLoading ? 'Yayınlanıyor...' : 'Yayınla'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {selectedPosts.length} blog yazısını silmek istediğinize emin misiniz?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Bu işlem geri alınamaz. Seçili blog yazıları kalıcı olarak silinecektir.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>İptal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
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
