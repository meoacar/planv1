import { db } from './db'

// Cache for settings (in-memory)
let settingsCache: Record<string, string> | null = null
let cacheTime: number = 0
const CACHE_DURATION = 60 * 1000 // 1 minute

export async function getSettings(): Promise<Record<string, string>> {
  // Return cached settings if still valid
  if (settingsCache && Date.now() - cacheTime < CACHE_DURATION) {
    return settingsCache
  }

  // Fetch from database
  const settings = await db.setting.findMany()
  
  // Convert to key-value object
  const settingsObj: Record<string, string> = {}
  settings.forEach(setting => {
    settingsObj[setting.key] = setting.value
  })

  // Set defaults if not found
  if (!settingsObj.siteName) settingsObj.siteName = 'ZayiflamaPlan'
  if (!settingsObj.siteDescription) settingsObj.siteDescription = 'Gerçek insanların gerçek zayıflama planları'
  
  // Update cache
  settingsCache = settingsObj
  cacheTime = Date.now()
  
  return settingsObj
}

export async function getSetting(key: string, defaultValue: string = ''): Promise<string> {
  const settings = await getSettings()
  return settings[key] || defaultValue
}

// Clear cache (call this after updating settings)
export function clearSettingsCache() {
  settingsCache = null
  cacheTime = 0
}
