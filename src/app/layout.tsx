import type { Metadata } from 'next'
import { Cairo, Inter } from 'next/font/google'
import './globals.css'
import { QuickContactWidget } from '@/components/organisms/QuickContactWidget'
import { BackToTop } from '@/components/organisms/BackToTop'
import { LanguageProvider } from '@/lib/i18n-context'
import { Toaster } from 'react-hot-toast'

const cairo = Cairo({
    subsets: ['arabic', 'latin'],
    variable: '--font-cairo',
    display: 'swap',
})

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
})

export const metadata: Metadata = {
    title: {
        default: 'مصنع السلام للزيوت النباتية',
        template: '%s | مصنع السلام للزيوت النباتية',
    },
    description: 'الريادة في عصر وإنتاج الزيوت النباتية، السمن، والشورتنج للسوق المحلي والتصدير. أكثر من 25 عاماً من الخبرة وشهادات ISO و HACCP.',
    keywords: ['زيوت نباتية', 'سمن', 'شورتنج', 'مصنع السلام', 'تصدير زيوت', 'vegetable oils', 'margarine', 'shortening'],
    openGraph: {
        title: 'مصنع السلام للزيوت النباتية',
        description: 'الريادة في عصر وإنتاج الزيوت النباتية، السمن، والشورتنج.',
        type: 'website',
        locale: 'ar_EG',
    },
}

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "مصنع السلام للزيوت النباتية",
    "alternateName": "Elsalam Vegetable Oils Factory",
    "url": "https://elsalamoils.com",
    "logo": "https://elsalamoils.com/images/logo.png",
    "description": "الريادة في عصر وإنتاج الزيوت النباتية، السمن، والشورتنج للسوق المحلي والتصدير.",
    "foundingDate": "2000",
    "address": {
        "@type": "PostalAddress",
        "addressLocality": "المنوفية",
        "addressCountry": "EG"
    },
    "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+20-123-456-7890",
        "contactType": "customer service",
        "availableLanguage": ["Arabic", "English"]
    },
    "sameAs": [
        "https://facebook.com/elsalamoils",
        "https://instagram.com/elsalamoils",
        "https://linkedin.com/company/elsalamoils"
    ]
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="ar" dir="rtl" className={`${cairo.variable} ${inter.variable}`}>
            <head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            </head>
            <body className="font-arabic antialiased text-text-dark bg-surface-soft min-h-screen flex flex-col">
                <LanguageProvider>
                    <Toaster position="top-center" reverseOrder={false} />
                    {children}
                    <QuickContactWidget />
                    <BackToTop />
                </LanguageProvider>
            </body>
        </html>
    )
}
