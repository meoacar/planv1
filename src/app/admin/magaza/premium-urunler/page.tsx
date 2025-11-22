"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Plus, Edit, Trash2, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  stock: number
  isActive: boolean
  category: string
  image?: string
}

export default function UrunlerPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<Product>>({})
  const { toast } = useToast()

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      const res = await fetch('/api/admin/magaza/products')
      if (res.ok) {
        const data = await res.json()
        setProducts(data)
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
        ? `/api/admin/magaza/products/${editingId}`
        : '/api/admin/magaza/products'
      
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
        loadProducts()
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
      const res = await fetch(`/api/admin/magaza/products/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        toast({
          title: "Başarılı",
          description: "Ürün silindi",
        })
        loadProducts()
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
          <h1 className="text-3xl font-bold">💎 Premium Ürünler</h1>
          <p className="text-muted-foreground">
            Gerçek para ile satılan premium ürünleri yönetin
          </p>
        </div>
        <Button onClick={() => {
          setEditingId(null)
          setFormData({})
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
                  placeholder="Örn: Premium Plan"
                />
              </div>

              <div className="space-y-2">
                <Label>Kategori</Label>
                <Input
                  value={formData.category || ''}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Örn: Planlar"
                />
              </div>

              <div className="space-y-2">
                <Label>Fiyat (₺)</Label>
                <Input
                  type="number"
                  value={formData.price || ''}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label>Eski Fiyat (₺) - Opsiyonel</Label>
                <Input
                  type="number"
                  value={formData.originalPrice || ''}
                  onChange={(e) => setFormData({ ...formData, originalPrice: parseFloat(e.target.value) })}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label>Stok</Label>
                <Input
                  type="number"
                  value={formData.stock || ''}
                  onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label>Görsel URL</Label>
                <Input
                  value={formData.image || ''}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Açıklama</Label>
              <Textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Ürün açıklaması..."
                rows={4}
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
        {products.map((product) => (
          <Card key={product.id}>
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex-1">
                <div className="flex items-center gap-4">
                  {product.image && (
                    <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded" />
                  )}
                  <div>
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">{product.category}</p>
                    <p className="text-sm text-muted-foreground mt-1">{product.description}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="font-bold text-lg">₺{product.price.toFixed(2)}</div>
                  {product.originalPrice && (
                    <div className="text-sm text-muted-foreground line-through">
                      ₺{product.originalPrice.toFixed(2)}
                    </div>
                  )}
                  <div className="text-sm text-muted-foreground">Stok: {product.stock}</div>
                  <div className={`text-sm ${product.isActive ? 'text-green-600' : 'text-red-600'}`}>
                    {product.isActive ? 'Aktif' : 'Pasif'}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setEditingId(product.id)
                      setFormData(product)
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDelete(product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {products.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">Henüz ürün eklenmemiş</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
