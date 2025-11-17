import { Metadata } from 'next'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { CheckInClient } from './check-in-client'
import { db as prisma } from '@/lib/db'

export const metadata: Metadata = {
  title: 'Günlük Check-in | ZayiflamaPlanim.com',
  description: 'Günlük check-in yap, streak kazan!',
}

async function getCheckInData(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      streak: true,
      lastCheckIn: true,
    },
  })

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const lastCheckIn = user?.lastCheckIn ? new Date(user.lastCheckIn) : null
  const lastCheckInDate = lastCheckIn ? new Date(lastCheckIn.setHours(0, 0, 0, 0)) : null

  const hasCheckedInToday = lastCheckInDate?.getTime() === today.getTime()

  return {
    streak: user?.streak || 0,
    lastCheckIn: user?.lastCheckIn,
    hasCheckedInToday,
  }
}

export default async function CheckInPage() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/giris?callbackUrl=/check-in')
  }

  const data = await getCheckInData(session.user.id)

  return (
    <>
      <Navbar />
      <CheckInClient {...data} />
    </>
  )
}
