/**
 * Strictly typed Design Tokens exported for JS/TS logic beyond CSS
 * Mirrors the tailwind config and DESIGN_SYSTEM.md to maintain single source of truth.
 */

export const colors = {
    primary: {
        green: '#2E7D32',
        dark: '#1B5E20',
    },
    accent: {
        green: '#66BB6A',
        gold: '#F4A100',
    },
    surface: {
        soft: '#F8FAF9',
        light: '#EDEDED',
        white: '#FFFFFF',
    },
    text: {
        dark: '#1F2937',
    }
} as const;

export const spacing = {
    4: '4px',
    8: '8px',
    16: '16px',
    24: '24px',
    32: '32px',
    48: '48px',
    64: '64px',
    96: '96px',
} as const;

export const radius = {
    sm: '6px',
    md: '12px',
    lg: '20px',
    section: '48px',
} as const;

export type ThemeColors = typeof colors;
export type ThemeSpacing = typeof spacing;
export type ThemeRadius = typeof radius;
