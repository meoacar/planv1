"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createRole } from "@/app/admin/roller/actions"
import { toast } from "sonner"
import { Loader2, Plus } from "lucide-react"

export function NewRoleForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [roleName, setRoleName] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!roleName.trim()) {
      toast.error('Rol adı gerekli')
      return
    }

    try {
      setLoading(true)
      const result = await createRole(roleName)
      toast.success('Rol oluşturuldu')
      router.push(`/admin/roller/duzenle?role=${result.role}`)
    } catch (error: any) {
      toast.error(error.message || 'Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Rol Bilgileri</CardTitle>
        <CardDescription>
          Yeni bir rol oluştur. Rol adı büyük harfe çevrilecek ve boşluklar alt çizgi ile değiştirilecek.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="roleName">Rol Adı</Label>
            <Input 
              id="roleName"
              placeholder="Örn: MODERATOR, EDITOR, VIEWER"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground">
              Önizleme: {roleName.toUpperCase().trim().replace(/\s+/g, '_') || 'ROL_ADI'}
            </p>
          </div>

          <div className="bg-muted p-4 rounded-lg space-y-2">
            <p className="text-sm font-medium">Önemli Notlar:</p>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Rol adı benzersiz olmalıdır</li>
              <li>Sistem rolleri (USER, ADMIN) oluşturulamaz</li>
              <li>Rol oluşturulduktan sonra izinlerini düzenleyebilirsiniz</li>
              <li>Varsayılan olarak sadece "Kullanıcı Görüntüleme" izni verilir</li>
            </ul>
          </div>

          <div className="flex items-center gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Oluşturuluyor...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Rol Oluştur
                </>
              )}
            </Button>
            <Button 
              type="button" 
              variant="outline"
              onClick={() => router.push('/admin/roller')}
              disabled={loading}
            >
              İptal
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
