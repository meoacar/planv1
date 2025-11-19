'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
import { Plus, Pencil, Trash2, MessageSquare } from 'lucide-react'

type SinType = 'tatli' | 'fastfood' | 'gazli' | 'alkol' | 'diger'

interface Reaction {
  id: string
  message: string
  sinType: SinType
  createdAt: string
}

const sinTypeLabels: Record<SinType, { label: string; emoji: string }> = {
  tatli: { label: 'Tatlı', emoji: '🍰' },
  fastfood: { label: 'Fast Food', emoji: '🍔' },
  gazli: { label: 'Gazlı İçecek', emoji: '🥤' },
  alkol: { label: 'Alkol', emoji: '🍺' },
  diger: { label: 'Diğer', emoji: '🍕' },
}

export default function ReactionsAdminPage() {
  const [reactions, setReactions] = useState<Reaction[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingReaction, setEditingReaction] = useState<Reaction | null>(null)
  const [filterType, setFilterType] = useState<SinType | 'all'>('all')
  
  const [formData, setFormData] = useState({
    message: '',
    sinType: 'tatli' as SinType,
  })

  useEffect(() => {
    fetchReactions()
  }, [filterType])

  const fetchReactions = async () => {
    try {
      const url = filterType === 'all' 
        ? '/api/admin/sin-reactions'
        : `/api/admin/sin-reactions?sinType=${filterType}`
      
      const res = await fetch(url)
      if (!res.ok) throw new Error('Fetch failed')
      const data = await res.json()
      setReactions(data)
    } catch (error) {
      toast.error('Yanıtlar yüklenemedi')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingReaction
        ? `/api/admin/sin-reactions/${editingReaction.id}`
        : '/api/admin/sin-reactions'
      
      const method = editingReaction ? 'PUT' : 'POST'
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) throw new Error('Save failed')

      toast.success(editingReaction ? 'Yanıt güncellendi' : 'Yanıt eklendi')
      setIsDialogOpen(false)
      setEditingReaction(null)
      setFormData({ message: '', sinType: 'tatli' })
      fetchReactions()
    } catch (error) {
      toast.error('İşlem başarısız')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu yanıtı silmek istediğinize emin misiniz?')) return

    try {
      const res = await fetch(`/api/admin/sin-reactions/${id}`, {
        method: 'DELETE',
      })

      if (!res.ok) throw new Error('Delete failed')

      toast.success('Yanıt silindi')
      fetchReactions()
    } catch (error) {
      toast.error('Silme işlemi başarısız')
    }
  }

  const openEditDialog = (reaction: Reaction) => {
    setEditingReaction(reaction)
    setFormData({
      message: reaction.message,
      sinType: reaction.sinType,
    })
    setIsDialogOpen(true)
  }

  const openCreateDialog = () => {
    setEditingReaction(null)
    setFormData({ message: '', sinType: 'tatli' })
    setIsDialogOpen(true)
  }

  const filteredReactions = reactions

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mizahi Yanıtlar</h1>
          <p className="text-muted-foreground mt-1">
            Günah eklendiğinde gösterilen mesajları yönet
          </p>
        </div>
        <Button onClick={openCreateDialog} size="lg">
          <Plus className="h-4 w-4 mr-2" />
          Yeni Yanıt Ekle
        </Button>
      </div>

      {/* Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Filtrele</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={filterType} onValueChange={(v) => setFilterType(v as any)}>
            <SelectTrigger className="w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm Türler</SelectItem>
              {Object.entries(sinTypeLabels).map(([key, { label, emoji }]) => (
                <SelectItem key={key} value={key}>
                  {emoji} {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Reactions List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <p>Yükleniyor...</p>
        ) : filteredReactions.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground">Henüz yanıt eklenmemiş</p>
            </CardContent>
          </Card>
        ) : (
          filteredReactions.map((reaction) => {
            const type = sinTypeLabels[reaction.sinType]
            return (
              <Card key={reaction.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">
                      {type.emoji} {type.label}
                    </Badge>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(reaction)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(reaction.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{reaction.message}</p>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingReaction ? 'Yanıtı Düzenle' : 'Yeni Yanıt Ekle'}
            </DialogTitle>
            <DialogDescription>
              Kullanıcılar günah eklediklerinde bu mesajlardan biri rastgele gösterilir
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
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
                <Label htmlFor="message">Mesaj</Label>
                <Input
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Örn: Tatlı mı? Hayat zaten yeterince acı! 😄"
                  required
                  minLength={5}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                İptal
              </Button>
              <Button type="submit">
                {editingReaction ? 'Güncelle' : 'Ekle'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
