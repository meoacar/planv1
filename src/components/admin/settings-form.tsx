"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { updateSettings } from "@/app/admin/ayarlar/actions"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

interface SettingsFormProps {
  initialSettings: Record<string, string>
}

export function SettingsForm({ initialSettings }: SettingsFormProps) {
  const [loading, setLoading] = useState(false)
  const [settings, setSettings] = useState({
    siteName: initialSettings.siteName || 'ZayiflamaPlan',
    siteDescription: initialSettings.siteDescription || 'Gerçek insanların gerçek zayıflama planları',
    contactEmail: initialSettings.contactEmail || 'info@zayiflamaplan.com',
    siteUrl: initialSettings.siteUrl || 'https://zayiflamaplan.com',
    siteLogo: initialSettings.siteLogo || '/logo.png',
    siteFavicon: initialSettings.siteFavicon || '/favicon.ico',
    primaryColor: initialSettings.primaryColor || '#3b82f6',
    secondaryColor: initialSettings.secondaryColor || '#8b5cf6',
    facebookUrl: initialSettings.facebookUrl || '',
    twitterUrl: initialSettings.twitterUrl || '',
    instagramUrl: initialSettings.instagramUrl || '',
    youtubeUrl: initialSettings.youtubeUrl || '',
    linkedinUrl: initialSettings.linkedinUrl || '',
    seoTitle: initialSettings.seoTitle || 'ZayiflamaPlan - Gerçek İnsanların Gerçek Planları',
    seoDescription: initialSettings.seoDescription || 'Gerçek insanların gerçek zayıflama planlarını paylaştığı, topluluk destekli platform. Kilo verme yolculuğunda sana ilham verecek planları keşfet.',
    seoKeywords: initialSettings.seoKeywords || 'zayıflama, diyet, kilo verme, sağlıklı yaşam, fitness',
    ogImage: initialSettings.ogImage || '/og-image.jpg',
    twitterHandle: initialSettings.twitterHandle || '@zayiflamaplan',
    googleAnalytics: initialSettings.googleAnalytics || '',
    googleSiteVerification: initialSettings.googleSiteVerification || '',
    robotsTxt: initialSettings.robotsTxt || 'User-agent: *\nAllow: /',
    bannedWords: initialSettings.bannedWords || '',
    autoModerate: initialSettings.autoModerate === 'true',
    emailFrom: initialSettings.emailFrom || 'noreply@zayiflamaplan.com',
    emailFromName: initialSettings.emailFromName || 'ZayiflamaPlan',
    emailNotifications: initialSettings.emailNotifications !== 'false',
    notifyNewPlan: initialSettings.notifyNewPlan === 'true',
    notifyNewComment: initialSettings.notifyNewComment === 'true',
    notifyNewUser: initialSettings.notifyNewUser === 'true',
    notifyAdminEmail: initialSettings.notifyAdminEmail || '',
    pushNotifications: initialSettings.pushNotifications === 'true',
    autoBackup: initialSettings.autoBackup === 'true',
    backupFrequency: initialSettings.backupFrequency || 'daily',
    backupRetention: initialSettings.backupRetention || '30',
    backupPath: initialSettings.backupPath || './backups',
    lastBackupDate: initialSettings.lastBackupDate || '',
    rateLimit: initialSettings.rateLimit !== 'false',
    xssProtection: initialSettings.xssProtection !== 'false',
  })

  const handleSave = async (category: string) => {
    try {
      setLoading(true)
      
      const settingsToUpdate: Record<string, { value: string; category: string }> = {}
      
      if (category === 'general') {
        settingsToUpdate.siteName = { value: settings.siteName, category: 'general' }
        settingsToUpdate.siteDescription = { value: settings.siteDescription, category: 'general' }
        settingsToUpdate.contactEmail = { value: settings.contactEmail, category: 'general' }
        settingsToUpdate.siteUrl = { value: settings.siteUrl, category: 'general' }
      } else if (category === 'appearance') {
        settingsToUpdate.siteLogo = { value: settings.siteLogo, category: 'appearance' }
        settingsToUpdate.siteFavicon = { value: settings.siteFavicon, category: 'appearance' }
        settingsToUpdate.primaryColor = { value: settings.primaryColor, category: 'appearance' }
        settingsToUpdate.secondaryColor = { value: settings.secondaryColor, category: 'appearance' }
      } else if (category === 'social') {
        settingsToUpdate.facebookUrl = { value: settings.facebookUrl, category: 'social' }
        settingsToUpdate.twitterUrl = { value: settings.twitterUrl, category: 'social' }
        settingsToUpdate.instagramUrl = { value: settings.instagramUrl, category: 'social' }
        settingsToUpdate.youtubeUrl = { value: settings.youtubeUrl, category: 'social' }
        settingsToUpdate.linkedinUrl = { value: settings.linkedinUrl, category: 'social' }
      } else if (category === 'seo') {
        settingsToUpdate.seoTitle = { value: settings.seoTitle, category: 'seo' }
        settingsToUpdate.seoDescription = { value: settings.seoDescription, category: 'seo' }
        settingsToUpdate.seoKeywords = { value: settings.seoKeywords, category: 'seo' }
        settingsToUpdate.ogImage = { value: settings.ogImage, category: 'seo' }
        settingsToUpdate.twitterHandle = { value: settings.twitterHandle, category: 'seo' }
        settingsToUpdate.googleAnalytics = { value: settings.googleAnalytics, category: 'seo' }
        settingsToUpdate.googleSiteVerification = { value: settings.googleSiteVerification, category: 'seo' }
        settingsToUpdate.robotsTxt = { value: settings.robotsTxt, category: 'seo' }
      } else if (category === 'moderation') {
        settingsToUpdate.bannedWords = { value: settings.bannedWords, category: 'moderation' }
        settingsToUpdate.autoModerate = { value: settings.autoModerate.toString(), category: 'moderation' }
      } else if (category === 'email') {
        settingsToUpdate.emailFrom = { value: settings.emailFrom, category: 'email' }
        settingsToUpdate.emailFromName = { value: settings.emailFromName, category: 'email' }
      } else if (category === 'notifications') {
        settingsToUpdate.emailNotifications = { value: settings.emailNotifications.toString(), category: 'notifications' }
        settingsToUpdate.notifyNewPlan = { value: settings.notifyNewPlan.toString(), category: 'notifications' }
        settingsToUpdate.notifyNewComment = { value: settings.notifyNewComment.toString(), category: 'notifications' }
        settingsToUpdate.notifyNewUser = { value: settings.notifyNewUser.toString(), category: 'notifications' }
        settingsToUpdate.notifyAdminEmail = { value: settings.notifyAdminEmail, category: 'notifications' }
        settingsToUpdate.pushNotifications = { value: settings.pushNotifications.toString(), category: 'notifications' }
      } else if (category === 'backup') {
        settingsToUpdate.autoBackup = { value: settings.autoBackup.toString(), category: 'backup' }
        settingsToUpdate.backupFrequency = { value: settings.backupFrequency, category: 'backup' }
        settingsToUpdate.backupRetention = { value: settings.backupRetention, category: 'backup' }
        settingsToUpdate.backupPath = { value: settings.backupPath, category: 'backup' }
      } else if (category === 'security') {
        settingsToUpdate.rateLimit = { value: settings.rateLimit.toString(), category: 'security' }
        settingsToUpdate.xssProtection = { value: settings.xssProtection.toString(), category: 'security' }
      }

      await updateSettings(settingsToUpdate)
      toast.success('Ayarlar kaydedildi')
    } catch (error) {
      toast.error('Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Tabs defaultValue="general" className="space-y-4">
      <TabsList className="grid w-full grid-cols-7">
        <TabsTrigger value="general">Genel</TabsTrigger>
        <TabsTrigger value="appearance">Görünüm</TabsTrigger>
        <TabsTrigger value="social">Sosyal Medya</TabsTrigger>
        <TabsTrigger value="seo">SEO</TabsTrigger>
        <TabsTrigger value="moderation">Moderasyon</TabsTrigger>
        <TabsTrigger value="email">Email</TabsTrigger>
        <TabsTrigger value="security">Güvenlik</TabsTrigger>
      </TabsList>

      <TabsContent value="general">
        <Card>
          <CardHeader>
            <CardTitle>Genel Ayarlar</CardTitle>
            <CardDescription>Site genel ayarları</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="siteName">Site Adı</Label>
              <Input 
                id="siteName" 
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="siteDescription">Site Açıklaması</Label>
              <Textarea
                id="siteDescription"
                value={settings.siteDescription}
                onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactEmail">İletişim Email</Label>
              <Input 
                id="contactEmail" 
                type="email" 
                value={settings.contactEmail}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="siteUrl">Site URL</Label>
              <Input 
                id="siteUrl" 
                type="url" 
                value={settings.siteUrl}
                onChange={(e) => setSettings({ ...settings, siteUrl: e.target.value })}
                placeholder="https://zayiflamaplan.com"
              />
              <p className="text-xs text-muted-foreground">
                Sitemap ve canonical URL'ler için kullanılır
              </p>
            </div>
            <Button onClick={() => handleSave('general')} disabled={loading}>
              {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Kaydediliyor...</> : 'Kaydet'}
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="appearance">
        <Card>
          <CardHeader>
            <CardTitle>Görünüm Ayarları</CardTitle>
            <CardDescription>Site görünümü ve branding</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="siteLogo">Site Logo URL</Label>
              <Input 
                id="siteLogo" 
                value={settings.siteLogo}
                onChange={(e) => setSettings({ ...settings, siteLogo: e.target.value })}
                placeholder="/logo.png"
              />
              <p className="text-xs text-muted-foreground">
                Header'da görünecek logo (PNG veya SVG önerilir)
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="siteFavicon">Favicon URL</Label>
              <Input 
                id="siteFavicon" 
                value={settings.siteFavicon}
                onChange={(e) => setSettings({ ...settings, siteFavicon: e.target.value })}
                placeholder="/favicon.ico"
              />
              <p className="text-xs text-muted-foreground">
                Tarayıcı sekmesinde görünecek ikon (32x32px ICO veya PNG)
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="primaryColor">Ana Renk</Label>
                <div className="flex gap-2">
                  <Input 
                    id="primaryColor" 
                    type="color"
                    value={settings.primaryColor}
                    onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                    className="w-20 h-10"
                  />
                  <Input 
                    value={settings.primaryColor}
                    onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                    placeholder="#3b82f6"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Butonlar ve vurgular için
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="secondaryColor">İkincil Renk</Label>
                <div className="flex gap-2">
                  <Input 
                    id="secondaryColor" 
                    type="color"
                    value={settings.secondaryColor}
                    onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                    className="w-20 h-10"
                  />
                  <Input 
                    value={settings.secondaryColor}
                    onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                    placeholder="#8b5cf6"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Aksan rengi
                </p>
              </div>
            </div>
            <div className="p-4 rounded-lg border bg-muted/50">
              <p className="text-sm font-medium mb-2">Önizleme</p>
              <div className="flex gap-2">
                <div 
                  className="w-20 h-10 rounded flex items-center justify-center text-white text-xs font-medium"
                  style={{ backgroundColor: settings.primaryColor }}
                >
                  Ana Renk
                </div>
                <div 
                  className="w-20 h-10 rounded flex items-center justify-center text-white text-xs font-medium"
                  style={{ backgroundColor: settings.secondaryColor }}
                >
                  İkincil
                </div>
              </div>
            </div>
            <Button onClick={() => handleSave('appearance')} disabled={loading}>
              {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Kaydediliyor...</> : 'Kaydet'}
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="social">
        <Card>
          <CardHeader>
            <CardTitle>Sosyal Medya</CardTitle>
            <CardDescription>Sosyal medya hesap linkleri</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="facebookUrl">Facebook</Label>
              <Input 
                id="facebookUrl" 
                value={settings.facebookUrl}
                onChange={(e) => setSettings({ ...settings, facebookUrl: e.target.value })}
                placeholder="https://facebook.com/zayiflamaplan"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="twitterUrl">Twitter / X</Label>
              <Input 
                id="twitterUrl" 
                value={settings.twitterUrl}
                onChange={(e) => setSettings({ ...settings, twitterUrl: e.target.value })}
                placeholder="https://twitter.com/zayiflamaplan"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instagramUrl">Instagram</Label>
              <Input 
                id="instagramUrl" 
                value={settings.instagramUrl}
                onChange={(e) => setSettings({ ...settings, instagramUrl: e.target.value })}
                placeholder="https://instagram.com/zayiflamaplan"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="youtubeUrl">YouTube</Label>
              <Input 
                id="youtubeUrl" 
                value={settings.youtubeUrl}
                onChange={(e) => setSettings({ ...settings, youtubeUrl: e.target.value })}
                placeholder="https://youtube.com/@zayiflamaplan"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedinUrl">LinkedIn</Label>
              <Input 
                id="linkedinUrl" 
                value={settings.linkedinUrl}
                onChange={(e) => setSettings({ ...settings, linkedinUrl: e.target.value })}
                placeholder="https://linkedin.com/company/zayiflamaplan"
              />
            </div>
            <div className="p-4 rounded-lg border bg-muted/50">
              <p className="text-sm font-medium mb-2">Aktif Linkler</p>
              <div className="flex flex-wrap gap-2">
                {settings.facebookUrl && (
                  <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700">
                    Facebook
                  </a>
                )}
                {settings.twitterUrl && (
                  <a href={settings.twitterUrl} target="_blank" rel="noopener noreferrer" className="text-xs px-2 py-1 rounded bg-sky-100 text-sky-700">
                    Twitter
                  </a>
                )}
                {settings.instagramUrl && (
                  <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-xs px-2 py-1 rounded bg-pink-100 text-pink-700">
                    Instagram
                  </a>
                )}
                {settings.youtubeUrl && (
                  <a href={settings.youtubeUrl} target="_blank" rel="noopener noreferrer" className="text-xs px-2 py-1 rounded bg-red-100 text-red-700">
                    YouTube
                  </a>
                )}
                {settings.linkedinUrl && (
                  <a href={settings.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700">
                    LinkedIn
                  </a>
                )}
                {!settings.facebookUrl && !settings.twitterUrl && !settings.instagramUrl && !settings.youtubeUrl && !settings.linkedinUrl && (
                  <span className="text-xs text-muted-foreground">Henüz link eklenmemiş</span>
                )}
              </div>
            </div>
            <Button onClick={() => handleSave('social')} disabled={loading}>
              {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Kaydediliyor...</> : 'Kaydet'}
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="seo">
        <Card>
          <CardHeader>
            <CardTitle>SEO Ayarları</CardTitle>
            <CardDescription>Arama motoru optimizasyonu ayarları</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* SEO Dosyaları Hızlı Erişim */}
            <div className="p-4 rounded-lg border bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
              <p className="text-sm font-semibold mb-3 text-blue-900 dark:text-blue-100">📄 SEO Dosyaları</p>
              <div className="flex flex-wrap gap-2">
                <a 
                  href="/sitemap.xml" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-md bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/50 transition-colors"
                >
                  🗺️ sitemap.xml
                </a>
                <a 
                  href="/robots.txt" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-md bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/50 transition-colors"
                >
                  🤖 robots.txt
                </a>
                <a 
                  href="/og-default.svg" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-md bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/50 transition-colors"
                >
                  🖼️ OG Image
                </a>
                <a 
                  href="/api/og?title=Örnek Plan&author=kullanici&result=5kg verdi" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-md bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/50 transition-colors"
                >
                  🎨 Dinamik OG
                </a>
              </div>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-2">
                Bu dosyalar otomatik oluşturulur ve dinamik içerik içerir
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="seoTitle">SEO Başlık</Label>
              <Input 
                id="seoTitle" 
                value={settings.seoTitle}
                onChange={(e) => setSettings({ ...settings, seoTitle: e.target.value })}
                maxLength={60}
              />
              <p className="text-xs text-muted-foreground">
                {settings.seoTitle.length}/60 karakter - Arama sonuçlarında görünür
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="seoDescription">SEO Açıklama</Label>
              <Textarea
                id="seoDescription"
                value={settings.seoDescription}
                onChange={(e) => setSettings({ ...settings, seoDescription: e.target.value })}
                rows={3}
                maxLength={160}
              />
              <p className="text-xs text-muted-foreground">
                {settings.seoDescription.length}/160 karakter - Arama sonuçlarında görünür
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="seoKeywords">Anahtar Kelimeler</Label>
              <Input 
                id="seoKeywords" 
                value={settings.seoKeywords}
                onChange={(e) => setSettings({ ...settings, seoKeywords: e.target.value })}
                placeholder="kelime1, kelime2, kelime3"
              />
              <p className="text-xs text-muted-foreground">
                Virgülle ayırarak yazın
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ogImage">Open Graph Resim URL</Label>
              <Input 
                id="ogImage" 
                value={settings.ogImage}
                onChange={(e) => setSettings({ ...settings, ogImage: e.target.value })}
                placeholder="/og-image.jpg"
              />
              <p className="text-xs text-muted-foreground">
                Sosyal medyada paylaşıldığında görünecek resim (1200x630px önerilir)
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="twitterHandle">Twitter Kullanıcı Adı</Label>
              <Input 
                id="twitterHandle" 
                value={settings.twitterHandle}
                onChange={(e) => setSettings({ ...settings, twitterHandle: e.target.value })}
                placeholder="@kullaniciadi"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="googleAnalytics">Google Analytics ID</Label>
              <Input 
                id="googleAnalytics" 
                value={settings.googleAnalytics}
                onChange={(e) => setSettings({ ...settings, googleAnalytics: e.target.value })}
                placeholder="G-XXXXXXXXXX"
              />
              <p className="text-xs text-muted-foreground">
                Google Analytics 4 ölçüm kimliği
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="googleSiteVerification">Google Site Verification</Label>
              <Input 
                id="googleSiteVerification" 
                value={settings.googleSiteVerification}
                onChange={(e) => setSettings({ ...settings, googleSiteVerification: e.target.value })}
                placeholder="verification-code"
              />
              <p className="text-xs text-muted-foreground">
                Google Search Console doğrulama kodu
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="robotsTxt">robots.txt İçeriği</Label>
              <Textarea
                id="robotsTxt"
                value={settings.robotsTxt}
                onChange={(e) => setSettings({ ...settings, robotsTxt: e.target.value })}
                rows={6}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Arama motoru botları için kurallar
              </p>
            </div>
            <Button onClick={() => handleSave('seo')} disabled={loading}>
              {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Kaydediliyor...</> : 'Kaydet'}
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="notifications">
        <Card>
          <CardHeader>
            <CardTitle>Bildirim Ayarları</CardTitle>
            <CardDescription>Email ve push notification ayarları</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Email Bildirimleri</h3>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="emailNotifications"
                    checked={settings.emailNotifications}
                    onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                  />
                  <Label htmlFor="emailNotifications">Email bildirimlerini aktif et</Label>
                </div>
                <p className="text-xs text-muted-foreground ml-6">
                  Kapalı olduğunda hiçbir email bildirimi gönderilmez
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notifyAdminEmail">Admin Bildirim Email</Label>
                <Input 
                  id="notifyAdminEmail" 
                  type="email"
                  value={settings.notifyAdminEmail}
                  onChange={(e) => setSettings({ ...settings, notifyAdminEmail: e.target.value })}
                  placeholder="admin@zayiflamaplan.com"
                  disabled={!settings.emailNotifications}
                />
                <p className="text-xs text-muted-foreground">
                  Sistem bildirimleri bu adrese gönderilir
                </p>
              </div>

              <div className="space-y-3 pl-6 border-l-2">
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="notifyNewPlan"
                    checked={settings.notifyNewPlan}
                    onChange={(e) => setSettings({ ...settings, notifyNewPlan: e.target.checked })}
                    disabled={!settings.emailNotifications}
                  />
                  <Label htmlFor="notifyNewPlan">Yeni plan oluşturulduğunda bildir</Label>
                </div>

                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="notifyNewComment"
                    checked={settings.notifyNewComment}
                    onChange={(e) => setSettings({ ...settings, notifyNewComment: e.target.checked })}
                    disabled={!settings.emailNotifications}
                  />
                  <Label htmlFor="notifyNewComment">Yeni yorum yapıldığında bildir</Label>
                </div>

                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="notifyNewUser"
                    checked={settings.notifyNewUser}
                    onChange={(e) => setSettings({ ...settings, notifyNewUser: e.target.checked })}
                    disabled={!settings.emailNotifications}
                  />
                  <Label htmlFor="notifyNewUser">Yeni kullanıcı kaydolduğunda bildir</Label>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t">
              <h3 className="font-semibold">Push Notifications</h3>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="pushNotifications"
                    checked={settings.pushNotifications}
                    onChange={(e) => setSettings({ ...settings, pushNotifications: e.target.checked })}
                  />
                  <Label htmlFor="pushNotifications">Push notification'ları aktif et</Label>
                </div>
                <p className="text-xs text-muted-foreground ml-6">
                  Kullanıcılara tarayıcı bildirimleri gönderir (Service Worker gerektirir)
                </p>
              </div>
            </div>

            <Button onClick={() => handleSave('notifications')} disabled={loading}>
              {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Kaydediliyor...</> : 'Kaydet'}
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="backup">
        <Card>
          <CardHeader>
            <CardTitle>Yedekleme Ayarları</CardTitle>
            <CardDescription>Otomatik database yedekleme ayarları</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="autoBackup"
                  checked={settings.autoBackup}
                  onChange={(e) => setSettings({ ...settings, autoBackup: e.target.checked })}
                />
                <Label htmlFor="autoBackup">Otomatik yedeklemeyi aktif et</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="backupFrequency">Yedekleme Sıklığı</Label>
                <select
                  id="backupFrequency"
                  value={settings.backupFrequency}
                  onChange={(e) => setSettings({ ...settings, backupFrequency: e.target.value })}
                  disabled={!settings.autoBackup}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="hourly">Her Saat</option>
                  <option value="daily">Günlük</option>
                  <option value="weekly">Haftalık</option>
                  <option value="monthly">Aylık</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="backupRetention">Yedek Saklama Süresi (gün)</Label>
                <Input 
                  id="backupRetention" 
                  type="number"
                  min="1"
                  max="365"
                  value={settings.backupRetention}
                  onChange={(e) => setSettings({ ...settings, backupRetention: e.target.value })}
                  disabled={!settings.autoBackup}
                />
                <p className="text-xs text-muted-foreground">
                  Bu süreden eski yedekler otomatik silinir
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="backupPath">Yedek Klasörü</Label>
                <Input 
                  id="backupPath" 
                  value={settings.backupPath}
                  onChange={(e) => setSettings({ ...settings, backupPath: e.target.value })}
                  disabled={!settings.autoBackup}
                  placeholder="./backups"
                />
                <p className="text-xs text-muted-foreground">
                  Yedeklerin kaydedileceği klasör yolu
                </p>
              </div>

              {settings.lastBackupDate && (
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm font-medium">Son Yedekleme</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(settings.lastBackupDate).toLocaleString('tr-TR')}
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button onClick={() => handleSave('backup')} disabled={loading}>
                {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Kaydediliyor...</> : 'Kaydet'}
              </Button>
              <Button 
                type="button"
                variant="outline"
                onClick={async () => {
                  try {
                    setLoading(true)
                    const response = await fetch('/api/admin/backup', { method: 'POST' })
                    const data = await response.json()
                    if (data.success) {
                      toast.success('Yedekleme başarılı')
                      setSettings({ ...settings, lastBackupDate: new Date().toISOString() })
                    } else {
                      toast.error('Yedekleme başarısız')
                    }
                  } catch (error) {
                    toast.error('Bir hata oluştu')
                  } finally {
                    setLoading(false)
                  }
                }}
                disabled={loading}
              >
                Manuel Yedekle
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="moderation">
        <Card>
          <CardHeader>
            <CardTitle>Moderasyon Ayarları</CardTitle>
            <CardDescription>İçerik moderasyon kuralları</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bannedWords">Yasaklı Kelimeler (her satıra bir kelime)</Label>
              <Textarea
                id="bannedWords"
                placeholder="spam&#10;reklam&#10;..."
                value={settings.bannedWords}
                onChange={(e) => setSettings({ ...settings, bannedWords: e.target.value })}
                rows={5}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="autoModerate"
                  checked={settings.autoModerate}
                  onChange={(e) => setSettings({ ...settings, autoModerate: e.target.checked })}
                />
                <Label htmlFor="autoModerate">Yorumları otomatik modera et</Label>
              </div>
              <p className="text-xs text-muted-foreground">
                Aktif olduğunda, yasaklı kelime içeren yorumlar otomatik olarak gizlenir
              </p>
            </div>
            <Button onClick={() => handleSave('moderation')} disabled={loading}>
              {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Kaydediliyor...</> : 'Kaydet'}
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="email">
        <Card>
          <CardHeader>
            <CardTitle>Email Ayarları</CardTitle>
            <CardDescription>Email bildirim ayarları</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="emailFrom">Gönderen Email</Label>
              <Input 
                id="emailFrom" 
                type="email" 
                value={settings.emailFrom}
                onChange={(e) => setSettings({ ...settings, emailFrom: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emailFromName">Gönderen Adı</Label>
              <Input 
                id="emailFromName" 
                value={settings.emailFromName}
                onChange={(e) => setSettings({ ...settings, emailFromName: e.target.value })}
              />
            </div>
            <Button onClick={() => handleSave('email')} disabled={loading}>
              {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Kaydediliyor...</> : 'Kaydet'}
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="security">
        <Card>
          <CardHeader>
            <CardTitle>Güvenlik Ayarları</CardTitle>
            <CardDescription>Platform güvenlik ayarları</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="rateLimit"
                  checked={settings.rateLimit}
                  onChange={(e) => setSettings({ ...settings, rateLimit: e.target.checked })}
                />
                <Label htmlFor="rateLimit">Rate limiting aktif</Label>
              </div>
              <p className="text-xs text-muted-foreground">
                API isteklerini sınırlar (Redis gerektirir)
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="xssProtection"
                  checked={settings.xssProtection}
                  onChange={(e) => setSettings({ ...settings, xssProtection: e.target.checked })}
                />
                <Label htmlFor="xssProtection">XSS koruması aktif</Label>
              </div>
              <p className="text-xs text-muted-foreground">
                Kullanıcı girdilerini otomatik olarak temizler
              </p>
            </div>
            <Button onClick={() => handleSave('security')} disabled={loading}>
              {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Kaydediliyor...</> : 'Kaydet'}
            </Button>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
