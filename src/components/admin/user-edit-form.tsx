"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateUser } from "@/app/admin/kullanicilar/actions"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface UserEditFormProps {
  user: {
    id: string
    email: string
    username: string | null
    name: string | null
    bio: string | null
    role: string
    isBanned: boolean
    currentWeight: number | null
    targetWeight: number | null
    height: number | null
  }
}

export function UserEditForm({ user }: UserEditFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: user.name || '',
    username: user.username || '',
    bio: user.bio || '',
    role: user.role,
    isBanned: user.isBanned,
    currentWeight: user.currentWeight?.toString() || '',
    targetWeight: user.targetWeight?.toString() || '',
    height: user.height?.toString() || '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      
      await updateUser(user.id, {
        name: formData.name || null,
        username: formData.username || null,
        bio: formData.bio || null,
        role: formData.role as 'USER' | 'ADMIN',
        isBanned: formData.isBanned,
        currentWeight: formData.currentWeight ? parseFloat(formData.currentWeight) : null,
        targetWeight: formData.targetWeight ? parseFloat(formData.targetWeight) : null,
        height: formData.height ? parseFloat(formData.height) : null,
      })
      
      toast.success('Kullanıcı güncellendi')
      router.push('/admin/kullanicilar')
      router.refresh()
    } catch (error) {
      toast.error('Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Kullanıcı Bilgileri</CardTitle>
          <CardDescription>
            Kullanıcı bilgilerini düzenle
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Temel Bilgiler */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email (değiştirilemez)</Label>
              <Input 
                id="email" 
                type="email" 
                value={user.email}
                disabled
                className="bg-muted"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">İsim</Label>
              <Input 
                id="name" 
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Kullanıcı adı"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Kullanıcı Adı</Label>
              <Input 
                id="username" 
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="@kullaniciadi"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Biyografi</Label>
              <Textarea 
                id="bio" 
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Kullanıcı hakkında..."
                rows={3}
              />
            </div>
          </div>

          {/* Rol ve Durum */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-semibold">Rol ve Durum</h3>
            
            <div className="space-y-2">
              <Label htmlFor="role">Rol</Label>
              <Select 
                value={formData.role} 
                onValueChange={(value) => setFormData({ ...formData, role: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USER">Kullanıcı</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="isBanned"
                checked={formData.isBanned}
                onChange={(e) => setFormData({ ...formData, isBanned: e.target.checked })}
              />
              <Label htmlFor="isBanned" className="cursor-pointer">
                Kullanıcı yasaklı
              </Label>
              {formData.isBanned && (
                <Badge variant="destructive">Yasaklı</Badge>
              )}
            </div>
          </div>

          {/* Fiziksel Bilgiler */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-semibold">Fiziksel Bilgiler</h3>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currentWeight">Mevcut Kilo (kg)</Label>
                <Input 
                  id="currentWeight" 
                  type="number"
                  step="0.1"
                  value={formData.currentWeight}
                  onChange={(e) => setFormData({ ...formData, currentWeight: e.target.value })}
                  placeholder="75.5"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetWeight">Hedef Kilo (kg)</Label>
                <Input 
                  id="targetWeight" 
                  type="number"
                  step="0.1"
                  value={formData.targetWeight}
                  onChange={(e) => setFormData({ ...formData, targetWeight: e.target.value })}
                  placeholder="65.0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="height">Boy (cm)</Label>
                <Input 
                  id="height" 
                  type="number"
                  step="0.1"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                  placeholder="170"
                />
              </div>
            </div>
          </div>

          {/* Butonlar */}
          <div className="flex items-center gap-2 pt-4">
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Kaydediliyor...
                </>
              ) : (
                'Kaydet'
              )}
            </Button>
            <Button 
              type="button" 
              variant="outline"
              onClick={() => router.push('/admin/kullanicilar')}
              disabled={loading}
            >
              İptal
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
