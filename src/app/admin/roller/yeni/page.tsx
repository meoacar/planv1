import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { NewRoleForm } from '@/components/admin/new-role-form'

export default async function NewRolePage() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/roller">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold mb-2">Yeni Rol Oluştur</h1>
          <p className="text-muted-foreground">
            Özel bir rol oluştur ve izinlerini belirle
          </p>
        </div>
      </div>

      <NewRoleForm />
    </div>
  )
}
