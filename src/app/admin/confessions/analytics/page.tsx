import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ConfessionAnalytics } from "@/components/admin/confessions/ConfessionAnalytics"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export const metadata = {
  title: "İtiraf Analitikleri | Admin",
  description: "İtiraf sistemi istatistiklerini görüntüleyin",
}

export default async function AdminConfessionAnalyticsPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/giris")
  }

  // Admin kontrolü
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  })

  if (user?.role !== "ADMIN") {
    redirect("/")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">İtiraf Analitikleri</h1>
        <p className="text-muted-foreground">
          İtiraf sistemi kullanım istatistikleri ve trendler
        </p>
      </div>

      <ConfessionAnalytics />
    </div>
  )
}
