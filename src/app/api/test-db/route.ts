import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  const startTime = Date.now()
  
  try {
    // Test database connection
    await db.$queryRaw`SELECT 1 as test`
    
    // Get connection pool stats
    const blogCount = await db.blogPost.count()
    
    const duration = Date.now() - startTime
    
    return NextResponse.json({
      success: true,
      message: 'Veritabanı bağlantısı sağlıklı',
      stats: {
        blogCount,
        responseTime: `${duration}ms`,
        timestamp: new Date().toISOString(),
      }
    })
  } catch (error: any) {
    const duration = Date.now() - startTime
    
    return NextResponse.json({
      success: false,
      error: error.message,
      code: error.code,
      stats: {
        responseTime: `${duration}ms`,
        timestamp: new Date().toISOString(),
      }
    }, { status: 500 })
  }
}
