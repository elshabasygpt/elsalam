"use client";

import { Navbar } from "@/components/organisms/Navbar";
import { Footer } from "@/components/organisms/Footer";
import { CertificationsBanner } from "@/components/organisms/CertificationsBanner";
import { OurProcess } from "@/components/organisms/OurProcess";
import { Container } from "@/components/atoms/Container";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/atoms/ScrollReveal";
import { ShieldCheck, Download, Award, Target, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/lib/i18n-context";
import { PageContentProvider } from "@/lib/page-content-context";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function QualityClient({ cmsContent }: { cmsContent?: Record<string, any> }) {
    const { t, locale } = useLanguage();
    const containerRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });
    const progressHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

    const qcChecksItems = cmsContent?.qcChecks?.items || [];
    const defaultImages = [
        "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1582719478250-c89e82c5a013?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1579154204601-39769d4b0f09?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1576086213369-8b806f7df282?q=80&w=800&auto=format&fit=crop"
    ];

    const checksToRender = qcChecksItems.length > 0 
        ? qcChecksItems 
        : t.quality.qcChecks.map((text: string, i: number) => ({
            text_ar: text,
            text_en: text,
            image: defaultImages[i % defaultImages.length]
        }));

    const labData = cmsContent?.lab || {};
    const labTitle = locale === 'ar' ? (labData.title_ar || 'معامل فحص الجودة') : (labData.title_en || 'Quality Control Laboratories');
    const labDesc = locale === 'ar' ? (labData.description_ar || 'نمتلك أحدث الأجهزة المعملية لضمان مطابقة جميع منتجاتنا للمواصفات القياسية العالمية، من خلال اختبارات دقيقة في كل مرحلة من مراحل الإنتاج.') : (labData.description_en || 'Equipped with state-of-the-art laboratory technology to ensure all our products meet strict international standards through rigorous testing.');
    
    const labImages = labData.images || [];
    const labMainImg = labImages[0]?.url || "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?q=80&w=1200&auto=format&fit=crop";
    const labMainTitle = locale === 'ar' ? (labImages[0]?.title_ar || 'أحدث التقنيات') : (labImages[0]?.title_en || 'Latest Technologies');
    
    const labSub1Img = labImages[1]?.url || "https://images.unsplash.com/photo-1582719478250-c89e82c5a013?q=80&w=800&auto=format&fit=crop";
    const labSub2Img = labImages[2]?.url || "https://images.unsplash.com/photo-1574689211272-bc1550ce15f5?q=80&w=800&auto=format&fit=crop";

    const heroBgImg = cmsContent?.hero?.image || "https://images.unsplash.com/photo-1618042164219-62c820f10723?q=80&w=2500&auto=format&fit=crop";

    return (
        <PageContentProvider content={cmsContent || {}}>
            <main className="min-h-screen bg-white font-arabic">
            <Navbar />

            {/* Premium Hero Section */}
            <section className="relative pt-40 pb-32 lg:pt-56 lg:pb-48 overflow-hidden bg-slate-950">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <img 
                        src={heroBgImg}
                        alt="Quality Background" 
                        className="w-full h-full object-cover opacity-20 mix-blend-luminosity"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/40 to-transparent" />
                </div>
                
                {/* Abstract floating shapes */}
                <div className="absolute top-1/4 -right-20 w-96 h-96 bg-emerald-600/20 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-0 -left-20 w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[120px] pointer-events-none" />

                <Container className="relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <ScrollReveal>
                            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-8 backdrop-blur-md shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                                <Award className="w-5 h-5" />
                                <span className="text-sm font-bold tracking-wide">
                                    {locale === 'ar' ? 'معايير عالمية لا تقبل المساومة' : 'Uncompromising Global Standards'}
                                </span>
                            </div>
                            <h1 className="text-white mb-6 text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] drop-shadow-sm">
                                {t.quality.heroTitle}
                            </h1>
                            <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-medium">
                                {t.quality.heroSubtitle}
                            </p>
                        </ScrollReveal>
                    </div>
                </Container>
            </section>

            <CertificationsBanner />

            {/* Modern QC Checklist */}
            <section className="py-24 lg:py-32 bg-slate-50 relative overflow-hidden" ref={containerRef}>
                {/* Decorative background pattern */}
                <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none bg-[radial-gradient(circle_at_1px_1px,#0f172a_1px,transparent_0)] [background-size:40px_40px]" />
                
                <Container className="relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-24">
                        <ScrollReveal>
                            <div className="w-16 h-1 bg-emerald-500 mx-auto mb-8 rounded-full" />
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                                {t.quality.qcTitle}
                            </h2>
                            <p className="text-lg text-slate-600 font-medium">
                                {t.quality.qcSubtitle}
                            </p>
                        </ScrollReveal>
                    </div>

                    {/* Desktop Layout: Premium Accordion Gallery */}
                    <div className="hidden lg:flex w-full h-[600px] gap-4 px-8 max-w-[100vw]">
                        {checksToRender.map((checkObj: any, index: number) => {
                            const checkText = locale === 'ar' ? (checkObj.text_ar || checkObj.text) : (checkObj.text_en || checkObj.text);
                            const imgSrc = checkObj.image || defaultImages[index % defaultImages.length];

                            return (
                                <div 
                                    key={index} 
                                    className="relative flex-1 hover:flex-[4] transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] rounded-[3rem] overflow-hidden group cursor-pointer shadow-lg border border-slate-200/50 hover:border-emerald-500/50"
                                >
                                    {/* Background Image */}
                                    <img
                                        src={imgSrc}
                                        alt={checkText}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                    />
                                    
                                    {/* Gradients */}
                                    <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-slate-900/10 transition-colors duration-700" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-700" />

                                    {/* Unhovered State */}
                                    <div className="absolute inset-0 flex flex-col items-center justify-end pb-10 opacity-100 group-hover:opacity-0 transition-opacity duration-500">
                                        <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 text-white font-bold font-english shadow-lg">
                                            0{index + 1}
                                        </div>
                                    </div>

                                    {/* Content on Hover */}
                                    <div className="absolute inset-x-0 bottom-0 p-10 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-all duration-700 transform translate-y-6 group-hover:translate-y-0">
                                        <div className="flex items-center gap-4 mb-5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">
                                            <div className="w-16 h-16 shrink-0 rounded-full bg-emerald-500 flex items-center justify-center text-white font-black text-2xl font-english shadow-lg shadow-emerald-500/40">
                                                0{index + 1}
                                            </div>
                                            <div className="h-px flex-1 bg-gradient-to-r from-emerald-400 to-transparent" />
                                        </div>
                                        <h3 className="text-3xl font-black text-white leading-tight drop-shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-200">
                                            {checkText}
                                        </h3>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Mobile/Tablet Layout: Clean 2-Column Grid */}
                    <div className="grid lg:hidden grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 px-4 max-w-5xl mx-auto">
                        {checksToRender.map((checkObj: any, index: number) => {
                            const checkText = locale === 'ar' ? (checkObj.text_ar || checkObj.text) : (checkObj.text_en || checkObj.text);
                            const imgSrc = checkObj.image || defaultImages[index % defaultImages.length];

                            return (
                                <ScrollReveal key={index} delay={index * 0.05}>
                                    <div className="relative aspect-[4/5] md:aspect-square rounded-2xl overflow-hidden shadow-md group border border-slate-200">
                                        <img
                                            src={imgSrc}
                                            alt={checkText}
                                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/30 to-transparent opacity-90" />
                                        
                                        <div className={`absolute top-3 ${locale === 'ar' ? 'left-3' : 'right-3'} w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-xs font-bold font-english border border-white/20 shadow-sm`}>
                                            0{index + 1}
                                        </div>
                                        
                                        <div className="absolute inset-x-0 bottom-0 p-3 md:p-4 flex flex-col justify-end">
                                            <h3 className="text-sm md:text-base font-bold text-white leading-snug drop-shadow-md">
                                                {checkText}
                                            </h3>
                                        </div>
                                    </div>
                                </ScrollReveal>
                            );
                        })}
                    </div>
                </Container>
            </section>

            {/* Bento Box Lab Gallery */}
            <section className="py-24 lg:py-32 bg-white">
                <Container>
                    <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16 lg:mb-20">
                        <ScrollReveal className="max-w-2xl">
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                                {labTitle}
                            </h2>
                            <p className="text-lg text-slate-600 leading-relaxed">
                                {labDesc}
                            </p>
                        </ScrollReveal>
                        <ScrollReveal delay={0.2}>
                            <div className="hidden md:flex items-center gap-4 text-emerald-600 font-bold bg-emerald-50 px-6 py-4 rounded-2xl border border-emerald-100">
                                <Target className="w-6 h-6" />
                                <span>{locale === 'ar' ? 'دقة متناهية' : 'Absolute Precision'}</span>
                            </div>
                        </ScrollReveal>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
                        {/* Main large image */}
                        <ScrollReveal delay={0.1} className="md:col-span-2 h-[400px] lg:h-[600px]">
                            <div className="w-full h-full rounded-[3rem] overflow-hidden relative group shadow-lg border border-slate-100">
                                <img src={labMainImg} alt="Lab Main" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
                                <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                    <div className="w-12 h-1 bg-emerald-500 mb-6 rounded-full" />
                                    <h3 className="text-2xl lg:text-3xl font-black text-white mb-3">{labMainTitle}</h3>
                                    <p className="text-slate-300 text-lg">{locale === 'ar' ? 'أجهزة تحليل متطورة لضمان نقاء الزيوت' : 'Advanced analysis equipment to ensure oil purity'}</p>
                                </div>
                            </div>
                        </ScrollReveal>

                        <div className="flex flex-col gap-4 lg:gap-6 h-[500px] lg:h-[600px]">
                            {/* Top small image */}
                            <ScrollReveal delay={0.2} className="flex-1 min-h-0 h-full">
                                <div className="w-full h-full rounded-[3rem] overflow-hidden relative group shadow-lg border border-slate-100">
                                    <img src={labSub1Img} alt="Lab Sub 1" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                                    <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-slate-900/0 transition-colors duration-500" />
                                </div>
                            </ScrollReveal>
                            {/* Bottom small image */}
                            <ScrollReveal delay={0.3} className="flex-1 min-h-0 h-full">
                                <div className="w-full h-full rounded-[3rem] overflow-hidden relative group shadow-lg border border-slate-100">
                                    <img src={labSub2Img} alt="Lab Sub 2" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                                    <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-slate-900/0 transition-colors duration-500" />
                                </div>
                            </ScrollReveal>
                        </div>
                    </div>
                </Container>
            </section>

            <OurProcess />

            {/* Premium Download CTA */}
            <section className="py-24 lg:py-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-slate-950" />
                {/* Optional subtle texture */}
                <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_0)] [background-size:24px_24px]" />
                
                <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-emerald-600/20 rounded-full blur-[150px] pointer-events-none" />
                <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
                
                <Container className="relative z-10">
                    <ScrollReveal>
                        <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[3rem] p-10 md:p-16 lg:p-24 text-center max-w-5xl mx-auto shadow-2xl relative overflow-hidden group">
                            {/* Inner glow effect */}
                            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            
                            <div className="relative z-10">
                                <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-10 border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.15)] group-hover:scale-110 transition-transform duration-500">
                                    <ShieldCheck className="w-12 h-12 text-emerald-400" />
                                </div>
                                <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-6 leading-tight">
                                    {t.quality.downloadTitle}
                                </h2>
                                <p className="text-lg md:text-xl text-slate-300/80 max-w-3xl mx-auto mb-14 leading-relaxed font-medium">
                                    {locale === 'ar' 
                                        ? 'نلتزم بأعلى معايير الجودة العالمية، ونفخر بحصولنا على أهم الشهادات التي تثبت التزامنا بتقديم الأفضل دائماً.'
                                        : 'We adhere to the highest global quality standards, proudly holding major certifications that prove our commitment to excellence.'}
                                </p>

                                <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 lg:gap-6">
                                    <a href="#" className="flex items-center justify-center gap-3 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-2xl transition-all duration-300 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-1">
                                        <Download className="w-5 h-5" />
                                        {t.quality.downloadISO9001}
                                    </a>
                                    <a href="#" className="flex items-center justify-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl border border-white/10 transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm">
                                        <Download className="w-5 h-5 text-slate-400" />
                                        {t.quality.downloadISO22000}
                                    </a>
                                    <a href="#" className="flex items-center justify-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl border border-white/10 transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm">
                                        <Download className="w-5 h-5 text-slate-400" />
                                        {t.quality.downloadHalal}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>
                </Container>
            </section>

            <Footer />
        </main>
        </PageContentProvider>
    );
}
