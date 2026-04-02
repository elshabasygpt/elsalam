"use client";

import React from "react";
import { Button } from "@/components/atoms/Button";

interface LanguageSwitcherProps {
    currentLocale: "ar" | "en";
    onChange: (locale: "ar" | "en") => void;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
    currentLocale,
    onChange,
}) => {
    return (
        <div className="flex bg-surface-light rounded-sm p-1 gap-1">
            <Button
                variant={currentLocale === "ar" ? "primary" : "ghost"}
                size="sm"
                onClick={() => onChange("ar")}
                className="rounded-[4px] min-w-[60px]"
                aria-pressed={currentLocale === "ar"}
            >
                عربي
            </Button>
            <Button
                variant={currentLocale === "en" ? "primary" : "ghost"}
                size="sm"
                onClick={() => onChange("en")}
                className="rounded-[4px] font-english min-w-[60px]"
                aria-pressed={currentLocale === "en"}
            >
                EN
            </Button>
        </div>
    );
};
