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
    { value: 25, suffix: "+", labelKey: "experience", icon: <CalendarDays className="w-12 h-12 md:w-14 md:h-14" strokeWidth={1.5} /> },
    { value: 500, labelKey: "production", icon: <Factory className="w-12 h-12 md:w-14 md:h-14" strokeWidth={1.5} /> },
    { value: 15, suffix: "+", labelKey: "exports", icon: <Globe className="w-12 h-12 md:w-14 md:h-14" strokeWidth={1.5} /> },
    { value: 200, suffix: "+", labelKey: "clients", icon: <Handshake className="w-12 h-12 md:w-14 md:h-14" strokeWidth={1.5} /> },
    { value: 8, labelKey: "lines", icon: <Settings className="w-12 h-12 md:w-14 md:h-14" strokeWidth={1.5} /> },
    { value: 6, labelKey: "certifications", icon: <ShieldCheck className="w-12 h-12 md:w-14 md:h-14" strokeWidth={1.5} /> },
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
            <div ref={ref} className="bg-white rounded-3xl p-6 md:p-8 text-center flex flex-col items-center group shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] border border-surface-light hover:border-primary-green/20 transition-all duration-300 hover:-translate-y-1 h-full">
                <span className="flex items-center justify-center mb-5 md:mb-6 text-primary-green group-hover:scale-110 group-hover:-translate-y-2 transition-transform duration-500">
                    {stat.icon}
                </span>
                <span className="text-4xl md:text-5xl lg:text-6xl font-black text-primary-dark tabular-nums mb-2 tracking-tight">
                    {stat.prefix}<span className="text-primary-green">{count}</span>{stat.suffix}
                </span>
                <span className="text-base md:text-lg text-text-dark/80 font-bold">{label}</span>
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
        <section className="py-24 bg-surface-soft border-y border-surface-light relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-primary-green/5 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-accent-gold/5 blur-3xl pointer-events-none" />

            <Container className="relative z-10 w-full max-w-[1400px]">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
                    {/* Left Column (Text) - One third */}
                    <div className="lg:col-span-4 space-y-6 text-center lg:text-start relative z-20">
                        <ScrollReveal>
                            <span className="text-primary-green font-bold text-sm tracking-wider bg-primary-green/10 px-4 py-2 rounded-full inline-block mb-3">
                                {texts.badge}
                            </span>
                            <h2 className="text-3xl lg:text-5xl font-bold text-primary-dark leading-tight lg:leading-tight">
                                {texts.title}
                            </h2>
                            <p className="text-text-dark/70 text-lg leading-relaxed mt-6">
                                {texts.description}
                            </p>

                            <div className="mt-8 pt-8 border-t border-surface-light hidden lg:flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full bg-primary-green/10 flex items-center justify-center shrink-0">
                                    <ShieldCheck className="w-7 h-7 text-primary-green" />
                                </div>
                                <div className="text-start">
                                    <p className="font-bold text-primary-dark text-lg">{texts.badgeTitle}</p>
                                    <p className="text-sm text-text-dark/60 mt-1">{texts.badgeSub}</p>
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
