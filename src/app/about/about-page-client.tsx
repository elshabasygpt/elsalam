"use client";

import { Navbar } from "@/components/organisms/Navbar";
import { Footer } from "@/components/organisms/Footer";
import { StatsCounter } from "@/components/organisms/StatsCounter";
import { CTAPartnership } from "@/components/organisms/CTAPartnership";
import { Container } from "@/components/atoms/Container";
import { Typography } from "@/components/atoms/Typography";
import { SectionHeader } from "@/components/molecules/SectionHeader";
import { cn } from "@/utils/classnames";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/atoms/ScrollReveal";
import { User, Users, Target, ShieldCheck, Factory, Leaf, Quote, Building2 } from "lucide-react";
import { useLanguage } from "@/lib/i18n-context";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";

function StationLogo({ src, alt }: { src: string, alt?: string }) {
    const [hasError, setHasError] = useState(false);
    const [mounted, setMounted] = useState(false);
    
    useEffect(() => { setMounted(true); }, []);
    
    // Add cache-buster to prevent local Windows filesystem dev cache locking
    const imgSrc = mounted && src?.startsWith("/uploads") ? `${src}?v=${Date.now()}` : src;
    
    return (
        <div 
            className="relative rounded-2xl shadow-md border-2 border-gray-100 bg-white flex items-center justify-center shrink-0 overflow-hidden ring-4 ring-gray-50/50"
            style={{ width: '90px', height: '90px', minWidth: '90px', minHeight: '90px', flexShrink: 0 }}
        >
            {!hasError && imgSrc ? (
                <img 
                    src={imgSrc} 
                    alt={alt || "Logo"} 
                    className="w-full h-full object-contain transition-transform duration-300 hover:scale-110" 
                    style={{ padding: '8px' }}
                    onError={() => setHasError(true)}
                />
            ) : (
                <Building2 className="text-gray-400 opacity-60" style={{ width: '40px', height: '40px' }} />
            )}
        </div>
    );
}

export function AboutPageClient({ cmsContent = {} }: { cmsContent?: Record<string, any> }) {
    const { t, isRTL } = useLanguage();

    // For timeline scroll animation
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });
    const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1.2]);

    const defaultTeam = [
        { name: isRTL ? "أحمد سليمان" : "Ahmed Soliman", role: isRTL ? "المدير المالي" : "Chief Financial Officer" },
        { name: isRTL ? "منى عبد الرحمن" : "Mona Abdulrahman", role: isRTL ? "رئيس قطاع العمليات" : "Chief Operating Officer" },
        { name: isRTL ? "طارق حسن" : "Tarek Hassan", role: isRTL ? "مدير الجودة والتطوير" : "R&D Director" },
        { name: isRTL ? "ريم خالد" : "Reem Khaled", role: isRTL ? "مدير إدارة المبيعات" : "Sales Director" },
    ];

    const teamMembers = cmsContent?.team?.members?.length > 0 ? cmsContent.team.members : defaultTeam;
    const teamTitle = isRTL ? (cmsContent?.team?.title_ar || "فريق الإدارة العليا") : (cmsContent?.team?.title_en || "Executive Leadership");
    const teamDesc = isRTL ? (cmsContent?.team?.subtitle_ar || "نخبة من الكفاءات المتميزة التي تقود رؤيتنا نحو العالمية، وتضمن أعلى معايير الجودة والتميز في كافة قطاعات الشركة.") : (cmsContent?.team?.subtitle_en || "Our distinguished leadership driving our global vision and ensuring the highest standards of quality.");
    const teamBadge = isRTL ? (cmsContent?.team?.badge_ar || "شركاء النجاح") : (cmsContent?.team?.badge_en || "Partners in Success");
    
    // Gallery Data
    const galleryItems = cmsContent?.gallery?.items?.length > 0 ? cmsContent.gallery.items : t.about.galleryItems.map(title => ({ title, url: "" }));
    const galleryTitle = isRTL ? (cmsContent?.gallery?.title_ar || t.about.galleryTitle) : (cmsContent?.gallery?.title_en || t.about.galleryTitle);
    const gallerySubtitle = isRTL ? (cmsContent?.gallery?.subtitle_ar || t.about.gallerySubtitle) : (cmsContent?.gallery?.subtitle_en || t.about.gallerySubtitle);
    
    const heroBgImage = cmsContent?.hero?.backgroundImage || "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=2070&auto=format&fit=crop";

    return (
        <main className="min-h-screen bg-surface-soft font-arabic">
            <Navbar />

            {/* ─── Premium About Hero Section ─── */}
            <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden rounded-b-[2.5rem] md:rounded-b-[4rem] shadow-xl bg-green-950">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 opacity-20 mix-blend-overlay">
                    <img
                        src={heroBgImage}
                        alt="Background"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Animated gradient glows */}
                <div className="absolute inset-0 opacity-40">
                    <div className="absolute -top-20 -left-20 w-96 h-96 bg-green-500 rounded-full mix-blend-screen filter blur-[100px] animate-pulse" />
                    <div className="absolute top-1/2 -right-20 w-80 h-80 bg-emerald-400 rounded-full mix-blend-screen filter blur-[100px] animate-pulse" style={{ animationDelay: "2s" }} />
                </div>

                {/* Grid pattern overlay */}
                <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
                    backgroundSize: "30px 30px",
                }} />

                <Container className="relative z-10 text-center">
                    <ScrollReveal>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-green-100 text-sm font-bold mb-6 border border-white/20">
                            <ShieldCheck className="w-5 h-5" />
                            {isRTL ? "جودة عالمية منذ عام 2000" : "Global Quality Since 2000"}
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white mb-6 leading-tight drop-shadow-xl">
                            {t.about.heroTitle}
                        </h1>
                        <p className="text-lg md:text-2xl text-green-50/90 leading-relaxed max-w-3xl mx-auto font-medium mb-12">
                            {t.about.heroSubtitle}
                        </p>

                        {/* Quick Trust Bar inside Hero */}
                        <div className="flex flex-wrap justify-center gap-4 md:gap-8 max-w-4xl mx-auto">
                            {[
                                { number: "25+", text: isRTL ? "عاماً من الخبرة" : "Years Experience" },
                                { number: "500", text: isRTL ? "طن يومياً" : "MT / Day Capacity" },
                                { number: "15+", text: isRTL ? "دولة تصدير" : "Export Countries" }
                            ].map((stat, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 + (idx * 0.1) }}
                                    className="flex flex-col items-center p-4 rounded-2xl bg-black/20 backdrop-blur-sm border border-white/10 min-w-[140px]"
                                >
                                    <span className="text-3xl md:text-4xl font-black text-white mb-1">{stat.number}</span>
                                    <span className="text-green-200 text-xs md:text-sm font-bold uppercase tracking-wider">{stat.text}</span>
                                </motion.div>
                            ))}
                        </div>
                    </ScrollReveal>
                </Container>
            </section>

            <StatsCounter />

            {/* ─── Story Timeline Section ─── */}
            <section className="py-24 bg-white overflow-hidden" ref={containerRef}>
                <Container>
                    <div className="max-w-4xl mx-auto mb-20 text-center">
                        <ScrollReveal>
                            <div className="flex flex-col items-center">
                                {/* Roots Badge */}
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-50 text-green-700 font-bold text-sm mb-6 border border-green-200">
                                    <Leaf className="w-5 h-5" />
                                    {isRTL ? "جذور التميز والريادة" : "Roots of Excellence"}
                                </div>

                                <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-10 text-center">
                                    {t.about.storyTitle}
                                </h2>

                                {/* Highlighted Story Card */}
                                <div className="relative p-8 md:p-12 bg-gradient-to-br from-gray-50 to-white rounded-3xl border border-gray-100 shadow-sm group transition-all duration-300 hover:shadow-lg hover:border-green-200 text-center md:text-start overflow-hidden">
                                    {/* Decorative large quote */}
                                    <Quote className={`absolute -top-4 -${isRTL ? 'right-4' : 'left-4'} w-32 h-32 text-green-50 group-hover:text-green-100 transition-colors transform ${isRTL ? '' : 'rotate-180'} -z-0 opacity-50`} />

                                    <Typography variant="body-lg" className="text-gray-700 leading-loose md:text-2xl font-medium relative z-10 drop-shadow-sm">
                                        {t.about.storyP1}
                                    </Typography>

                                    {/* Subtle green underline decoration */}
                                    <div className={`absolute bottom-0 ${isRTL ? 'left-8' : 'right-8'} w-32 h-1 bg-gradient-to-r from-green-300 to-green-500 rounded-t-full opacity-70`} />
                                </div>
                            </div>
                        </ScrollReveal>
                    </div>

                    <div className="relative max-w-4xl mx-auto">
                        {/* The glowing vertical line */}
                        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1 bg-gradient-to-b from-green-100 via-green-600 to-green-100 rounded-full hidden md:block" />

                        {/* Animated fill line */}
                        <motion.div
                            className="absolute top-0 left-1/2 -translate-x-1/2 w-1 bg-gradient-to-b from-yellow-300 to-green-400 rounded-full hidden md:block origin-top shadow-[0_0_15px_rgba(74,222,128,0.5)] z-0"
                            style={{ scaleY, height: "100%" }}
                        />

                        {/* Timeline Items */}
                        <div className="space-y-12 relative z-10 w-full">
                            {t.about.storyTimeline.map((item: any, i: number) => {
                                const isLeft = i % 2 === 0;
                                return (
                                    <div key={i} className="relative flex items-center justify-between flex-col md:flex-row w-full gap-8 md:gap-0">

                                        {/* Mobile structural line (hidden on desktop) */}
                                        <div className="absolute top-0 bottom-0 left-8 w-px bg-green-200 block md:hidden -z-10" />

                                        {/* Left Side Content */}
                                        <div className={`w-full md:w-5/12 ${isLeft ? "md:text-left" : "md:text-right md:order-last"} pl-16 md:pl-0`}>
                                            <ScrollReveal
                                                direction={isLeft ? (isRTL ? "right" : "left") : (isRTL ? "left" : "right")}
                                                delay={i * 0.15}
                                            >
                                                <div className={`p-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover:border-green-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative group`}>
                                                    <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 rounded-bl-full opacity-50 group-hover:scale-110 transition-transform" />
                                                    <span className="inline-block px-4 py-1.5 bg-green-100 text-green-700 font-bold text-sm rounded-full mb-4">
                                                        {item.year}
                                                    </span>
                                                    <h3 className="text-xl font-black text-gray-900 mb-2">{item.title}</h3>
                                                    <p className="text-gray-600 text-sm md:text-base leading-relaxed">{item.description}</p>
                                                </div>
                                            </ScrollReveal>
                                        </div>

                                        {/* Center Node */}
                                        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-12 h-12 rounded-full border-4 border-white bg-gradient-to-br from-green-500 to-green-700 items-center justify-center shadow-lg transform transition-transform duration-500 hover:scale-125 hover:rotate-12 z-20">
                                            {i === 0 ? <Factory className="w-5 h-5 text-white" /> :
                                                i === t.about.storyTimeline.length - 1 ? <Target className="w-5 h-5 text-white" /> :
                                                    <ShieldCheck className="w-5 h-5 text-white" />}
                                        </div>

                                        {/* Empty spacer for grid alignment */}
                                        <div className="hidden md:block w-5/12"></div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </Container>
            </section>

            {/* ─── Comprehensive CEO Section ─── */}
            <section className="py-24 bg-surface-soft relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-green-50/50 to-transparent pointer-events-none" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-green-100 rounded-full mix-blend-multiply opacity-50 blur-3xl pointer-events-none" />

                <Container>
                    <div className="flex flex-col lg:flex-row gap-16 items-start relative z-10">
                        {/* Left/Right Column: Photo & Quick Info */}
                        <div className="w-full lg:w-1/3 shrink-0">
                            <ScrollReveal>
                                <div className="sticky top-32">
                                    <div className="relative mb-8 aspect-square rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white group">
                                        {cmsContent?.ceo?.image ? (
                                            <img 
                                                src={cmsContent.ceo.image} 
                                                alt={t.about.ceoBio.name} 
                                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 z-10" 
                                                style={{ WebkitTransform: 'translateZ(0)', WebkitBackfaceVisibility: 'hidden', imageRendering: 'high-quality' as any }}
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center z-10 relative">
                                                <User className="w-40 h-40 text-gray-400 group-hover:scale-110 group-hover:text-green-600 transition-all duration-700" />
                                            </div>
                                        )}
                                    </div>

                                    <h2 className="text-3xl font-black text-gray-900 mb-2">{t.about.ceoBio.name}</h2>
                                    <p className="text-lg text-green-700 font-bold mb-6">{t.about.ceoBio.role}</p>

                                    {/* Quote Box */}
                                    <div className="relative p-6 bg-white rounded-2xl shadow-sm border border-green-100">
                                        <Quote className="absolute -top-3 -right-3 w-8 h-8 text-green-200 fill-current" />
                                        <p className="text-gray-600 italic leading-relaxed font-medium">
                                            {t.about.ceoQuote}
                                        </p>
                                    </div>
                                </div>
                            </ScrollReveal>
                        </div>

                        {/* Right/Left Column: Detailed Bio */}
                        <div className="w-full lg:w-2/3 space-y-12">
                            {/* Education & Early Life */}
                            <ScrollReveal delay={0.1}>
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                        <Target className="w-6 h-6" /> {/* Replace with GraduationCap if available */}
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-3">{t.about.ceoBio.educationTitle}</h3>
                                        <p className="text-gray-600 leading-relaxed text-lg">{t.about.ceoBio.educationDesc}</p>
                                    </div>
                                </div>
                            </ScrollReveal>

                            {/* Career Journey (Timeline Style) */}
                            {/* Career Journey (Timeline Style) */}
                            <div className="mb-24">
                                <ScrollReveal delay={0.2}>
                                    <div className="flex items-center gap-4 mb-4 justify-start">
                                        <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center shadow-sm">
                                            <Factory className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-3xl font-black text-gray-900">{t.about.ceoBio.careerTitle}</h3>
                                    </div>
                                </ScrollReveal>

                                <div className="relative w-full mt-10">
                                    {/* Mobile View: Vertical Left/Right Line */}
                                    <div className="md:hidden flex flex-col gap-6 relative">
                                        <div className={cn("absolute top-4 bottom-4 w-1 bg-green-100 rounded-full", isRTL ? "right-6" : "left-6")} />
                                        
                                        {t.about.ceoBio.careerStations.map((station, idx) => {
                                            const fallbackDomains = ["coca-cola.com", "aujan.com", "rabea.com", "nestle.com", "savola.com"];
                                            const domain = fallbackDomains[idx] || "company.com";
                                            const imageStr = cmsContent?.ceo?.careerStations?.[idx]?.image;
                                            const finalImage = (imageStr && imageStr.trim() !== "") ? imageStr : `https://logo.clearbit.com/${domain}`;

                                            return (
                                                <div key={idx} className="relative flex items-start gap-4 z-10">
                                                    <div className="w-12 h-12 rounded-full bg-white border-4 border-green-500 text-green-700 font-bold flex items-center justify-center shrink-0 shadow-sm mt-2">
                                                        {idx + 1}
                                                    </div>
                                                    <div className="bg-white p-5 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 flex-1 relative group w-full overflow-hidden">
                                                        <div className="flex items-start gap-4 mb-4">
                                                            <StationLogo src={finalImage} alt={station.title} />
                                                            <div className="flex-1 pt-1">
                                                                <h4 className="font-bold text-gray-900 text-base mb-1">{station.title}</h4>
                                                                <span className="inline-block px-2 py-1 rounded-md bg-green-50 text-green-700 font-bold text-xs">{station.role}</span>
                                                            </div>
                                                        </div>
                                                        {station.desc && <p className="text-gray-600 leading-relaxed text-sm mb-2">{station.desc}</p>}
                                                        {station.achievements && station.achievements.length > 0 && (
                                                            <ul className="space-y-1 list-disc list-inside text-sm text-gray-500 marker:text-gray-300">
                                                                {station.achievements.map((ach, achIdx) => (<li key={achIdx}>{ach}</li>))}
                                                            </ul>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Desktop View: Alternating Centered Vertical Timeline */}
                                    <div className="hidden md:flex flex-col gap-8 relative w-full pt-4 pb-4">
                                        <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-green-100 -translate-x-1/2 rounded-full"></div>

                                        {t.about.ceoBio.careerStations.map((station, idx) => {
                                            const isEven = idx % 2 === 0;
                                            const flexDir = isEven ? "flex-row-reverse" : "flex-row";
                                            // In RTL: flex-row flows Right->Left (empty space on Right, card on Left). 
                                            // If we want the first card (idx 0) on the Right, we need "flex-row" for idx 0.
                                            // Wait, in RTL, 'flex-row' child 0 is on the RIGHT. So card is child 2, card goes to LEFT.
                                            // To put card on the RIGHT in RTL, we use 'flex-row-reverse' (child 0 on LEFT, card on RIGHT).
                                            const fallbackDomains = ["coca-cola.com", "aujan.com", "rabea.com", "nestle.com", "savola.com"];
                                            const domain = fallbackDomains[idx] || "company.com";
                                            const imageStr = cmsContent?.ceo?.careerStations?.[idx]?.image;
                                            const finalImage = (imageStr && imageStr.trim() !== "") ? imageStr : `https://logo.clearbit.com/${domain}`;

                                            return (
                                                <div key={idx} className={cn("flex w-full items-center justify-between", flexDir)}>
                                                    <div className="w-[45%]"></div>
                                                    
                                                    <div className="w-12 h-12 rounded-full bg-white border-4 border-green-400 font-extrabold text-green-700 flex items-center justify-center shadow-lg relative z-10 shrink-0 text-lg">
                                                        {idx + 1}
                                                    </div>

                                                    <div className="w-[45%] flex">
                                                        <motion.div initial={{ opacity: 0, x: isEven ? -40 : 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.5, type: "spring" }} className="bg-white p-7 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] hover:border-green-300 transition-all duration-300 w-full group">
                                                            <div className="flex items-start gap-5 mb-4">
                                                                <StationLogo src={finalImage} alt={station.title} />
                                                                <div className="flex-1 pt-1">
                                                                    <h4 className="font-extrabold text-gray-900 text-lg mb-1.5 leading-tight group-hover:text-green-700 transition-colors">{station.title}</h4>
                                                                    <span className="inline-block px-3 py-1 rounded-full bg-green-50 text-green-700 font-bold text-xs uppercase tracking-wider">{station.role}</span>
                                                                </div>
                                                            </div>
                                                            
                                                            {station.desc && <p className="text-gray-600 leading-relaxed text-sm mb-4">{station.desc}</p>}
                                                            {station.achievements && station.achievements.length > 0 && (
                                                                <ul className="space-y-1.5 list-disc list-inside text-sm text-gray-500 marker:text-green-400 px-1">
                                                                    {station.achievements.map((ach, achIdx) => (<li key={achIdx}>{ach}</li>))}
                                                                </ul>
                                                            )}
                                                        </motion.div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Entrepreneurship & Expansion */}
                            <ScrollReveal delay={0.3}>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="p-8 bg-green-900 rounded-3xl text-white relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full group-hover:scale-110 transition-transform" />
                                        <ShieldCheck className="w-10 h-10 text-green-300 mb-6" />
                                        <h3 className="text-xl font-bold mb-3">{t.about.ceoBio.entrepreneurshipTitle}</h3>
                                        <p className="text-green-50/90 leading-relaxed">{t.about.ceoBio.entrepreneurshipDesc}</p>
                                    </div>
                                    <div className="p-8 bg-white border border-green-100 shadow-sm rounded-3xl group hover:shadow-lg transition-all">
                                        <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                            <Leaf className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-3">{t.about.ceoBio.expansionTitle}</h3>
                                        <p className="text-gray-600 leading-relaxed">{t.about.ceoBio.expansionDesc}</p>
                                    </div>
                                </div>
                            </ScrollReveal>

                            {/* Innovation & Leadership */}
                            <ScrollReveal delay={0.4}>
                                <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100">
                                    <div className="grid md:grid-cols-2 gap-10">
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 pb-4 border-b border-gray-100 mb-4">{t.about.ceoBio.innovationTitle}</h3>
                                            <ul className="space-y-3">
                                                {t.about.ceoBio.innovationPoints.map((point, idx) => (
                                                    <li key={idx} className="flex items-start gap-3">
                                                        <div className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0 mt-0.5">
                                                            <div className="w-2 h-2 rounded-full bg-green-600" />
                                                        </div>
                                                        <span className="text-gray-600 text-sm leading-relaxed">{point}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 pb-4 border-b border-gray-100 mb-4">{t.about.ceoBio.leadershipTitle}</h3>
                                            <ul className="space-y-3">
                                                {t.about.ceoBio.leadershipPoints.map((point, idx) => (
                                                    <li key={idx} className="flex items-start gap-3">
                                                        <div className="w-5 h-5 bg-blue-50 text-blue-600 rounded flex items-center justify-center shrink-0 mt-0.5">
                                                            <Target className="w-5 h-5" />
                                                        </div>
                                                        <span className="text-gray-600 text-sm leading-relaxed">{point}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="mt-8 pt-8 border-t border-gray-100">
                                        <h3 className="text-xl font-bold text-gray-900 mb-3">{t.about.ceoBio.visionTitle}</h3>
                                        <p className="text-gray-600 leading-relaxed text-lg">{t.about.ceoBio.visionDesc}</p>
                                    </div>
                                </div>
                            </ScrollReveal>
                        </div>
                    </div>
                </Container>
            </section>

            {/* ─── Executive Team Section ─── */}
            <section className="py-24 bg-surface-light relative overflow-hidden">
                <Container>
                    <ScrollReveal>
                        <div className="text-center mb-20 flex flex-col items-center justify-center">
                            {/* Premium Glassmorphic Badge */}
                            <div className="inline-flex items-center justify-center gap-2.5 px-6 py-2.5 rounded-full bg-green-50/80 backdrop-blur-md text-green-700 font-bold text-sm md:text-base mb-6 border border-green-200/50 shadow-sm ring-1 ring-black/5">
                                <Users className="w-5 h-5 md:w-6 md:h-6 shrink-0" />
                                <span>{teamBadge}</span>
                            </div>
                            
                            {/* Sleek Gradient Title */}
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-800 to-gray-600 mb-6 tracking-tight drop-shadow-sm pb-4 leading-normal">
                                {teamTitle}
                            </h2>
                            
                            {/* Balanced, highly readable description */}
                            <p 
                                className="text-lg md:text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed md:leading-loose"
                                style={{ textWrap: 'balance' }}
                            >
                                {teamDesc}
                            </p>
                        </div>
                    </ScrollReveal>

                    <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8 items-stretch justify-items-center">
                        {teamMembers.map((member: any, i: number) => {
                            const name = isRTL ? (member.name_ar || member.name) : (member.name_en || member.name);
                            const role = isRTL ? (member.role_ar || member.role) : (member.role_en || member.role);
                            const image = member.image || "";
                            
                            return (
                                <StaggerItem key={i} className="w-full h-full max-w-[320px]">
                                    <div className="group bg-white rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-all duration-500 border border-gray-100 flex flex-col h-full hover:-translate-y-3 relative">
                                        
                                        {/* Large Top Cover Profile Photo */}
                                        <div className="w-full aspect-square relative overflow-hidden bg-gray-50 flex items-center justify-center shrink-0 border-b border-gray-50">
                                            {image ? (
                                                <img src={image} alt={name} className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700" />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center group-hover:scale-105 transition-transform duration-700">
                                                    <User className="w-20 h-20 text-gray-300 group-hover:text-green-500 transition-colors" />
                                                </div>
                                            )}
                                            
                                            {/* Subtle gradient overlay at the bottom of the image for smooth blending */}
                                            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-white/20 to-transparent pointer-events-none" />
                                        </div>
                                        
                                        {/* Profile Information */}
                                        <div className="p-6 text-center bg-white relative z-20 w-full mt-auto flex flex-col items-center justify-center">
                                            <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight group-hover:text-green-700 transition-colors">{name}</h3>
                                            <span className="inline-block px-4 py-1.5 rounded-full bg-green-50 text-green-700 font-bold text-sm">
                                                {role}
                                            </span>
                                        </div>
                                    </div>
                                </StaggerItem>
                            );
                        })}
                    </StaggerContainer>
                </Container>
            </section>

            {/* Factory Gallery */}
            <section className="py-24 bg-white">
                <Container>
                    <ScrollReveal>
                        <div className="text-center mb-16 flex flex-col items-center justify-center">
                            <div className="inline-flex items-center justify-center gap-2.5 px-6 py-2.5 rounded-full bg-blue-50/80 backdrop-blur-md text-blue-700 font-bold text-sm md:text-base mb-6 border border-blue-200/50 shadow-sm ring-1 ring-black/5">
                                <Factory className="w-5 h-5 md:w-6 md:h-6 shrink-0" />
                                <span>{isRTL ? "عدسة المصنع" : "Factory Lens"}</span>
                            </div>
                            
                            <h2 className="text-4xl md:text-5xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-800 to-gray-600 mb-6 tracking-tight drop-shadow-sm pb-4 leading-normal">
                                {galleryTitle}
                            </h2>
                            
                            {gallerySubtitle && (
                                <p className="text-lg md:text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed md:leading-loose" style={{ textWrap: 'balance' }}>
                                    {gallerySubtitle}
                                </p>
                            )}
                        </div>
                    </ScrollReveal>
                    <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {galleryItems.map((item: any, i: number) => {
                            const itemTitle = typeof item === 'string' ? item : (isRTL ? (item.title_ar || item.title) : (item.title_en || item.title) || item.title);
                            const itemUrl = item.url || item.image || "";
                            return (
                                <StaggerItem key={i}>
                                    <div className="aspect-square bg-surface-soft rounded-2xl overflow-hidden shadow-sm border border-surface-light relative group">
                                        {itemUrl ? (
                                            <>
                                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center p-4 text-center">
                                                    <Typography variant="small" className="text-white font-bold">{itemTitle}</Typography>
                                                </div>
                                                <img 
                                                    src={itemUrl.startsWith('/uploads') ? `${itemUrl}?v=1` : itemUrl} 
                                                    alt={itemTitle} 
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                                    onError={(e) => {
                                                        const target = e.currentTarget;
                                                        target.style.display = 'none';
                                                        target.nextElementSibling?.classList.remove('hidden');
                                                    }}
                                                />
                                                <div className="hidden absolute inset-0 bg-slate-100 flex-col items-center justify-center p-4 text-center text-slate-400 gap-3">
                                                    <Factory className="w-8 h-8 opacity-50 text-red-400" />
                                                    <Typography variant="small" className="font-bold text-slate-500">Image Broken</Typography>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="absolute inset-0 bg-slate-100 opacity-60"></div>
                                                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center text-slate-400 gap-3 group-hover:scale-105 transition-transform duration-500">
                                                    <Factory className="w-8 h-8 opacity-50" />
                                                    <Typography variant="small" className="font-bold text-slate-500">
                                                        {itemTitle}
                                                    </Typography>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </StaggerItem>
                            );
                        })}
                    </StaggerContainer>
                </Container>
            </section>

            <CTAPartnership />
            <Footer />
        </main>
    );
}
