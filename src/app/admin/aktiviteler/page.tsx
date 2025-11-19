import { Metadata } from 'next'
import { ActivityLogsTable } from '@/components/admin/activity-logs-table'

export const metadata: Metadata = {
  title: 'Aktivite Logları | Admin Panel',
  description: 'Sistem aktivite loglarını görüntüle',
}

export default function ActivityLogsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Aktivite Logları</h1>
        <p className="text-muted-foreground mt-2">
          Admin işlemlerini ve sistem aktivitelerini takip edin
        </p>
      </div>

      <ActivityLogsTable />
    </div>
  )
}
