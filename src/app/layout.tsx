import type { Metadata, Viewport } from 'next'
import { Cairo, Inter } from 'next/font/google'
import './globals.css'
import { QuickContactWidget } from '@/components/organisms/QuickContactWidget'
import { BackToTop } from '@/components/organisms/BackToTop'
import { MobileBottomNav } from '@/components/organisms/MobileBottomNav'
import { LanguageProvider } from '@/lib/i18n-context'
import { Toaster } from 'react-hot-toast'
import Script from 'next/script'
import { prisma } from '@/lib/prisma'

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
    manifest: '/manifest.json',
    appleWebApp: {
        capable: true,
        statusBarStyle: 'black-translucent',
        title: 'السلام',
    },
    openGraph: {
        title: 'مصنع السلام للزيوت النباتية',
        description: 'الريادة في عصر وإنتاج الزيوت النباتية، السمن، والشورتنج.',
        type: 'website',
        locale: 'ar_EG',
    },
}

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    themeColor: '#16a34a',
    viewportFit: 'cover',
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
    ],
    "hasCredential": [
        {
            "@type": "EducationalOccupationalCredential",
            "credentialCategory": "ISO 22000",
            "name": "ISO 22000 Food Safety Management",
            "recognizedBy": {
                "@type": "Organization",
                "name": "International Organization for Standardization"
            }
        },
        {
            "@type": "EducationalOccupationalCredential",
            "credentialCategory": "HACCP",
            "name": "Hazard Analysis and Critical Control Points",
            "recognizedBy": {
                "@type": "Organization",
                "name": "HACCP Alliance"
            }
        }
    ],
    "knowsAbout": ["Vegetable Oils Production", "Margarine", "Shortening", "B2B Export", "Food Safety"]
};

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const settings = await prisma.siteSettings.findFirst();
    const gaId = settings?.googleAnalyticsId;

    return (
        <html lang="ar" dir="rtl" className={`${cairo.variable} ${inter.variable}`} suppressHydrationWarning>
            <head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            </head>
            <body className="font-arabic antialiased text-text-dark bg-surface-soft min-h-screen flex flex-col pb-safe">
                {gaId && (
                    <>
                        <Script
                            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
                            strategy="afterInteractive"
                        />
                        <Script id="google-analytics" strategy="afterInteractive">
                            {`
                                window.dataLayer = window.dataLayer || [];
                                function gtag(){dataLayer.push(arguments);}
                                gtag('js', new Date());
                                gtag('config', '${gaId}', {
                                    page_path: window.location.pathname,
                                });
                            `}
                        </Script>
                    </>
                )}
                <LanguageProvider>
                    <Toaster position="top-center" reverseOrder={false} />
                    {children}
                    <QuickContactWidget />
                    <BackToTop />
                    <MobileBottomNav />
                </LanguageProvider>
            </body>
        </html>
    )
}
