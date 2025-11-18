/**
 * Blog Kategori API Test Script
 * 
 * Bu script blog kategori yönetimi API'lerini test eder.
 * 
 * Kullanım:
 * 1. .env dosyasında NEXTAUTH_SECRET ve DATABASE_URL ayarlandığından emin olun
 * 2. Admin kullanıcı oluşturun (scripts/create-admin.mjs)
 * 3. npx tsx test-blog-category-api.ts
 */

const BASE_URL = 'http://localhost:3000'

// Test için admin credentials (kendi admin bilgilerinizi kullanın)
const ADMIN_EMAIL = 'admin@example.com'
const ADMIN_PASSWORD = 'admin123'

let authCookie = ''
let createdCategoryId = ''

async function login() {
  console.log('🔐 Admin girişi yapılıyor...')
  
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

  const cookies = response.headers.get('set-cookie')
  if (cookies) {
    authCookie = cookies.split(';')[0]
    console.log('✅ Giriş başarılı\n')
  } else {
    console.error('❌ Giriş başarısız')
    process.exit(1)
  }
}

async function testCreateCategory() {
  console.log('📝 Test 1: Kategori Oluşturma')
  
  const categoryData = {
    name: 'Test Kategorisi',
    description: 'Bu bir test kategorisidir',
    icon: '🧪',
    color: '#FF5733',
    order: 10,
  }

  const response = await fetch(`${BASE_URL}/api/admin/blog/categories`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': authCookie,
    },
    body: JSON.stringify(categoryData),
  })

  const data = await response.json()
  
  if (response.ok && data.success) {
    createdCategoryId = data.data.id
    console.log('✅ Kategori başarıyla oluşturuldu')
    console.log('   ID:', data.data.id)
    console.log('   Slug:', data.data.slug)
    console.log('   İsim:', data.data.name)
  } else {
    console.error('❌ Kategori oluşturulamadı:', data.error)
  }
  console.log()
}

async function testGetCategories() {
  console.log('📋 Test 2: Kategori Listesi')
  
  const response = await fetch(`${BASE_URL}/api/admin/blog/categories`, {
    headers: {
      'Cookie': authCookie,
    },
  })

  const data = await response.json()
  
  if (response.ok && data.success) {
    console.log('✅ Kategori listesi alındı')
    console.log(`   Toplam ${data.data.length} kategori`)
    data.data.forEach((cat: any) => {
      console.log(`   - ${cat.name} (${cat._count.posts} yazı)`)
    })
  } else {
    console.error('❌ Kategori listesi alınamadı:', data.error)
  }
  console.log()
}

async function testUpdateCategory() {
  console.log('✏️  Test 3: Kategori Güncelleme')
  
  if (!createdCategoryId) {
    console.log('⚠️  Güncellenecek kategori yok, test atlanıyor\n')
    return
  }

  const updateData = {
    name: 'Test Kategorisi (Güncellendi)',
    description: 'Bu kategori güncellendi',
    color: '#00FF00',
  }

  const response = await fetch(`${BASE_URL}/api/admin/blog/categories/${createdCategoryId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': authCookie,
    },
    body: JSON.stringify(updateData),
  })

  const data = await response.json()
  
  if (response.ok && data.success) {
    console.log('✅ Kategori başarıyla güncellendi')
    console.log('   Yeni İsim:', data.data.name)
    console.log('   Yeni Renk:', data.data.color)
  } else {
    console.error('❌ Kategori güncellenemedi:', data.error)
  }
  console.log()
}

async function testDeleteCategoryWithPosts() {
  console.log('🚫 Test 4: Blog Yazısı Olan Kategoriyi Silme (Başarısız Olmalı)')
  
  // Önce bir kategori oluştur ve ona blog yazısı ekle
  // Bu test için mevcut bir kategori ID'si kullanılabilir
  // Şimdilik bu testi atlıyoruz
  console.log('⚠️  Bu test manuel olarak yapılmalı (blog yazısı olan kategori gerekli)\n')
}

async function testDeleteCategory() {
  console.log('🗑️  Test 5: Kategori Silme')
  
  if (!createdCategoryId) {
    console.log('⚠️  Silinecek kategori yok, test atlanıyor\n')
    return
  }

  const response = await fetch(`${BASE_URL}/api/admin/blog/categories/${createdCategoryId}`, {
    method: 'DELETE',
    headers: {
      'Cookie': authCookie,
    },
  })

  const data = await response.json()
  
  if (response.ok && data.success) {
    console.log('✅ Kategori başarıyla silindi')
  } else {
    console.error('❌ Kategori silinemedi:', data.error)
  }
  console.log()
}

async function testValidation() {
  console.log('🔍 Test 6: Validation Kontrolleri')
  
  // Geçersiz veri ile kategori oluşturmaya çalış
  const invalidData = {
    name: 'A', // Çok kısa
    color: 'invalid-color', // Geçersiz renk
  }

  const response = await fetch(`${BASE_URL}/api/admin/blog/categories`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': authCookie,
    },
    body: JSON.stringify(invalidData),
  })

  const data = await response.json()
  
  if (!response.ok && data.error) {
    console.log('✅ Validation çalışıyor (geçersiz veri reddedildi)')
    if (data.details) {
      console.log('   Hatalar:', data.details.map((e: any) => e.message).join(', '))
    }
  } else {
    console.error('❌ Validation çalışmıyor (geçersiz veri kabul edildi)')
  }
  console.log()
}

async function testDuplicateSlug() {
  console.log('🔄 Test 7: Duplicate Slug Kontrolü')
  
  // Aynı isimle iki kategori oluşturmaya çalış
  const categoryData = {
    name: 'Duplicate Test',
  }

  // İlk kategori
  const response1 = await fetch(`${BASE_URL}/api/admin/blog/categories`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': authCookie,
    },
    body: JSON.stringify(categoryData),
  })

  const data1 = await response1.json()
  let firstCategoryId = ''

  if (response1.ok && data1.success) {
    firstCategoryId = data1.data.id
    console.log('✅ İlk kategori oluşturuldu')

    // İkinci kategori (aynı isim)
    const response2 = await fetch(`${BASE_URL}/api/admin/blog/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': authCookie,
      },
      body: JSON.stringify(categoryData),
    })

    const data2 = await response2.json()

    if (!response2.ok && data2.error) {
      console.log('✅ Duplicate kontrolü çalışıyor (aynı isim reddedildi)')
    } else {
      console.error('❌ Duplicate kontrolü çalışmıyor')
    }

    // Temizlik
    await fetch(`${BASE_URL}/api/admin/blog/categories/${firstCategoryId}`, {
      method: 'DELETE',
      headers: {
        'Cookie': authCookie,
      },
    })
  }
  console.log()
}

async function runTests() {
  console.log('🧪 Blog Kategori API Testleri\n')
  console.log('=' .repeat(50))
  console.log()

  try {
    await login()
    await testCreateCategory()
    await testGetCategories()
    await testUpdateCategory()
    await testDeleteCategoryWithPosts()
    await testValidation()
    await testDuplicateSlug()
    await testDeleteCategory()

    console.log('=' .repeat(50))
    console.log('✅ Tüm testler tamamlandı!\n')
  } catch (error) {
    console.error('❌ Test hatası:', error)
    process.exit(1)
  }
}

runTests()
