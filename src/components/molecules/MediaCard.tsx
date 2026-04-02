import React from "react";
import { Play, Maximize2 } from "lucide-react";
import { Typography } from "@/components/atoms/Typography";
import { cn } from "@/utils/classnames";
import { useLanguage } from "@/lib/i18n-context";

export interface MediaItem {
    id: string;
    type: "video" | "image";
    title: string;
    category: string;
    thumbnailUrl: string;
    mediaUrl: string;
}

interface MediaCardProps {
    item: MediaItem;
    onClick: (item: MediaItem) => void;
    className?: string;
}

export const MediaCard: React.FC<MediaCardProps> = ({ item, onClick, className }) => {
    const { locale } = useLanguage();
    return (
        <div
            className={cn(
                "group relative bg-surface-soft rounded-lg overflow-hidden cursor-pointer shadow-card hover:shadow-elevation transition-all duration-300 border border-surface-light flex flex-col h-full",
                className
            )}
            onClick={() => onClick(item)}
        >
            <div className="relative aspect-video w-full overflow-hidden bg-surface-light shrink-0">
                <img
                    src={item.thumbnailUrl}
                    alt={item.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-primary-green text-white flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-300 shadow-lg">
                        {item.type === "video" ? (
                            <Play className="w-6 h-6 ml-1" />
                        ) : (
                            <Maximize2 className="w-6 h-6" />
                        )}
                    </div>
                </div>

                {/* Duration or Type Badge */}
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-sm">
                    {item.type === "video" ? (locale === "ar" ? "فيديو" : "Video") : (locale === "ar" ? "صورة" : "Image")}
                </div>
            </div>

            <div className="p-4 bg-white flex-grow flex flex-col">
                <Typography variant="small" className="text-primary-green mb-1 font-medium">
                    {item.category}
                </Typography>
                <Typography variant="body" className="text-primary-dark font-medium line-clamp-2">
                    {item.title}
                </Typography>
            </div>
        </div>
    );
};
