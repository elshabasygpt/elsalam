"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { ar, en, type TranslationKeys } from "@/lib/translations";

type Locale = "ar" | "en";

interface LanguageContextValue {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: TranslationKeys;
    dir: "rtl" | "ltr";
    isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const translations: Record<Locale, TranslationKeys> = { ar, en };

const STORAGE_KEY = "elsalam-locale";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>("ar");
    const [mounted, setMounted] = useState(false);

    // Read saved locale on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
            if (saved === "ar" || saved === "en") {
                setLocaleState(saved);
            }
        } catch {
            // localStorage not available
        }
        setMounted(true);
    }, []);

    // Apply dir and lang to document when locale changes
    useEffect(() => {
        if (!mounted) return;
        const dir = locale === "ar" ? "rtl" : "ltr";
        document.documentElement.dir = dir;
        document.documentElement.lang = locale;
        document.documentElement.style.fontFamily =
            locale === "ar"
                ? "var(--font-cairo), sans-serif"
                : "var(--font-inter), sans-serif";
    }, [locale, mounted]);

    const setLocale = useCallback((newLocale: Locale) => {
        setLocaleState(newLocale);
        try {
            localStorage.setItem(STORAGE_KEY, newLocale);
        } catch {
            // localStorage not available
        }
    }, []);

    const t = translations[locale];
    const dir = locale === "ar" ? "rtl" : "ltr";
    const isRTL = locale === "ar";

    return (
        <LanguageContext.Provider value={{ locale, setLocale, t, dir, isRTL }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage(): LanguageContextValue {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}
