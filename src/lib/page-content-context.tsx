"use client";

import React, { createContext, useContext } from "react";

/**
 * PageContentContext provides CMS overrides for page sections.
 * Components check this context first, then fall back to i18n.
 *
 * Usage:
 *   const overrides = usePageContent("heroSlides");
 *   // overrides?.slides or fall back to t.heroSlides
 */

type PageContentData = Record<string, any>;

const PageContentContext = createContext<PageContentData>({});

export function PageContentProvider({
    content,
    children,
}: {
    content: PageContentData;
    children: React.ReactNode;
}) {
    return (
        <PageContentContext.Provider value={content}>
            {children}
        </PageContentContext.Provider>
    );
}

/**
 * Returns CMS overrides for a specific section, or undefined if none exist.
 */
export function usePageContent(sectionId: string): Record<string, any> | undefined {
    const ctx = useContext(PageContentContext);
    const section = ctx?.[sectionId];
    // Only return if section has actual data (not empty object)
    if (section && typeof section === "object" && Object.keys(section).length > 0) {
        return section;
    }
    return undefined;
}

/**
 * Helper: get bilingual value from CMS data based on current locale.
 * CMS stores bilingual fields as key_ar / key_en.
 *
 * Usage:
 *   const title = getBilingualValue(overrides, "title", locale) ?? t.heroSlides[0].titleLine1;
 */
export function getBilingualValue(
    data: Record<string, any> | undefined,
    key: string,
    locale: "ar" | "en"
): string | undefined {
    if (!data) return undefined;
    const localeKey = `${key}_${locale}`;
    const val = data[localeKey] || data[key];
    return val && typeof val === "string" && val.trim() !== "" ? val : undefined;
}

/**
 * Helper: get bilingual value from a list item.
 */
export function getItemBilingual(
    item: Record<string, any>,
    key: string,
    locale: "ar" | "en"
): string {
    return item[`${key}_${locale}`] || item[key] || "";
}
