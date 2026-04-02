"use client";

import React, { useState } from "react";
import { Container } from "@/components/atoms/Container";
import { ScrollReveal } from "@/components/atoms/ScrollReveal";
import { ChevronDown, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/lib/i18n-context";
import { usePageContent, getBilingualValue, getItemBilingual } from "@/lib/page-content-context";

export const FAQ = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const { t, locale } = useLanguage();
    const cms = usePageContent("faq");

    const title = getBilingualValue(cms, "title", locale) ?? t.faq.title;
    const subtitle = getBilingualValue(cms, "subtitle", locale) ?? t.faq.subtitle;
    const items = (cms?.items && Array.isArray(cms.items) && cms.items.length > 0)
        ? cms.items.map((item: any) => ({ question: getItemBilingual(item, "question", locale), answer: getItemBilingual(item, "answer", locale) }))
        : t.faq.items;

    const toggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="py-24 bg-surface-soft relative overflow-hidden">
            <div className="absolute top-0 left-0 w-96 h-96 bg-green-100/30 rounded-full blur-3xl pointer-events-none" />

            <Container className="relative z-10 max-w-3xl">
                <ScrollReveal>
                    <div className="text-center mb-14">
                        <span className="inline-block py-1.5 px-5 rounded-full bg-amber-100 text-amber-700 text-sm font-bold mb-6 border border-amber-200">
                            <HelpCircle className="w-5 h-5 inline-block mr-1.5 -mt-0.5" />
                            {title}
                        </span>
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">{title}</h2>
                        <p className="text-gray-500 text-base max-w-lg mx-auto">{subtitle}</p>
                    </div>
                </ScrollReveal>

                <div className="space-y-3">
                    {items.map((item, i) => {
                        const isOpen = openIndex === i;
                        return (
                            <ScrollReveal key={i} delay={i * 0.05}>
                                <div className={`bg-white rounded-2xl border-2 transition-all duration-300 overflow-hidden ${isOpen ? "border-green-500 shadow-lg shadow-green-100/50" : "border-gray-100 hover:border-green-200"
                                    }`}>
                                    <button
                                        onClick={() => toggle(i)}
                                        className="w-full flex items-center justify-between p-5 text-right gap-4"
                                        aria-expanded={isOpen}
                                    >
                                        <span className={`font-bold text-base transition-colors ${isOpen ? "text-green-700" : "text-gray-900"}`}>
                                            {item.question}
                                        </span>
                                        <ChevronDown className={`w-5 h-5 shrink-0 transition-all duration-300 ${isOpen ? "rotate-180 text-green-600" : "text-gray-400"}`} />
                                    </button>

                                    <AnimatePresence initial={false}>
                                        {isOpen && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                            >
                                                <div className="px-5 pb-5 pt-0">
                                                    <div className="w-12 h-0.5 bg-green-500 rounded-full mb-3" />
                                                    <p className="text-gray-500 text-sm leading-relaxed">{item.answer}</p>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </ScrollReveal>
                        );
                    })}
                </div>
            </Container>
        </section>
    );
};
