"use client";

import { usePathname, useSearchParams } from 'next/navigation';
import Script from 'next/script';
import { useEffect } from 'react';

/**
 * Next.js 14 App Router Compatible Google Analytics
 * Tracks the B2B Buyer's Journey across soft navigations.
 */
export function GoogleAnalytics({ gaId }: { gaId: string }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Track page views on route changes
    useEffect(() => {
        if (!gaId || !pathname) return;
        
        const url = searchParams.toString() 
            ? `${pathname}?${searchParams.toString()}` 
            : pathname;

        // @ts-ignore: gtag is injected globally by Google
        if (typeof window !== "undefined" && window.gtag) {
            // @ts-ignore
            window.gtag("config", gaId, {
                page_path: url,
            });
        }
    }, [pathname, searchParams, gaId]);

    if (!gaId) return null;

    return (
        <>
            <Script
                strategy="afterInteractive"
                src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            />
            <Script
                id="google-analytics"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', '${gaId}', {
                            page_path: window.location.pathname,
                        });
                    `,
                }}
            />
        </>
    );
}
