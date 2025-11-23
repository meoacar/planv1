import { NextResponse } from 'next/server'
import { getPaymentSettings } from '@/lib/payment/settings'

export async function GET() {
  try {
    const settings = await getPaymentSettings()
    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error fetching payment settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch payment settings' },
      { status: 500 }
    )
  }
}
