'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Plus, Save, Trash2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface FooterSocial {
  id: string
  platform: string
  url: string
  icon: string
  sortOrder: number
  isActive: boolean
}

interface FooterSocialManagerProps {
  initialSocials: FooterSocial[]
}

export function FooterSocialManager({ initialSocials }: FooterSocialManagerProps) {
  const router = useRouter()
  const [socials, setSocials] = useState(initialSocials)
  const [loading, setLoading] = useState(false)

  const platformIcons: Record<string, string> = {
    facebook: '📘',
    twitter: '🐦',
    instagram: '📷',
    youtube: '📺',
    linkedin: '💼',
    tiktok: '🎵',
    discord: '💬',
    telegram: '✈️',
  }

  const addNewSocial = () => {
    const newSocial: FooterSocial = {
      id: `new-${Date.now()}`,
      platform: 'instagram',
      url: '',
      icon: '📷',
      sortOrder: socials.length,
      isActive: true,
    }
    setSocials([...socials, newSocial])
  }

  const updateSocial = (id: string, field: keyof FooterSocial, value: any) => {
    setSocials(socials.map(social => {
      if (social.id === id) {
        const updated = { ...social, [field]: value }
        // Platform değiştiğinde icon'u otomatik güncelle
        if (field === 'platform') {
          updated.icon = platformIcons[value] || '🔗'
        }
        return updated
      }
      return social
    }))
  }

  const deleteSocial = async (id: string) => {
    if (!confirm('Bu sosyal medya linkini silmek istediğinizden emin misiniz?')) {
      return
    }

    if (id.startsWith('new-')) {
      setSocials(socials.filter(social => social.id !== id))
      return
    }

    try {
      const response = await fetch(`/api/admin/footer/socials/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error()

      setSocials(socials.filter(social => social.id !== id))
      toast.success('Sosyal medya linki silindi')
      router.refresh()
    } catch (error) {
      toast.error('Silme işlemi başarısız')
    }
  }

  const saveAll = async () => {
    setLoading(true)

    try {
      const response = await fetch('/api/admin/footer/socials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ socials }),
      })

      if (!response.ok) throw new Error()

      toast.success('Sosyal medya linkleri kaydedildi')
      router.refresh()
    } catch (error) {
      toast.error('Kaydetme işlemi başarısız')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Sosyal Medya Linkleri</h3>
          <p className="text-sm text-muted-foreground">
            Footer'da görünecek sosyal medya hesaplarını yönetin
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={addNewSocial} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Yeni Hesap
          </Button>
          <Button onClick={saveAll} disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Kaydet
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sosyal Medya Hesapları</CardTitle>
          <CardDescription>
            {socials.length} hesap tanımlı
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {socials.map((social) => (
            <div
              key={social.id}
              className="p-4 border rounded-lg space-y-3"
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl">{social.icon}</span>
                <select
                  value={social.platform}
                  onChange={(e) => updateSocial(social.id, 'platform', e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  {Object.keys(platformIcons).map(platform => (
                    <option key={platform} value={platform}>
                      {platform.charAt(0).toUpperCase() + platform.slice(1)}
                    </option>
                  ))}
                </select>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteSocial(social.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>

              <Input
                value={social.url}
                onChange={(e) => updateSocial(social.id, 'url', e.target.value)}
                placeholder="https://instagram.com/kullanici"
              />

              <div className="flex items-center gap-2">
                <Switch
                  checked={social.isActive}
                  onCheckedChange={(checked) => 
                    updateSocial(social.id, 'isActive', checked)
                  }
                />
                <span className="text-sm text-muted-foreground">Aktif</span>
              </div>
            </div>
          ))}

          {socials.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-8">
              Henüz sosyal medya hesabı eklenmemiş
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
