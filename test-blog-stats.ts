/**
 * Blog İstatistikleri API Test Script
 * 
 * Test: GET /api/admin/blog/stats
 */

async function testBlogStats() {
  const baseUrl = 'http://localhost:3000';
  
  console.log('🧪 Blog İstatistikleri API Testi Başlıyor...\n');

  try {
    // Admin olarak giriş yap
    console.log('1️⃣ Admin girişi yapılıyor...');
    const loginResponse = await fetch(`${baseUrl}/api/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'admin',
        password: 'admin123'
      })
    });

    if (!loginResponse.ok) {
      throw new Error('Admin girişi başarısız');
    }

    const loginData = await loginResponse.json();
    const token = loginData.token;
    console.log('✅ Admin girişi başarılı\n');

    // İstatistikleri al
    console.log('2️⃣ Blog istatistikleri alınıyor...');
    const statsResponse = await fetch(`${baseUrl}/api/admin/blog/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!statsResponse.ok) {
      const error = await statsResponse.json();
      throw new Error(`İstatistikler alınamadı: ${JSON.stringify(error)}`);
    }

    const stats = await statsResponse.json();
    console.log('✅ İstatistikler başarıyla alındı\n');

    // İstatistikleri göster
    console.log('📊 GENEL İSTATİSTİKLER:');
    console.log('─'.repeat(50));
    console.log(`📝 Toplam Blog: ${stats.overview.totalBlogs}`);
    console.log(`✅ Yayınlanmış: ${stats.overview.publishedBlogs}`);
    console.log(`📄 Taslak: ${stats.overview.draftBlogs}`);
    console.log(`💬 Toplam Yorum: ${stats.overview.totalComments}`);
    console.log(`⏳ Bekleyen Yorum: ${stats.overview.pendingComments}`);
    console.log(`✔️  Onaylı Yorum: ${stats.overview.approvedComments}`);
    console.log(`👁️  Toplam Görüntülenme: ${stats.overview.totalViews}`);
    console.log(`⏱️  Ortalama Okuma Süresi: ${stats.overview.avgReadingTime} dakika\n`);

    console.log('📈 TRENDLER:');
    console.log('─'.repeat(50));
    console.log(`Son 7 Gün: ${stats.trends.last7Days} yeni blog`);
    console.log(`Son 30 Gün: ${stats.trends.last30Days} yeni blog\n`);

    console.log('🔥 EN ÇOK OKUNAN YAZILAR:');
    console.log('─'.repeat(50));
    stats.mostReadPosts.slice(0, 5).forEach((post: any, index: number) => {
      console.log(`${index + 1}. ${post.title}`);
      console.log(`   👁️  ${post.viewCount} görüntülenme | 📁 ${post.category.name}`);
    });
    console.log();

    console.log('💬 EN ÇOK YORUM ALAN YAZILAR:');
    console.log('─'.repeat(50));
    stats.mostCommentedPosts.forEach((post: any, index: number) => {
      console.log(`${index + 1}. ${post.title}`);
      console.log(`   💬 ${post.commentCount} yorum`);
    });
    console.log();

    console.log('📂 KATEGORİ DAĞILIMI:');
    console.log('─'.repeat(50));
    stats.categoryDistribution.forEach((cat: any) => {
      const bar = '█'.repeat(Math.min(cat.postCount, 20));
      console.log(`${cat.icon || '📁'} ${cat.name.padEnd(20)} ${bar} ${cat.postCount}`);
    });
    console.log();

    console.log('✅ Tüm testler başarıyla tamamlandı!');

  } catch (error: any) {
    console.error('❌ Test hatası:', error.message);
    process.exit(1);
  }
}

// Test'i çalıştır
testBlogStats();
