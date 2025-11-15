import { NextResponse } from 'next/server'
import { ApiResponse } from '@/types'

export function successResponse<T>(data: T, meta?: any) {
  const response: ApiResponse<T> = {
    success: true,
    data,
    meta,
  }
  return NextResponse.json(response)
}

export function errorResponse(
  code: string,
  message: string,
  status: number = 400
) {
  const response: ApiResponse = {
    success: false,
    error: {
      code,
      message,
    },
  }
  return NextResponse.json(response, { status })
}

export function unauthorizedResponse() {
  return errorResponse('UNAUTHORIZED', 'Giriş yapmalısınız', 401)
}

export function forbiddenResponse() {
  return errorResponse('FORBIDDEN', 'Bu işlem için yetkiniz yok', 403)
}

export function notFoundResponse(message: string = 'Bulunamadı') {
  return errorResponse('NOT_FOUND', message, 404)
}

export function validationErrorResponse(message: string) {
  return errorResponse('VALIDATION_ERROR', message, 400)
}

export function rateLimitResponse() {
  return errorResponse(
    'RATE_LIMIT',
    'Çok fazla istek. Lütfen daha sonra tekrar deneyin.',
    429
  )
}

export function serverErrorResponse(message: string = 'Sunucu hatası') {
  return errorResponse('SERVER_ERROR', message, 500)
}
