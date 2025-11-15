import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const session = await auth()
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'all'
    const format = searchParams.get('format') || 'json'

    let data: any = {}

    // Veri tipine göre export
    if (type === 'all' || type === 'users') {
      data.users = await db.user.findMany({
        select: {
          id: true,
          email: true,
          username: true,
          name: true,
          role: true,
          createdAt: true,
          currentWeight: true,
          targetWeight: true,
          height: true,
        },
      })
    }

    if (type === 'all' || type === 'plans') {
      data.plans = await db.plan.findMany({
        include: {
          author: {
            select: {
              username: true,
              name: true,
            },
          },
          days: true,
        },
      })
    }

    if (type === 'all' || type === 'comments') {
      data.comments = await db.comment.findMany({
        include: {
          author: {
            select: {
              username: true,
              name: true,
            },
          },
        },
      })
    }

    if (type === 'all' || type === 'settings') {
      data.settings = await db.setting.findMany()
    }

    // Format'a göre response
    if (format === 'csv') {
      // CSV export (basit versiyon)
      const csv = convertToCSV(data)
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="export-${type}-${Date.now()}.csv"`,
        },
      })
    }

    // JSON export (default)
    const json = JSON.stringify(data, null, 2)
    return new NextResponse(json, {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="export-${type}-${Date.now()}.json"`,
      },
    })
  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json({ error: 'Export failed' }, { status: 500 })
  }
}

function convertToCSV(data: any): string {
  // Basit CSV converter
  const items = data.users || data.plans || data.comments || []
  if (items.length === 0) return ''

  const headers = Object.keys(items[0]).join(',')
  const rows = items.map((item: any) => 
    Object.values(item).map(val => 
      typeof val === 'object' ? JSON.stringify(val) : val
    ).join(',')
  )

  return [headers, ...rows].join('\n')
}
