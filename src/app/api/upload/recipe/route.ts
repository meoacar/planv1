import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { uploadFile } from '@/lib/upload'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Giriş yapmalısınız',
          },
        },
        { status: 401 }
      )
    }

    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NO_FILE',
            message: 'Dosya bulunamadı',
          },
        },
        { status: 400 }
      )
    }

    const result = await uploadFile(file, 'recipes')

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UPLOAD_ERROR',
            message: result.error || 'Dosya yüklenemedi',
          },
        },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        url: result.url,
      },
    })
  } catch (error: any) {
    console.error('Upload error:', error)

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'UPLOAD_ERROR',
          message: error.message || 'Dosya yüklenirken hata oluştu',
        },
      },
      { status: 500 }
    )
  }
}
