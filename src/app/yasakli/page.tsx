import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'
import Link from 'next/link'

export default async function BannedPage() {
  const session = await auth()

  // Yasaklı değilse dashboard'a yönlendir
  if (!session?.user?.isBanned) {
    redirect('/dashboard')
  }

  const bannedUntil = session.user.bannedUntil
  const banReason = session.user.banReason

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-red-50 to-orange-50">
      <Card className="max-w-2xl w-full border-destructive">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="h-10 w-10 text-destructive" />
            </div>
          </div>
          <CardTitle className="text-2xl text-destructive">
            Hesabınız Yasaklandı
          </CardTitle>
          <CardDescription className="text-base mt-2">
            Hesabınız geçici veya kalıcı olarak askıya alınmıştır
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {banReason && (
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Yasaklama Sebebi:</h3>
              <p className="text-muted-foreground">{banReason}</p>
            </div>
          )}

          {bannedUntil ? (
            <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Yasaklama Süresi:</h3>
              <p className="text-muted-foreground">
                Hesabınız{' '}
                <span className="font-bold text-orange-700">
                  {new Date(bannedUntil).toLocaleDateString('tr-TR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>{' '}
                tarihine kadar yasaklıdır.
              </p>
            </div>
          ) : (
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 text-destructive">Süresiz Yasaklama</h3>
              <p className="text-muted-foreground">
                Hesabınız süresiz olarak yasaklanmıştır. İtiraz etmek için destek ekibiyle iletişime geçebilirsiniz.
              </p>
            </div>
          )}

          <div className="border-t pt-6">
            <h3 className="font-semibold mb-3">Ne Yapabilirsiniz?</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Topluluk kurallarımızı gözden geçirin</li>
              <li>• İtiraz etmek istiyorsanız destek ekibiyle iletişime geçin</li>
              <li>• Yasaklama süresi dolduğunda hesabınız otomatik olarak aktif olacaktır</li>
            </ul>
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" asChild className="flex-1">
              <Link href="/iletisim">Destek Ekibi</Link>
            </Button>
            <Button variant="outline" asChild className="flex-1">
              <Link href="/topluluk-kurallari">Topluluk Kuralları</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
