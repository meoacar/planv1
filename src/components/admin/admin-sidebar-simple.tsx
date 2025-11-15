"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Shield } from "lucide-react"

const menuItems = [
  { title: "Dashboard", href: "/admin" },
  { title: "Planlar", href: "/admin/planlar" },
  { title: "Kullanıcılar", href: "/admin/kullanicilar" },
  { title: "Yorumlar", href: "/admin/yorumlar" },
  { title: "Ayarlar", href: "/admin/ayarlar" },
]

export function AdminSidebarSimple() {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r bg-muted/30 min-h-screen">
      <div className="p-6">
        <Link href="/admin" className="flex items-center gap-2 font-bold text-lg">
          <Shield className="h-6 w-6" />
          Admin Panel
        </Link>
      </div>

      <nav className="px-3 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "block px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {item.title}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
