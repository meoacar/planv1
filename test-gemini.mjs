import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = 'AIzaSyC24B5flx2C-OLJvfEQbTpJH89FSq27eF4';

console.log('🧪 Gemini API Test Başlıyor...\n');
console.log('API Key:', GEMINI_API_KEY.substring(0, 20) + '...\n');

try {
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' }); // Yeni model

  console.log('📤 Gemini\'ye istek gönderiliyor...');
  
  const result = await model.generateContent('Merhaba, nasılsın? Kısa yanıt ver.');
  const response = await result.response;
  const text = response.text();

  console.log('\n✅ BAŞARILI! Gemini API çalışıyor!\n');
  console.log('📥 Yanıt:', text);
  console.log('\n🎉 Test tamamlandı!');

} catch (error) {
  console.error('\n❌ HATA! Gemini API çalışmıyor!\n');
  console.error('Hata detayı:', error.message);
  
  if (error.message.includes('API_KEY_INVALID')) {
    console.error('\n💡 Çözüm: API key geçersiz, yeni key alın:');
    console.error('   https://makersuite.google.com/app/apikey');
  } else if (error.message.includes('RATE_LIMIT')) {
    console.error('\n💡 Çözüm: API limiti aşıldı, biraz bekleyin.');
  } else if (error.message.includes('quota')) {
    console.error('\n💡 Çözüm: Ücretsiz kota dolmuş olabilir.');
  }
  
  process.exit(1);
}
