"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff, Loader2, AlertTriangle } from "lucide-react"
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
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SortableTable } from "@/components/admin/sortable-table"
import { ConfessionWithUser, ConfessionStatus } from "@/types/confession"
import { formatDistanceToNow } from "date-fns"
import { tr } from "date-fns/locale"

interface ConfessionReport {
  id: string
  confessionId: string
  userId: string
  reason: string
  createdAt: Date
  user: {
    id: string
    name: string | null
    username: string | null
    image: string | null
  }
}

interface ReportedConfession {
  confession: ConfessionWithUser
  reportCount: number
  reports: ConfessionReport[]
}

interface ConfessionReportsProps {
  initialData: ReportedConfession[]
  initialMeta: {
    page: number
    limit: number
    total: number
    totalPages: number
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

export function ConfessionReports({ initialData, initialMeta }: ConfessionReportsProps) {
  const router = useRouter()
  const [data, setData] = useState(initialData)
  const [loading, setLoading] = useState(false)
  
  const [toggleDialogOpen, setToggleDialogOpen] = useState(false)
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [togglingStatus, setTogglingStatus] = useState<"hidden" | "published">("hidden")
  
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [viewingReports, setViewingReports] = useState<ConfessionReport[]>([])
  const [viewingConfession, setViewingConfession] = useState<ConfessionWithUser | null>(null)

  const handleToggleVisibility = async (id: string, currentStatus: ConfessionStatus) => {
    const newStatus = currentStatus === "hidden" ? "published" : "hidden"
    
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/confessions/${id}/toggle-visibility`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error?.message || "İşlem başarısız")
      }

      toast.success(
        newStatus === "hidden" 
          ? "İtiraf gizlendi" 
          : "İtiraf yayına alındı"
      )
      
      setData(prev => 
        prev.map(item => 
          item.confession.id === id 
            ? { ...item, confession: { ...item.confession, status: newStatus as ConfessionStatus } }
            : item
        )
      )
      
      setToggleDialogOpen(false)
      setTogglingId(null)
      
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || "Bir hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  const openToggleDialog = (id: string, currentStatus: ConfessionStatus) => {
    setTogglingId(id)
    setTogglingStatus(currentStatus === "hidden" ? "published" : "hidden")
    setToggleDialogOpen(true)
  }

  const openDetailDialog = (confession: ConfessionWithUser, reports: ConfessionReport[]) => {
    setViewingConfession(confession)
    setViewingReports(reports)
    setDetailDialogOpen(true)
  }

  const columns = [
    {
      key: "user",
      label: "Kullanıcı",
      render: (item: ReportedConfession) => (
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={item.confession.user.image || undefined} />
            <AvatarFallback>
              {item.confession.user.name?.[0] || item.confession.user.username?.[0] || "?"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">
              {item.confession.user.name || item.confession.user.username || "Anonim"}
            </span>
            <span className="text-xs text-muted-foreground">
              @{item.confession.user.username || "unknown"}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "content",
      label: "İtiraf",
      render: (item: ReportedConfession) => (
        <div className="max-w-md">
          <p className="text-sm line-clamp-2">{item.confession.content}</p>
          <Button
            variant="link"
            size="sm"
            className="h-auto p-0 text-xs"
            onClick={() => openDetailDialog(item.confession, item.reports)}
          >
            <Eye className="h-3 w-3 mr-1" />
            Raporları Gör
          </Button>
        </div>
      ),
    },
    {
      key: "category",
      label: "Kategori",
      sortable: true,
      render: (item: ReportedConfession) => (
        <span className="text-sm">{CATEGORY_LABELS[item.confession.category]}</span>
      ),
    },
    {
      key: "reportCount",
      label: "Rapor Sayısı",
      sortable: true,
      render: (item: ReportedConfession) => (
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold">{item.reportCount}</span>
          {item.reportCount >= 5 && (
            <AlertTriangle className="h-4 w-4 text-red-500" />
          )}
        </div>
      ),
    },
    {
      key: "status",
      label: "Durum",
      sortable: true,
      render: (item: ReportedConfession) => {
        const statusInfo = STATUS_LABELS[item.confession.status]
        return (
          <Badge variant={statusInfo.variant}>
            {statusInfo.label}
          </Badge>
        )
      },
    },
    {
      key: "createdAt",
      label: "Tarih",
      sortable: true,
      render: (item: ReportedConfession) => (
        <span className="text-sm text-muted-foreground">
          {formatDistanceToNow(new Date(item.confession.createdAt), {
            addSuffix: true,
            locale: tr,
          })}
        </span>
      ),
    },
    {
      key: "actions",
      label: "İşlemler",
      render: (item: ReportedConfession) => (
        <Button
          size="sm"
          variant="ghost"
          className={
            item.confession.status === "hidden"
              ? "text-green-600 hover:text-green-700 hover:bg-green-50"
              : "text-orange-600 hover:text-orange-700 hover:bg-orange-50"
          }
          onClick={() => openToggleDialog(item.confession.id, item.confession.status)}
          disabled={loading}
          title={item.confession.status === "hidden" ? "Yayına Al" : "Gizle"}
        >
          {loading && togglingId === item.confession.id ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : item.confession.status === "hidden" ? (
            <Eye className="h-4 w-4" />
          ) : (
            <EyeOff className="h-4 w-4" />
          )}
        </Button>
      ),
    },
  ]

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-sm text-red-600 font-medium">Toplam Rapor</div>
          <div className="text-2xl font-bold text-red-700">{initialMeta.total}</div>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="text-sm text-orange-600 font-medium">Kritik (5+ Rapor)</div>
          <div className="text-2xl font-bold text-orange-700">
            {data.filter(item => item.reportCount >= 5).length}
          </div>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="text-sm text-gray-600 font-medium">Gizlenen</div>
          <div className="text-2xl font-bold text-gray-700">
            {data.filter(item => item.confession.status === "hidden").length}
          </div>
        </div>
      </div>

      <div className="border rounded-lg">
        <SortableTable
          data={data}
          columns={columns}
          getItemId={(item) => item.confession.id}
        />
      </div>

      <AlertDialog open={toggleDialogOpen} onOpenChange={setToggleDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {togglingStatus === "hidden" ? "İtirafı Gizle" : "İtirafı Yayına Al"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {togglingStatus === "hidden"
                ? "Bu itirafı gizlemek istediğinizden emin misiniz? İtiraf feed'de görünmeyecek."
                : "Bu itirafı yayına almak istediğinizden emin misiniz? İtiraf tekrar feed'de görünecek."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>İptal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (togglingId) {
                  const item = data.find(d => d.confession.id === togglingId)
                  if (item) {
                    handleToggleVisibility(togglingId, item.confession.status)
                  }
                }
              }}
              disabled={loading}
              className={
                togglingStatus === "hidden"
                  ? "bg-orange-600 hover:bg-orange-700"
                  : "bg-green-600 hover:bg-green-700"
              }
            >
              {loading ? "İşleniyor..." : "Onayla"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>İtiraf ve Raporlar</DialogTitle>
            <DialogDescription>
              Bu itiraf hakkında yapılan raporların detayları
            </DialogDescription>
          </DialogHeader>
          
          {viewingConfession && (
            <div className="space-y-6">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="text-sm font-medium mb-2">İtiraf İçeriği</h4>
                <p className="text-sm">{viewingConfession.content}</p>
                
                <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                  <span>Kategori: {CATEGORY_LABELS[viewingConfession.category]}</span>
                  <span>Empati: {viewingConfession.empathyCount}</span>
                  <Badge variant={STATUS_LABELS[viewingConfession.status].variant}>
                    {STATUS_LABELS[viewingConfession.status].label}
                  </Badge>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-3">
                  Raporlar ({viewingReports.length})
                </h4>
                <div className="space-y-3">
                  {viewingReports.map((report) => (
                    <div key={report.id} className="p-3 border rounded-lg">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={report.user.image || undefined} />
                          <AvatarFallback>
                            {report.user.name?.[0] || "?"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium">
                              {report.user.name || report.user.username || "Anonim"}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(report.createdAt), {
                                addSuffix: true,
                                locale: tr,
                              })}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{report.reason}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
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
