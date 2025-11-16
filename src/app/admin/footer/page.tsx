import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FooterLinksManager } from '@/components/admin/footer-links-manager'
import { FooterSocialManager } from '@/components/admin/footer-social-manager'
import { FooterSettingsManager } from '@/components/admin/footer-settings-manager'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default async function AdminFooterPage() {
  const session = await auth()

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/giris')
  }

  // Footer verilerini çek
  const [footerLinks, socialLinks, footerSettings] = await Promise.all([
    db.footerLink.findMany({
      orderBy: [
        { column: 'asc' },
        { sortOrder: 'asc' }
      ],
    }),
    db.footerSocial.findMany({
      orderBy: { sortOrder: 'asc' },
    }),
    db.footerSetting.findMany(),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Footer Yönetimi</h1>
        <p className="text-muted-foreground">
          Site footer'ındaki linkleri, sosyal medya hesaplarını ve ayarları yönetin
        </p>
      </div>

      <Tabs defaultValue="links" className="space-y-6">
        <TabsList>
          <TabsTrigger value="links">Linkler</TabsTrigger>
          <TabsTrigger value="social">Sosyal Medya</TabsTrigger>
          <TabsTrigger value="settings">Ayarlar</TabsTrigger>
        </TabsList>

        <TabsContent value="links">
          <FooterLinksManager initialLinks={footerLinks} />
        </TabsContent>

        <TabsContent value="social">
          <FooterSocialManager initialSocials={socialLinks} />
        </TabsContent>

        <TabsContent value="settings">
          <FooterSettingsManager initialSettings={footerSettings} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
