import { NextRequest, NextResponse } from 'next/server'
import { UserService } from '@/services/user.service'
import { registerSchema } from '@/validations/auth.schema'
import { rateLimit } from '@/lib/redis'

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const ip = req.headers.get('x-forwarded-for') || 'unknown'
    const rateLimitKey = `register:${ip}`
    const { success } = await rateLimit(rateLimitKey, 5, 900) // 5 attempts per 15 min

    if (!success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'RATE_LIMIT',
            message: 'Çok fazla kayıt denemesi. Lütfen 15 dakika sonra tekrar deneyin.',
          },
        },
        { status: 429 }
      )
    }

    const body = await req.json()

    // Validate
    const validatedData = registerSchema.parse(body)

    // Create user
    const user = await UserService.createUser(validatedData)

    return NextResponse.json({
      success: true,
      data: user,
    })
  } catch (error: any) {
    console.error('Register error:', error)

    if (error.name === 'ZodError') {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: error.errors[0].message,
          },
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'REGISTER_ERROR',
          message: error.message || 'Kayıt sırasında bir hata oluştu',
        },
      },
      { status: 400 }
    )
  }
}
