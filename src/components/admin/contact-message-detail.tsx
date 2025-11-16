'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { 
  ArrowLeft, 
  Mail, 
  Calendar, 
  User, 
  MessageSquare, 
  Send, 
  Trash2, 
  Archive,
  AlertTriangle,
  Loader2
} from 'lucide-react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'
import { toast } from 'sonner'

interface ContactMessageDetailProps {
  message: {
    id: string
    name: string
    email: string
    subject: string
    message: string
    status: string
    response: string | null
    respondedBy: string | null
    respondedAt: Date | null
    ipAddress: string | null
    userAgent: string | null
    createdAt: Date
    updatedAt: Date
  }
  adminId: string
}

export function ContactMessageDetail({ message, adminId }: ContactMessageDetailProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState(message.response || '')
  const [showResponse, setShowResponse] = useState(!!message.response)

  const handleStatusChange = async (newStatus: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/contact/${message.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!res.ok) throw new Error()

      toast.success('Durum güncellendi')
      router.refresh()
    } catch (error) {
      toast.error('Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const handleSendResponse = async () => {
    if (!response.trim()) {
      toast.error('Lütfen bir yanıt yazın')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/admin/contact/${message.id}/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ response }),
      })

      if (!res.ok) throw new Error()

      toast.success('Yanıt gönderildi')
      router.refresh()
    } catch (error) {
      toast.error('Yanıt gönderilemedi')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Bu mesajı silmek istediğinizden emin misiniz?')) return

    setLoading(true)
    try {
      const res = await fetch(`/api/admin/contact/${message.id}`, {
        method: 'DELETE',
      })

      if (!res.ok) throw new Error()

      toast.success('Mesaj silindi')
      router.push('/admin/iletisim')
    } catch (error) {
      toast.error('Mesaj silinemedi')
    } finally {
      setLoading(false)
    }
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

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/iletisim">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Geri
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Mesaj Detayı</h1>
            <p className="text-muted-foreground">#{message.id.slice(0, 8)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleStatusChange('archived')}
            disabled={loading}
          >
            <Archive className="h-4 w-4 mr-2" />
            Arşivle
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleStatusChange('spam')}
            disabled={loading}
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            Spam
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={loading}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Sil
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mesaj İçeriği */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  {message.subject}
                </CardTitle>
                {getStatusBadge(message.status)}
              </div>
              <CardDescription>
                {formatDistanceToNow(new Date(message.createdAt), {
                  addSuffix: true,
                  locale: tr,
                })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <p className="whitespace-pre-wrap">{message.message}</p>
              </div>
            </CardContent>
          </Card>

          {/* Yanıt Bölümü */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Yanıt Gönder
              </CardTitle>
              <CardDescription>
                Kullanıcıya e-posta ile yanıt gönderin
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {message.respondedAt && (
                <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200">
                  <p className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">
                    ✓ Bu mesaj yanıtlandı
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400">
                    {formatDistanceToNow(new Date(message.respondedAt), {
                      addSuffix: true,
                      locale: tr,
                    })}
                  </p>
                  {message.response && (
                    <div className="mt-3 p-3 rounded bg-white dark:bg-gray-900 border">
                      <p className="text-sm whitespace-pre-wrap">{message.response}</p>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="response">Yanıt Mesajı</Label>
                <Textarea
                  id="response"
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  placeholder="Yanıtınızı buraya yazın..."
                  rows={8}
                  disabled={loading}
                />
              </div>

              <Button
                onClick={handleSendResponse}
                disabled={loading || !response.trim()}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Gönderiliyor...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Yanıtı Gönder
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Gönderen Bilgileri */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Gönderen Bilgileri
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">İsim</p>
                <p className="font-medium">{message.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">E-posta</p>
                <a
                  href={`mailto:${message.email}`}
                  className="font-medium text-purple-600 hover:underline"
                >
                  {message.email}
                </a>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Gönderim Tarihi</p>
                <p className="text-sm">
                  {new Date(message.createdAt).toLocaleString('tr-TR')}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Teknik Bilgiler</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">IP Adresi</p>
                <p className="font-mono text-xs">{message.ipAddress || 'Bilinmiyor'}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">User Agent</p>
                <p className="font-mono text-xs break-all">
                  {message.userAgent || 'Bilinmiyor'}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Mesaj ID</p>
                <p className="font-mono text-xs">{message.id}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
