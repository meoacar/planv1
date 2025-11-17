import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SeasonalThemeManager } from "@/components/admin/confessions/SeasonalThemeManager"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export const metadata = {
  title: "Sezonluk Temalar | Admin",
  description: "Özel günler için tema yönetimi",
}

export default async function AdminSeasonalThemesPage() {
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
        <h1 className="text-3xl font-bold mb-2">Sezonluk Temalar</h1>
        <p className="text-muted-foreground">
          Ramazan, Bayram, Yılbaşı gibi özel günler için tema yönetimi
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tema Yönetimi</CardTitle>
          <CardDescription>
            Sezonluk temaları oluştur, düzenle ve yönet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SeasonalThemeManager />
        </CardContent>
      </Card>
    </div>
  )
}
