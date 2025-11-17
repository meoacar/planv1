'use client'

import Link from 'next/link'
import { Facebook, Twitter, Instagram, Heart } from 'lucide-react'

export function FooterClient() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-t from-muted/50 to-background border-t mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Logo ve Açıklama */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                ZayiflamaPlan
              </h3>
            </Link>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm">
              Gerçek insanların gerçek başarı hikayeleri. Hedeflerine ulaşan binlerce kişiye katıl!
            </p>
            
            {/* Sosyal Medya */}
            <div className="flex items-center gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-all hover:scale-110 group"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5 text-primary" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-all hover:scale-110 group"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5 text-primary" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-all hover:scale-110 group"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5 text-primary" />
              </a>
            </div>
          </div>

          {/* Hızlı Linkler */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Keşfet</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/kesfet" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Planları Keşfet
                </Link>
              </li>
              <li>
                <Link href="/plan-ekle" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Plan Oluştur
                </Link>
              </li>
              <li>
                <Link href="/tarifler" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Tarifler
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Destek */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Destek</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/hakkimizda" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link href="/iletisim" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  İletişim
                </Link>
              </li>
              <li>
                <Link href="/gizlilik" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Gizlilik Politikası
                </Link>
              </li>
              <li>
                <Link href="/kullanim-kosullari" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Kullanım Koşulları
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Alt Kısım */}
        <div className="pt-8 border-t border-border/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              © {currentYear} ZayiflamaPlan. Tüm hakları saklıdır.
              <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
            </p>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Link href="/gizlilik" className="hover:text-primary transition-colors">
                Gizlilik
              </Link>
              <span>•</span>
              <Link href="/kullanim-kosullari" className="hover:text-primary transition-colors">
                Koşullar
              </Link>
              <span>•</span>
              <Link href="/cerezler" className="hover:text-primary transition-colors">
                Çerezler
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
