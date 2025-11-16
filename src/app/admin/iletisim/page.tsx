import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'
import { Mail, MailOpen, MessageSquare, Archive, AlertTriangle, Eye } from 'lucide-react'

export default async function AdminContactPage({
  searchParams,
}: {
  searchParams: { status?: string }
}) {
  const session = await auth()

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/giris')
  }

  const statusFilter = searchParams.status || 'all'

  // Mesajları çek
  const messages = await db.contactMessage.findMany({
    where: statusFilter !== 'all' ? { status: statusFilter as any } : undefined,
    orderBy: { createdAt: 'desc' },
  })

  // İstatistikler
  const stats = {
    total: messages.length,
    new: await db.contactMessage.count({ where: { status: 'new' } }),
    read: await db.contactMessage.count({ where: { status: 'read' } }),
    responded: await db.contactMessage.count({ where: { status: 'responded' } }),
    spam: await db.contactMessage.count({ where: { status: 'spam' } }),
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge className="bg-blue-500">Yeni</Badge>
      case 'read':
        return <Badge variant="secondary">Okundu</Badge>
      case 'responded':
        return <Badge className="bg-green-500">Yanıtlandı</Badge>
      case 'archived':
        return <Badge variant="outline">Arşivlendi</Badge>
      case 'spam':
        return <Badge variant="destructive">Spam</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new':
        return <Mail className="h-4 w-4 text-blue-500" />
      case 'read':
        return <MailOpen className="h-4 w-4 text-muted-foreground" />
      case 'responded':
        return <MessageSquare className="h-4 w-4 text-green-500" />
      case 'archived':
        return <Archive className="h-4 w-4 text-muted-foreground" />
      case 'spam':
        return <AlertTriangle className="h-4 w-4 text-destructive" />
      default:
        return <Mail className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">İletişim Mesajları</h1>
        <p className="text-muted-foreground">
          Kullanıcılardan gelen mesajları görüntüleyin ve yanıtlayın
        </p>
      </div>

      {/* İstatistikler */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Toplam</CardDescription>
            <CardTitle className="text-3xl">{stats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Yeni</CardDescription>
            <CardTitle className="text-3xl text-blue-600">{stats.new}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Okundu</CardDescription>
            <CardTitle className="text-3xl">{stats.read}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Yanıtlandı</CardDescription>
            <CardTitle className="text-3xl text-green-600">{stats.responded}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Spam</CardDescription>
            <CardTitle className="text-3xl text-red-600">{stats.spam}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Filtreler */}
      <div className="flex flex-wrap gap-2">
        <Button asChild variant={statusFilter === 'all' ? 'default' : 'outline'} size="sm">
          <Link href="/admin/iletisim">Tümü</Link>
        </Button>
        <Button asChild variant={statusFilter === 'new' ? 'default' : 'outline'} size="sm">
          <Link href="/admin/iletisim?status=new">Yeni</Link>
        </Button>
        <Button asChild variant={statusFilter === 'read' ? 'default' : 'outline'} size="sm">
          <Link href="/admin/iletisim?status=read">Okundu</Link>
        </Button>
        <Button asChild variant={statusFilter === 'responded' ? 'default' : 'outline'} size="sm">
          <Link href="/admin/iletisim?status=responded">Yanıtlandı</Link>
        </Button>
        <Button asChild variant={statusFilter === 'spam' ? 'default' : 'outline'} size="sm">
          <Link href="/admin/iletisim?status=spam">Spam</Link>
        </Button>
      </div>

      {/* Mesaj Listesi */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Mesajlar
          </CardTitle>
        </CardHeader>
        <CardContent>
          {messages.length > 0 ? (
            <div className="space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`p-4 rounded-lg border transition-all hover:border-primary hover:shadow-md ${
                    message.status === 'new' ? 'bg-blue-50 dark:bg-blue-950/20 border-blue-200' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      {getStatusIcon(message.status)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold truncate">{message.name}</h4>
                          {getStatusBadge(message.status)}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{message.email}</p>
                      </div>
                    </div>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/iletisim/${message.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                  
                  <div className="mb-2">
                    <p className="font-medium text-sm mb-1">{message.subject}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {message.message}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>
                      {formatDistanceToNow(new Date(message.createdAt), {
                        addSuffix: true,
                        locale: tr,
                      })}
                    </span>
                    {message.respondedAt && (
                      <span className="text-green-600">
                        ✓ Yanıtlandı
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">
                {statusFilter === 'all' ? 'Henüz mesaj yok' : 'Bu filtrede mesaj bulunamadı'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
