"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createApiKey } from "@/app/admin/api-keys/actions"
import { toast } from "sonner"
import { Loader2, Plus, CheckCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const availablePermissions = [
  { value: 'plans:read', label: 'Planları Okuma' },
  { value: 'plans:create', label: 'Plan Oluşturma' },
  { value: 'plans:update', label: 'Plan Güncelleme' },
  { value: 'plans:delete', label: 'Plan Silme' },
  { value: 'users:read', label: 'Kullanıcıları Okuma' },
  { value: 'users:update', label: 'Kullanıcı Güncelleme' },
  { value: 'comments:read', label: 'Yorumları Okuma' },
  { value: 'comments:create', label: 'Yorum Oluşturma' },
  { value: 'comments:delete', label: 'Yorum Silme' },
  { value: 'stats:read', label: 'İstatistikleri Okuma' },
]

export function NewApiKeyForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [expiresInDays, setExpiresInDays] = useState('')
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(new Set())
  const [createdKey, setCreatedKey] = useState('')

  const togglePermission = (permission: string) => {
    const newSet = new Set(selectedPermissions)
    if (newSet.has(permission)) {
      newSet.delete(permission)
    } else {
      newSet.add(permission)
    }
    setSelectedPermissions(newSet)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name.trim()) {
      toast.error('API key adı gerekli')
      return
    }

    if (selectedPermissions.size === 0) {
      toast.error('En az bir izin seçmelisiniz')
      return
    }

    try {
      setLoading(true)
      const result = await createApiKey({
        name,
        permissions: Array.from(selectedPermissions),
        expiresInDays: expiresInDays ? parseInt(expiresInDays) : undefined,
      })
      
      setCreatedKey(result.apiKey.key)
      toast.success('API key oluşturuldu')
    } catch (error: any) {
      toast.error(error.message || 'Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  if (createdKey) {
    return (
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            API Key Oluşturuldu
          </CardTitle>
          <CardDescription>
            API key'inizi güvenli bir yerde saklayın. Bir daha göremeyeceksiniz!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <Label className="text-xs text-muted-foreground">API Key</Label>
            <code className="block mt-2 p-3 bg-background rounded border text-sm break-all">
              {createdKey}
            </code>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => {
                navigator.clipboard.writeText(createdKey)
                toast.success('Kopyalandı')
              }}
            >
              Kopyala
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/admin/api-keys')}
            >
              API Keys Sayfasına Dön
            </Button>
          </div>

          <div className="p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
              ⚠️ Önemli: Bu API key'i bir daha göremeyeceksiniz. Lütfen güvenli bir yerde saklayın.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>API Key Bilgileri</CardTitle>
        <CardDescription>
          Yeni bir API anahtarı oluştur ve izinlerini belirle
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">API Key Adı</Label>
            <Input 
              id="name"
              placeholder="Örn: Production API, Mobile App, Test Key"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expiresInDays">Geçerlilik Süresi (gün)</Label>
            <Input 
              id="expiresInDays"
              type="number"
              placeholder="Boş bırakırsanız süresiz olur"
              value={expiresInDays}
              onChange={(e) => setExpiresInDays(e.target.value)}
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground">
              Opsiyonel - Boş bırakırsanız API key süresiz olur
            </p>
          </div>

          <div className="space-y-3">
            <Label>İzinler ({selectedPermissions.size} seçili)</Label>
            <div className="grid grid-cols-2 gap-3">
              {availablePermissions.map((perm) => {
                const isSelected = selectedPermissions.has(perm.value)
                
                return (
                  <div
                    key={perm.value}
                    onClick={() => togglePermission(perm.value)}
                    className={`
                      p-3 rounded-lg border-2 cursor-pointer transition-all
                      ${isSelected 
                        ? 'border-green-500 bg-green-50 dark:bg-green-950' 
                        : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium">{perm.label}</span>
                      {isSelected && (
                        <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      )}
                    </div>
                    <code className="text-xs text-muted-foreground">{perm.value}</code>
                  </div>
                )
              })}
            </div>
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
                  API Key Oluştur
                </>
              )}
            </Button>
            <Button 
              type="button" 
              variant="outline"
              onClick={() => router.push('/admin/api-keys')}
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
