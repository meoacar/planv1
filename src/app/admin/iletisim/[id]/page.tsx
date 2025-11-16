import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { ContactMessageDetail } from '@/components/admin/contact-message-detail'

export default async function AdminContactDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await auth()

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/giris')
  }

  const message = await db.contactMessage.findUnique({
    where: { id: params.id },
  })

  if (!message) {
    redirect('/admin/iletisim')
  }

  // Mesajı okundu olarak işaretle
  if (message.status === 'new') {
    await db.contactMessage.update({
      where: { id: params.id },
      data: { status: 'read' },
    })
  }

  return (
    <div className="space-y-6">
      <ContactMessageDetail message={message} adminId={session.user.id} />
    </div>
  )
}
