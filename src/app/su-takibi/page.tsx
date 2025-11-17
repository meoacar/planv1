import { Metadata } from 'next'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { WaterClient } from './water-client'

export const metadata: Metadata = {
  title: 'Su Takibi | ZayiflamaPlanim.com',
  description: 'Günlük su tüketimini takip et',
}

export default async function WaterPage() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/giris?callbackUrl=/su-takibi')
  }

  return (
    <>
      <Navbar />
      <WaterClient />
    </>
  )
}
