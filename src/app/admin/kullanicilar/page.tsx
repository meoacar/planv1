import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getUsersForAdmin } from './actions'
import { Eye, Edit } from 'lucide-react'
import Link from 'next/link'
import { UserActions } from '@/components/admin/user-actions'
import { UserFilters } from '@/components/admin/user-filters'

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string; page?: string; search?: string }>
}) {
  const params = await searchParams
  const role = params.role || 'all'
  const page = parseInt(params.page || '1')
  const search = params.search
  
  const { users, total } = await getUsersForAdmin(role, page, search)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Kullanıcı Yönetimi</h1>
        <p className="text-muted-foreground">
          Kullanıcıları yönet, rol değiştir veya engelle
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Kullanıcılar</CardTitle>
              <CardDescription>Toplam {total} kullanıcı</CardDescription>
            </div>
            <UserFilters currentRole={role} />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kullanıcı</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Yorum</TableHead>
                <TableHead>Kayıt Tarihi</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-semibold">
                        {user.name?.[0] || 'U'}
                      </div>
                      <div>
                        <p className="font-medium">{user.name || 'İsimsiz'}</p>
                        <p className="text-xs text-muted-foreground">
                          @{user.username || user.email?.split('@')[0]}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.isBanned ? (
                      <div className="flex flex-col gap-1">
                        <Badge variant="destructive">Yasaklı</Badge>
                        {user.bannedUntil && (
                          <span className="text-xs text-muted-foreground">
                            {new Date(user.bannedUntil).toLocaleDateString('tr-TR')} tarihine kadar
                          </span>
                        )}
                      </div>
                    ) : (
                      <Badge variant="success">Aktif</Badge>
                    )}
                  </TableCell>
                  <TableCell>{user._count.plans}</TableCell>
                  <TableCell>{user._count.comments}</TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button size="sm" variant="ghost" asChild>
                        <Link href={`/profil/${user.username || user.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button size="sm" variant="ghost" asChild>
                        <Link href={`/admin/kullanicilar/${user.id}`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <UserActions 
                        userId={user.id} 
                        role={user.role} 
                        isBanned={user.isBanned || false}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
