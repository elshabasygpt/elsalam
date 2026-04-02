"use client";

import React from "react";
import { Share2, MessageCircle, Facebook, Linkedin, Link2 } from "lucide-react";
import { useLanguage } from "@/lib/i18n-context";

interface ShareButtonsProps {
    url: string;
    title: string;
    className?: string;
}

export const ShareButtons: React.FC<ShareButtonsProps> = ({ url, title, className }) => {
    const { locale } = useLanguage();
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);

    const shareLinks = [
        {
            name: "WhatsApp",
            icon: <MessageCircle className="w-5 h-5" />,
            href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
            bg: "bg-green-500 hover:bg-green-600",
        },
        {
            name: "Facebook",
            icon: <Facebook className="w-5 h-5" />,
            href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
            bg: "bg-blue-600 hover:bg-blue-700",
        },
        {
            name: "LinkedIn",
            icon: <Linkedin className="w-5 h-5" />,
            href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
            bg: "bg-sky-700 hover:bg-sky-800",
        },
    ];

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(url);
            alert(locale === "ar" ? "تم نسخ الرابط!" : "Link copied!");
        } catch {
            // fallback
        }
    };

    return (
        <div className={`flex items-center gap-3 ${className || ""}`}>
            <span className="flex items-center gap-1.5 text-sm text-gray-500 font-medium">
                <Share2 className="w-5 h-5" />
                {locale === "ar" ? "مشاركة" : "Share"}
            </span>
            {shareLinks.map((link) => (
                <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-9 h-9 rounded-full ${link.bg} text-white flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-sm`}
                    title={link.name}
                >
                    {link.icon}
                </a>
            ))}
            <button
                onClick={copyToClipboard}
                className="w-9 h-9 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 flex items-center justify-center transition-all duration-200 hover:scale-110"
                title={locale === "ar" ? "نسخ الرابط" : "Copy Link"}
            >
                <Link2 className="w-5 h-5" />
            </button>
        </div>
    );
};
