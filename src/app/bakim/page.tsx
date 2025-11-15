import { getSetting } from '@/lib/settings'
import { Wrench } from 'lucide-react'

export default async function MaintenancePage() {
  const maintenanceMessage = await getSetting(
    'maintenanceMessage',
    'Site şu anda bakımda. Lütfen daha sonra tekrar deneyin.'
  )
  const maintenanceTitle = await getSetting('maintenanceTitle', 'Bakım Modu')

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 text-center">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
            <Wrench className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {maintenanceTitle}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {maintenanceMessage}
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            En kısa sürede geri döneceğiz
          </p>
        </div>
      </div>
    </div>
  )
}
