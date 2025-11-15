'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
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
import { MoreHorizontal, Check, X, Trash2, Star, Eye } from 'lucide-react'
import { toast } from 'sonner'
import { approveRecipe, rejectRecipe, deleteRecipe, toggleFeatured } from '@/app/admin/tarifler/actions'
import Link from 'next/link'

interface RecipeActionsProps {
  recipe: {
    id: string
    slug: string
    status: string
    isFeatured: boolean
  }
}

export function RecipeActions({ recipe }: RecipeActionsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleApprove = async () => {
    setLoading(true)
    try {
      await approveRecipe(recipe.id)
      toast.success('Tarif onaylandı!')
      router.refresh()
    } catch (error) {
      toast.error('Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const handleReject = async () => {
    setLoading(true)
    try {
      await rejectRecipe(recipe.id)
      toast.success('Tarif reddedildi')
      router.refresh()
    } catch (error) {
      toast.error('Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    setLoading(true)
    try {
      await deleteRecipe(recipe.id)
      toast.success('Tarif silindi')
      router.refresh()
    } catch (error) {
      toast.error('Bir hata oluştu')
    } finally {
      setLoading(false)
      setShowDeleteDialog(false)
    }
  }

  const handleToggleFeatured = async () => {
    setLoading(true)
    try {
      await toggleFeatured(recipe.id)
      toast.success(recipe.isFeatured ? 'Öne çıkandan kaldırıldı' : 'Öne çıkarıldı')
      router.refresh()
    } catch (error) {
      toast.error('Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" disabled={loading}>
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={`/tarif/${recipe.slug}`}>
              <Eye className="w-4 h-4 mr-2" />
              Görüntüle
            </Link>
          </DropdownMenuItem>

          {recipe.status === 'pending' && (
            <>
              <DropdownMenuItem onClick={handleApprove}>
                <Check className="w-4 h-4 mr-2" />
                Onayla
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleReject}>
                <X className="w-4 h-4 mr-2" />
                Reddet
              </DropdownMenuItem>
            </>
          )}

          {recipe.status === 'published' && (
            <DropdownMenuItem onClick={handleToggleFeatured}>
              <Star className={`w-4 h-4 mr-2 ${recipe.isFeatured ? 'fill-current' : ''}`} />
              {recipe.isFeatured ? 'Öne Çıkandan Kaldır' : 'Öne Çıkar'}
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className="text-destructive"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Sil
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tarifi Sil</AlertDialogTitle>
            <AlertDialogDescription>
              Bu tarifi kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive">
              Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
