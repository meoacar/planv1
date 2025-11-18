import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/layout/footer'
import { Metadata } from 'next'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const page = await db.page.findUnique({
    where: {
      slug,
      isPublished: true,
    },
  })

  if (!page) {
    return {
      title: 'Sayfa Bulunamadı',
    }
  }

  return {
    title: page.metaTitle || page.title,
    description: page.metaDesc || undefined,
  }
}

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params
  const page = await db.page.findUnique({
    where: {
      slug,
      isPublished: true,
    },
  })

  if (!page) {
    notFound()
  }

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
            <span className="text-sm font-medium bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {page.slug === 'hakkimizda' && '📖 Hakkımızda'}
              {page.slug === 'gizlilik-politikasi' && '🔒 Gizlilik'}
              {page.slug === 'kullanim-kosullari' && '📋 Koşullar'}
              {page.slug === 'iletisim' && '📧 İletişim'}
              {!['hakkimizda', 'gizlilik-politikasi', 'kullanim-kosullari', 'iletisim'].includes(page.slug) && '📄 Sayfa'}
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
            {page.title}
          </h1>
          {page.metaDesc && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {page.metaDesc}
            </p>
          )}
        </div>
      </div>
      
      <main className="flex-1 container mx-auto px-4 py-16 max-w-4xl">
        <article className="relative">
          {/* Content Card */}
          <div className="bg-card/50 backdrop-blur-sm rounded-3xl border-2 border-border/50 shadow-2xl p-8 md:p-12">
            <div 
              className="prose prose-lg dark:prose-invert max-w-none
                prose-headings:font-bold 
                prose-headings:bg-gradient-to-r prose-headings:from-purple-600 prose-headings:to-pink-600 
                prose-headings:bg-clip-text prose-headings:text-transparent
                prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
                prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
                prose-p:text-foreground/90 prose-p:leading-relaxed prose-p:mb-6
                prose-a:text-purple-600 prose-a:no-underline hover:prose-a:underline
                prose-strong:text-foreground prose-strong:font-semibold
                prose-ul:my-6 prose-ul:space-y-2
                prose-li:text-foreground/90
                prose-li:marker:text-purple-600"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
          </div>

          {/* Decorative Elements */}
          <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl -z-10" />
          <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-full blur-3xl -z-10" />
        </article>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-col sm:flex-row gap-4 items-center justify-center p-8 rounded-2xl bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 border border-purple-500/20 backdrop-blur-sm">
            <div className="text-left">
              <h3 className="font-bold text-xl mb-1">Sorularınız mı var?</h3>
              <p className="text-sm text-muted-foreground">Bizimle iletişime geçin, yardımcı olalım!</p>
            </div>
            <a 
              href="/iletisim"
              className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              İletişime Geç →
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

// Statik sayfa oluşturma için
export async function generateStaticParams() {
  const pages = await db.page.findMany({
    where: { isPublished: true },
    select: { slug: true },
  })

  return pages.map((page) => ({
    slug: page.slug,
  }))
}
