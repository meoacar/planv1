"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw, Trash2, Loader2, Database, Download } from "lucide-react"
import { clearCache, restartServices, clearRedisCache } from "@/app/admin/sistem/actions"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function SystemActions() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showRedisDialog, setShowRedisDialog] = useState(false)
  const [exporting, setExporting] = useState(false)

  const handleClearCache = async () => {
    try {
      setLoading(true)
      await clearCache()
      toast.success('Cache temizlendi')
      router.refresh()
    } catch (error) {
      toast.error('Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const handleRestartServices = async () => {
    try {
      setLoading(true)
      await restartServices()
      toast.success('Servisler yeniden başlatıldı')
      router.refresh()
    } catch (error) {
      toast.error('Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const handleClearRedis = async () => {
    try {
      setLoading(true)
      setShowRedisDialog(false)
      await clearRedisCache()
      toast.success('Redis cache temizlendi')
      router.refresh()
    } catch (error) {
      toast.error((error as Error).message || 'Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async (type: string, format: string) => {
    try {
      setExporting(true)
      const response = await fetch(`/admin/sistem/export?type=${type}&format=${format}`)
      
      if (!response.ok) throw new Error('Export failed')
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `export-${type}-${Date.now()}.${format}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      toast.success('Veri export edildi')
    } catch (error) {
      toast.error('Export başarısız')
    } finally {
      setExporting(false)
    }
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" disabled={exporting}>
              {exporting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Veri Tipi</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => handleExport('all', 'json')}>
              Tüm Veriler (JSON)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport('users', 'json')}>
              Kullanıcılar (JSON)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport('users', 'csv')}>
              Kullanıcılar (CSV)
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleExport('plans', 'json')}>
              Planlar (JSON)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport('plans', 'csv')}>
              Planlar (CSV)
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleExport('comments', 'json')}>
              Yorumlar (JSON)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport('settings', 'json')}>
              Ayarlar (JSON)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="outline"
          onClick={handleClearCache}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4 mr-2" />
          )}
          Cache Temizle
        </Button>
        <Button
          variant="outline"
          onClick={() => setShowRedisDialog(true)}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Database className="h-4 w-4 mr-2" />
          )}
          Redis Temizle
        </Button>
        <Button
          variant="outline"
          onClick={handleRestartServices}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          Servisleri Yenile
        </Button>
      </div>

      <AlertDialog open={showRedisDialog} onOpenChange={setShowRedisDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Redis Cache Temizle</AlertDialogTitle>
            <AlertDialogDescription>
              Tüm Redis cache verileri silinecek. Bu işlem geri alınamaz.
              Rate limiting sayaçları ve cache'lenmiş veriler sıfırlanacak.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction onClick={handleClearRedis}>
              Temizle
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
