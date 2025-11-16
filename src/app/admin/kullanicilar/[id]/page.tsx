import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { getUserById } from '../actions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { UserEditForm } from '@/components/admin/user-edit-form'
import { ArrowLeft, FileText, Users, Heart, MessageSquare, Calendar, Clock, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

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
          {/* İstatistikler */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                İstatistikler
              </CardTitle>
              <CardDescription>Kullanıcı aktivite özeti</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Toplam Plan</span>
                </div>
                <Badge variant="secondary" className="text-lg font-bold">
                  {user._count.plans}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-950/20">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Toplam Yorum</span>
                </div>
                <Badge variant="secondary" className="text-lg font-bold">
                  {user._count.comments}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-purple-50 dark:bg-purple-950/20">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-purple-500" />
                  <span className="text-sm font-medium">Takipçi</span>
                </div>
                <Badge variant="secondary" className="text-lg font-bold">
                  {user._count.followers}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-orange-50 dark:bg-orange-950/20">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-orange-500" />
                  <span className="text-sm font-medium">Takip Edilen</span>
                </div>
                <Badge variant="secondary" className="text-lg font-bold">
                  {user._count.following}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Hesap Bilgileri */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Hesap Bilgileri
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Kayıt Tarihi</p>
                  <p className="font-medium">
                    {new Date(user.createdAt).toLocaleDateString('tr-TR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Son Güncelleme</p>
                  <p className="font-medium">
                    {new Date(user.updatedAt).toLocaleDateString('tr-TR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Yasaklama Bilgileri */}
          {user.isBanned && (
            <Card className="border-destructive bg-destructive/5">
              <CardHeader>
                <CardTitle className="text-destructive flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Yasaklama Bilgileri
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {user.bannedUntil ? (
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                    <Calendar className="h-4 w-4 text-destructive mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Yasaklama Bitiş Tarihi</p>
                      <p className="font-medium text-destructive">
                        {new Date(user.bannedUntil).toLocaleDateString('tr-TR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                    <p className="text-sm font-medium text-destructive flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Süresiz yasaklama
                    </p>
                  </div>
                )}
                
                {user.banReason && (
                  <div className="p-3 rounded-lg bg-muted/50 border">
                    <p className="text-xs text-muted-foreground mb-1">Yasaklama Sebebi</p>
                    <p className="text-sm">{user.banReason}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
