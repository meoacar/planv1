"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Plus, Edit, Trash2, Save, Copy } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"

interface Coupon {
  id: string
  code: string
  discountType: 'percentage' | 'fixed'
  discountValue: number
  minPurchase?: number
  maxDiscount?: number
  usageLimit?: number
  usageCount: number
  expiresAt?: string
  isActive: boolean
}

export default function KuponlarPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<Coupon>>({})
  const { toast } = useToast()

  useEffect(() => {
    loadCoupons()
  }, [])

  const loadCoupons = async () => {
    try {
      const res = await fetch('/api/admin/magaza/coupons')
      if (res.ok) {
        const data = await res.json()
        setCoupons(data)
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: "Kuponlar yüklenemedi",
        variant: "destructive",
      })
    }
  }

  const generateCode = () => {
    const code = 'KUPON' + Math.random().toString(36).substring(2, 8).toUpperCase()
    setFormData({ ...formData, code })
  }

  const handleSave = async () => {
    try {
      const url = editingId 
        ? `/api/admin/magaza/coupons/${editingId}`
        : '/api/admin/magaza/coupons'
      
      const res = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        toast({
          title: "Başarılı",
          description: editingId ? "Kupon güncellendi" : "Kupon oluşturuldu",
        })
        loadCoupons()
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
    if (!confirm('Bu kuponu silmek istediğinizden emin misiniz?')) return

    try {
      const res = await fetch(`/api/admin/magaza/coupons/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        toast({
          title: "Başarılı",
          description: "Kupon silindi",
        })
        loadCoupons()
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: "Silme işlemi başarısız",
        variant: "destructive",
      })
    }
  }

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    toast({
      title: "Kopyalandı",
      description: "Kupon kodu panoya kopyalandı",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Kupon Yönetimi</h1>
          <p className="text-muted-foreground">
            İndirim kuponları oluşturun ve yönetin
          </p>
        </div>
        <Button onClick={() => {
          setEditingId(null)
          setFormData({ discountType: 'percentage', isActive: true })
        }}>
          <Plus className="mr-2 h-4 w-4" />
          Yeni Kupon
        </Button>
      </div>

      {(editingId !== null || Object.keys(formData).length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Kupon Düzenle' : 'Yeni Kupon Oluştur'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Kupon Kodu</Label>
                <div className="flex gap-2">
                  <Input
                    value={formData.code || ''}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="KUPON123"
                  />
                  <Button type="button" variant="outline" onClick={generateCode}>
                    Oluştur
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>İndirim Tipi</Label>
                <select
                  className="w-full p-2 border rounded"
                  value={formData.discountType || 'percentage'}
                  onChange={(e) => setFormData({ ...formData, discountType: e.target.value as any })}
                >
                  <option value="percentage">Yüzde (%)</option>
                  <option value="fixed">Sabit Tutar (₺)</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label>İndirim Değeri</Label>
                <Input
                  type="number"
                  value={formData.discountValue || ''}
                  onChange={(e) => setFormData({ ...formData, discountValue: parseFloat(e.target.value) })}
                  placeholder={formData.discountType === 'percentage' ? '10' : '50'}
                />
              </div>

              <div className="space-y-2">
                <Label>Min. Alışveriş (₺) - Opsiyonel</Label>
                <Input
                  type="number"
                  value={formData.minPurchase || ''}
                  onChange={(e) => setFormData({ ...formData, minPurchase: parseFloat(e.target.value) })}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label>Maks. İndirim (₺) - Opsiyonel</Label>
                <Input
                  type="number"
                  value={formData.maxDiscount || ''}
                  onChange={(e) => setFormData({ ...formData, maxDiscount: parseFloat(e.target.value) })}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label>Kullanım Limiti - Opsiyonel</Label>
                <Input
                  type="number"
                  value={formData.usageLimit || ''}
                  onChange={(e) => setFormData({ ...formData, usageLimit: parseInt(e.target.value) })}
                  placeholder="Sınırsız"
                />
              </div>

              <div className="space-y-2">
                <Label>Son Kullanma Tarihi - Opsiyonel</Label>
                <Input
                  type="datetime-local"
                  value={formData.expiresAt || ''}
                  onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                />
              </div>
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
        {coupons.map((coupon) => (
          <Card key={coupon.id}>
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex-1">
                <div className="flex items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-xl font-mono">{coupon.code}</h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyCode(coupon.code)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      {coupon.isActive ? (
                        <Badge>Aktif</Badge>
                      ) : (
                        <Badge variant="secondary">Pasif</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {coupon.discountType === 'percentage' 
                        ? `%${coupon.discountValue} indirim`
                        : `₺${coupon.discountValue} indirim`
                      }
                      {coupon.minPurchase && ` (Min: ₺${coupon.minPurchase})`}
                      {coupon.maxDiscount && ` (Maks: ₺${coupon.maxDiscount})`}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Kullanım: {coupon.usageCount}
                      {coupon.usageLimit && ` / ${coupon.usageLimit}`}
                      {coupon.expiresAt && ` • Son: ${new Date(coupon.expiresAt).toLocaleDateString('tr-TR')}`}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setEditingId(coupon.id)
                    setFormData(coupon)
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleDelete(coupon.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {coupons.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">Henüz kupon oluşturulmamış</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
