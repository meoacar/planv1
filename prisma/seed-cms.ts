import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedCMS() {
  console.log('🌱 CMS ve Footer verileri ekleniyor...')

  // Örnek Sayfalar
  const pages = [
    {
      slug: 'hakkimizda',
      title: 'Hakkımızda',
      content: `
        <h2>🌟 ZayiflamaPlan Nedir?</h2>
        <p>ZayiflamaPlan, gerçek insanların gerçek zayıflama deneyimlerini paylaştığı, topluluk destekli bir platformdur. Binlerce kişi burada hedeflerine ulaşıyor, deneyimlerini paylaşıyor ve birbirlerine ilham veriyor.</p>
        
        <p>Diyet listeleri, kısıtlayıcı programlar ve tek tip çözümler yerine, <strong>gerçek insanların gerçek başarı hikayelerini</strong> sunuyoruz. Çünkü biliyoruz ki, herkesin yolculuğu farklıdır ve en iyi motivasyon, benzer hedeflere sahip insanlardan gelir.</p>
        
        <h3>💪 Misyonumuz</h3>
        <p>Sağlıklı yaşam yolculuğunda insanları bir araya getirmek ve birbirlerinden ilham almalarını sağlamak. Kimsenin yalnız hissetmediği, herkesin desteklendiği bir topluluk oluşturmak.</p>
        
        <ul>
          <li><strong>Gerçek deneyimler:</strong> Profesyonel değil, gerçek insanların hikayeleri</li>
          <li><strong>Topluluk desteği:</strong> Gruplar, loncalar ve mesajlaşma ile sürekli motivasyon</li>
          <li><strong>Gamification:</strong> Rozetler, XP sistemi ve ödüllerle eğlenceli bir deneyim</li>
          <li><strong>Ücretsiz:</strong> Tüm özellikler herkese açık</li>
        </ul>
        
        <h3>🎯 Vizyonumuz</h3>
        <p>Türkiye'nin en büyük ve en destekleyici sağlıklı yaşam topluluğu olmak. Milyonlarca insanın hedeflerine ulaşmasına yardımcı olmak ve sağlıklı yaşamı herkes için erişilebilir kılmak.</p>
        
        <h3>📊 Rakamlarla Biz</h3>
        <ul>
          <li>15,000+ aktif kullanıcı</li>
          <li>2,500+ paylaşılan plan</li>
          <li>45,678 kg toplam kilo kaybı</li>
          <li>%98 kullanıcı memnuniyeti</li>
        </ul>
        
        <h2>🚀 Nasıl Başladık?</h2>
        <p>ZayiflamaPlan, kendi kilo verme yolculuğunda zorluk çeken ve internette gerçek, samimi deneyimler arayan bir grup arkadaş tarafından kuruldu. Profesyonel diyetisyenlerin pahalı programları yerine, gerçek insanların başarı hikayelerinin daha motive edici olduğunu fark ettik.</p>
        
        <p>2024 yılında küçük bir topluluk olarak başladık ve bugün binlerce insanın hayatına dokunuyoruz. Her gün yeni başarı hikayeleri ekleniyor, yeni dostluklar kuruluyor ve yeni hedeflere ulaşılıyor.</p>
        
        <h2>💝 Değerlerimiz</h2>
        <ul>
          <li><strong>Samimiyet:</strong> Gerçek deneyimler, gerçek sonuçlar</li>
          <li><strong>Destek:</strong> Kimse yalnız değil, hep birlikte başarıyoruz</li>
          <li><strong>Çeşitlilik:</strong> Her vücut tipi, her hedef değerlidir</li>
          <li><strong>Pozitiflik:</strong> Kısıtlama değil, sağlıklı yaşam</li>
          <li><strong>Gizlilik:</strong> Verileriniz güvende, paylaşımlarınız sizin kontrolünüzde</li>
        </ul>
      `,
      metaTitle: 'Hakkımızda - ZayiflamaPlan',
      metaDesc: 'ZayiflamaPlan hakkında bilgi edinin. Misyonumuz, vizyonumuz ve hikayemiz.',
      isPublished: true,
      status: 'published',
      sortOrder: 1,
      publishedAt: new Date(),
    },
    {
      slug: 'gizlilik-politikasi',
      title: 'Gizlilik Politikası',
      content: `
        <h2>Gizlilik Politikası</h2>
        <p>Son güncelleme: ${new Date().toLocaleDateString('tr-TR')}</p>
        
        <h3>1. Toplanan Bilgiler</h3>
        <p>Platformumuzu kullanırken aşağıdaki bilgileri topluyoruz:</p>
        <ul>
          <li>Hesap bilgileri (e-posta, kullanıcı adı)</li>
          <li>Profil bilgileri (boy, kilo, hedefler)</li>
          <li>Kullanım verileri</li>
        </ul>
        
        <h3>2. Bilgilerin Kullanımı</h3>
        <p>Topladığımız bilgileri şu amaçlarla kullanırız:</p>
        <ul>
          <li>Hizmet kalitesini artırmak</li>
          <li>Kişiselleştirilmiş deneyim sunmak</li>
          <li>Güvenlik sağlamak</li>
        </ul>
        
        <h3>3. Bilgi Güvenliği</h3>
        <p>Verilerinizi korumak için endüstri standardı güvenlik önlemleri kullanıyoruz.</p>
      `,
      metaTitle: 'Gizlilik Politikası - ZayiflamaPlan',
      metaDesc: 'ZayiflamaPlan gizlilik politikası. Verilerinizi nasıl topladığımız ve koruduğumuz hakkında bilgi.',
      isPublished: true,
      status: 'published',
      sortOrder: 2,
      publishedAt: new Date(),
    },
    {
      slug: 'kullanim-kosullari',
      title: 'Kullanım Koşulları',
      content: `
        <h2>Kullanım Koşulları</h2>
        <p>Son güncelleme: ${new Date().toLocaleDateString('tr-TR')}</p>
        
        <h3>1. Hizmet Kullanımı</h3>
        <p>ZayiflamaPlan'ı kullanarak aşağıdaki koşulları kabul etmiş olursunuz:</p>
        <ul>
          <li>18 yaşından büyük olmalısınız</li>
          <li>Doğru bilgiler paylaşmalısınız</li>
          <li>Topluluk kurallarına uymalısınız</li>
        </ul>
        
        <h3>2. İçerik Politikası</h3>
        <p>Paylaştığınız içerikler:</p>
        <ul>
          <li>Yasalara uygun olmalı</li>
          <li>Başkalarının haklarını ihlal etmemeli</li>
          <li>Yanıltıcı bilgi içermemeli</li>
        </ul>
        
        <h3>3. Sorumluluk Reddi</h3>
        <p>Platform sadece bilgi paylaşım amaçlıdır. Tıbbi tavsiye yerine geçmez.</p>
      `,
      metaTitle: 'Kullanım Koşulları - ZayiflamaPlan',
      metaDesc: 'ZayiflamaPlan kullanım koşulları ve kuralları.',
      isPublished: true,
      status: 'published',
      sortOrder: 3,
      publishedAt: new Date(),
    },
    {
      slug: 'iletisim',
      title: 'İletişim',
      content: `
        <h2>📬 Bize Ulaşın</h2>
        <p>Sorularınız, önerileriniz veya geri bildirimleriniz için bizimle iletişime geçebilirsiniz. Size en kısa sürede dönüş yapacağız!</p>
        
        <h3>📧 E-posta</h3>
        <p><strong>Genel Sorular:</strong> <a href="mailto:info@zayiflamaplan.com">info@zayiflamaplan.com</a></p>
        <p><strong>Teknik Destek:</strong> <a href="mailto:destek@zayiflamaplan.com">destek@zayiflamaplan.com</a></p>
        <p><strong>İş Birliği:</strong> <a href="mailto:isbirligi@zayiflamaplan.com">isbirligi@zayiflamaplan.com</a></p>
        
        <h3>🌐 Sosyal Medya</h3>
        <p>Bizi sosyal medyada takip edin, güncel kalın ve topluluğumuzun bir parçası olun!</p>
        <ul>
          <li><strong>Instagram:</strong> <a href="https://instagram.com/zayiflamaplan" target="_blank">@zayiflamaplan</a></li>
          <li><strong>Facebook:</strong> <a href="https://facebook.com/zayiflamaplan" target="_blank">ZayiflamaPlan</a></li>
          <li><strong>Twitter:</strong> <a href="https://twitter.com/zayiflamaplan" target="_blank">@zayiflamaplan</a></li>
          <li><strong>YouTube:</strong> <a href="https://youtube.com/@zayiflamaplan" target="_blank">ZayiflamaPlan</a></li>
        </ul>
        
        <h3>⏰ Çalışma Saatleri</h3>
        <p>Destek ekibimiz size yardımcı olmak için burada:</p>
        <ul>
          <li><strong>Hafta İçi:</strong> 09:00 - 18:00</li>
          <li><strong>Hafta Sonu:</strong> 10:00 - 16:00</li>
        </ul>
        <p><em>E-postalarınıza 24 saat içinde yanıt vermeye çalışıyoruz.</em></p>
        
        <h3>❓ Sık Sorulan Sorular</h3>
        <p>Hızlı yanıtlar için <a href="/sss">SSS sayfamızı</a> ziyaret edebilirsiniz. Çoğu sorunun yanıtını burada bulabilirsiniz.</p>
        
        <h3>🐛 Hata Bildirimi</h3>
        <p>Platformda bir hata mı buldunuz? Lütfen bize bildirin! Detaylı açıklama ile birlikte <a href="mailto:destek@zayiflamaplan.com">destek@zayiflamaplan.com</a> adresine yazabilirsiniz.</p>
        
        <h2>💡 Öneri ve Geri Bildirim</h2>
        <p>Platformumuzu daha iyi hale getirmek için fikirlerinizi bekliyoruz! Önerilerinizi <a href="mailto:info@zayiflamaplan.com">info@zayiflamaplan.com</a> adresine gönderebilirsiniz.</p>
      `,
      metaTitle: 'İletişim - ZayiflamaPlan',
      metaDesc: 'ZayiflamaPlan ile iletişime geçin. Sorularınız için bize ulaşın.',
      isPublished: true,
      status: 'published',
      sortOrder: 4,
      publishedAt: new Date(),
    },
  ]

  for (const page of pages) {
    await prisma.page.upsert({
      where: { slug: page.slug },
      update: page,
      create: page,
    })
    console.log(`✅ Sayfa oluşturuldu: ${page.title}`)
  }

  // Footer Linkleri
  const footerLinks = [
    // Şirket
    { title: 'Hakkımızda', url: '/hakkimizda', column: 'company', sortOrder: 1 },
    { title: 'Blog', url: '/blog', column: 'company', sortOrder: 2 },
    { title: 'Kariyer', url: '/kariyer', column: 'company', sortOrder: 3 },
    
    // Destek
    { title: 'Yardım Merkezi', url: '/yardim', column: 'support', sortOrder: 1 },
    { title: 'SSS', url: '/sss', column: 'support', sortOrder: 2 },
    { title: 'İletişim', url: '/iletisim', column: 'support', sortOrder: 3 },
    
    // Yasal
    { title: 'Gizlilik Politikası', url: '/gizlilik-politikasi', column: 'legal', sortOrder: 1 },
    { title: 'Kullanım Koşulları', url: '/kullanim-kosullari', column: 'legal', sortOrder: 2 },
    { title: 'Çerez Politikası', url: '/cerez-politikasi', column: 'legal', sortOrder: 3 },
    
    // Topluluk
    { title: 'Topluluk Kuralları', url: '/topluluk-kurallari', column: 'community', sortOrder: 1 },
    { title: 'Başarı Hikayeleri', url: '/basari-hikayeleri', column: 'community', sortOrder: 2 },
    { title: 'Forum', url: '/forum', column: 'community', sortOrder: 3 },
  ]

  for (const link of footerLinks) {
    await prisma.footerLink.create({
      data: {
        ...link,
        isActive: true,
        openInNew: false,
      },
    })
  }
  console.log(`✅ ${footerLinks.length} footer linki oluşturuldu`)

  // Sosyal Medya Linkleri
  const socialLinks = [
    { platform: 'instagram', url: 'https://instagram.com/zayiflamaplan', icon: '📷', sortOrder: 1 },
    { platform: 'facebook', url: 'https://facebook.com/zayiflamaplan', icon: '📘', sortOrder: 2 },
    { platform: 'twitter', url: 'https://twitter.com/zayiflamaplan', icon: '🐦', sortOrder: 3 },
    { platform: 'youtube', url: 'https://youtube.com/@zayiflamaplan', icon: '📺', sortOrder: 4 },
  ]

  for (const social of socialLinks) {
    await prisma.footerSocial.create({
      data: {
        ...social,
        isActive: true,
      },
    })
  }
  console.log(`✅ ${socialLinks.length} sosyal medya linki oluşturuldu`)

  // Footer Ayarları
  const footerSettings = [
    {
      key: 'footerDescription',
      value: 'Gerçek insanların gerçek zayıflama planlarını paylaştığı, topluluk destekli platform. Sağlıklı yaşam yolculuğunda yanınızdayız!',
      description: 'Footer logo altında görünecek açıklama',
    },
    {
      key: 'copyrightText',
      value: `© ${new Date().getFullYear()} ZayiflamaPlan. Tüm hakları saklıdır.`,
      description: 'Footer alt kısmında görünecek telif hakkı metni',
    },
  ]

  for (const setting of footerSettings) {
    await prisma.footerSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    })
  }
  console.log(`✅ ${footerSettings.length} footer ayarı oluşturuldu`)

  console.log('✨ CMS ve Footer verileri başarıyla eklendi!')
}

seedCMS()
  .catch((e) => {
    console.error('❌ Hata:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
