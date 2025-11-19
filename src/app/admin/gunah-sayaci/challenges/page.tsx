'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2, Target, Users, Calendar } from 'lucide-react'

type SinType = 'tatli' | 'fastfood' | 'gazli' | 'alkol' | 'diger'

interface SinChallenge {
  id: string
  title: string
  description: string
  targetDays: number
  sinType: SinType
  xpReward: number
  coinReward: number
  startDate: string
  endDate: string
  createdAt: string
  _count: {
    participants: number
  }
}

const sinTypeLabels: Record<SinType, { label: string; emoji: string }> = {
  tatli: { label: 'Tatlı', emoji: '🍰' },
  fastfood: { label: 'Fast Food', emoji: '🍔' },
  gazli: { label: 'Gazlı İçecek', emoji: '🥤' },
  alkol: { label: 'Alkol', emoji: '🍺' },
  diger: { label: 'Diğer', emoji: '🍕' },
}

export default function ChallengesAdminPage() {
  const [challenges, setChallenges] = useState<SinChallenge[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingChallenge, setEditingChallenge] = useState<SinChallenge | null>(null)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetDays: 7,
    sinType: 'tatli' as SinType,
    xpReward: 100,
    coinReward: 50,
    startDate: '',
    endDate: '',
  })

  useEffect(() => {
    fetchChallenges()
  }, [])

  const fetchChallenges = async () => {
    try {
      const res = await fetch('/api/admin/sin-challenges')
      if (!res.ok) throw new Error('Fetch failed')
      const data = await res.json()
      setChallenges(data)
    } catch (error) {
      toast.error('Challenge\'lar yüklenemedi')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingChallenge
        ? `/api/admin/sin-challenges/${editingChallenge.id}`
        : '/api/admin/sin-challenges'
      
      const method = editingChallenge ? 'PUT' : 'POST'
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) throw new Error('Save failed')

      toast.success(editingChallenge ? 'Challenge güncellendi' : 'Challenge eklendi')
      setIsDialogOpen(false)
      setEditingChallenge(null)
      resetForm()
      fetchChallenges()
    } catch (error) {
      toast.error('İşlem başarısız')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu challenge\'ı silmek istediğinize emin misiniz? Katılımcı verileri de silinecek.')) return

    try {
      const res = await fetch(`/api/admin/sin-challenges/${id}`, {
        method: 'DELETE',
      })

      if (!res.ok) throw new Error('Delete failed')

      toast.success('Challenge silindi')
      fetchChallenges()
    } catch (error) {
      toast.error('Silme işlemi başarısız')
    }
  }

  const openEditDialog = (challenge: SinChallenge) => {
    setEditingChallenge(challenge)
    setFormData({
      title: challenge.title,
      description: challenge.description,
      targetDays: challenge.targetDays,
      sinType: challenge.sinType,
      xpReward: challenge.xpReward,
      coinReward: challenge.coinReward,
      startDate: new Date(challenge.startDate).toISOString().split('T')[0],
      endDate: new Date(challenge.endDate).toISOString().split('T')[0],
    })
    setIsDialogOpen(true)
  }

  const openCreateDialog = () => {
    setEditingChallenge(null)
    resetForm()
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    const today = new Date().toISOString().split('T')[0]
    const nextMonth = new Date()
    nextMonth.setMonth(nextMonth.getMonth() + 1)
    const endDate = nextMonth.toISOString().split('T')[0]
    
    setFormData({
      title: '',
      description: '',
      targetDays: 7,
      sinType: 'tatli',
      xpReward: 100,
      coinReward: 50,
      startDate: today,
      endDate: endDate,
    })
  }

  const isActive = (challenge: SinChallenge) => {
    const now = new Date()
    const start = new Date(challenge.startDate)
    const end = new Date(challenge.endDate)
    return now >= start && now <= end
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Challenge\'lar</h1>
          <p className="text-muted-foreground mt-1">
            Kullanıcıların katılabileceği hedefleri yönet
          </p>
        </div>
        <Button onClick={openCreateDialog} size="lg">
          <Plus className="h-4 w-4 mr-2" />
          Yeni Challenge Ekle
        </Button>
      </div>

      {/* Challenges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <p>Yükleniyor...</p>
        ) : challenges.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="text-center py-12">
              <Target className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground">Henüz challenge eklenmemiş</p>
            </CardContent>
          </Card>
        ) : (
          challenges.map((challenge) => {
            const type = sinTypeLabels[challenge.sinType]
            const active = isActive(challenge)
            
            return (
              <Card key={challenge.id} className={`hover:shadow-lg transition-shadow ${active ? 'border-green-500 border-2' : ''}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={active ? 'default' : 'secondary'}>
                          {active ? '🔥 Aktif' : '⏸️ Pasif'}
                        </Badge>
                        <Badge variant="outline">
                          {type.emoji} {type.label}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl">{challenge.title}</CardTitle>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(challenge)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(challenge.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{challenge.description}</p>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Target className="h-4 w-4 text-muted-foreground" />
                      <span>{challenge.targetDays} gün hedef</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{challenge._count.participants} katılımcı</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(challenge.startDate).toLocaleDateString('tr-TR')} - {new Date(challenge.endDate).toLocaleDateString('tr-TR')}
                    </span>
                  </div>

                  <div className="flex gap-2 pt-2 border-t">
                    <Badge variant="outline">⭐ {challenge.xpReward} XP</Badge>
                    <Badge variant="outline">🪙 {challenge.coinReward} Coin</Badge>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingChallenge ? 'Challenge\'ı Düzenle' : 'Yeni Challenge Ekle'}
            </DialogTitle>
            <DialogDescription>
              Kullanıcılar belirli bir süre boyunca seçilen günah türünden kaçınmaya çalışır
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Challenge Başlığı</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Örn: 7 Günlük Tatlı Detoksu"
                  required
                  minLength={5}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Açıklama</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Challenge hakkında motivasyonel bir açıklama yaz"
                  required
                  minLength={10}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sinType">Günah Türü</Label>
                  <Select
                    value={formData.sinType}
                    onValueChange={(v) => setFormData({ ...formData, sinType: v as SinType })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(sinTypeLabels).map(([key, { label, emoji }]) => (
                        <SelectItem key={key} value={key}>
                          {emoji} {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="targetDays">Hedef Gün Sayısı</Label>
                  <Input
                    id="targetDays"
                    type="number"
                    value={formData.targetDays}
                    onChange={(e) => setFormData({ ...formData, targetDays: parseInt(e.target.value) })}
                    min={1}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Başlangıç Tarihi</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">Bitiş Tarihi</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="xpReward">XP Ödülü</Label>
                  <Input
                    id="xpReward"
                    type="number"
                    value={formData.xpReward}
                    onChange={(e) => setFormData({ ...formData, xpReward: parseInt(e.target.value) })}
                    min={0}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="coinReward">Coin Ödülü</Label>
                  <Input
                    id="coinReward"
                    type="number"
                    value={formData.coinReward}
                    onChange={(e) => setFormData({ ...formData, coinReward: parseInt(e.target.value) })}
                    min={0}
                    required
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                İptal
              </Button>
              <Button type="submit">
                {editingChallenge ? 'Güncelle' : 'Ekle'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
