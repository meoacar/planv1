"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { updateUser } from "@/app/admin/kullanicilar/actions"
import { toast } from "sonner"
import { 
  Loader2, 
  User, 
  Mail, 
  AtSign, 
  FileText, 
  Shield, 
  Ban, 
  Calendar,
  AlertTriangle,
  Weight,
  Target,
  Ruler,
  Crown,
  Sparkles,
  Zap
} from "lucide-react"
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
    bannedUntil: Date | null
    banReason: string | null
    currentWeight: number | null
    targetWeight: number | null
    height: number | null
    isPremium: boolean
    premiumUntil: Date | null
    premiumType: string | null
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
    bannedUntil: user.bannedUntil ? new Date(user.bannedUntil).toISOString().split('T')[0] : '',
    banReason: user.banReason || '',
    currentWeight: user.currentWeight?.toString() || '',
    targetWeight: user.targetWeight?.toString() || '',
    height: user.height?.toString() || '',
  })

  const [grantingPremium, setGrantingPremium] = useState(false)
  const [selectedPremiumType, setSelectedPremiumType] = useState<string>('monthly')

  const handleGrantPremium = async () => {
    try {
      setGrantingPremium(true)
      
      const response = await fetch(`/api/admin/users/${user.id}/grant-premium`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ premiumType: selectedPremiumType })
      })

      if (!response.ok) throw new Error('Premium verilemedi')

      toast.success('Premium başarıyla verildi!')
      router.refresh()
    } catch (error) {
      toast.error('Premium verilirken hata oluştu')
    } finally {
      setGrantingPremium(false)
    }
  }

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
        bannedUntil: formData.bannedUntil ? new Date(formData.bannedUntil) : null,
        banReason: formData.banReason || null,
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
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Temel Bilgiler */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Temel Bilgiler</CardTitle>
              <CardDescription>Kullanıcının kişisel bilgileri</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              Email Adresi
            </Label>
            <Input 
              id="email" 
              type="email" 
              value={user.email}
              disabled
              className="bg-muted/50"
            />
            <p className="text-xs text-muted-foreground">Email adresi değiştirilemez</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                İsim Soyisim
              </Label>
              <Input 
                id="name" 
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ahmet Yılmaz"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username" className="flex items-center gap-2">
                <AtSign className="h-4 w-4 text-muted-foreground" />
                Kullanıcı Adı
              </Label>
              <Input 
                id="username" 
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="ahmetyilmaz"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio" className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              Biyografi
            </Label>
            <Textarea 
              id="bio" 
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Kullanıcı hakkında kısa bilgi..."
              rows={3}
              className="resize-none"
            />
          </div>
        </CardContent>
      </Card>

      {/* Rol ve Yetki */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Shield className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <CardTitle>Rol ve Yetki</CardTitle>
              <CardDescription>Kullanıcı rolü ve yetkileri</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="role">Kullanıcı Rolü</Label>
            <Select 
              value={formData.role} 
              onValueChange={(value) => setFormData({ ...formData, role: value })}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USER">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>Kullanıcı</span>
                  </div>
                </SelectItem>
                <SelectItem value="ADMIN">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    <span>Admin</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {formData.role === 'ADMIN' 
                ? 'Admin kullanıcılar tüm yönetim paneline erişebilir' 
                : 'Normal kullanıcılar sadece kendi içeriklerini yönetebilir'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Yasaklama */}
      <Card className={formData.isBanned ? 'border-destructive' : ''}>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              formData.isBanned ? 'bg-destructive/10' : 'bg-orange-500/10'
            }`}>
              <Ban className={`h-5 w-5 ${formData.isBanned ? 'text-destructive' : 'text-orange-500'}`} />
            </div>
            <div>
              <CardTitle>Yasaklama Yönetimi</CardTitle>
              <CardDescription>Kullanıcı yasaklama ve kısıtlama ayarları</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
            <div className="space-y-0.5">
              <Label htmlFor="isBanned" className="text-base font-medium cursor-pointer">
                Kullanıcıyı Yasakla
              </Label>
              <p className="text-sm text-muted-foreground">
                Yasaklanan kullanıcı platforma erişemez
              </p>
            </div>
            <Switch
              id="isBanned"
              checked={formData.isBanned}
              onCheckedChange={(checked) => setFormData({ ...formData, isBanned: checked })}
            />
          </div>

          {formData.isBanned && (
            <div className="space-y-4 p-4 rounded-lg border border-destructive/50 bg-destructive/5">
              <div className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                <span className="font-semibold">Yasaklama Detayları</span>
              </div>
              
              <Separator />

              <div className="space-y-2">
                <Label htmlFor="bannedUntil" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  Yasaklama Bitiş Tarihi
                </Label>
                <Input 
                  id="bannedUntil" 
                  type="date"
                  value={formData.bannedUntil}
                  onChange={(e) => setFormData({ ...formData, bannedUntil: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="border-destructive/50"
                />
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <span>💡</span>
                  Boş bırakırsanız süresiz yasaklama olur
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="banReason" className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  Yasaklama Sebebi
                </Label>
                <Textarea 
                  id="banReason" 
                  value={formData.banReason}
                  onChange={(e) => setFormData({ ...formData, banReason: e.target.value })}
                  placeholder="Örn: Spam içerik paylaşımı, topluluk kurallarını ihlal, hakaret..."
                  rows={4}
                  className="resize-none border-destructive/50"
                />
                <p className="text-xs text-muted-foreground">
                  Bu sebep kullanıcıya gösterilecektir
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Premium Yönetimi */}
      <Card className={user.isPremium ? 'border-yellow-500 bg-gradient-to-br from-yellow-50/50 to-orange-50/50 dark:from-yellow-950/20 dark:to-orange-950/20' : ''}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                user.isPremium ? 'bg-gradient-to-br from-yellow-500 to-orange-500' : 'bg-yellow-500/10'
              }`}>
                <Crown className={`h-5 w-5 ${user.isPremium ? 'text-white' : 'text-yellow-500'}`} />
              </div>
              <div>
                <CardTitle className="flex items-center gap-2">
                  Premium Üyelik
                  {user.isPremium && (
                    <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Aktif
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>Premium üyelik yönetimi ve özellikleri</CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {user.isPremium ? (
            <div className="space-y-4">
              <div className="p-4 rounded-lg border-2 border-yellow-500/20 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                    <Crown className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Premium Üye</h3>
                    <p className="text-sm text-muted-foreground">Tüm premium özelliklere erişim</p>
                  </div>
                </div>

                <Separator className="my-3" />

                <div className="grid gap-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-white/50 dark:bg-black/20">
                    <span className="text-sm font-medium">Premium Tipi</span>
                    <Badge variant="outline" className="font-semibold">
                      {user.premiumType === 'monthly' && '📅 Aylık'}
                      {user.premiumType === 'yearly' && '📆 Yıllık'}
                      {user.premiumType === 'lifetime' && '♾️ Ömür Boyu'}
                    </Badge>
                  </div>

                  {user.premiumUntil && (
                    <div className="flex items-center justify-between p-3 rounded-lg bg-white/50 dark:bg-black/20">
                      <span className="text-sm font-medium">Bitiş Tarihi</span>
                      <span className="text-sm font-semibold">
                        {new Date(user.premiumUntil).toLocaleDateString('tr-TR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between p-3 rounded-lg bg-white/50 dark:bg-black/20">
                    <span className="text-sm font-medium">Kalan Süre</span>
                    <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                      {user.premiumUntil 
                        ? `${Math.ceil((new Date(user.premiumUntil).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} gün`
                        : 'Sınırsız'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg border bg-muted/30">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  Premium Özellikler
                </h4>
                <div className="grid gap-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span>⚡ 2x XP Kazancı</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span>🚫 Reklamsız Deneyim</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span>🏆 Özel Rozetler</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span>💬 Öncelikli Destek</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span>🎨 Özel Profil Teması</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span>📊 Gelişmiş İstatistikler</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-lg border-2 border-dashed bg-muted/30">
                <div className="text-center py-6">
                  <Crown className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Premium Üyelik Yok</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Bu kullanıcı henüz premium üye değil
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <Label>Premium Tipi Seç</Label>
                <Select value={selectedPremiumType} onValueChange={setSelectedPremiumType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <div className="text-left">
                          <div className="font-medium">Aylık Premium</div>
                          <div className="text-xs text-muted-foreground">30 gün - 49.99 TL</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="yearly">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <div className="text-left">
                          <div className="font-medium">Yıllık Premium</div>
                          <div className="text-xs text-muted-foreground">365 gün - 399.99 TL (%33 indirim)</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="lifetime">
                      <div className="flex items-center gap-2">
                        <Crown className="h-4 w-4" />
                        <div className="text-left">
                          <div className="font-medium">Ömür Boyu Premium</div>
                          <div className="text-xs text-muted-foreground">Sınırsız - 999.99 TL</div>
                        </div>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Button 
                  type="button"
                  onClick={handleGrantPremium}
                  disabled={grantingPremium}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                >
                  {grantingPremium ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Premium Veriliyor...
                    </>
                  ) : (
                    <>
                      <Crown className="h-4 w-4 mr-2" />
                      Premium Ver
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Fiziksel Bilgiler */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
              <Weight className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <CardTitle>Fiziksel Bilgiler</CardTitle>
              <CardDescription>Kilo ve boy bilgileri</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currentWeight" className="flex items-center gap-2">
                <Weight className="h-4 w-4 text-muted-foreground" />
                Mevcut Kilo
              </Label>
              <div className="relative">
                <Input 
                  id="currentWeight" 
                  type="number"
                  step="0.1"
                  value={formData.currentWeight}
                  onChange={(e) => setFormData({ ...formData, currentWeight: e.target.value })}
                  placeholder="75.5"
                  className="pr-12"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  kg
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetWeight" className="flex items-center gap-2">
                <Target className="h-4 w-4 text-muted-foreground" />
                Hedef Kilo
              </Label>
              <div className="relative">
                <Input 
                  id="targetWeight" 
                  type="number"
                  step="0.1"
                  value={formData.targetWeight}
                  onChange={(e) => setFormData({ ...formData, targetWeight: e.target.value })}
                  placeholder="65.0"
                  className="pr-12"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  kg
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="height" className="flex items-center gap-2">
                <Ruler className="h-4 w-4 text-muted-foreground" />
                Boy
              </Label>
              <div className="relative">
                <Input 
                  id="height" 
                  type="number"
                  step="0.1"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                  placeholder="170"
                  className="pr-12"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  cm
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Butonlar */}
      <div className="flex items-center gap-3 sticky bottom-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4 rounded-lg border shadow-lg">
        <Button type="submit" disabled={loading} size="lg" className="flex-1">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Kaydediliyor...
            </>
          ) : (
            <>
              <Shield className="h-4 w-4 mr-2" />
              Değişiklikleri Kaydet
            </>
          )}
        </Button>
        <Button 
          type="button" 
          variant="outline"
          size="lg"
          onClick={() => router.push('/admin/kullanicilar')}
          disabled={loading}
        >
          İptal
        </Button>
      </div>
    </form>
  )
}
