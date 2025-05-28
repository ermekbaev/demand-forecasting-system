import './globals.css'
import { Inter } from 'next/font/google'
import { Providers } from './providers'
import { ClientLayoutWrapper } from '@/components/layout/ClientLayoutWrapper'
import { Metadata } from 'next'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Store Premium - Премиальная одежда и обувь',
  description: 'Откройте для себя эксклюзивную коллекцию премиальной одежды и обуви. Безупречное качество, современный дизайн и непревзойденный комфорт.',
  keywords: 'одежда, обувь, кроссовки, premium, бренды, Nike, Adidas',
  authors: [{ name: 'Store Premium Team' }],
  creator: 'Store Premium',
  publisher: 'Store Premium',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: 'https://store-premium.ru',
    title: 'Store Premium - Премиальная одежда и обувь',
    description: 'Откройте для себя эксклюзивную коллекцию премиальной одежды и обуви',
    siteName: 'Store Premium',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Store Premium - Премиальная одежда и обувь',
    description: 'Откройте для себя эксклюзивную коллекцию премиальной одежды и обуви',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        {/* Дополнительные мета-теги */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#10b981" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* Preconnect для внешних ресурсов */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Structured Data для поисковых систем */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Store",
              "name": "Store Premium",
              "description": "Премиальный интернет-магазин одежды и обуви",
              "url": "https://store-premium.ru",
              "logo": "https://store-premium.ru/logo.png",
              "sameAs": [
                "https://instagram.com/store_premium",
                "https://t.me/store_premium",
                "https://vk.com/store_premium"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+7-999-123-45-67",
                "contactType": "customer service",
                "availableLanguage": "Russian"
              }
            })
          }}
        />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <Providers>
          <ClientLayoutWrapper>
            {children}
          </ClientLayoutWrapper>
        </Providers>
      </body>
    </html>
  )
}