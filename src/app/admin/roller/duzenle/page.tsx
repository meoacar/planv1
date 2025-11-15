import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { getAllPermissions, getRolePermissions, getAllRoles } from '../actions'
import { RolePermissionManager } from '@/components/admin/role-permission-manager'
import { RoleSelector } from '@/components/admin/role-selector'
import { ArrowLeft, Plus } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function RoleEditPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>
}) {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  const params = await searchParams
  const selectedRole = params.role || 'USER'
  
  const [allPermissions, rolePermissions, roles] = await Promise.all([
    getAllPermissions(),
    getRolePermissions(selectedRole),
    getAllRoles(),
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/roller">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">İzin Yönetimi</h1>
          <p className="text-muted-foreground">
            Rol bazlı izinleri düzenle
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-48">
            <RoleSelector 
              selectedRole={selectedRole}
              roles={roles.map(r => ({ value: r, label: r }))}
            />
          </div>
          <Button asChild variant="outline">
            <Link href="/admin/roller/yeni">
              <Plus className="h-4 w-4 mr-2" />
              Yeni Rol
            </Link>
          </Button>
        </div>
      </div>

      <RolePermissionManager 
        role={selectedRole}
        permissions={rolePermissions.map(p => ({
          ...p,
          description: p.description || ''
        }))}
        allPermissions={allPermissions}
      />
    </div>
  )
}
