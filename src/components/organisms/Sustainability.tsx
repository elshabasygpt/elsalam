"use client";

import React from "react";
import { Container } from "@/components/atoms/Container";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/atoms/ScrollReveal";
import { useLanguage } from "@/lib/i18n-context";
import { Recycle, Sun, Leaf, Droplets } from "lucide-react";

const SUSTAINABILITY_FEATURES = [
    {
        icon: Leaf,
        titleEn: "Ethical Sourcing",
        titleAr: "توريد أخلاقي ومستدام",
        descEn: "Partnering strictly with farms that practice sustainable agriculture.",
        descAr: "شراكات حصريّة مع مزارع تطبّق أساليب الزراعة المستدامة.",
    },
    {
        icon: Recycle,
        titleEn: "Zero-Waste Policy",
        titleAr: "سياسة انعدام الهدر (Zero-Waste)",
        descEn: "100% of organic byproducts are recycled into animal feed or biofuel.",
        descAr: "إعادة تدوير 100% من المخلفات العضوية وتحويلها لأعلاف أو وقود حيوي.",
    },
    {
        icon: Sun,
        titleEn: "Clean Energy Integration",
        titleAr: "الاعتماد على الطاقة النظيفة",
        descEn: "Actively transitioning our facilities to solar and renewable energy grids.",
        descAr: "نعمل بنشاط على انتقال مرافقنا للعمل بشبكات الطاقة الشمسية والمتجددة.",
    },
    {
        icon: Droplets,
        titleEn: "Water Conservation",
        titleAr: "ترشيد استهلاك المياه",
        descEn: "Advanced closed-loop water systems reduce our consumption by over 40%.",
        descAr: "أنظمة مياه متطورة ومغلقة تقلل من استهلاكنا للمياه بأكثر من 40%.",
    }
];

export const Sustainability = () => {
    const { locale, isRTL } = useLanguage();

    return (
        <section className="py-24 bg-white relative overflow-hidden" id="sustainability">
            {/* Background decorative elements */}
            <div className={`absolute top-0 w-full h-1/2 bg-gradient-to-b from-green-50 to-transparent ${isRTL ? 'right-0' : 'left-0'}`} />
            <div className="absolute -bottom-[200px] -right-[200px] w-[500px] h-[500px] bg-green-100/50 rounded-full blur-[80px]" />
            <div className="absolute top-[100px] -left-[100px] w-[300px] h-[300px] bg-emerald-50 rounded-full blur-[60px]" />

            <Container className="relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Left/Right Text & Features */}
                    <div>
                        <ScrollReveal>
                            <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-green-100 text-green-700 text-sm font-bold mb-6 border border-green-200">
                                <Leaf className="w-5 h-5" />
                                {locale === 'en' ? 'Sustainability & CSR' : 'المسؤولية البيئية والمجتمعية'}
                            </span>

                            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
                                {locale === 'en' ? 'Brewing a Greener Future' : 'نصنع مستقبلاً أكثر اخضراراً'}
                            </h2>

                            <p className="text-gray-600 text-lg leading-relaxed mb-10">
                                {locale === 'en'
                                    ? 'At Elsalam Factory, we believe that world-class quality should never come at the expense of our planet. We integrate deeply sustainable practices into every stage of our supply chain and manufacturing process.'
                                    : 'في مصنع السلام، نؤمن بأن الجودة العالمية لا يجب أن تأتي على حساب كوكبنا. نحن ندمج الممارسات المستدامة بعمق في كل مرحلة من مراحل سلسلة التوريد وعمليات التصنيع.'}
                            </p>

                            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-10">
                                {SUSTAINABILITY_FEATURES.map((feat, idx) => {
                                    const Icon = feat.icon;
                                    return (
                                        <StaggerItem key={idx}>
                                            <div className="flex flex-col gap-3">
                                                <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-600 mb-2 border border-green-100">
                                                    <Icon strokeWidth={1.5} className="w-6 h-6" />
                                                </div>
                                                <h4 className="text-xl font-bold text-gray-900">
                                                    {locale === 'en' ? feat.titleEn : feat.titleAr}
                                                </h4>
                                                <p className="text-gray-600 text-sm leading-relaxed">
                                                    {locale === 'en' ? feat.descEn : feat.descAr}
                                                </p>
                                            </div>
                                        </StaggerItem>
                                    );
                                })}
                            </StaggerContainer>
                        </ScrollReveal>
                    </div>

                    {/* Right/Left Image & Visuals */}
                    <div className="relative">
                        <ScrollReveal direction={isRTL ? "left" : "right"}>
                            <div className="relative rounded-[2rem] overflow-hidden aspect-[4/5] shadow-2xl group">
                                <img
                                    src="/images/placeholder.svg"
                                    alt="Sustainability"
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1500ms]"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-green-900/80 via-transparent to-transparent opacity-80" />

                                {/* Overlay floating badge */}
                                <div className={`absolute bottom-8 ${isRTL ? 'right-8' : 'left-8'} z-10 bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl max-w-[280px] shadow-2xl`}>
                                    <div className="text-white">
                                        <h5 className="font-black text-4xl mb-2 text-green-400">100%</h5>
                                        <p className="text-white/90 font-medium leading-snug">
                                            {locale === 'en'
                                                ? 'Commitment to sustainable and ethical manufacturing standards.'
                                                : 'التزام تام بمعايير التصنيع المستدام والأخلاقي.'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Decorative organic shapes */}
                            <div className={`absolute -top-12 ${isRTL ? '-left-12' : '-right-12'} w-32 h-32 rounded-full border-4 border-green-500/20 translate-y-8`} />
                            <div className={`absolute -bottom-8 ${isRTL ? '-right-8' : '-left-8'} w-24 h-24 rounded-full border-8 border-yellow-400/20`} />
                        </ScrollReveal>
                    </div>

                </div>
            </Container>
        </section>
    );
};
