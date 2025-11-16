import Link from 'next/link'
import { db } from '@/lib/db'
import { getSetting } from '@/lib/settings'
import { Facebook, Twitter, Instagram, Youtube, Linkedin, Send } from 'lucide-react'

const socialIcons: Record<string, any> = {
  facebook: Facebook,
  twitter: Twitter,
  instagram: Instagram,
  youtube: Youtube,
  linkedin: Linkedin,
  telegram: Send,
  tiktok: null, // Lucide'da yok, emoji kullanacağız
  discord: null, // Lucide'da yok, emoji kullanacağız
}

export async function Footer() {
  // Footer verilerini çek
  const [footerLinks, socialLinks, footerSettings] = await Promise.all([
    db.footerLink.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    }),
    db.footerSocial.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    }),
    db.footerSetting.findMany(),
  ])

  // Footer ayarlarını objeye çevir
  const settings = footerSettings.reduce((acc, setting) => {
    acc[setting.key] = setting.value
    return acc
  }, {} as Record<string, string>)

  // Site ayarlarını al
  const [siteName, siteDescription] = await Promise.all([
    getSetting('seoTitle', 'ZayiflamaPlan'),
    getSetting('seoDescription', 'Gerçek insanların gerçek zayıflama planları'),
  ])

  // Linkleri kolonlara göre grupla
  const linksByColumn = {
    company: footerLinks.filter(link => link.column === 'company'),
    support: footerLinks.filter(link => link.column === 'support'),
    legal: footerLinks.filter(link => link.column === 'legal'),
    community: footerLinks.filter(link => link.column === 'community'),
  }

  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-muted/30 border-t mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo ve Açıklama */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                {siteName}
              </h3>
            </Link>
            <p className="text-sm text-muted-foreground mb-4 max-w-sm">
              {settings.footerDescription || siteDescription}
            </p>
            
            {/* Sosyal Medya */}
            {socialLinks.length > 0 && (
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => {
                  const Icon = socialIcons[social.platform.toLowerCase()]
                  
                  return (
                    <a
                      key={social.id}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors group"
                      aria-label={social.platform}
                    >
                      {Icon ? (
                        <Icon className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                      ) : (
                        <span className="text-lg">{social.icon}</span>
                      )}
                    </a>
                  )
                })}
              </div>
            )}
          </div>

          {/* Şirket */}
          {linksByColumn.company.length > 0 && (
            <div>
              <h4 className="font-semibold mb-4">Şirket</h4>
              <ul className="space-y-2">
                {linksByColumn.company.map((link) => (
                  <li key={link.id}>
                    <Link
                      href={link.url}
                      target={link.openInNew ? '_blank' : undefined}
                      rel={link.openInNew ? 'noopener noreferrer' : undefined}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Destek */}
          {linksByColumn.support.length > 0 && (
            <div>
              <h4 className="font-semibold mb-4">Destek</h4>
              <ul className="space-y-2">
                {linksByColumn.support.map((link) => (
                  <li key={link.id}>
                    <Link
                      href={link.url}
                      target={link.openInNew ? '_blank' : undefined}
                      rel={link.openInNew ? 'noopener noreferrer' : undefined}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Topluluk */}
          {linksByColumn.community.length > 0 && (
            <div>
              <h4 className="font-semibold mb-4">Topluluk</h4>
              <ul className="space-y-2">
                {linksByColumn.community.map((link) => (
                  <li key={link.id}>
                    <Link
                      href={link.url}
                      target={link.openInNew ? '_blank' : undefined}
                      rel={link.openInNew ? 'noopener noreferrer' : undefined}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Alt Kısım */}
        <div className="mt-12 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              {settings.copyrightText || `© ${currentYear} ${siteName}. Tüm hakları saklıdır.`}
            </p>
            
            {/* Yasal Linkler */}
            {linksByColumn.legal.length > 0 && (
              <div className="flex items-center gap-4">
                {linksByColumn.legal.map((link) => (
                  <Link
                    key={link.id}
                    href={link.url}
                    target={link.openInNew ? '_blank' : undefined}
                    rel={link.openInNew ? 'noopener noreferrer' : undefined}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}
