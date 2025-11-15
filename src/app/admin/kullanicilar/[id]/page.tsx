import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { getUserById } from '../actions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { UserEditForm } from '@/components/admin/user-edit-form'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function UserEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  const { id } = await params
  const user = await getUserById(id)

  if (!user) {
    redirect('/admin/kullanicilar')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/kullanicilar">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold mb-2">Kullanıcı Düzenle</h1>
          <p className="text-muted-foreground">
            {user.name || user.email} kullanıcısını düzenle
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <UserEditForm user={user} />
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>İstatistikler</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Toplam Plan</p>
                <p className="text-2xl font-bold">{user._count.plans}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Toplam Yorum</p>
                <p className="text-2xl font-bold">{user._count.comments}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Takipçi</p>
                <p className="text-2xl font-bold">{user._count.followers}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Takip Edilen</p>
                <p className="text-2xl font-bold">{user._count.following}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Hesap Bilgileri</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>
                <p className="text-muted-foreground">Kayıt Tarihi</p>
                <p className="font-medium">
                  {new Date(user.createdAt).toLocaleDateString('tr-TR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Son Güncelleme</p>
                <p className="font-medium">
                  {new Date(user.updatedAt).toLocaleDateString('tr-TR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
