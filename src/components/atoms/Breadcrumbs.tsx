"use client";

import Link from "next/link";
import { ChevronLeft, Home } from "lucide-react";
import { cn } from "@/utils/classnames";

export interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
    variant?: "dark" | "light";
    className?: string;
}

export const Breadcrumbs = ({ items, variant = "dark", className }: BreadcrumbsProps) => {
    const isLight = variant === "light";

    return (
        <nav aria-label="Breadcrumb" className={cn("flex items-center gap-1.5 text-sm", className)}>
            <Link
                href="/"
                className={cn(
                    "flex items-center gap-1 transition-colors",
                    isLight
                        ? "text-white/60 hover:text-white"
                        : "text-gray-400 hover:text-green-700"
                )}
            >
                <Home className="w-5 h-5" />
            </Link>

            {items.map((item, i) => (
                <span key={i} className="flex items-center gap-1.5">
                    <ChevronLeft className={cn("w-5 h-5", isLight ? "text-white/30" : "text-gray-300")} />
                    {item.href && i < items.length - 1 ? (
                        <Link
                            href={item.href}
                            className={cn(
                                "transition-colors font-medium",
                                isLight
                                    ? "text-white/60 hover:text-white"
                                    : "text-gray-400 hover:text-green-700"
                            )}
                        >
                            {item.label}
                        </Link>
                    ) : (
                        <span className={cn(
                            "font-bold",
                            isLight ? "text-white/90" : "text-gray-700"
                        )}>
                            {item.label}
                        </span>
                    )}
                </span>
            ))}
        </nav>
    );
};
