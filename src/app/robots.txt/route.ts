import { getSetting } from '@/lib/settings'

export async function GET() {
  const robotsTxt = await getSetting(
    'robotsTxt',
    `User-agent: *
Allow: /

Sitemap: ${await getSetting('siteUrl', 'https://zayiflamaplan.com')}/sitemap.xml`
  )

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
    },
  })
}
