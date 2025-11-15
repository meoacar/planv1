import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getRoleStats, getRolePermissions } from './actions'
import { Shield, Users, Crown, CheckCircle, XCircle, Settings, Plus } from 'lucide-react'
import Link from 'next/link'
import { InitializePermissionsButton } from '@/components/admin/initialize-permissions-button'

export default async function AdminRolesPage() {
  const stats = await getRoleStats()
  const [userPermissions, adminPermissions] = await Promise.all([
    getRolePermissions('USER'),
    getRolePermissions('ADMIN'),
  ])

  const permissions = [
    { key: 'createPlan', label: 'Plan Oluşturma', user: true, admin: true },
    { key: 'editOwnPlan', label: 'Kendi Planını Düzenleme', user: true, admin: true },
    { key: 'editAnyPlan', label: 'Tüm Planları Düzenleme', user: false, admin: true },
    { key: 'deletePlan', label: 'Plan Silme', user: false, admin: true },
    { key: 'approvePlan', label: 'Plan Onaylama', user: false, admin: true },
    { key: 'comment', label: 'Yorum Yapma', user: true, admin: true },
    { key: 'moderateComment', label: 'Yorum Moderasyonu', user: false, admin: true },
    { key: 'viewUsers', label: 'Kullanıcıları Görüntüleme', user: false, admin: true },
    { key: 'editUsers', label: 'Kullanıcı Düzenleme', user: false, admin: true },
    { key: 'banUsers', label: 'Kullanıcı Yasaklama', user: false, admin: true },
    { key: 'viewStats', label: 'İstatistikleri Görüntüleme', user: false, admin: true },
    { key: 'viewLogs', label: 'Logları Görüntüleme', user: false, admin: true },
    { key: 'changeSettings', label: 'Ayarları Değiştirme', user: false, admin: true },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Roller & İzinler</h1>
          <p className="text-muted-foreground">
            Kullanıcı rolleri ve izin yönetimi
          </p>
        </div>
        <div className="flex items-center gap-2">
          <InitializePermissionsButton />
          <Button asChild variant="outline">
            <Link href="/admin/roller/yeni">
              <Plus className="h-4 w-4 mr-2" />
              Yeni Rol
            </Link>
          </Button>
          <Button asChild>
            <Link href="/admin/roller/duzenle">
              <Settings className="h-4 w-4 mr-2" />
              İzinleri Düzenle
            </Link>
          </Button>
        </div>
      </div>

      {/* Rol İstatistikleri */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Toplam Kullanıcı</CardDescription>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Tüm kayıtlı kullanıcılar
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Admin Kullanıcılar</CardDescription>
            <Crown className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.adminUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Tam yetki sahibi
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Normal Kullanıcılar</CardDescription>
            <Shield className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.normalUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Standart izinler
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Roller Tablosu */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              USER (Kullanıcı)
            </CardTitle>
            <CardDescription>
              Standart kullanıcı rolü - Temel izinler
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                <span className="text-sm font-medium">Kullanıcı Sayısı</span>
                <Badge variant="secondary">{stats.normalUsers}</Badge>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">İzinler: {userPermissions.length}</p>
                <ul className="space-y-1 max-h-48 overflow-y-auto">
                  {userPermissions.map((perm, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      {perm.description}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-yellow-600" />
              ADMIN (Yönetici)
            </CardTitle>
            <CardDescription>
              Yönetici rolü - Tam yetki
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                <span className="text-sm font-medium">Kullanıcı Sayısı</span>
                <Badge variant="default">{stats.adminUsers}</Badge>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">İzinler: {adminPermissions.length}</p>
                <p className="text-sm text-muted-foreground">
                  Tüm izinler dahil (tam yetki)
                </p>
                <ul className="space-y-1 max-h-48 overflow-y-auto">
                  {adminPermissions.map((perm, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      {perm.description}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* İzin Karşılaştırma Tablosu */}
      <Card>
        <CardHeader>
          <CardTitle>İzin Karşılaştırması</CardTitle>
          <CardDescription>Roller arası izin farklılıkları</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>İzin</TableHead>
                <TableHead className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Shield className="h-4 w-4" />
                    USER
                  </div>
                </TableHead>
                <TableHead className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Crown className="h-4 w-4" />
                    ADMIN
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {permissions.map((permission) => (
                <TableRow key={permission.key}>
                  <TableCell className="font-medium">{permission.label}</TableCell>
                  <TableCell className="text-center">
                    {permission.user ? (
                      <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-400 mx-auto" />
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {permission.admin ? (
                      <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-400 mx-auto" />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Admin Kullanıcılar Listesi */}
      <Card>
        <CardHeader>
          <CardTitle>Admin Kullanıcılar</CardTitle>
          <CardDescription>Yönetici yetkisine sahip kullanıcılar</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kullanıcı</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Kayıt Tarihi</TableHead>
                <TableHead>Durum</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.adminList.map((admin) => (
                <TableRow key={admin.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                        <Crown className="h-4 w-4 text-yellow-600" />
                      </div>
                      <div>
                        <p className="font-medium">{admin.name || 'İsimsiz'}</p>
                        <p className="text-xs text-muted-foreground">
                          @{admin.username || admin.email?.split('@')[0]}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell>
                    {new Date(admin.createdAt).toLocaleDateString('tr-TR')}
                  </TableCell>
                  <TableCell>
                    <Badge variant={admin.isBanned ? 'destructive' : 'success'}>
                      {admin.isBanned ? 'Yasaklı' : 'Aktif'}
                    </Badge>
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
