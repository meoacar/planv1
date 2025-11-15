"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Trash2, Eye, EyeOff, Power } from "lucide-react"
import { toggleApiKey, deleteApiKey } from "@/app/admin/api-keys/actions"
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

interface ApiKeyActionsProps {
  apiKeyId: string
  apiKey: string
  isActive: boolean
}

export function ApiKeyActions({ apiKeyId, apiKey, isActive }: ApiKeyActionsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showKey, setShowKey] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey)
    toast.success('API key kopyalandı')
  }

  const handleToggle = async () => {
    try {
      setLoading(true)
      await toggleApiKey(apiKeyId)
      toast.success(isActive ? 'API key devre dışı bırakıldı' : 'API key aktif edildi')
      router.refresh()
    } catch (error) {
      toast.error('Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      setLoading(true)
      await deleteApiKey(apiKeyId)
      toast.success('API key silindi')
      setShowDeleteDialog(false)
      router.refresh()
    } catch (error) {
      toast.error('Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="flex items-center justify-end gap-2">
        <Button 
          size="sm" 
          variant="ghost"
          onClick={handleCopy}
          title="Kopyala"
        >
          <Copy className="h-4 w-4" />
        </Button>
        
        <Button 
          size="sm" 
          variant="ghost"
          onClick={handleToggle}
          disabled={loading}
          title={isActive ? 'Devre dışı bırak' : 'Aktif et'}
        >
          <Power className={`h-4 w-4 ${isActive ? 'text-green-600' : 'text-gray-400'}`} />
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
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>API Key'i Sil</AlertDialogTitle>
            <AlertDialogDescription>
              Bu API key'i kalıcı olarak silmek istediğinizden emin misiniz? Bu key'i kullanan tüm uygulamalar çalışmayı durduracaktır.
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
