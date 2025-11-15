import Link from 'next/link'
import { auth } from '@/lib/auth'
import { Button } from '@/components/ui/button'

export async function Header() {
  const session = await auth()

  return (
    <header className="border-b bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold hover:text-primary transition-colors">
          🌟 ZayiflamaPlan
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/kesfet" className="text-sm hover:text-primary transition-colors">
            Keşfet
          </Link>
          {session?.user && (
            <>
              <Link href="/dashboard" className="text-sm hover:text-primary transition-colors">
                Dashboard
              </Link>
              <Link href="/planlarim" className="text-sm hover:text-primary transition-colors">
                Planlarım
              </Link>
              <Link href="/kilo-takibi" className="text-sm hover:text-primary transition-colors">
                Takip
              </Link>
            </>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {session?.user ? (
            <>
              <Link href="/bildirimler" className="relative">
                <Button variant="ghost" size="icon">
                  🔔
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                </Button>
              </Link>
              <Link href="/profil/me">
                <Button variant="ghost" size="icon">
                  👤
                </Button>
              </Link>
              <Link href="/ayarlar">
                <Button variant="ghost" size="icon">
                  ⚙️
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Button asChild variant="ghost">
                <Link href="/giris">Giriş Yap</Link>
              </Button>
              <Button asChild>
                <Link href="/kayit">Kayıt Ol</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
