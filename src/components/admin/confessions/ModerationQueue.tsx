"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, AlertTriangle, Loader2, Eye } from "lucide-react"
import { toast } from "sonner"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SortableTable } from "@/components/admin/sortable-table"
import { BulkActions } from "@/components/admin/bulk-actions"
import { ConfessionWithUser, ConfessionStatus } from "@/types/confession"
import { formatDistanceToNow } from "date-fns"
import { tr } from "date-fns/locale"

interface ModerationQueueProps {
  initialConfessions: ConfessionWithUser[]
  initialMeta: {
    page: number
    limit: number
    total: number
    totalPages: number
    pendingCount: number
    hiddenCount: number
  }
}

const CATEGORY_LABELS: Record<string, string> = {
  night_attack: "🌙 Gece Saldırıları",
  special_occasion: "🎉 Özel Gün",
  stress_eating: "😰 Stres Yeme",
  social_pressure: "👥 Sosyal Baskı",
  no_regrets: "😎 Pişman Değilim",
  seasonal: "🎊 Sezonluk",
}

const STATUS_LABELS: Record<ConfessionStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "Beklemede", variant: "secondary" },
  published: { label: "Yayında", variant: "default" },
  rejected: { label: "Reddedildi", variant: "destructive" },
  hidden: { label: "Gizlendi", variant: "outline" },
}

export function ModerationQueue({ initialConfessions, initialMeta }: ModerationQueueProps) {
  const router = useRouter()
  const [confessions, setConfessions] = useState(initialConfessions)
  const [loading, setLoading] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [rejectingId, setRejectingId] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState("")
  
  const [approveDialogOpen, setApproveDialogOpen] = useState(false)
  const [approvingId, setApprovingId] = useState<string | null>(null)
  
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [viewingConfession, setViewingConfession] = useState<ConfessionWithUser | null>(null)

  const handleApprove = async (id: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/confessions/${id}/approve`, {
        method: "POST",
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error?.message || "İtiraf onaylanamadı")
      }

      toast.success("İtiraf onaylandı ve yayınlandı")
      
      setConfessions(prev => prev.filter(c => c.id !== id))
      setApproveDialogOpen(false)
      setApprovingId(null)
      
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || "Bir hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  const handleReject = async () => {
    if (!rejectingId || !rejectReason.trim()) {
      toast.error("Lütfen reddetme sebebini yazın")
      return
    }

    if (rejectReason.length < 10) {
      toast.error("Reddetme sebebi en az 10 karakter olmalı")
      return
    }

    try {
      setLoading(true)
      const response = await fetch(`/api/admin/confessions/${rejectingId}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: rejectReason }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error?.message || "İtiraf reddedilemedi")
      }

      toast.success("İtiraf reddedildi ve kullanıcıya bildirim gönderildi")
      
      setConfessions(prev => prev.filter(c => c.id !== rejectingId))
      setRejectDialogOpen(false)
      setRejectingId(null)
      setRejectReason("")
      
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || "Bir hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  const handleBulkAction = async (action: string, ids: string[]) => {
    if (action === "approve") {
      const promises = ids.map(id => 
        fetch(`/api/admin/confessions/${id}/approve`, { method: "POST" })
      )
      await Promise.all(promises)
      setConfessions(prev => prev.filter(c => !ids.includes(c.id)))
      router.refresh()
    } else if (action === "reject") {
      const defaultReason = "Toplu moderasyon: İçerik uygunsuz bulundu"
      const promises = ids.map(id =>
        fetch(`/api/admin/confessions/${id}/reject`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reason: defaultReason }),
        })
      )
      await Promise.all(promises)
      setConfessions(prev => prev.filter(c => !ids.includes(c.id)))
      router.refresh()
    }
  }

  const openRejectDialog = (id: string) => {
    setRejectingId(id)
    setRejectDialogOpen(true)
  }

  const openApproveDialog = (id: string) => {
    setApprovingId(id)
    setApproveDialogOpen(true)
  }

  const openDetailDialog = (confession: ConfessionWithUser) => {
    setViewingConfession(confession)
    setDetailDialogOpen(true)
  }

  const columns = [
    {
      key: "user",
      label: "Kullanıcı",
      render: (confession: ConfessionWithUser) => (
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={confession.user.image || undefined} />
            <AvatarFallback>
              {confession.user.name?.[0] || confession.user.username?.[0] || "?"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">
              {confession.user.name || confession.user.username || "Anonim"}
            </span>
            <span className="text-xs text-muted-foreground">
              @{confession.user.username || "unknown"}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "content",
      label: "İtiraf",
      render: (confession: ConfessionWithUser) => (
        <div className="max-w-md">
          <p className="text-sm line-clamp-2">{confession.content}</p>
          <Button
            variant="link"
            size="sm"
            className="h-auto p-0 text-xs"
            onClick={() => openDetailDialog(confession)}
          >
            <Eye className="h-3 w-3 mr-1" />
            Detayları Gör
          </Button>
        </div>
      ),
    },
    {
      key: "category",
      label: "Kategori",
      sortable: true,
      render: (confession: ConfessionWithUser) => (
        <span className="text-sm">{CATEGORY_LABELS[confession.category]}</span>
      ),
    },
    {
      key: "status",
      label: "Durum",
      sortable: true,
      render: (confession: ConfessionWithUser) => {
        const statusInfo = STATUS_LABELS[confession.status]
        return (
          <Badge variant={statusInfo.variant}>
            {statusInfo.label}
          </Badge>
        )
      },
    },
    {
      key: "_count",
      label: "Raporlar",
      sortable: true,
      render: (confession: ConfessionWithUser) => (
        <span className="text-sm">
          {confession._count?.reports || 0}
          {(confession._count?.reports || 0) >= 5 && (
            <AlertTriangle className="inline h-4 w-4 ml-1 text-red-500" />
          )}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Tarih",
      sortable: true,
      render: (confession: ConfessionWithUser) => (
        <span className="text-sm text-muted-foreground">
          {formatDistanceToNow(new Date(confession.createdAt), {
            addSuffix: true,
            locale: tr,
          })}
        </span>
      ),
    },
    {
      key: "actions",
      label: "İşlemler",
      render: (confession: ConfessionWithUser) => (
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            className="text-green-600 hover:text-green-700 hover:bg-green-50"
            onClick={() => openApproveDialog(confession.id)}
            disabled={loading}
            title="Onayla"
          >
            {loading && approvingId === confession.id ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle className="h-4 w-4" />
            )}
          </Button>

          <Button
            size="sm"
            variant="ghost"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => openRejectDialog(confession.id)}
            disabled={loading}
            title="Reddet"
          >
            {loading && rejectingId === confession.id ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <XCircle className="h-4 w-4" />
            )}
          </Button>
        </div>
      ),
    },
  ]

  const bulkActions = [
    {
      value: "approve",
      label: "Seçilenleri Onayla",
      variant: "default" as const,
    },
    {
      value: "reject",
      label: "Seçilenleri Reddet",
      variant: "destructive" as const,
      confirmMessage: "Seçilen itiraflar reddedilecek ve kullanıcılara bildirim gönderilecek. Emin misiniz?",
    },
  ]

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="text-sm text-yellow-600 font-medium">Bekleyen</div>
          <div className="text-2xl font-bold text-yellow-700">{initialMeta.pendingCount}</div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-sm text-red-600 font-medium">Gizlenen</div>
          <div className="text-2xl font-bold text-red-700">{initialMeta.hiddenCount}</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-sm text-blue-600 font-medium">Toplam</div>
          <div className="text-2xl font-bold text-blue-700">{initialMeta.total}</div>
        </div>
      </div>

      <BulkActions
        selectedIds={selectedIds}
        onClearSelection={() => setSelectedIds([])}
        actions={bulkActions}
        onAction={handleBulkAction}
      />

      <div className="border rounded-lg">
        <SortableTable
          data={confessions}
          columns={columns}
          selectable
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          getItemId={(item) => item.id}
        />
      </div>

      <AlertDialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>İtirafı Onayla</AlertDialogTitle>
            <AlertDialogDescription>
              Bu itirafı onaylamak istediğinizden emin misiniz? İtiraf yayınlanacak ve kullanıcıya bildirim gönderilecek.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>İptal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => approvingId && handleApprove(approvingId)}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700"
            >
              {loading ? "Onaylanıyor..." : "Onayla"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>İtirafı Reddet</DialogTitle>
            <DialogDescription>
              Lütfen reddetme sebebini açıklayın. Bu mesaj kullanıcıya gönderilecek.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <Textarea
              placeholder="Reddetme sebebi (en az 10 karakter)..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              {rejectReason.length}/500 karakter
            </p>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setRejectDialogOpen(false)
                setRejectingId(null)
                setRejectReason("")
              }}
              disabled={loading}
            >
              İptal
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={loading || rejectReason.length < 10}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Reddediliyor...
                </>
              ) : (
                "Reddet"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>İtiraf Detayları</DialogTitle>
          </DialogHeader>
          
          {viewingConfession && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={viewingConfession.user.image || undefined} />
                  <AvatarFallback>
                    {viewingConfession.user.name?.[0] || "?"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{viewingConfession.user.name || "Anonim"}</div>
                  <div className="text-sm text-muted-foreground">
                    @{viewingConfession.user.username || "unknown"}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">İtiraf İçeriği</h4>
                <p className="text-sm bg-muted p-3 rounded-lg">{viewingConfession.content}</p>
              </div>

              {viewingConfession.aiResponse && (
                <div>
                  <h4 className="text-sm font-medium mb-2">AI Yanıtı</h4>
                  <p className="text-sm bg-blue-50 p-3 rounded-lg border border-blue-200">
                    {viewingConfession.aiResponse}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Kategori:</span>
                  <div className="font-medium">{CATEGORY_LABELS[viewingConfession.category]}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Durum:</span>
                  <div>
                    <Badge variant={STATUS_LABELS[viewingConfession.status].variant}>
                      {STATUS_LABELS[viewingConfession.status].label}
                    </Badge>
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Empati:</span>
                  <div className="font-medium">{viewingConfession.empathyCount}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Raporlar:</span>
                  <div className="font-medium">{viewingConfession._count?.reports || 0}</div>
                </div>
              </div>

              {viewingConfession.rejectionReason && (
                <div>
                  <h4 className="text-sm font-medium mb-2 text-red-600">Reddetme Sebebi</h4>
                  <p className="text-sm bg-red-50 p-3 rounded-lg border border-red-200">
                    {viewingConfession.rejectionReason}
                  </p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailDialogOpen(false)}>
              Kapat
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
