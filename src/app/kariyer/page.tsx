import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/layout/footer'
import { 
  Briefcase, 
  Users, 
  TrendingUp, 
  Heart, 
  ArrowRight, 
  CheckCircle2,
  Sparkles,
  Rocket,
  Code,
  Palette,
  MessageCircle,
  Globe,
  Zap,
  Star,
  Award,
  Target,
  BookOpen
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Kariyer | Zayıflama Planım',
  description: 'Zayıflama Planım ekibine katıl! Açık pozisyonlarımızı incele ve başvur.',
}

export default function KariyerPage() {
  const positions = [
    {
      title: 'Senior Full Stack Developer',
      department: 'Yazılım',
      type: 'Tam Zamanlı',
      location: 'Uzaktan',
      icon: Code,
      isOpen: true,
      openings: 2,
      experience: '3+ yıl',
      description: 'Next.js, React, TypeScript ve Node.js konularında deneyimli, sağlık teknolojileri alanında çalışmak isteyen geliştiriciler arıyoruz. Ölçeklenebilir sistemler geliştirme deneyimi olan, modern web teknolojilerine hakim, temiz kod yazan ve takım çalışmasına yatkın geliştiriciler aramızda olsun!',
      responsibilities: [
        'Yeni özellikler geliştirme ve mevcut sistemleri iyileştirme',
        'API tasarımı ve veritabanı optimizasyonu',
        'Code review ve teknik mentorluk',
        'Performans optimizasyonu ve güvenlik iyileştirmeleri'
      ],
      skills: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL', 'Redis', 'REST API', 'Git'],
    },
    {
      title: 'Frontend Developer',
      department: 'Yazılım',
      type: 'Tam Zamanlı',
      location: 'Uzaktan',
      icon: Code,
      isOpen: true,
      openings: 1,
      experience: '2+ yıl',
      description: 'Modern frontend teknolojileri ile kullanıcı dostu, performanslı ve responsive arayüzler geliştirmek isteyen geliştiriciler arıyoruz. React ve Next.js konusunda deneyimli, animasyonlar ve kullanıcı deneyimi konusunda tutkulu geliştiriciler aramızda olsun!',
      responsibilities: [
        'Responsive ve erişilebilir UI componentleri geliştirme',
        'Animasyon ve micro-interaction tasarımı',
        'Performance optimization ve SEO iyileştirmeleri',
        'Design system ve component library geliştirme'
      ],
      skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Responsive Design'],
    },
    {
      title: 'Backend Developer',
      department: 'Yazılım',
      type: 'Tam Zamanlı',
      location: 'Uzaktan',
      icon: Code,
      isOpen: true,
      openings: 1,
      experience: '2+ yıl',
      description: 'Ölçeklenebilir backend sistemleri geliştirmek isteyen, API tasarımı ve veritabanı yönetimi konusunda deneyimli geliştiriciler arıyoruz. Mikroservis mimarisi, caching stratejileri ve güvenlik konularında bilgi sahibi geliştiriciler aramızda olsun!',
      responsibilities: [
        'RESTful API geliştirme ve dokümantasyon',
        'Veritabanı tasarımı ve optimizasyonu',
        'Caching stratejileri ve Redis entegrasyonu',
        'Güvenlik ve authentication sistemleri'
      ],
      skills: ['Node.js', 'TypeScript', 'Prisma', 'PostgreSQL', 'Redis', 'JWT', 'API Design'],
    },
    {
      title: 'UI/UX Designer',
      department: 'Tasarım',
      type: 'Tam Zamanlı',
      location: 'Uzaktan',
      icon: Palette,
      isOpen: true,
      openings: 1,
      experience: '2+ yıl',
      description: 'Kullanıcı deneyimi odaklı, modern ve erişilebilir arayüzler tasarlayabilen, Figma konusunda uzman tasarımcılar arıyoruz. User research, wireframing, prototyping ve usability testing konularında deneyimli, detaylara önem veren tasarımcılar aramızda olsun!',
      responsibilities: [
        'User research ve persona oluşturma',
        'Wireframe, mockup ve prototip tasarımı',
        'Design system ve component library yönetimi',
        'Usability testing ve kullanıcı geri bildirimi analizi'
      ],
      skills: ['Figma', 'UI Design', 'UX Research', 'Prototyping', 'Design Systems', 'User Testing'],
    },
    {
      title: 'Product Designer',
      department: 'Tasarım',
      type: 'Tam Zamanlı',
      location: 'Uzaktan',
      icon: Palette,
      isOpen: false,
      openings: 0,
      experience: '3+ yıl',
      description: 'Ürün tasarımı ve stratejisi konusunda deneyimli, kullanıcı ihtiyaçlarını iş hedefleriyle dengeleyebilen tasarımcılar arıyoruz.',
      responsibilities: [
        'Ürün stratejisi ve roadmap oluşturma',
        'Cross-functional takımlarla işbirliği',
        'Design sprint ve workshop yönetimi',
        'Metrics ve analytics ile tasarım kararları alma'
      ],
      skills: ['Product Strategy', 'Design Thinking', 'Figma', 'Analytics', 'A/B Testing'],
    },
    {
      title: 'Diyetisyen',
      department: 'İçerik',
      type: 'Yarı Zamanlı',
      location: 'Uzaktan',
      icon: Heart,
      isOpen: true,
      openings: 2,
      experience: '1+ yıl',
      description: 'Beslenme planları oluşturacak, kullanıcı sorularını yanıtlayacak ve içerik üretecek diyetisyenler arıyoruz. Güncel beslenme trendlerini takip eden, empati kurabilen ve dijital platformlarda çalışmaya istekli diyetisyenler aramızda olsun!',
      responsibilities: [
        'Kişiselleştirilmiş beslenme planları oluşturma',
        'Kullanıcı sorularını yanıtlama ve danışmanlık',
        'Blog içerikleri ve tarif önerileri hazırlama',
        'Beslenme webinarları ve canlı yayınlar düzenleme'
      ],
      skills: ['Beslenme', 'İçerik Üretimi', 'Danışmanlık', 'Sosyal Medya', 'Sunum Becerileri'],
    },
    {
      title: 'Content Writer',
      department: 'İçerik',
      type: 'Tam Zamanlı',
      location: 'Uzaktan',
      icon: BookOpen,
      isOpen: true,
      openings: 1,
      experience: '1+ yıl',
      description: 'Sağlık, beslenme ve fitness konularında içerik üretecek, SEO dostu makaleler yazacak ve sosyal medya içerikleri oluşturacak yazarlar arıyoruz. Yaratıcı, araştırmacı ve hedef kitleye uygun ton kullanabilen yazarlar aramızda olsun!',
      responsibilities: [
        'Blog makaleleri ve rehberler yazma',
        'SEO optimizasyonu ve keyword research',
        'Sosyal medya içerikleri oluşturma',
        'Newsletter ve email kampanyaları hazırlama'
      ],
      skills: ['Copywriting', 'SEO', 'Content Strategy', 'Social Media', 'Research'],
    },
    {
      title: 'Community Manager',
      department: 'Topluluk',
      type: 'Tam Zamanlı',
      location: 'Uzaktan',
      icon: MessageCircle,
      isOpen: true,
      openings: 1,
      experience: '2+ yıl',
      description: 'Topluluğumuzu yönetecek, etkinlikler düzenleyecek ve kullanıcı etkileşimini artıracak deneyimli yöneticiler arıyoruz. Sosyal medya yönetimi, topluluk moderasyonu ve etkinlik organizasyonu konularında deneyimli, enerjik ve iletişim becerileri güçlü kişiler aramızda olsun!',
      responsibilities: [
        'Topluluk moderasyonu ve kullanıcı desteği',
        'Online etkinlikler ve challenge\'lar düzenleme',
        'Sosyal medya hesaplarını yönetme',
        'Kullanıcı geri bildirimlerini analiz etme ve raporlama'
      ],
      skills: ['Sosyal Medya', 'Etkinlik Yönetimi', 'İletişim', 'Moderasyon', 'Analytics'],
    },
    {
      title: 'DevOps Engineer',
      department: 'Yazılım',
      type: 'Tam Zamanlı',
      location: 'Uzaktan',
      icon: Code,
      isOpen: false,
      openings: 0,
      experience: '3+ yıl',
      description: 'CI/CD pipeline\'ları kuracak, infrastructure yönetimi yapacak ve sistem güvenliğini sağlayacak DevOps mühendisleri arıyoruz.',
      responsibilities: [
        'CI/CD pipeline kurulumu ve yönetimi',
        'Cloud infrastructure yönetimi (AWS/GCP)',
        'Monitoring ve logging sistemleri kurulumu',
        'Security best practices uygulama'
      ],
      skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Linux', 'Terraform'],
    },
    {
      title: 'Data Analyst',
      department: 'Veri',
      type: 'Tam Zamanlı',
      location: 'Uzaktan',
      icon: TrendingUp,
      isOpen: false,
      openings: 0,
      experience: '2+ yıl',
      description: 'Kullanıcı davranışlarını analiz edecek, veri odaklı kararlar alınmasına yardımcı olacak veri analistleri arıyoruz.',
      responsibilities: [
        'Kullanıcı davranış analizi ve raporlama',
        'A/B test tasarımı ve sonuç analizi',
        'Dashboard ve görselleştirme oluşturma',
        'Veri odaklı öneriler sunma'
      ],
      skills: ['SQL', 'Python', 'Data Visualization', 'Statistics', 'Analytics Tools'],
    },
  ]

  const values = [
    {
      icon: Heart,
      title: 'Kullanıcı Odaklı',
      description: 'Her kararımızda kullanıcılarımızın sağlığını ve mutluluğunu öncelik olarak görürüz.',
      gradient: 'from-red-500 to-pink-500',
    },
    {
      icon: Users,
      title: 'Takım Ruhu',
      description: 'Birlikte çalışmayı, bilgi paylaşımını ve birbirimizi desteklemeyi önemsiyoruz.',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: TrendingUp,
      title: 'Sürekli Gelişim',
      description: 'Öğrenmeye ve gelişmeye açık, yenilikçi çözümler üreten bir ekibiz.',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: Zap,
      title: 'Hızlı & Çevik',
      description: 'Hızlı karar alır, çevik çalışır ve sürekli yenilik yaparız.',
      gradient: 'from-orange-500 to-yellow-500',
    },
  ]

  const benefits = [
    { icon: Globe, text: 'Uzaktan çalışma imkanı' },
    { icon: Target, text: 'Esnek çalışma saatleri' },
    { icon: Award, text: 'Rekabetçi maaş' },
    { icon: Heart, text: 'Sağlık sigortası' },
    { icon: Sparkles, text: 'Eğitim ve gelişim desteği' },
    { icon: Code, text: 'Modern teknoloji stack' },
    { icon: Users, text: 'Genç ve dinamik ekip' },
    { icon: Rocket, text: 'Kariyer gelişim fırsatları' },
  ]

  const stats = [
    { value: '50K+', label: 'Aktif Kullanıcı' },
    { value: '100K+', label: 'Paylaşılan Plan' },
    { value: '1M+', label: 'Topluluk Etkileşimi' },
    { value: '4.8/5', label: 'Kullanıcı Memnuniyeti' },
  ]

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-b from-white via-purple-50/30 to-white dark:from-slate-950 dark:via-purple-950/10 dark:to-slate-950">
      <Navbar />

      {/* Hero Section */}
      <section className="relative container mx-auto px-4 pt-20 md:pt-28 pb-12 md:pb-16">
        {/* Background Decorations */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300/20 dark:bg-purple-600/10 rounded-full blur-3xl" />
          <div className="absolute top-40 right-10 w-96 h-96 bg-pink-300/20 dark:bg-pink-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-orange-300/20 dark:bg-orange-600/10 rounded-full blur-3xl" />
        </div>

        <div className="text-center max-w-5xl mx-auto relative">
          {/* Animated Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 border border-purple-200 dark:border-purple-800 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Briefcase className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className="text-sm font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              Ekibimize Katıl 🚀
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-[1.1] animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 dark:from-purple-400 dark:via-pink-400 dark:to-orange-400 bg-clip-text text-transparent">
              Geleceği Birlikte
            </span>
            <br />
            <span className="text-slate-900 dark:text-white">
              İnşa Edelim! 💪
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl font-semibold mb-4 text-slate-700 dark:text-slate-300 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            Milyonlarca insanın hayatına dokunuyoruz
          </p>
          
          <p className="text-base md:text-lg text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
            Yenilikçi, dinamik ve kullanıcı odaklı ekibimizin bir parçası ol. 
            Sağlıklı yaşam yolculuğunda milyonlarca insana rehberlik et! 🌟
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-in fade-in slide-in-from-bottom-12 duration-700 delay-500">
            <Button asChild size="lg" className="text-lg px-10 h-14 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 hover:from-purple-700 hover:via-pink-700 hover:to-orange-700 shadow-xl hover:shadow-2xl transition-all hover:scale-105 group font-bold">
              <Link href="#pozisyonlar">
                <Rocket className="mr-2 w-5 h-5" />
                Açık Pozisyonlar
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-10 h-14 border-2 hover:bg-slate-50 dark:hover:bg-slate-900 font-semibold">
              <Link href="#degerlerimiz">
                <Sparkles className="mr-2 w-5 h-5" />
                Değerlerimiz
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section id="degerlerimiz" className="py-16 px-4 bg-slate-50/50 dark:bg-slate-900/20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black mb-4 text-slate-900 dark:text-white">
              Değerlerimiz 💎
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Bizi biz yapan değerler ve çalışma kültürümüz
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className="group p-8 bg-white dark:bg-slate-900 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-slate-200 dark:border-slate-800"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${value.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                  <value.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">{value.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section id="pozisyonlar" className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black mb-4 text-slate-900 dark:text-white">
              Açık Pozisyonlar 🎯
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Yeteneklerini sergileyebileceğin pozisyonları keşfet
            </p>
          </div>
          
          <div className="grid gap-6">
            {positions.map((position, index) => (
              <div
                key={index}
                className={`group p-8 bg-white dark:bg-slate-900 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border ${
                  position.isOpen 
                    ? 'border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-700' 
                    : 'border-slate-200 dark:border-slate-800 opacity-75'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${
                        position.isOpen ? 'from-purple-500 to-pink-500' : 'from-slate-400 to-slate-500'
                      } rounded-xl flex items-center justify-center flex-shrink-0`}>
                        <position.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{position.title}</h3>
                          {position.isOpen ? (
                            <span className="px-3 py-1 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 rounded-full text-xs font-bold flex items-center gap-1">
                              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                              AÇIK
                            </span>
                          ) : (
                            <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full text-xs font-bold">
                              KAPALI
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium">
                            {position.department}
                          </span>
                          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                            {position.type}
                          </span>
                          <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 rounded-full text-sm font-medium">
                            📍 {position.location}
                          </span>
                          <span className="px-3 py-1 bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300 rounded-full text-sm font-medium">
                            ⏱️ {position.experience}
                          </span>
                          {position.isOpen && position.openings > 0 && (
                            <span className="px-3 py-1 bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300 rounded-full text-sm font-medium">
                              👥 {position.openings} pozisyon
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground mb-4 leading-relaxed">{position.description}</p>
                    
                    {/* Responsibilities */}
                    <div className="mb-4">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Sorumluluklar:</h4>
                      <ul className="space-y-1">
                        {position.responsibilities.map((resp, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                            <span>{resp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Skills */}
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Aranan Yetenekler:</h4>
                      <div className="flex flex-wrap gap-2">
                        {position.skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {position.isOpen ? (
                    <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all group-hover:scale-105 font-bold whitespace-nowrap lg:self-start">
                      <Link href="/iletisim">
                        Başvur
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  ) : (
                    <Button disabled size="lg" className="bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed font-bold whitespace-nowrap lg:self-start">
                      Başvuru Kapalı
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-slate-50/50 dark:bg-slate-900/20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black mb-4 text-slate-900 dark:text-white">
              Neler Sunuyoruz? 🎁
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Ekip üyelerimize sunduğumuz avantajlar ve imkanlar
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-5 bg-white dark:bg-slate-900 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-slate-200 dark:border-slate-800"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <benefit.icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-slate-700 dark:text-slate-300 font-medium">{benefit.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="relative overflow-hidden p-12 md:p-16 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 rounded-3xl shadow-2xl">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            
            <div className="relative text-center">
              <Star className="w-16 h-16 text-white/80 mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-black text-white mb-6">
                Aradığın Pozisyonu Bulamadın mı?
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
                Yine de bizimle iletişime geç! Yetenekli insanlarla tanışmaktan her zaman mutluluk duyarız. 
                Belki de senin için özel bir pozisyon oluşturabiliriz! 🌟
              </p>
              <Button asChild size="lg" className="bg-white text-purple-600 hover:bg-slate-50 shadow-xl hover:shadow-2xl transition-all hover:scale-105 font-bold text-lg px-10 h-14">
                <Link href="/iletisim">
                  <MessageCircle className="mr-2 w-5 h-5" />
                  İletişime Geç
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
