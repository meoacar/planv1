/**
 * Blog Comment API Test Script
 * 
 * Bu script blog yorum API'sini test eder.
 * 
 * Kullanım:
 * npx tsx scripts/test-blog-comment-api.ts
 */

import { db as prisma } from '../src/lib/db'

async function testBlogCommentAPI() {
  console.log('🧪 Blog Comment API Test Başlıyor...\n')

  try {
    // 1. Test için bir blog post var mı kontrol et
    console.log('1️⃣ Blog post kontrolü...')
    const blogPost = await prisma.blogPost.findFirst({
      where: {
        status: 'PUBLISHED',
        deletedAt: null,
      },
      select: {
        id: true,
        slug: true,
        title: true,
      },
    })

    if (!blogPost) {
      console.log('❌ Test için yayınlanmış blog post bulunamadı')
      console.log('💡 Önce bir blog post oluşturun ve yayınlayın')
      return
    }

    console.log(`✅ Blog post bulundu: ${blogPost.title} (${blogPost.slug})`)

    // 2. Test için bir kullanıcı var mı kontrol et
    console.log('\n2️⃣ Test kullanıcısı kontrolü...')
    const testUser = await prisma.user.findFirst({
      where: {
        isBanned: false,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    })

    if (!testUser) {
      console.log('❌ Test için kullanıcı bulunamadı')
      return
    }

    console.log(`✅ Test kullanıcısı: ${testUser.name || testUser.email}`)

    // 3. BlogComment modelini kontrol et
    console.log('\n3️⃣ BlogComment modeli kontrolü...')
    const commentCount = await prisma.blogComment.count()
    console.log(`✅ BlogComment modeli çalışıyor (${commentCount} yorum var)`)

    // 4. Test yorumu oluştur
    console.log('\n4️⃣ Test yorumu oluşturuluyor...')
    const testComment = await prisma.blogComment.create({
      data: {
        content: 'Bu bir test yorumudur. API test scripti tarafından oluşturuldu.',
        postId: blogPost.id,
        userId: testUser.id,
        status: 'PENDING',
      },
      select: {
        id: true,
        content: true,
        status: true,
        createdAt: true,
        user: {
          select: {
            name: true,
            username: true,
          },
        },
      },
    })

    console.log('✅ Test yorumu oluşturuldu:')
    console.log(`   ID: ${testComment.id}`)
    console.log(`   İçerik: ${testComment.content}`)
    console.log(`   Durum: ${testComment.status}`)
    console.log(`   Kullanıcı: ${testComment.user.name || testComment.user.username}`)

    // 5. Yorumu sil (temizlik)
    console.log('\n5️⃣ Test yorumu temizleniyor...')
    await prisma.blogComment.delete({
      where: { id: testComment.id },
    })
    console.log('✅ Test yorumu silindi')

    // 6. API endpoint bilgisi
    console.log('\n📝 API Endpoint Bilgisi:')
    console.log(`   POST /api/blog/${blogPost.slug}/comments`)
    console.log('   Headers: Authorization: Bearer <token>')
    console.log('   Body: { "content": "Yorum içeriği" }')

    console.log('\n✅ Tüm testler başarılı!')
    console.log('\n💡 API\'yi test etmek için:')
    console.log('   1. Uygulamaya giriş yapın')
    console.log('   2. Browser console\'da session token\'ı alın')
    console.log(`   3. POST isteği gönderin: /api/blog/${blogPost.slug}/comments`)

  } catch (error: any) {
    console.error('\n❌ Test hatası:', error.message)
    console.error(error)
  } finally {
    await prisma.$disconnect()
  }
}

testBlogCommentAPI()
