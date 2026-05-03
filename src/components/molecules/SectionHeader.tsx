"use client";

import React from "react";
import { Container } from "@/components/atoms/Container";
import { Typography } from "@/components/atoms/Typography";

interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    align?: "center" | "start";
    className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
    title,
    subtitle,
    align = "center",
    className,
}) => {
    return (
        <div className={`mb-16 flex flex-col items-center gap-6 ${align === "center" ? "text-center" : "text-start"} ${className ?? ""}`}>
            <Typography variant="h2" align={align} className="text-primary-dark font-black text-4xl md:text-5xl drop-shadow-sm leading-tight">
                {title}
            </Typography>
            {subtitle && (
                <Typography variant="body-lg" align={align} className="text-text-dark/70 max-w-3xl mx-auto text-lg md:text-xl text-balance leading-relaxed">
                    {subtitle}
                </Typography>
            )}
        </div>
    );
};
