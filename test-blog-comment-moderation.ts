/**
 * Blog Yorum Moderasyon API Test Script
 * 
 * Bu script blog yorum moderasyon API'lerini test eder:
 * - GET /api/admin/blog/comments - Bekleyen yorumları listele
 * - PUT /api/admin/blog/comments/[id] - Yorum durumunu güncelle
 */

const BASE_URL = 'http://localhost:3000'

// Admin kullanıcı bilgileri (gerçek admin credentials ile değiştirin)
const ADMIN_EMAIL = 'admin@example.com'
const ADMIN_PASSWORD = 'admin123'

interface TestResult {
  test: string
  status: 'PASS' | 'FAIL'
  message: string
  data?: any
}

const results: TestResult[] = []

async function login(): Promise<string | null> {
  try {
    const response = await fetch(`${BASE_URL}/api/auth/callback/credentials`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
      }),
    })

    if (!response.ok) {
      console.error('Login failed:', response.status)
      return null
    }

    // Cookie'den session token'ı al
    const cookies = response.headers.get('set-cookie')
    return cookies
  } catch (error) {
    console.error('Login error:', error)
    return null
  }
}

async function testGetComments(sessionCookie: string) {
  console.log('\n🧪 Test: GET /api/admin/blog/comments (Bekleyen yorumlar)')

  try {
    const response = await fetch(`${BASE_URL}/api/admin/blog/comments?status=PENDING&page=1&limit=10`, {
      headers: {
        Cookie: sessionCookie,
      },
    })

    const data = await response.json()

    if (response.ok && data.success) {
      results.push({
        test: 'GET /api/admin/blog/comments',
        status: 'PASS',
        message: `${data.data.length} bekleyen yorum bulundu`,
        data: {
          total: data.pagination.total,
          comments: data.data.slice(0, 2), // İlk 2 yorumu göster
        },
      })
      console.log('✅ PASS:', `${data.data.length} bekleyen yorum bulundu`)
      return data.data[0]?.id // İlk yorumun ID'sini döndür
    } else {
      results.push({
        test: 'GET /api/admin/blog/comments',
        status: 'FAIL',
        message: data.error || 'Bilinmeyen hata',
      })
      console.log('❌ FAIL:', data.error)
      return null
    }
  } catch (error: any) {
    results.push({
      test: 'GET /api/admin/blog/comments',
      status: 'FAIL',
      message: error.message,
    })
    console.log('❌ FAIL:', error.message)
    return null
  }
}

async function testGetCommentsByStatus(sessionCookie: string, status: string) {
  console.log(`\n🧪 Test: GET /api/admin/blog/comments?status=${status}`)

  try {
    const response = await fetch(`${BASE_URL}/api/admin/blog/comments?status=${status}&page=1&limit=10`, {
      headers: {
        Cookie: sessionCookie,
      },
    })

    const data = await response.json()

    if (response.ok && data.success) {
      results.push({
        test: `GET /api/admin/blog/comments?status=${status}`,
        status: 'PASS',
        message: `${data.data.length} ${status} yorum bulundu`,
      })
      console.log('✅ PASS:', `${data.data.length} ${status} yorum bulundu`)
    } else {
      results.push({
        test: `GET /api/admin/blog/comments?status=${status}`,
        status: 'FAIL',
        message: data.error || 'Bilinmeyen hata',
      })
      console.log('❌ FAIL:', data.error)
    }
  } catch (error: any) {
    results.push({
      test: `GET /api/admin/blog/comments?status=${status}`,
      status: 'FAIL',
      message: error.message,
    })
    console.log('❌ FAIL:', error.message)
  }
}

async function testApproveComment(sessionCookie: string, commentId: string) {
  console.log('\n🧪 Test: PUT /api/admin/blog/comments/[id] (Onayla)')

  try {
    const response = await fetch(`${BASE_URL}/api/admin/blog/comments/${commentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Cookie: sessionCookie,
      },
      body: JSON.stringify({
        status: 'APPROVED',
      }),
    })

    const data = await response.json()

    if (response.ok && data.success) {
      results.push({
        test: 'PUT /api/admin/blog/comments/[id] (APPROVED)',
        status: 'PASS',
        message: data.message,
        data: data.data,
      })
      console.log('✅ PASS:', data.message)
    } else {
      results.push({
        test: 'PUT /api/admin/blog/comments/[id] (APPROVED)',
        status: 'FAIL',
        message: data.error || 'Bilinmeyen hata',
      })
      console.log('❌ FAIL:', data.error)
    }
  } catch (error: any) {
    results.push({
      test: 'PUT /api/admin/blog/comments/[id] (APPROVED)',
      status: 'FAIL',
      message: error.message,
    })
    console.log('❌ FAIL:', error.message)
  }
}

async function testRejectComment(sessionCookie: string, commentId: string) {
  console.log('\n🧪 Test: PUT /api/admin/blog/comments/[id] (Reddet)')

  try {
    const response = await fetch(`${BASE_URL}/api/admin/blog/comments/${commentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Cookie: sessionCookie,
      },
      body: JSON.stringify({
        status: 'REJECTED',
      }),
    })

    const data = await response.json()

    if (response.ok && data.success) {
      results.push({
        test: 'PUT /api/admin/blog/comments/[id] (REJECTED)',
        status: 'PASS',
        message: data.message,
      })
      console.log('✅ PASS:', data.message)
    } else {
      results.push({
        test: 'PUT /api/admin/blog/comments/[id] (REJECTED)',
        status: 'FAIL',
        message: data.error || 'Bilinmeyen hata',
      })
      console.log('❌ FAIL:', data.error)
    }
  } catch (error: any) {
    results.push({
      test: 'PUT /api/admin/blog/comments/[id] (REJECTED)',
      status: 'FAIL',
      message: error.message,
    })
    console.log('❌ FAIL:', error.message)
  }
}

async function testMarkAsSpam(sessionCookie: string, commentId: string) {
  console.log('\n🧪 Test: PUT /api/admin/blog/comments/[id] (Spam)')

  try {
    const response = await fetch(`${BASE_URL}/api/admin/blog/comments/${commentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Cookie: sessionCookie,
      },
      body: JSON.stringify({
        status: 'SPAM',
      }),
    })

    const data = await response.json()

    if (response.ok && data.success) {
      results.push({
        test: 'PUT /api/admin/blog/comments/[id] (SPAM)',
        status: 'PASS',
        message: data.message,
      })
      console.log('✅ PASS:', data.message)
    } else {
      results.push({
        test: 'PUT /api/admin/blog/comments/[id] (SPAM)',
        status: 'FAIL',
        message: data.error || 'Bilinmeyen hata',
      })
      console.log('❌ FAIL:', data.error)
    }
  } catch (error: any) {
    results.push({
      test: 'PUT /api/admin/blog/comments/[id] (SPAM)',
      status: 'FAIL',
      message: error.message,
    })
    console.log('❌ FAIL:', error.message)
  }
}

async function testInvalidCommentId(sessionCookie: string) {
  console.log('\n🧪 Test: PUT /api/admin/blog/comments/[id] (Geçersiz ID)')

  try {
    const response = await fetch(`${BASE_URL}/api/admin/blog/comments/invalid-id`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Cookie: sessionCookie,
      },
      body: JSON.stringify({
        status: 'APPROVED',
      }),
    })

    const data = await response.json()

    if (response.status === 404 && data.error) {
      results.push({
        test: 'PUT /api/admin/blog/comments/[id] (Invalid ID)',
        status: 'PASS',
        message: '404 hatası doğru döndü',
      })
      console.log('✅ PASS: 404 hatası doğru döndü')
    } else {
      results.push({
        test: 'PUT /api/admin/blog/comments/[id] (Invalid ID)',
        status: 'FAIL',
        message: 'Beklenen 404 hatası dönmedi',
      })
      console.log('❌ FAIL: Beklenen 404 hatası dönmedi')
    }
  } catch (error: any) {
    results.push({
      test: 'PUT /api/admin/blog/comments/[id] (Invalid ID)',
      status: 'FAIL',
      message: error.message,
    })
    console.log('❌ FAIL:', error.message)
  }
}

async function testUnauthorizedAccess() {
  console.log('\n🧪 Test: Yetkisiz erişim kontrolü')

  try {
    const response = await fetch(`${BASE_URL}/api/admin/blog/comments`)

    const data = await response.json()

    if (response.status === 401 && data.error) {
      results.push({
        test: 'Unauthorized Access',
        status: 'PASS',
        message: '401 hatası doğru döndü',
      })
      console.log('✅ PASS: 401 hatası doğru döndü')
    } else {
      results.push({
        test: 'Unauthorized Access',
        status: 'FAIL',
        message: 'Beklenen 401 hatası dönmedi',
      })
      console.log('❌ FAIL: Beklenen 401 hatası dönmedi')
    }
  } catch (error: any) {
    results.push({
      test: 'Unauthorized Access',
      status: 'FAIL',
      message: error.message,
    })
    console.log('❌ FAIL:', error.message)
  }
}

async function runTests() {
  console.log('🚀 Blog Yorum Moderasyon API Testleri Başlıyor...\n')
  console.log('=' .repeat(60))

  // 1. Yetkisiz erişim testi
  await testUnauthorizedAccess()

  // 2. Admin login
  console.log('\n🔐 Admin girişi yapılıyor...')
  const sessionCookie = await login()

  if (!sessionCookie) {
    console.error('\n❌ Admin girişi başarısız! Testler durduruluyor.')
    console.log('\n⚠️  Not: Admin kullanıcı bilgilerini güncelleyin:')
    console.log(`   - Email: ${ADMIN_EMAIL}`)
    console.log(`   - Password: ${ADMIN_PASSWORD}`)
    return
  }

  console.log('✅ Admin girişi başarılı')

  // 3. Bekleyen yorumları listele
  const firstCommentId = await testGetComments(sessionCookie)

  // 4. Farklı statuslara göre listele
  await testGetCommentsByStatus(sessionCookie, 'APPROVED')
  await testGetCommentsByStatus(sessionCookie, 'REJECTED')
  await testGetCommentsByStatus(sessionCookie, 'SPAM')

  // 5. Yorum moderasyon testleri (eğer yorum varsa)
  if (firstCommentId) {
    await testApproveComment(sessionCookie, firstCommentId)
    await testRejectComment(sessionCookie, firstCommentId)
    await testMarkAsSpam(sessionCookie, firstCommentId)
  } else {
    console.log('\n⚠️  Bekleyen yorum bulunamadı, moderasyon testleri atlanıyor')
  }

  // 6. Geçersiz ID testi
  await testInvalidCommentId(sessionCookie)

  // Sonuçları yazdır
  console.log('\n' + '='.repeat(60))
  console.log('📊 TEST SONUÇLARI')
  console.log('='.repeat(60))

  const passCount = results.filter((r) => r.status === 'PASS').length
  const failCount = results.filter((r) => r.status === 'FAIL').length

  results.forEach((result) => {
    const icon = result.status === 'PASS' ? '✅' : '❌'
    console.log(`${icon} ${result.test}: ${result.message}`)
  })

  console.log('\n' + '='.repeat(60))
  console.log(`Toplam: ${results.length} test`)
  console.log(`✅ Başarılı: ${passCount}`)
  console.log(`❌ Başarısız: ${failCount}`)
  console.log('='.repeat(60))

  if (failCount === 0) {
    console.log('\n🎉 Tüm testler başarılı!')
  } else {
    console.log('\n⚠️  Bazı testler başarısız oldu. Lütfen kontrol edin.')
  }
}

// Testleri çalıştır
runTests().catch(console.error)
