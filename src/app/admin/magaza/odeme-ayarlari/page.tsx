import { getPaymentSettings } from './actions'
import { PaymentSettingsForm } from '@/components/admin/payment-settings-form'

export const metadata = {
  title: 'Ödeme Ayarları - Admin Panel',
  description: 'Ödeme sistemlerini yönet',
}

export default async function PaymentSettingsPage() {
  const settings = await getPaymentSettings()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Ödeme Ayarları</h1>
        <p className="text-muted-foreground">
          Ödeme sistemlerini aktif/pasif yapın ve API bilgilerini yönetin
        </p>
      </div>

      <PaymentSettingsForm initialSettings={settings} />
    </div>
  )
}
