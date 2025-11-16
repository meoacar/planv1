"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, X, Trash2, Eye, Loader2, Clock } from "lucide-react"
import { approvePlan, rejectPlan, deletePlan, setUnderReview } from "@/app/admin/planlar/actions"
import { useRouter } from "next/navigation"
import Link from "next/link"
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
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

interface PlanActionsProps {
  planId: string
  planSlug: string
  status: string
}

export function PlanActions({ planId, planSlug, status }: PlanActionsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")

  const handleApprove = async () => {
    try {
      setLoading(true)
      await approvePlan(planId)
      toast.success("Plan onaylandı")
      router.refresh()
    } catch (error) {
      toast.error("Bir hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  const handleReject = async () => {
    try {
      setLoading(true)
      await rejectPlan(planId, rejectionReason || undefined)
      toast.success("Plan reddedildi")
      setShowRejectDialog(false)
      setRejectionReason("")
      router.refresh()
    } catch (error) {
      toast.error("Bir hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  const handleSetUnderReview = async () => {
    try {
      setLoading(true)
      await setUnderReview(planId)
      toast.success("Plan inceleme aşamasına alındı")
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
      await deletePlan(planId)
      toast.success("Plan silindi")
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
      <div className="flex items-center justify-end gap-2">
        <Button size="sm" variant="ghost" asChild>
          <Link href={`/plan/${planSlug}`}>
            <Eye className="h-4 w-4" />
          </Link>
        </Button>
        
        {(status === 'pending' || status === 'under_review') && (
          <>
            <Button 
              size="sm" 
              variant="ghost" 
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              onClick={handleSetUnderReview}
              disabled={loading || status === 'under_review'}
              title="İnceleniyor olarak işaretle"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Clock className="h-4 w-4" />}
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              className="text-green-600 hover:text-green-700 hover:bg-green-50"
              onClick={handleApprove}
              disabled={loading}
              title="Onayla"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => setShowRejectDialog(true)}
              disabled={loading}
              title="Reddet"
            >
              <X className="h-4 w-4" />
            </Button>
          </>
        )}
        
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

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Planı Reddet</DialogTitle>
            <DialogDescription>
              Planı neden reddettiğinizi açıklayın. Bu mesaj kullanıcıya gönderilecek.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Red Sebebi (Opsiyonel)</Label>
              <Textarea
                id="reason"
                placeholder="Örn: İçerik topluluk kurallarına uygun değil..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
              />
              <p className="text-xs text-muted-foreground">
                Kullanıcı bu mesajı bildirim olarak alacak ve plan sayfasında görecek.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              İptal
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleReject}
              disabled={loading}
            >
              {loading ? "Reddediliyor..." : "Reddet"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Planı Sil</AlertDialogTitle>
            <AlertDialogDescription>
              Bu planı kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
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
