import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { getSetting } from '@/lib/settings'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

export async function generateMetadata(): Promise<Metadata> {
  const [
    seoTitle,
    seoDescription,
    seoKeywords,
    ogImage = '/og-default.svg',
    twitterHandle,
    siteUrl,
    googleSiteVerification,
    siteFavicon,
  ] = await Promise.all([
    getSetting('seoTitle', 'ZayiflamaPlan - Gerçek İnsanların Gerçek Planları'),
    getSetting('seoDescription', 'Gerçek insanların gerçek zayıflama planlarını paylaştığı, topluluk destekli platform.'),
    getSetting('seoKeywords', 'zayıflama, diyet, kilo verme, sağlıklı yaşam, fitness'),
    getSetting('ogImage', '/og-image.jpg'),
    getSetting('twitterHandle', '@zayiflamaplan'),
    getSetting('siteUrl', 'https://zayiflamaplan.com'),
    getSetting('googleSiteVerification', ''),
    getSetting('siteFavicon', '/favicon.ico'),
  ])

  const metadata: Metadata = {
    title: {
      default: seoTitle,
      template: `%s | ${seoTitle}`,
    },
    description: seoDescription,
    keywords: seoKeywords.split(',').map(k => k.trim()),
    authors: [{ name: 'ZayiflamaPlan' }],
    creator: 'ZayiflamaPlan',
    publisher: 'ZayiflamaPlan',
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: '/',
    },
    openGraph: {
      type: 'website',
      locale: 'tr_TR',
      url: siteUrl,
      title: seoTitle,
      description: seoDescription,
      siteName: seoTitle,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: seoTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: seoTitle,
      description: seoDescription,
      creator: twitterHandle,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }

  if (googleSiteVerification) {
    metadata.verification = {
      google: googleSiteVerification,
    }
  }

  // Favicon
  metadata.icons = {
    icon: siteFavicon,
    shortcut: siteFavicon,
    apple: siteFavicon,
  }

  return metadata
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const googleAnalytics = await getSetting('googleAnalytics', '')

  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        {googleAnalytics && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalytics}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${googleAnalytics}');
              `}
            </Script>
          </>
        )}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
