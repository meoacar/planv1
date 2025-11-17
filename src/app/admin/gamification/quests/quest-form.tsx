'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { Loader2, Save, Trash2 } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

interface QuestFormProps {
  quest?: any
}

export function QuestForm({ quest }: QuestFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  
  const [formData, setFormData] = useState({
    key: quest?.key || '',
    title: quest?.title || '',
    description: quest?.description || '',
    icon: quest?.icon || '✅',
    type: quest?.type || 'daily',
    target: quest?.target || 1,
    xpReward: quest?.xpReward || 10,
    coinReward: quest?.coinReward || 5,
    sortOrder: quest?.sortOrder || 0,
    isActive: quest?.isActive ?? true,
  })

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const url = quest
        ? `/api/admin/quests/${quest.id}`
        : '/api/admin/quests'
      
      const res = await fetch(url, {
        method: quest ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error?.message || 'İşlem başarısız')
      }

      toast.success(quest ? 'Görev güncellendi' : 'Görev oluşturuldu')
      router.push('/admin/gamification/quests')
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || 'Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const onDelete = async () => {
    if (!quest) return

    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/quests/${quest.id}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error?.message || 'Silme başarısız')
      }

      toast.success('Görev silindi')
      router.push('/admin/gamification/quests')
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || 'Bir hata oluştu')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Görev Bilgileri</CardTitle>
          <CardDescription>
            Görev detaylarını girin
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Key */}
          <div className="space-y-2">
            <Label htmlFor="key">Key *</Label>
            <Input
              id="key"
              placeholder="daily_check_in"
              value={formData.key}
              onChange={(e) => setFormData({ ...formData, key: e.target.value })}
              disabled={!!quest}
              required
            />
            <p className="text-sm text-muted-foreground">
              Benzersiz tanımlayıcı (sadece küçük harf, rakam ve _)
            </p>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Başlık *</Label>
            <Input
              id="title"
              placeholder="Günlük Check-in"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Açıklama *</Label>
            <Textarea
              id="description"
              placeholder="Bugün check-in yap"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              required
            />
          </div>

          {/* Icon */}
          <div className="space-y-2">
            <Label htmlFor="icon">İkon *</Label>
            <Input
              id="icon"
              placeholder="✅"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              required
            />
            <p className="text-sm text-muted-foreground">
              Emoji veya ikon (örn: ✅, 💧, 🏃)
            </p>
          </div>

          {/* Type */}
          <div className="space-y-2">
            <Label htmlFor="type">Tip *</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData({ ...formData, type: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tip seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Günlük</SelectItem>
                <SelectItem value="weekly">Haftalık</SelectItem>
                <SelectItem value="monthly">Aylık</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Target */}
          <div className="space-y-2">
            <Label htmlFor="target">Hedef *</Label>
            <Input
              id="target"
              type="number"
              value={formData.target}
              onChange={(e) => setFormData({ ...formData, target: parseInt(e.target.value) || 1 })}
              min={1}
              required
            />
            <p className="text-sm text-muted-foreground">
              Tamamlanması için gereken miktar
            </p>
          </div>

          {/* XP Reward */}
          <div className="space-y-2">
            <Label htmlFor="xpReward">XP Ödülü *</Label>
            <Input
              id="xpReward"
              type="number"
              value={formData.xpReward}
              onChange={(e) => setFormData({ ...formData, xpReward: parseInt(e.target.value) || 0 })}
              min={0}
              required
            />
          </div>

          {/* Coin Reward */}
          <div className="space-y-2">
            <Label htmlFor="coinReward">Coin Ödülü *</Label>
            <Input
              id="coinReward"
              type="number"
              value={formData.coinReward}
              onChange={(e) => setFormData({ ...formData, coinReward: parseInt(e.target.value) || 0 })}
              min={0}
              required
            />
          </div>

          {/* Sort Order */}
          <div className="space-y-2">
            <Label htmlFor="sortOrder">Sıra *</Label>
            <Input
              id="sortOrder"
              type="number"
              value={formData.sortOrder}
              onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
              min={0}
              required
            />
            <p className="text-sm text-muted-foreground">
              Görevlerin sıralanması için (küçükten büyüğe)
            </p>
          </div>

          {/* Is Active */}
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="isActive" className="text-base">Aktif</Label>
              <p className="text-sm text-muted-foreground">
                Görev kullanıcılara gösterilsin mi?
              </p>
            </div>
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div>
          {quest && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  type="button"
                  variant="destructive"
                  disabled={deleting}
                >
                  {deleting ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4 mr-2" />
                  )}
                  Sil
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Emin misiniz?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Bu görev kalıcı olarak silinecek. Bu işlem geri alınamaz.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>İptal</AlertDialogCancel>
                  <AlertDialogAction onClick={onDelete}>
                    Sil
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            İptal
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {quest ? 'Güncelle' : 'Oluştur'}
          </Button>
        </div>
      </div>
    </form>
  )
}
