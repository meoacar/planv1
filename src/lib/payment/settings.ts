import { db } from '@/lib/db'

export interface PaymentSettings {
  paytrEnabled: boolean
  iyzicoEnabled: boolean
  stripeEnabled: boolean
}

let cachedSettings: PaymentSettings | null = null
let cacheTime: number = 0
const CACHE_DURATION = 60000 // 1 dakika

export async function getPaymentSettings(): Promise<PaymentSettings> {
  // Cache kontrolü
  if (cachedSettings && Date.now() - cacheTime < CACHE_DURATION) {
    return cachedSettings
  }

  try {
    const settings = await db.setting.findMany({
      where: {
        category: 'payment',
        key: {
          in: ['paytrEnabled', 'iyzicoEnabled', 'stripeEnabled']
        }
      }
    })

    const settingsMap = settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value === 'true'
      return acc
    }, {} as Record<string, boolean>)

    cachedSettings = {
      paytrEnabled: settingsMap.paytrEnabled ?? true,
      iyzicoEnabled: settingsMap.iyzicoEnabled ?? true,
      stripeEnabled: settingsMap.stripeEnabled ?? true,
    }

    cacheTime = Date.now()
    return cachedSettings
  } catch (error) {
    console.error('Error fetching payment settings:', error)
    // Hata durumunda varsayılan değerler
    return {
      paytrEnabled: true,
      iyzicoEnabled: true,
      stripeEnabled: true,
    }
  }
}

export function clearPaymentSettingsCache() {
  cachedSettings = null
  cacheTime = 0
}
