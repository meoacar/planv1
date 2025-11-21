'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { updateProfile, updateWeightInfo, deleteAccount } from './actions'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Loader2, Upload, X } from 'lucide-react'
import { MaskotSelector } from '@/components/ui/maskot-selector'
import { PushNotificationManager } from '@/components/push-notification-manager'

interface SettingsClientProps {
  user: {
    name?: string | null
    email?: string | null
    username?: string | null
    bio?: string | null
    image?: string | null
    height?: number | null
    currentWeight?: number | null
    targetWeight?: number | null
  }
}

export function SettingsClient({ user }: SettingsClientProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(user.image || null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [selectedMaskot, setSelectedMaskot] = useState<string | null>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Resim boyutu 2MB\'dan küçük olmalı')
      return
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Sadece resim dosyaları yüklenebilir')
      return
    }

    setImageFile(file)

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveImage = () => {
    setImageFile(null)
    setImagePreview(null)
    setSelectedMaskot(null)
    // Clear file input
    const fileInput = document.getElementById('imageFile') as HTMLInputElement
    if (fileInput) fileInput.value = ''
  }

  const handleMaskotSelect = (url: string) => {
    setSelectedMaskot(url)
    setImagePreview(url)
    setImageFile(null)
    // Clear file input
    const fileInput = document.getElementById('imageFile') as HTMLInputElement
    if (fileInput) fileInput.value = ''
  }

  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const formData = new FormData(e.currentTarget)
      
      // If there's a file, convert to base64 and add to formData
      if (imageFile) {
        const reader = new FileReader()
        const base64Promise = new Promise<string>((resolve) => {
          reader.onloadend = () => resolve(reader.result as string)
          reader.readAsDataURL(imageFile)
        })
        const base64 = await base64Promise
        formData.set('image', base64)
      } else if (selectedMaskot) {
        // User selected a maskot
        formData.set('image', selectedMaskot)
      } else if (imagePreview === null) {
        // User removed the image
        formData.set('image', '')
      }
      
      await updateProfile(formData)
      toast.success('Profil güncellendi')
      router.refresh()
    } catch (error: any) {
      console.error('Profile update error:', error)
      toast.error(error.message || 'Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const handleWeightSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const formData = new FormData(e.currentTarget)
      await updateWeightInfo(formData)
      toast.success('Kilo bilgileri güncellendi')
      router.refresh()
    } catch (error: any) {
      console.error('Weight update error:', error)
      toast.error(error.message || 'Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!confirm('Hesabını silmek istediğinden emin misin? Bu işlem geri alınamaz!')) {
      return
    }

    setLoading(true)
    try {
      await deleteAccount()
      toast.success('Hesap silindi')
      router.push('/')
    } catch (error) {
      toast.error('Bir hata oluştu')
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Profile Settings */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            👤 Profil Bilgileri
          </CardTitle>
          <CardDescription>
            Genel profil bilgilerini düzenle
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            {/* Avatar Preview & Upload */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 p-6 bg-muted/50 rounded-lg border-2 border-dashed">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border-4 border-background shadow-xl">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-5xl">👤</span>
                  )}
                </div>
                {imagePreview && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              
              <div className="flex-1 space-y-4">
                <div>
                  <p className="text-sm font-medium mb-1">Profil Fotoğrafı</p>
                  <p className="text-xs text-muted-foreground">
                    Bilgisayarından resim yükle veya URL gir (Max 2MB)
                  </p>
                </div>

                {/* File Upload */}
                <div className="space-y-2">
                  <Label htmlFor="imageFile" className="cursor-pointer">
                    <div className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors w-fit">
                      <Upload className="h-4 w-4" />
                      <span className="text-sm">Bilgisayardan Yükle</span>
                    </div>
                  </Label>
                  <Input
                    id="imageFile"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  {imageFile && (
                    <p className="text-xs text-green-600">
                      ✓ {imageFile.name} seçildi
                    </p>
                  )}
                </div>

                {/* URL Input */}
                <div className="space-y-2">
                  <Label htmlFor="image" className="text-xs text-muted-foreground">
                    veya URL gir:
                  </Label>
                  <Input
                    id="image"
                    name="image"
                    type="url"
                    defaultValue={user.image || ''}
                    placeholder="https://example.com/avatar.jpg"
                    className="max-w-md"
                    disabled={!!imageFile || !!selectedMaskot}
                  />
                </div>
              </div>
            </div>

            {/* Maskot Selector */}
            <div className="p-6 bg-muted/30 rounded-lg border">
              <MaskotSelector
                selectedMaskot={selectedMaskot}
                onSelect={handleMaskotSelect}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">İsim</Label>
              <Input
                id="name"
                name="name"
                defaultValue={user.name || ''}
                placeholder="İsmin"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Kullanıcı Adı</Label>
              <Input
                id="username"
                name="username"
                defaultValue={user.username || ''}
                placeholder="kullanici_adi"
                disabled={!!user.username}
              />
              <p className="text-xs text-muted-foreground">
                {user.username 
                  ? `Kullanıcı adı değiştirilemez. Profil URL'in: zayiflamaplan.com/profil/${user.username}`
                  : 'Profil URL\'in: zayiflamaplan.com/profil/kullanici_adi'
                }
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                defaultValue={user.email || ''}
                disabled
              />
              <p className="text-xs text-muted-foreground">
                Email adresi değiştirilemez
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                defaultValue={user.bio || ''}
                placeholder="Kendinden bahset..."
                rows={4}
              />
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Kaydediliyor...</> : 'Kaydet'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Password Change */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🔒 Şifre Değiştir
          </CardTitle>
          <CardDescription>
            Hesap güvenliğini sağlamak için şifreni güncelle
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={async (e) => {
            e.preventDefault()
            setLoading(true)
            try {
              const formData = new FormData(e.currentTarget)
              const currentPassword = formData.get('currentPassword') as string
              const newPassword = formData.get('newPassword') as string
              const confirmPassword = formData.get('confirmPassword') as string

              if (!currentPassword || !newPassword || !confirmPassword) {
                toast.error('Tüm alanları doldur')
                return
              }

              if (newPassword !== confirmPassword) {
                toast.error('Yeni şifreler eşleşmiyor')
                return
              }

              if (newPassword.length < 6) {
                toast.error('Şifre en az 6 karakter olmalı')
                return
              }

              const response = await fetch('/api/user/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentPassword, newPassword }),
              })

              const data = await response.json()

              if (!response.ok) {
                throw new Error(data.error || 'Şifre değiştirilemedi')
              }

              toast.success('Şifre başarıyla değiştirildi')
              e.currentTarget.reset()
            } catch (error: any) {
              toast.error(error.message || 'Bir hata oluştu')
            } finally {
              setLoading(false)
            }
          }} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Mevcut Şifre</Label>
              <Input
                id="currentPassword"
                name="currentPassword"
                type="password"
                placeholder="Mevcut şifreni gir"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">Yeni Şifre</Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                placeholder="Yeni şifreni gir (min 6 karakter)"
                minLength={6}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Yeni Şifre (Tekrar)</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Yeni şifreni tekrar gir"
                minLength={6}
                required
              />
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Değiştiriliyor...</> : 'Şifreyi Değiştir'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Push Notifications */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🔔 Bildirimler
          </CardTitle>
          <CardDescription>
            Tarayıcı bildirimlerini yönet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PushNotificationManager />
        </CardContent>
      </Card>

      {/* Weight Settings */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            ⚖️ Kilo Bilgileri
          </CardTitle>
          <CardDescription>
            Mevcut ve hedef kilonu güncelle
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleWeightSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="height">Boy (cm)</Label>
                <Input
                  id="height"
                  name="height"
                  type="number"
                  defaultValue={user.height || ''}
                  placeholder="170"
                  min="100"
                  max="250"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentWeight">Mevcut Kilo (kg)</Label>
                <Input
                  id="currentWeight"
                  name="currentWeight"
                  type="number"
                  defaultValue={user.currentWeight || ''}
                  placeholder="75"
                  min="30"
                  max="300"
                  step="0.1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetWeight">Hedef Kilo (kg)</Label>
                <Input
                  id="targetWeight"
                  name="targetWeight"
                  type="number"
                  defaultValue={user.targetWeight || ''}
                  placeholder="65"
                  min="30"
                  max="300"
                  step="0.1"
                />
              </div>
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Kaydediliyor...</> : 'Kaydet'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200 shadow-lg bg-red-50/50 dark:bg-red-950/10">
        <CardHeader>
          <CardTitle className="text-red-600 flex items-center gap-2">
            ⚠️ Tehlikeli Bölge
          </CardTitle>
          <CardDescription>
            Geri alınamaz işlemler
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Hesabı Sil</p>
              <p className="text-sm text-muted-foreground">
                Tüm verilerini kalıcı olarak sil
              </p>
            </div>
            <Button 
              variant="destructive" 
              onClick={handleDeleteAccount}
              disabled={loading}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Hesabı Sil'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
