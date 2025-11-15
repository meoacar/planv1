import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ForgotPasswordForm } from './forgot-password-form'

import { Button } from '@/components/ui/button'

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <div className="w-full max-w-md space-y-4">
        <div className="flex justify-center">
          <Button asChild variant="ghost" size="sm">
            <Link href="/">← Siteye Geri Dön</Link>
          </Button>
        </div>
        
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Şifremi Unuttum</CardTitle>
            <CardDescription>
              Email adresine şifre sıfırlama linki göndereceğiz
            </CardDescription>
          </CardHeader>
        <CardContent>
          <ForgotPasswordForm />

          <div className="mt-6 text-center">
            <Link href="/giris" className="text-sm text-primary hover:underline">
              ← Giriş sayfasına dön
            </Link>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  )
}
