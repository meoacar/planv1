import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
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
import { getApiKeys } from './actions'
import { Plus, Copy, Trash2, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { ApiKeyActions } from '@/components/admin/api-key-actions'

export default async function ApiKeysPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  const apiKeys = await getApiKeys()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">API Key Yönetimi</h1>
          <p className="text-muted-foreground">
            API anahtarlarını oluştur ve yönet
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/api-keys/yeni">
            <Plus className="h-4 w-4 mr-2" />
            Yeni API Key
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>API Anahtarları</CardTitle>
          <CardDescription>Toplam {apiKeys.length} anahtar</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>İsim</TableHead>
                <TableHead>Anahtar</TableHead>
                <TableHead>İzinler</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead>Son Kullanım</TableHead>
                <TableHead>Oluşturulma</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apiKeys.map((apiKey) => (
                <TableRow key={apiKey.id}>
                  <TableCell className="font-medium">{apiKey.name}</TableCell>
                  <TableCell>
                    <code className="text-xs bg-muted px-2 py-1 rounded">
                      {apiKey.key.substring(0, 20)}...
                    </code>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {JSON.parse(apiKey.permissions).slice(0, 3).map((perm: string, idx: number) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {perm}
                        </Badge>
                      ))}
                      {JSON.parse(apiKey.permissions).length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{JSON.parse(apiKey.permissions).length - 3}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={apiKey.isActive ? 'success' : 'destructive'}>
                      {apiKey.isActive ? 'Aktif' : 'Pasif'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {apiKey.lastUsedAt 
                      ? new Date(apiKey.lastUsedAt).toLocaleDateString('tr-TR')
                      : 'Hiç kullanılmadı'
                    }
                  </TableCell>
                  <TableCell>
                    {new Date(apiKey.createdAt).toLocaleDateString('tr-TR')}
                  </TableCell>
                  <TableCell className="text-right">
                    <ApiKeyActions apiKeyId={apiKey.id} apiKey={apiKey.key} isActive={apiKey.isActive} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {apiKeys.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">Henüz API anahtarı oluşturulmamış</p>
              <Button asChild>
                <Link href="/admin/api-keys/yeni">
                  <Plus className="h-4 w-4 mr-2" />
                  İlk API Key'i Oluştur
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>API Kullanımı</CardTitle>
          <CardDescription>API anahtarlarını nasıl kullanacağınızı öğrenin</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">1. API Key ile İstek Gönderme</h3>
            <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
{`fetch('https://api.zayiflamaplan.com/v1/plans', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
})`}
            </pre>
          </div>

          <div>
            <h3 className="font-semibold mb-2">2. Rate Limiting</h3>
            <p className="text-sm text-muted-foreground">
              Her API key için dakikada 60 istek limiti vardır. Limit aşıldığında 429 hatası alırsınız.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">3. İzinler</h3>
            <p className="text-sm text-muted-foreground">
              Her API key'e özel izinler tanımlayabilirsiniz. Sadece izin verilen endpoint'lere erişim sağlanır.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
