import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { MessagesClient } from './messages-client'

export default async function MessagesPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/giris')
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <MessagesClient />
      </main>
    </div>
  )
}
