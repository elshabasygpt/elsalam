import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        container: {
            center: true,
            padding: "16px",
            screens: {
                tablet: "1024px",
                desktop: "1280px",
            },
        },
        extend: {
            colors: {
                primary: {
                    green: "#2E7D32",
                    dark: "#1B5E20",
                },
                accent: {
                    green: "#66BB6A",
                    gold: "#F4A100",
                },
                surface: {
                    soft: "#F8FAF9",
                    light: "#EDEDED",
                    white: "#FFFFFF",
                },
                text: {
                    dark: "#1F2937",
                },
            },
            fontFamily: {
                arabic: ["var(--font-cairo)", "Cairo", "sans-serif"],
                english: ["var(--font-inter)", "Inter", "sans-serif"],
            },
            fontSize: {
                h1: ["48px", { lineHeight: "1.2", fontWeight: "700" }],
                h2: ["36px", { lineHeight: "1.3", fontWeight: "700" }],
                h3: ["28px", { lineHeight: "1.4", fontWeight: "600" }],
                h4: ["22px", { lineHeight: "1.4", fontWeight: "500" }],
                "body-lg": ["18px", { lineHeight: "1.6", fontWeight: "400" }],
                body: ["16px", { lineHeight: "1.6", fontWeight: "400" }],
                small: ["14px", { lineHeight: "1.5", fontWeight: "400" }],
            },
            borderRadius: {
                sm: "6px",
                md: "12px",
                lg: "20px",
                section: "48px",
            },
            boxShadow: {
                card: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
                elevation: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                modal: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            },
        },
    },
    plugins: [],
};

export default config;
