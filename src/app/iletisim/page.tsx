import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/layout/footer'
import { ContactForm } from '@/components/contact-form'
import { Mail, Phone, MapPin, Clock, MessageCircle } from 'lucide-react'

export const metadata = {
  title: 'İletişim - ZayiflamaPlan',
  description: 'Bizimle iletişime geçin. Sorularınız için buradayız!',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-orange-500/5 blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-blue-500/5 via-cyan-500/5 to-teal-500/5 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-purple-600/10 via-pink-600/10 to-orange-600/10 border-b">
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 mb-6 backdrop-blur-sm">
            <MessageCircle className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Bize Ulaşın
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
            İletişim
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Sorularınız, önerileriniz veya geri bildirimleriniz için bizimle iletişime geçin. Size yardımcı olmaktan mutluluk duyarız!
          </p>
        </div>
      </div>
      
      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* İletişim Bilgileri */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-card/50 backdrop-blur-sm rounded-2xl border-2 border-border/50 p-6 hover:border-purple-500/50 transition-all">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2">E-posta</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Bize e-posta gönderin
                </p>
                <a href="mailto:info@zayiflamaplan.com" className="text-purple-600 hover:underline text-sm font-medium">
                  info@zayiflamaplan.com
                </a>
              </div>

              <div className="bg-card/50 backdrop-blur-sm rounded-2xl border-2 border-border/50 p-6 hover:border-purple-500/50 transition-all">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2">Çalışma Saatleri</h3>
                <p className="text-sm text-muted-foreground">
                  <strong>Hafta İçi:</strong> 09:00 - 18:00<br />
                  <strong>Hafta Sonu:</strong> 10:00 - 16:00
                </p>
              </div>

              <div className="bg-card/50 backdrop-blur-sm rounded-2xl border-2 border-border/50 p-6 hover:border-purple-500/50 transition-all">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mb-4">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2">Sosyal Medya</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Bizi takip edin
                </p>
                <div className="flex gap-2">
                  <a href="https://instagram.com/zayiflamaplan" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 flex items-center justify-center transition-colors">
                    📷
                  </a>
                  <a href="https://facebook.com/zayiflamaplan" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 flex items-center justify-center transition-colors">
                    📘
                  </a>
                  <a href="https://twitter.com/zayiflamaplan" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 flex items-center justify-center transition-colors">
                    🐦
                  </a>
                </div>
              </div>
            </div>

            {/* İletişim Formu */}
            <div className="lg:col-span-2">
              <div className="bg-card/50 backdrop-blur-sm rounded-3xl border-2 border-border/50 shadow-2xl p-8 md:p-10">
                <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Mesaj Gönderin
                </h2>
                <p className="text-muted-foreground mb-8">
                  Formu doldurun, size en kısa sürede dönüş yapalım.
                </p>
                
                <ContactForm />
              </div>
            </div>
          </div>

          {/* SSS Bölümü */}
          <div className="bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 rounded-3xl border border-purple-500/20 p-8 text-center">
            <h3 className="text-2xl font-bold mb-3">Sık Sorulan Sorular</h3>
            <p className="text-muted-foreground mb-6">
              Hızlı yanıtlar için SSS sayfamızı ziyaret edebilirsiniz
            </p>
            <a 
              href="/sss"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              SSS'ye Git →
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
