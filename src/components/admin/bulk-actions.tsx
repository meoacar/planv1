"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
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

interface BulkActionsProps {
  selectedIds: string[]
  onClearSelection: () => void
  actions: {
    value: string
    label: string
    variant?: 'default' | 'destructive'
    confirmMessage?: string
  }[]
  onAction: (action: string, ids: string[]) => Promise<void>
}

export function BulkActions({
  selectedIds,
  onClearSelection,
  actions,
  onAction,
}: BulkActionsProps) {
  const [loading, setLoading] = useState(false)
  const [selectedAction, setSelectedAction] = useState<string>('')
  const [showConfirm, setShowConfirm] = useState(false)

  const handleAction = async () => {
    if (!selectedAction || selectedIds.length === 0) {
      toast.error('Lütfen bir işlem seçin')
      return
    }

    const action = actions.find(a => a.value === selectedAction)
    
    if (action?.confirmMessage) {
      setShowConfirm(true)
      return
    }

    await executeAction()
  }

  const executeAction = async () => {
    try {
      setLoading(true)
      await onAction(selectedAction, selectedIds)
      toast.success(`${selectedIds.length} öğe üzerinde işlem tamamlandı`)
      onClearSelection()
      setSelectedAction('')
      setShowConfirm(false)
    } catch (error: any) {
      toast.error(error.message || 'İşlem başarısız')
    } finally {
      setLoading(false)
    }
  }

  if (selectedIds.length === 0) return null

  const currentAction = actions.find(a => a.value === selectedAction)

  return (
    <>
      <div className="flex items-center gap-3 p-4 bg-muted rounded-lg border">
        <Checkbox checked disabled />
        <span className="text-sm font-medium">
          {selectedIds.length} öğe seçildi
        </span>
        
        <Select value={selectedAction} onValueChange={setSelectedAction}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Toplu işlem seç" />
          </SelectTrigger>
          <SelectContent>
            {actions.map((action) => (
              <SelectItem key={action.value} value={action.value}>
                {action.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          onClick={handleAction}
          disabled={loading || !selectedAction}
          variant={currentAction?.variant || 'default'}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              İşleniyor...
            </>
          ) : (
            'Uygula'
          )}
        </Button>

        <Button
          variant="ghost"
          onClick={onClearSelection}
          disabled={loading}
        >
          Seçimi Temizle
        </Button>
      </div>

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Emin misiniz?</AlertDialogTitle>
            <AlertDialogDescription>
              {currentAction?.confirmMessage || 
                `${selectedIds.length} öğe üzerinde bu işlemi gerçekleştirmek istediğinizden emin misiniz?`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>İptal</AlertDialogCancel>
            <AlertDialogAction onClick={executeAction} disabled={loading}>
              {loading ? 'İşleniyor...' : 'Onayla'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
