import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ModerationQueue } from "@/components/admin/confessions/ModerationQueue"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export const metadata = {
  title: "İtiraf Moderasyonu | Admin",
  description: "İtirafları moderasyon yapın",
}

async function getModerationData(page: number = 1, limit: number = 20) {
  const skip = (page - 1) * limit

  // TODO: Confession modeli schema'ya eklendikten sonra aktif edilecek
  // Şimdilik mock data dönüyoruz
  const confessions: any[] = []
  const total = 0
  const pendingCount = 0
  const hiddenCount = 0

  /*
  const [confessions, total, pendingCount, hiddenCount] = await Promise.all([
    db.confession.findMany({
      where: {
        status: {
          in: ["pending", "hidden"],
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
        _count: {
          select: {
            empathies: true,
            reports: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    db.confession.count({
      where: {
        status: {
          in: ["pending", "hidden"],
        },
      },
    }),
    db.confession.count({ where: { status: "pending" } }),
    db.confession.count({ where: { status: "hidden" } }),
  ])
  */

  return {
    confessions,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      pendingCount,
      hiddenCount,
    },
  }
}

export default async function AdminConfessionModerationPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
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

  const params = await searchParams
  const page = parseInt(params.page || "1")
  const { confessions, meta } = await getModerationData(page)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">İtiraf Moderasyonu</h1>
        <p className="text-muted-foreground">
          Bekleyen ve gizlenen itirafları incele ve yönet
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Moderasyon Kuyruğu</CardTitle>
          <CardDescription>
            Toplam {meta.total} itiraf moderasyon bekliyor
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ModerationQueue 
            initialConfessions={confessions} 
            initialMeta={meta}
          />
        </CardContent>
      </Card>
    </div>
  )
}
