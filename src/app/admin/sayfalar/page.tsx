import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'
import { FileText, Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react'

export default async function AdminPagesPage() {
  const session = await auth()

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/giris')
  }

  // Tüm sayfaları çek
  const pages = await db.page.findMany({
    orderBy: [
      { sortOrder: 'asc' },
      { createdAt: 'desc' }
    ],
  })

  const stats = {
    total: pages.length,
    published: pages.filter(p => p.isPublished).length,
    draft: pages.filter(p => p.status === 'draft').length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Sayfa Yönetimi</h1>
          <p className="text-muted-foreground">
            Hakkımızda, Gizlilik Politikası gibi sayfaları yönetin
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/sayfalar/yeni">
            <Plus className="h-4 w-4 mr-2" />
            Yeni Sayfa
          </Link>
        </Button>
      </div>

      {/* İstatistikler */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Toplam Sayfa</CardDescription>
            <CardTitle className="text-3xl">{stats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Yayında</CardDescription>
            <CardTitle className="text-3xl text-green-600">{stats.published}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Taslak</CardDescription>
            <CardTitle className="text-3xl text-yellow-600">{stats.draft}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Sayfa Listesi */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Tüm Sayfalar
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pages.length > 0 ? (
            <div className="space-y-3">
              {pages.map((page) => (
                <div
                  key={page.id}
                  className="flex items-center justify-between p-4 rounded-lg border hover:border-primary transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold truncate">{page.title}</h3>
                      <Badge variant={page.isPublished ? 'default' : 'secondary'}>
                        {page.isPublished ? 'Yayında' : 'Taslak'}
                      </Badge>
                      {page.isPublished ? (
                        <Eye className="h-4 w-4 text-green-600" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>/{page.slug}</span>
                      <span>•</span>
                      <span>Sıra: {page.sortOrder}</span>
                      <span>•</span>
                      <span>
                        {formatDistanceToNow(new Date(page.updatedAt), {
                          addSuffix: true,
                          locale: tr,
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/sayfalar/${page.id}`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    {page.isPublished && (
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/${page.slug}`} target="_blank">
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground mb-4">Henüz sayfa oluşturulmamış</p>
              <Button asChild>
                <Link href="/admin/sayfalar/yeni">
                  <Plus className="h-4 w-4 mr-2" />
                  İlk Sayfayı Oluştur
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
