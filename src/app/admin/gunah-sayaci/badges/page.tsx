'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
import { Plus, Pencil, Trash2, Trophy, Users } from 'lucide-react'

interface SinBadge {
  id: string
  name: string
  description: string
  icon: string
  xpReward: number
  coinReward: number
  createdAt: string
  _count: {
    users: number
  }
}

export default function BadgesAdminPage() {
  const [badges, setBadges] = useState<SinBadge[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingBadge, setEditingBadge] = useState<SinBadge | null>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '',
    xpReward: 0,
    coinReward: 0,
  })

  useEffect(() => {
    fetchBadges()
  }, [])

  const fetchBadges = async () => {
    try {
      const res = await fetch('/api/admin/sin-badges')
      if (!res.ok) throw new Error('Fetch failed')
      const data = await res.json()
      setBadges(data)
    } catch (error) {
      toast.error('Rozetler yüklenemedi')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingBadge
        ? `/api/admin/sin-badges/${editingBadge.id}`
        : '/api/admin/sin-badges'
      
      const method = editingBadge ? 'PUT' : 'POST'
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) throw new Error('Save failed')

      toast.success(editingBadge ? 'Rozet güncellendi' : 'Rozet eklendi')
      setIsDialogOpen(false)
      setEditingBadge(null)
      setFormData({ name: '', description: '', icon: '', xpReward: 0, coinReward: 0 })
      fetchBadges()
    } catch (error) {
      toast.error('İşlem başarısız')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu rozeti silmek istediğinize emin misiniz? Kullanıcıların kazandığı rozetler de silinecek.')) return

    try {
      const res = await fetch(`/api/admin/sin-badges/${id}`, {
        method: 'DELETE',
      })

      if (!res.ok) throw new Error('Delete failed')

      toast.success('Rozet silindi')
      fetchBadges()
    } catch (error) {
      toast.error('Silme işlemi başarısız')
    }
  }

  const openEditDialog = (badge: SinBadge) => {
    setEditingBadge(badge)
    setFormData({
      name: badge.name,
      description: badge.description,
      icon: badge.icon,
      xpReward: badge.xpReward,
      coinReward: badge.coinReward,
    })
    setIsDialogOpen(true)
  }

  const openCreateDialog = () => {
    setEditingBadge(null)
    setFormData({ name: '', description: '', icon: '', xpReward: 0, coinReward: 0 })
    setIsDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Rozetler</h1>
          <p className="text-muted-foreground mt-1">
            Kullanıcıların kazanabileceği başarı rozetlerini yönet
          </p>
        </div>
        <Button onClick={openCreateDialog} size="lg">
          <Plus className="h-4 w-4 mr-2" />
          Yeni Rozet Ekle
        </Button>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p>Yükleniyor...</p>
        ) : badges.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="text-center py-12">
              <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground">Henüz rozet eklenmemiş</p>
            </CardContent>
          </Card>
        ) : (
          badges.map((badge) => (
            <Card key={badge.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{badge.icon}</span>
                    <div>
                      <CardTitle className="text-lg">{badge.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          <Users className="h-3 w-3 mr-1" />
                          {badge._count.users}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(badge)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(badge.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">{badge.description}</p>
                <div className="flex gap-2">
                  <Badge variant="outline">⭐ {badge.xpReward} XP</Badge>
                  <Badge variant="outline">🪙 {badge.coinReward} Coin</Badge>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingBadge ? 'Rozeti Düzenle' : 'Yeni Rozet Ekle'}
            </DialogTitle>
            <DialogDescription>
              Rozet kazanma koşulları kod tarafında tanımlanır (badge-checker.ts)
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Rozet Adı</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Örn: Glukozsuz Kahraman"
                    required
                    minLength={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="icon">Icon (Emoji)</Label>
                  <Input
                    id="icon"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    placeholder="🥇"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Açıklama</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Rozet kazanma koşulunu açıkla"
                  required
                  minLength={10}
                  rows={3}
                />
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
                {editingBadge ? 'Güncelle' : 'Ekle'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
