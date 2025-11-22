"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Plus, Edit, Trash2, Save, Coins } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ShopItem {
  id: string
  key: string
  name: string
  description: string
  icon: string
  category: string
  price: number
  stock: number | null
  isActive: boolean
  sortOrder: number
  metadata: string | null
}

const categories = [
  { value: 'cosmetic', label: 'Kozmetik' },
  { value: 'boost', label: 'Güçlendirici' },
  { value: 'special', label: 'Özel' },
  { value: 'seasonal', label: 'Sezonluk' },
]

export default function CoinUrunlerPage() {
  const [items, setItems] = useState<ShopItem[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<ShopItem>>({})
  const { toast } = useToast()

  useEffect(() => {
    loadItems()
  }, [])

  const loadItems = async () => {
    try {
      const res = await fetch('/api/admin/magaza/shop-items')
      if (res.ok) {
        const data = await res.json()
        setItems(data)
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: "Ürünler yüklenemedi",
        variant: "destructive",
      })
    }
  }

  const handleSave = async () => {
    try {
      const url = editingId 
        ? `/api/admin/magaza/shop-items/${editingId}`
        : '/api/admin/magaza/shop-items'
      
      const res = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        toast({
          title: "Başarılı",
          description: editingId ? "Ürün güncellendi" : "Ürün eklendi",
        })
        loadItems()
        setEditingId(null)
        setFormData({})
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: "İşlem başarısız",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu ürünü silmek istediğinizden emin misiniz?')) return

    try {
      const res = await fetch(`/api/admin/magaza/shop-items/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        toast({
          title: "Başarılı",
          description: "Ürün silindi",
        })
        loadItems()
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: "Silme işlemi başarısız",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Coins className="h-8 w-8 text-yellow-500" />
            Coin Ürünleri
          </h1>
          <p className="text-muted-foreground">
            Kullanıcıların coin ile satın alabileceği ürünleri yönetin
          </p>
        </div>
        <Button onClick={() => {
          setEditingId(null)
          setFormData({ category: 'cosmetic', isActive: true, sortOrder: 0 })
        }}>
          <Plus className="mr-2 h-4 w-4" />
          Yeni Ürün
        </Button>
      </div>

      {(editingId !== null || Object.keys(formData).length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Ürün Adı</Label>
                <Input
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Örn: Altın Rozet"
                />
              </div>

              <div className="space-y-2">
                <Label>Anahtar (Key)</Label>
                <Input
                  value={formData.key || ''}
                  onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                  placeholder="Örn: golden_badge"
                />
              </div>

              <div className="space-y-2">
                <Label>Kategori</Label>
                <select
                  className="w-full p-2 border rounded"
                  value={formData.category || 'cosmetic'}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label>Fiyat (Coin)</Label>
                <Input
                  type="number"
                  value={formData.price || ''}
                  onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label>Stok (Boş = Sınırsız)</Label>
                <Input
                  type="number"
                  value={formData.stock || ''}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value ? parseInt(e.target.value) : null })}
                  placeholder="Sınırsız"
                />
              </div>

              <div className="space-y-2">
                <Label>Sıralama</Label>
                <Input
                  type="number"
                  value={formData.sortOrder || 0}
                  onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) })}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label>İkon (Emoji)</Label>
                <Input
                  value={formData.icon || ''}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="🏆"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Açıklama</Label>
              <Textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Ürün açıklaması..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Metadata (JSON - Opsiyonel)</Label>
              <Textarea
                value={formData.metadata || ''}
                onChange={(e) => setFormData({ ...formData, metadata: e.target.value })}
                placeholder='{"color": "#FFD700"}'
                rows={2}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.isActive || false}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
              <Label>Aktif</Label>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Kaydet
              </Button>
              <Button variant="outline" onClick={() => {
                setEditingId(null)
                setFormData({})
              }}>
                İptal
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {items.map((item) => (
          <Card key={item.id}>
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex-1">
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{item.icon}</div>
                  <div>
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                    <div className="flex gap-2 mt-1">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {categories.find(c => c.value === item.category)?.label}
                      </span>
                      <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                        Key: {item.key}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="font-bold text-lg flex items-center gap-1">
                    <Coins className="h-4 w-4 text-yellow-500" />
                    {item.price}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Stok: {item.stock ?? '∞'}
                  </div>
                  <div className={`text-sm ${item.isActive ? 'text-green-600' : 'text-red-600'}`}>
                    {item.isActive ? 'Aktif' : 'Pasif'}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setEditingId(item.id)
                      setFormData(item)
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {items.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">Henüz coin ürünü eklenmemiş</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
