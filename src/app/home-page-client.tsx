"use client";

import { PageContentProvider } from "@/lib/page-content-context";
import { NewsTicker } from "@/components/organisms/NewsTicker";
import { HeroSection } from "@/components/organisms/HeroSection";
import { StatsCounter } from "@/components/organisms/StatsCounter";
import { WhyChooseUs } from "@/components/organisms/WhyChooseUs";
import { PackagingGuide } from "@/components/organisms/PackagingGuide";
import { CertificationsBanner } from "@/components/organisms/CertificationsBanner";
import { ClientLogos } from "@/components/organisms/ClientLogos";
import { CTAPartnership } from "@/components/organisms/CTAPartnership";
import { Footer } from "@/components/organisms/Footer";
import { HomeSegments } from "@/components/organisms/HomeSegments";
import { HomeFeaturedProducts } from "@/components/organisms/HomeFeaturedProducts";
import { OurProcess } from "@/components/organisms/OurProcess";
import { GlobalFootprint } from "@/components/organisms/GlobalFootprint";
import { Sustainability } from "@/components/organisms/Sustainability";
import { VirtualTour } from "@/components/organisms/VirtualTour";
import { Testimonials } from "@/components/organisms/Testimonials";
import { FAQ } from "@/components/organisms/FAQ";
import { Navbar } from "@/components/organisms/Navbar";
import { useState, useEffect } from "react";

interface HomePageClientProps {
    cmsContent: Record<string, any>;
}

export function HomePageClient({ cmsContent: initialContent }: HomePageClientProps) {
    // Start with server-side content, then fetch fresh from client
    const [cmsContent, setCmsContent] = useState<Record<string, any>>(initialContent);

    useEffect(() => {
        // Always fetch the latest content from DB when the page loads in the browser
        // This bypasses ANY server-side cache and ensures updated images/text appear immediately
        fetch(`/api/public/pages/home`, { cache: "no-store" })
            .then(r => r.json())
            .then(json => {
                if (json.data && Object.keys(json.data).length > 0) {
                    setCmsContent(json.data);
                }
            })
            .catch(() => {/* keep server-side content on error */});
    }, []);

    return (
        <PageContentProvider content={cmsContent}>
            <main className="min-h-screen bg-surface-soft font-arabic relative">
                <Navbar />
                <div className="absolute top-[76px] sm:top-[84px] md:top-[100px] left-0 w-full z-40 flex justify-center">
                    <div className="w-full max-w-7xl px-3 sm:px-6 lg:px-8">
                        <NewsTicker />
                    </div>
                </div>
                <HeroSection />
                <StatsCounter />
                <WhyChooseUs />
                <HomeSegments />
                <HomeFeaturedProducts />
                <OurProcess />
                <GlobalFootprint />
                <Sustainability />
                <VirtualTour />
                <PackagingGuide />
                <CertificationsBanner />
                <Testimonials />
                <FAQ />
                <CTAPartnership />
                <ClientLogos />
                <Footer />
            </main>
        </PageContentProvider>
    );
}
