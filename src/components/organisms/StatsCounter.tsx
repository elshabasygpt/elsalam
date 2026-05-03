"use client";

import React, { useEffect, useState, useRef } from "react";
import { Container } from "@/components/atoms/Container";
import { StaggerContainer, StaggerItem, ScrollReveal } from "@/components/atoms/ScrollReveal";
import { CalendarDays, Factory, Globe, Handshake, Settings, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/lib/i18n-context";

interface Stat {
    value: number;
    suffix?: string;
    prefix?: string;
    labelKey: string;
    icon: React.ReactNode;
}

const DEFAULT_STATS: Stat[] = [
    { value: 25, suffix: "+", labelKey: "experience", icon: <CalendarDays className="w-20 h-20 md:w-24 md:h-24" strokeWidth={1} /> },
    { value: 500, labelKey: "production", icon: <Factory className="w-20 h-20 md:w-24 md:h-24" strokeWidth={1} /> },
    { value: 15, suffix: "+", labelKey: "exports", icon: <Globe className="w-20 h-20 md:w-24 md:h-24" strokeWidth={1} /> },
    { value: 200, suffix: "+", labelKey: "clients", icon: <Handshake className="w-20 h-20 md:w-24 md:h-24" strokeWidth={1} /> },
    { value: 8, labelKey: "lines", icon: <Settings className="w-20 h-20 md:w-24 md:h-24" strokeWidth={1} /> },
    { value: 6, labelKey: "certifications", icon: <ShieldCheck className="w-20 h-20 md:w-24 md:h-24" strokeWidth={1} /> },
];

function useCountUp(target: number, duration: number = 2000, triggerRef: React.RefObject<HTMLElement | null>) {
    const [count, setCount] = useState(0);
    const started = useRef(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !started.current) {
                    started.current = true;
                    const startTime = performance.now();
                    const animate = (now: number) => {
                        const elapsed = now - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        setCount(Math.floor(progress * target));
                        if (progress < 1) requestAnimationFrame(animate);
                    };
                    requestAnimationFrame(animate);
                }
            },
            { threshold: 0.3 }
        );
        if (triggerRef.current) observer.observe(triggerRef.current);
        return () => observer.disconnect();
    }, [target, duration, triggerRef]);

    return count;
}

function StatItem({ stat }: { stat: Stat }) {
    const ref = useRef<HTMLDivElement>(null);
    const count = useCountUp(stat.value, 2000, ref);
    const { t } = useLanguage();
    const label = t.stats[stat.labelKey as keyof typeof t.stats];

    return (
        <StaggerItem>
            <div ref={ref} className="relative overflow-hidden rounded-3xl p-6 md:p-8 text-center flex flex-col items-center group bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-all duration-500 hover:-translate-y-2 h-full shadow-[0_8px_32px_rgba(0,0,0,0.15)] hover:shadow-[0_20px_40px_rgba(209,136,27,0.2)]">
                {/* Subtle top glow on hover */}
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#d1881b] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <span className="flex items-center justify-center mb-6 text-[#d1881b] group-hover:scale-110 group-hover:text-white transition-all duration-500 drop-shadow-md">
                    {stat.icon}
                </span>
                <span className="text-4xl md:text-5xl lg:text-6xl font-black text-white tabular-nums mb-3 tracking-tight drop-shadow-lg flex items-center justify-center gap-1">
                    {stat.prefix && <span className="text-2xl md:text-3xl text-[#d1881b]">{stat.prefix}</span>}
                    {count}
                    {stat.suffix && <span className="text-2xl md:text-3xl text-[#d1881b]">{stat.suffix}</span>}
                </span>
                <span className="text-base md:text-lg text-white/70 font-medium tracking-wide">{label}</span>
            </div>
        </StaggerItem>
    );
}

export const StatsCounter = () => {
    const { locale } = useLanguage();
    const [stats, setStats] = useState<Stat[]>(DEFAULT_STATS);

    // Stats are loaded from defaults (set them from the CMS later)


    const texts = {
        badge: locale === 'ar' ? "أرقامنا تتحدث" : "Our Numbers Speak",
        title: locale === 'ar' ? "أرقام تعكس ريادتنا في صناعة الزيوت" : "Figures Reflecting Our Oil Industry Leadership",
        description: locale === 'ar' ? "على مدار أكثر من عقدين من الزمن، بنينا الثقة من خلال الجودة العالية، والاعتماد على أفضل التقنيات لتقديم منتجات تلبي تطلعات عملائنا في السوق المحلي والعالمي." : "Over the past two decades, we have built trust through high quality and reliance on the best technologies to deliver products that meet our clients' aspirations globally.",
        badgeTitle: locale === 'ar' ? "جودة مضمونة" : "Guaranteed Quality",
        badgeSub: locale === 'ar' ? "حاصلون على أعلى شهادات الجودة والتصنيع" : "Certified with the highest quality standards"
    };

    return (
        <section className="py-24 relative overflow-hidden bg-primary-dark">
            {/* Immersive Background */}
            <div className="absolute inset-0 z-0">
                <img 
                    src="https://images.unsplash.com/photo-1587314168485-3236d6710814?q=80&w=2500&auto=format&fit=crop" 
                    alt="Factory Background" 
                    className="w-full h-full object-cover opacity-10 mix-blend-luminosity grayscale"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-primary-dark via-primary-dark/95 to-[#0f2c1b]/90" />
                <div className="absolute inset-0 bg-[url('/images/pattern-dots.svg')] opacity-[0.05]" />
            </div>

            {/* Glowing Orbs */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-primary-green/10 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-accent-gold/5 blur-[100px] pointer-events-none" />

            <Container className="relative z-10 w-full max-w-[1400px]">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12 items-center">
                    {/* Left Column (Text) - One third */}
                    <div className="lg:col-span-4 space-y-6 text-center lg:text-start relative z-20">
                        <ScrollReveal>
                            <span className="text-white font-bold text-sm tracking-widest bg-white/10 backdrop-blur-sm border border-white/20 px-6 py-2 rounded-full inline-block mb-6 shadow-xl uppercase">
                                {texts.badge}
                            </span>
                            <h2 className="text-4xl lg:text-5xl font-black text-white leading-tight lg:leading-tight mb-6 drop-shadow-xl">
                                {texts.title}
                            </h2>
                            <p className="text-white/80 text-lg leading-relaxed mb-10 text-balance">
                                {texts.description}
                            </p>

                            <div className="pt-8 border-t border-white/10 hidden lg:flex items-center gap-5">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-green/20 to-primary-green/5 border border-primary-green/30 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(30,136,70,0.2)]">
                                    <ShieldCheck className="w-8 h-8 text-primary-green" />
                                </div>
                                <div className="text-start">
                                    <p className="font-bold text-white text-xl mb-1">{texts.badgeTitle}</p>
                                    <p className="text-sm text-white/60 leading-snug">{texts.badgeSub}</p>
                                </div>
                            </div>
                        </ScrollReveal>
                    </div>

                    {/* Right Column (Grid) - Two thirds */}
                    <div className="lg:col-span-8 relative z-20">
                        <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6" staggerDelay={0.08}>
                            {stats.map((stat, i) => (
                                <StatItem key={i} stat={stat} />
                            ))}
                        </StaggerContainer>
                    </div>
                </div>
            </Container>
        </section>
    );
};
