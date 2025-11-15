"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Shield, Ban, Trash2, Loader2 } from "lucide-react"
import { toggleUserRole, toggleUserBan, deleteUser } from "@/app/admin/kullanicilar/actions"
import { useRouter } from "next/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"

interface UserActionsProps {
  userId: string
  role: string
  isBanned: boolean
}

export function UserActions({ userId, role, isBanned }: UserActionsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleToggleRole = async () => {
    try {
      setLoading(true)
      await toggleUserRole(userId)
      toast.success(role === 'ADMIN' ? 'Kullanıcı yetkisi kaldırıldı' : 'Kullanıcı admin yapıldı')
      router.refresh()
    } catch (error) {
      toast.error("Bir hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  const handleToggleBan = async () => {
    try {
      setLoading(true)
      await toggleUserBan(userId)
      toast.success(isBanned ? 'Kullanıcı yasağı kaldırıldı' : 'Kullanıcı yasaklandı')
      router.refresh()
    } catch (error) {
      toast.error("Bir hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      setLoading(true)
      await deleteUser(userId)
      toast.success("Kullanıcı silindi")
      setShowDeleteDialog(false)
      router.refresh()
    } catch (error) {
      toast.error("Bir hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button 
        size="sm" 
        variant="ghost" 
        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
        onClick={handleToggleRole}
        disabled={loading}
        title={role === 'ADMIN' ? 'Admin yetkisini kaldır' : 'Admin yap'}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Shield className="h-4 w-4" />}
      </Button>
      
      <Button 
        size="sm" 
        variant="ghost" 
        className={isBanned ? "text-green-600 hover:text-green-700 hover:bg-green-50" : "text-orange-600 hover:text-orange-700 hover:bg-orange-50"}
        onClick={handleToggleBan}
        disabled={loading}
        title={isBanned ? 'Yasağı kaldır' : 'Yasakla'}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Ban className="h-4 w-4" />}
      </Button>
      
      <Button 
        size="sm" 
        variant="ghost" 
        className="text-red-600 hover:text-red-700 hover:bg-red-50"
        onClick={() => setShowDeleteDialog(true)}
        disabled={loading}
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Kullanıcıyı Sil</AlertDialogTitle>
            <AlertDialogDescription>
              Bu kullanıcıyı kalıcı olarak silmek istediğinizden emin misiniz? Tüm planları ve yorumları da silinecektir. Bu işlem geri alınamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={loading}>
              {loading ? "Siliniyor..." : "Sil"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
