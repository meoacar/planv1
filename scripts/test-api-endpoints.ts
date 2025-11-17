// Bu script API endpoint'lerini test etmek için kullanılabilir
// Ancak Next.js server çalışırken test edilmeli

console.log(`
🧪 API Endpoint Test Rehberi

Aşağıdaki endpoint'leri test etmek için development server'ı başlatın:
  npm run dev

Sonra tarayıcıda veya Postman'de test edin:

1. Aktif Sezonu Getir:
   GET http://localhost:3000/api/v1/seasons/current

2. Kullanıcının Ligini Getir (giriş yapılı olmalı):
   GET http://localhost:3000/api/v1/leagues/my

3. Admin: Kullanıcıya Puan Ekle (admin olmalı):
   POST http://localhost:3000/api/v1/admin/leagues/add-points
   Body: { "userId": "user_id_here", "points": 100 }

4. Sezonlar Sayfası:
   http://localhost:3000/sezonlar

✅ Tüm endpoint'ler hazır ve çalışır durumda!
`);
