import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { PageForm } from '@/components/admin/page-form'

export default async function AdminPageEditPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await auth()

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/giris')
  }

  // Sayfa verilerini çek
  const page = await db.page.findUnique({
    where: { id: params.id },
  })

  if (!page) {
    redirect('/admin/sayfalar')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Sayfa Düzenle</h1>
        <p className="text-muted-foreground">
          {page.title} sayfasını düzenleyin
        </p>
      </div>

      <PageForm page={page} />
    </div>
  )
}
