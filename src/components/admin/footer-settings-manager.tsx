'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Save, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface FooterSetting {
  id: string
  key: string
  value: string
  description: string | null
}

interface FooterSettingsManagerProps {
  initialSettings: FooterSetting[]
}

export function FooterSettingsManager({ initialSettings }: FooterSettingsManagerProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  // Ayarları key-value objesine çevir
  const settingsMap = initialSettings.reduce((acc, setting) => {
    acc[setting.key] = setting.value
    return acc
  }, {} as Record<string, string>)

  const [settings, setSettings] = useState({
    footerDescription: settingsMap.footerDescription || '',
    copyrightText: settingsMap.copyrightText || '',
  })

  const saveSettings = async () => {
    setLoading(true)

    try {
      const response = await fetch('/api/admin/footer/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings }),
      })

      if (!response.ok) throw new Error()

      toast.success('Footer ayarları kaydedildi')
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
          <h3 className="text-lg font-semibold">Footer Ayarları</h3>
          <p className="text-sm text-muted-foreground">
            Footer'da görünecek genel ayarları düzenleyin
          </p>
        </div>
        <Button onClick={saveSettings} disabled={loading}>
          {loading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Kaydet
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Genel Ayarlar</CardTitle>
          <CardDescription>
            Footer'da görünecek metinleri düzenleyin
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="footerDescription">Footer Açıklaması</Label>
            <Textarea
              id="footerDescription"
              value={settings.footerDescription}
              onChange={(e) =>
                setSettings({ ...settings, footerDescription: e.target.value })
              }
              placeholder="Site hakkında kısa açıklama..."
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              Logo altında görünecek açıklama metni
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="copyrightText">Telif Hakkı Metni</Label>
            <Textarea
              id="copyrightText"
              value={settings.copyrightText}
              onChange={(e) =>
                setSettings({ ...settings, copyrightText: e.target.value })
              }
              placeholder="© 2024 ZayiflamaPlan. Tüm hakları saklıdır."
              rows={2}
            />
            <p className="text-xs text-muted-foreground">
              Footer alt kısmında görünecek telif hakkı metni. Boş bırakılırsa otomatik oluşturulur.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
