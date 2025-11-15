import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title') || 'ZayiflamaPlan'
  const author = searchParams.get('author') || ''
  const result = searchParams.get('result') || ''

  // SVG template
  const svg = `
    <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
        </linearGradient>
      </defs>
      
      <rect width="1200" height="630" fill="url(#bgGradient)"/>
      
      <rect x="60" y="60" width="1080" height="510" rx="24" fill="white" opacity="0.95"/>
      
      <text x="600" y="180" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="#1e293b" text-anchor="middle">
        ${escapeXml(title.substring(0, 50))}
      </text>
      
      ${author ? `
      <text x="150" y="400" font-family="Arial, sans-serif" font-size="24" fill="#64748b">
        Yazan: ${escapeXml(author)}
      </text>
      ` : ''}
      
      ${result ? `
      <text x="1050" y="400" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="#10b981" text-anchor="end">
        ${escapeXml(result)}
      </text>
      ` : ''}
      
      <line x1="150" y1="450" x2="1050" y2="450" stroke="#e2e8f0" stroke-width="2"/>
      
      <text x="150" y="510" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="#667eea">
        ZayiflamaPlan
      </text>
      
      <text x="1050" y="510" font-family="Arial, sans-serif" font-size="20" fill="#94a3b8" text-anchor="end">
        Gerçek İnsanların Gerçek Planları
      </text>
    </svg>
  `

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
