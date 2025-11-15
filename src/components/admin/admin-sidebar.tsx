"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import {
  LayoutDashboard,
  FileText,
  Users,
  MessageSquare,
  Settings,
  Activity,
  BarChart3,
  Shield,
  Database,
  ChevronLeft,
  ChevronRight,
  ChefHat,
  Trophy,
  Gamepad2,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const menuItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Planlar",
    href: "/admin/planlar",
    icon: FileText,
  },
  {
    title: "Tarifler",
    href: "/admin/tarifler",
    icon: ChefHat,
  },
  {
    title: "Kullanıcılar",
    href: "/admin/kullanicilar",
    icon: Users,
  },
  {
    title: "Roller & İzinler",
    href: "/admin/roller",
    icon: Shield,
  },
  {
    title: "Yorumlar",
    href: "/admin/yorumlar",
    icon: MessageSquare,
  },
  {
    title: "Gruplar",
    href: "/admin/gruplar",
    icon: Users,
  },
  {
    title: "Gamification",
    href: "/admin/gamification/badges",
    icon: Trophy,
  },
  {
    title: "API Keys",
    href: "/admin/api-keys",
    icon: Database,
  },
  {
    title: "İstatistikler",
    href: "/admin/istatistikler",
    icon: BarChart3,
  },
  {
    title: "Aktivite Logları",
    href: "/admin/aktiviteler",
    icon: Activity,
  },
  {
    title: "Moderasyon",
    href: "/admin/moderasyon",
    icon: Shield,
  },
  {
    title: "Sistem",
    href: "/admin/sistem",
    icon: Database,
  },
  {
    title: "Ayarlar",
    href: "/admin/ayarlar",
    icon: Settings,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <aside className="w-64 border-r bg-muted/30 min-h-screen">
        <div className="p-6">
          <div className="flex items-center gap-2 font-bold text-lg">
            <Shield className="h-6 w-6 flex-shrink-0" />
            Admin Panel
          </div>
        </div>
      </aside>
    )
  }

  return (
    <aside className={cn(
      "border-r bg-muted/30 min-h-screen transition-all duration-300 relative",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className={cn("p-6", collapsed && "p-3")}>
        <Link href="/admin" className={cn(
          "flex items-center gap-2 font-bold text-lg",
          collapsed && "justify-center"
        )}>
          <Shield className="h-6 w-6 flex-shrink-0" />
          {!collapsed && "Admin Panel"}
        </Link>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-20 h-6 w-6 rounded-full border bg-background shadow-md"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </Button>

      <nav className="px-3 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
                collapsed && "justify-center"
              )}
              title={collapsed ? item.title : undefined}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {!collapsed && item.title}
            </Link>
          )
        })}
      </nav>

      {!collapsed && (
        <div className="p-6 mt-auto">
          <Link
            href="/dashboard"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Kullanıcı Görünümü
          </Link>
        </div>
      )}
    </aside>
  )
}
