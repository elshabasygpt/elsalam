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
        <div className={`mb-16 ${align === "center" ? "text-center" : "text-start"} ${className ?? ""}`}>
            <Typography variant="h2" className="text-primary-dark mb-4">
                {title}
            </Typography>
            {subtitle && (
                <Typography variant="body-lg" className="text-text-dark/70 max-w-2xl mx-auto">
                    {subtitle}
                </Typography>
            )}
        </div>
    );
};
