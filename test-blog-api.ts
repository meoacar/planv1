/**
 * Blog Admin API Test Script
 * 
 * Bu script blog admin API'lerini test eder.
 * Kullanım: npx tsx test-blog-api.ts
 */

const API_BASE = 'http://localhost:3000'

async function testBlogAPI() {
  console.log('🧪 Blog Admin API Test Başlıyor...\n')

  try {
    // 1. Blog oluştur (POST /api/admin/blog)
    console.log('1️⃣ Blog oluşturma testi...')
    const createResponse = await fetch(`${API_BASE}/api/admin/blog`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: 'Test Blog Yazısı',
        content: 'Bu bir test blog yazısıdır. İçerik en az 100 karakter olmalıdır. Bu yüzden biraz daha uzun bir metin yazıyoruz.',
        categoryId: 'test-category-id', // Gerçek bir kategori ID'si gerekli
        status: 'DRAFT',
      }),
    })

    if (!createResponse.ok) {
      console.error('❌ Blog oluşturma başarısız:', await createResponse.text())
    } else {
      const createData = await createResponse.json()
      console.log('✅ Blog oluşturuldu:', createData.data?.id)
      
      const blogId = createData.data?.id

      if (blogId) {
        // 2. Blog detay (GET /api/admin/blog/[id])
        console.log('\n2️⃣ Blog detay testi...')
        const detailResponse = await fetch(`${API_BASE}/api/admin/blog/${blogId}`)
        if (detailResponse.ok) {
          const detailData = await detailResponse.json()
          console.log('✅ Blog detay alındı:', detailData.data?.title)
        } else {
          console.error('❌ Blog detay alınamadı')
        }

        // 3. Blog güncelle (PUT /api/admin/blog/[id])
        console.log('\n3️⃣ Blog güncelleme testi...')
        const updateResponse = await fetch(`${API_BASE}/api/admin/blog/${blogId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: 'Güncellenmiş Test Blog Yazısı',
          }),
        })
        if (updateResponse.ok) {
          console.log('✅ Blog güncellendi')
        } else {
          console.error('❌ Blog güncellenemedi')
        }

        // 4. Blog yayınla (POST /api/admin/blog/[id]/publish)
        console.log('\n4️⃣ Blog yayınlama testi...')
        const publishResponse = await fetch(`${API_BASE}/api/admin/blog/${blogId}/publish`, {
          method: 'POST',
        })
        if (publishResponse.ok) {
          console.log('✅ Blog yayınlandı')
        } else {
          console.error('❌ Blog yayınlanamadı')
        }

        // 5. Blog öne çıkar (POST /api/admin/blog/[id]/feature)
        console.log('\n5️⃣ Blog öne çıkarma testi...')
        const featureResponse = await fetch(`${API_BASE}/api/admin/blog/${blogId}/feature`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            featured: true,
            featuredOrder: 1,
          }),
        })
        if (featureResponse.ok) {
          console.log('✅ Blog öne çıkarıldı')
        } else {
          console.error('❌ Blog öne çıkarılamadı')
        }

        // 6. Blog sil (DELETE /api/admin/blog/[id])
        console.log('\n6️⃣ Blog silme testi...')
        const deleteResponse = await fetch(`${API_BASE}/api/admin/blog/${blogId}`, {
          method: 'DELETE',
        })
        if (deleteResponse.ok) {
          console.log('✅ Blog silindi')
        } else {
          console.error('❌ Blog silinemedi')
        }
      }
    }

    // 7. Blog listesi (GET /api/admin/blog)
    console.log('\n7️⃣ Blog listesi testi...')
    const listResponse = await fetch(`${API_BASE}/api/admin/blog?page=1&limit=10`)
    if (listResponse.ok) {
      const listData = await listResponse.json()
      console.log('✅ Blog listesi alındı:', listData.pagination?.total, 'blog')
    } else {
      console.error('❌ Blog listesi alınamadı')
    }

    console.log('\n✨ Test tamamlandı!')

  } catch (error) {
    console.error('❌ Test hatası:', error)
  }
}

// Test'i çalıştır
testBlogAPI()
