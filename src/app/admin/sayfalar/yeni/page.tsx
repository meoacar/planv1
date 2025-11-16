import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { PageForm } from '@/components/admin/page-form'

export default async function AdminNewPagePage() {
  const session = await auth()

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/giris')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Yeni Sayfa Oluştur</h1>
        <p className="text-muted-foreground">
          Hakkımızda, İletişim gibi statik sayfalar oluşturun
        </p>
      </div>

      <PageForm />
    </div>
  )
}
