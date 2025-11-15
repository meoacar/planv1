import { getSettings } from './actions'
import { SettingsForm } from '@/components/admin/settings-form'

export default async function AdminSettingsPage() {
  const settings = await getSettings()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Ayarlar</h1>
        <p className="text-muted-foreground">
          Platform ayarlarını yönet
        </p>
      </div>

      <SettingsForm initialSettings={settings} />
    </div>
  )
}
