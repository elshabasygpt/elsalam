/**
 * Helper to determine current direction based on locale
 */
export const isRTL = (locale: string): boolean => {
    return locale === "ar";
};

/**
 * Returns the appropriate alignment class based on language
 */
export const getTextAlign = (locale: string) => {
    return isRTL(locale) ? "text-right" : "text-left";
};

/**
 * Flip an icon horizontally if RTL
 */
export const getIconFlipClass = (locale: string, flipInRTL: boolean = true) => {
    if (!flipInRTL) return "";
    return isRTL(locale) ? "transform scale-x-[-1]" : "";
};
