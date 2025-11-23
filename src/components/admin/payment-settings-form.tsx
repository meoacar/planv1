"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { updatePaymentSettings, getPaymentStats } from "@/app/admin/magaza/odeme-ayarlari/actions"
import { toast } from "sonner"
import { Loader2, CreditCard, TrendingUp, AlertCircle, CheckCircle2, Clock, XCircle } from "lucide-react"

interface PaymentSettingsFormProps {
  initialSettings: Record<string, string>
}

export function PaymentSettingsForm({ initialSettings }: PaymentSettingsFormProps) {
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState<any>(null)
  const [settings, setSettings] = useState({
    paytrEnabled: initialSettings.paytrEnabled === 'true',
    paytrMerchantId: initialSettings.paytrMerchantId || '',
    paytrMerchantKey: initialSettings.paytrMerchantKey || '',
    paytrMerchantSalt: initialSettings.paytrMerchantSalt || '',
    paytrTestMode: initialSettings.paytrTestMode === 'true',
    
    iyzicoEnabled: initialSettings.iyzicoEnabled === 'true',
    iyzicoApiKey: initialSettings.iyzicoApiKey || '',
    iyzicoSecretKey: initialSettings.iyzicoSecretKey || '',
    iyzicoTestMode: initialSettings.iyzicoTestMode === 'true',
  })

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const data = await getPaymentStats()
      setStats(data)
    } catch (error) {
      console.error('Stats yüklenemedi:', error)
    }
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      
      const settingsToUpdate: Record<string, string> = {
        paytrEnabled: settings.paytrEnabled.toString(),
        paytrMerchantId: settings.paytrMerchantId,
        paytrMerchantKey: settings.paytrMerchantKey,
        paytrMerchantSalt: settings.paytrMerchantSalt,
        paytrTestMode: settings.paytrTestMode.toString(),
        
        iyzicoEnabled: settings.iyzicoEnabled.toString(),
        iyzicoApiKey: settings.iyzicoApiKey,
        iyzicoSecretKey: settings.iyzicoSecretKey,
        iyzicoTestMode: settings.iyzicoTestMode.toString(),
      }

      await updatePaymentSettings(settingsToUpdate)
      toast.success('Ödeme ayarları kaydedildi')
    } catch (error) {
      toast.error('Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* İstatistikler */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Toplam Sipariş</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Başarılı</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.successful}</div>
              <p className="text-xs text-muted-foreground">
                {stats.total > 0 ? Math.round((stats.successful / stats.total) * 100) : 0}% başarı oranı
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Başarısız</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bekleyen</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Aktif Ödeme Yöntemleri Özeti */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Aktif Ödeme Yöntemleri
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {settings.paytrEnabled && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                <CheckCircle2 className="h-4 w-4" />
                <span className="font-medium">PayTR</span>
                {settings.paytrTestMode && (
                  <span className="text-xs px-2 py-0.5 rounded bg-yellow-200 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200">
                    TEST
                  </span>
                )}
              </div>
            )}
            {settings.iyzicoEnabled && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                <CheckCircle2 className="h-4 w-4" />
                <span className="font-medium">Iyzico</span>
                {settings.iyzicoTestMode && (
                  <span className="text-xs px-2 py-0.5 rounded bg-yellow-200 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200">
                    TEST
                  </span>
                )}
              </div>
            )}
            {!settings.paytrEnabled && !settings.iyzicoEnabled && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">
                <AlertCircle className="h-4 w-4" />
                <span className="font-medium">Hiçbir ödeme yöntemi aktif değil!</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* PayTR Ayarları */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>PayTR</CardTitle>
              <CardDescription>Türkiye'nin yerli ödeme sistemi</CardDescription>
            </div>
            <Switch
              checked={settings.paytrEnabled}
              onCheckedChange={(checked) => setSettings({ ...settings, paytrEnabled: checked })}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="paytrMerchantId">Merchant ID</Label>
            <Input 
              id="paytrMerchantId" 
              value={settings.paytrMerchantId}
              onChange={(e) => setSettings({ ...settings, paytrMerchantId: e.target.value })}
              disabled={!settings.paytrEnabled}
              placeholder="123456"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="paytrMerchantKey">Merchant Key</Label>
            <Input 
              id="paytrMerchantKey" 
              type="password"
              value={settings.paytrMerchantKey}
              onChange={(e) => setSettings({ ...settings, paytrMerchantKey: e.target.value })}
              disabled={!settings.paytrEnabled}
              placeholder="••••••••••••••••"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="paytrMerchantSalt">Merchant Salt</Label>
            <Input 
              id="paytrMerchantSalt" 
              type="password"
              value={settings.paytrMerchantSalt}
              onChange={(e) => setSettings({ ...settings, paytrMerchantSalt: e.target.value })}
              disabled={!settings.paytrEnabled}
              placeholder="••••••••••••••••"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="paytrTestMode"
              checked={settings.paytrTestMode}
              onCheckedChange={(checked) => setSettings({ ...settings, paytrTestMode: checked })}
              disabled={!settings.paytrEnabled}
            />
            <Label htmlFor="paytrTestMode">Test Modu</Label>
          </div>

          {settings.paytrTestMode && settings.paytrEnabled && (
            <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
              <p className="text-sm text-yellow-800 dark:text-yellow-200 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Test modunda gerçek ödeme alınmaz
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Iyzico Ayarları */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Iyzico</CardTitle>
              <CardDescription>Gelişmiş ödeme altyapısı</CardDescription>
            </div>
            <Switch
              checked={settings.iyzicoEnabled}
              onCheckedChange={(checked) => setSettings({ ...settings, iyzicoEnabled: checked })}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="iyzicoApiKey">API Key</Label>
            <Input 
              id="iyzicoApiKey" 
              type="password"
              value={settings.iyzicoApiKey}
              onChange={(e) => setSettings({ ...settings, iyzicoApiKey: e.target.value })}
              disabled={!settings.iyzicoEnabled}
              placeholder="••••••••••••••••"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="iyzicoSecretKey">Secret Key</Label>
            <Input 
              id="iyzicoSecretKey" 
              type="password"
              value={settings.iyzicoSecretKey}
              onChange={(e) => setSettings({ ...settings, iyzicoSecretKey: e.target.value })}
              disabled={!settings.iyzicoEnabled}
              placeholder="••••••••••••••••"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="iyzicoTestMode"
              checked={settings.iyzicoTestMode}
              onCheckedChange={(checked) => setSettings({ ...settings, iyzicoTestMode: checked })}
              disabled={!settings.iyzicoEnabled}
            />
            <Label htmlFor="iyzicoTestMode">Test Modu (Sandbox)</Label>
          </div>

          {settings.iyzicoTestMode && settings.iyzicoEnabled && (
            <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
              <p className="text-sm text-yellow-800 dark:text-yellow-200 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Sandbox modunda gerçek ödeme alınmaz
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Kaydet Butonu */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={loading} size="lg">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Kaydediliyor...
            </>
          ) : (
            'Ayarları Kaydet'
          )}
        </Button>
      </div>
    </div>
  )
}
