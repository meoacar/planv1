import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ConfessionReports } from "@/components/admin/confessions/ConfessionReports"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export const metadata = {
  title: "İtiraf Raporları | Admin",
  description: "Rapor edilen itirafları inceleyin",
}

async function getReportedConfessions(page: number = 1, limit: number = 20) {
  const skip = (page - 1) * limit

  // TODO: Confession modeli schema'ya eklendikten sonra aktif edilecek
  // Şimdilik mock data dönüyoruz
  const reportedConfessions: any[] = []
  const total = 0

  /*
  const reportedConfessions = await db.confession.findMany({
    where: {
      reports: {
        some: {},
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
      reports: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              username: true,
              image: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
      _count: {
        select: {
          empathies: true,
          reports: true,
        },
      },
    },
    orderBy: [
      {
        reports: {
          _count: "desc",
        },
      },
      { createdAt: "desc" },
    ],
    skip,
    take: limit,
  })

  const total = await db.confession.count({
    where: {
      reports: {
        some: {},
      },
    },
  })

  const confessionsWithReportCount = reportedConfessions.map((confession) => ({
    confession: {
      ...confession,
      reports: undefined,
    },
    reportCount: confession._count.reports,
    reports: confession.reports,
  }))
  */

  const confessionsWithReportCount: any[] = []

  return {
    data: confessionsWithReportCount,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  }
}

export default async function AdminConfessionReportsPage({
  searchParams,
}: {
  searchParams: { page?: string }
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

  const page = parseInt(searchParams.page || "1")
  const { data, meta } = await getReportedConfessions(page)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">İtiraf Raporları</h1>
        <p className="text-muted-foreground">
          Kullanıcılar tarafından rapor edilen itirafları incele
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Rapor Edilen İtiraflar</CardTitle>
          <CardDescription>
            Toplam {meta.total} rapor edilen itiraf
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ConfessionReports 
            initialData={data} 
            initialMeta={meta}
          />
        </CardContent>
      </Card>
    </div>
  )
}
