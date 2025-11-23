'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function getPaymentSettings() {
  const session = await auth()

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  const settings = await db.setting.findMany({
    where: {
      category: 'payment'
    }
  })
  
  // Convert to key-value object
  const settingsObj: Record<string, string> = {}
  settings.forEach(setting => {
    settingsObj[setting.key] = setting.value
  })

  // Default values
  return {
    paytrEnabled: settingsObj.paytrEnabled || 'true',
    paytrMerchantId: settingsObj.paytrMerchantId || process.env.PAYTR_MERCHANT_ID || '',
    paytrMerchantKey: settingsObj.paytrMerchantKey || process.env.PAYTR_MERCHANT_KEY || '',
    paytrMerchantSalt: settingsObj.paytrMerchantSalt || process.env.PAYTR_MERCHANT_SALT || '',
    paytrTestMode: settingsObj.paytrTestMode || 'false',
    
    iyzicoEnabled: settingsObj.iyzicoEnabled || 'true',
    iyzicoApiKey: settingsObj.iyzicoApiKey || process.env.IYZICO_API_KEY || '',
    iyzicoSecretKey: settingsObj.iyzicoSecretKey || process.env.IYZICO_SECRET_KEY || '',
    iyzicoTestMode: settingsObj.iyzicoTestMode || 'false',
    
    stripeEnabled: settingsObj.stripeEnabled || 'true',
    stripePublishableKey: settingsObj.stripePublishableKey || process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
    stripeSecretKey: settingsObj.stripeSecretKey || process.env.STRIPE_SECRET_KEY || '',
    stripeTestMode: settingsObj.stripeTestMode || 'false',
  }
}

export async function updatePaymentSettings(settings: Record<string, string>) {
  const session = await auth()

  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized')
  }

  // Update all settings
  await Promise.all(
    Object.entries(settings).map(([key, value]) =>
      db.setting.upsert({
        where: { key },
        update: { value, category: 'payment' },
        create: { key, value, category: 'payment' },
      })
    )
  )

  // Clear payment settings cache
  const { clearPaymentSettingsCache } = await import('@/lib/payment/settings')
  clearPaymentSettingsCache()

  revalidatePath('/admin/magaza/odeme-ayarlari')
  revalidatePath('/magaza/premium')
  return { success: true }
}

export async function getPaymentStats() {
  const session = await auth()

  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized')
  }

  // Get payment statistics from orders
  const totalOrders = await db.order.count()
  const successfulOrders = await db.order.count({
    where: { status: 'COMPLETED' }
  })
  const failedOrders = await db.order.count({
    where: { status: 'FAILED' }
  })
  const pendingOrders = await db.order.count({
    where: { status: 'PENDING' }
  })

  // Get payment method breakdown
  const paytrOrders = await db.order.count({
    where: { 
      status: 'COMPLETED',
      // PayTR orders will have specific characteristics
    }
  })

  const iyzicoOrders = await db.order.count({
    where: { 
      status: 'COMPLETED',
      // Iyzico orders will have specific characteristics
    }
  })

  return {
    total: totalOrders,
    successful: successfulOrders,
    failed: failedOrders,
    pending: pendingOrders,
    paytr: paytrOrders,
    iyzico: iyzicoOrders,
  }
}
