"use client";

import React from "react";
import { extractYouTubeId } from "@/lib/news-api";

interface YouTubeEmbedProps {
    url: string;
    title?: string;
    className?: string;
}

export const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({ url, title = "Video", className }) => {
    const videoId = extractYouTubeId(url);

    if (!videoId) return null;

    return (
        <div className={`relative w-full rounded-2xl overflow-hidden shadow-lg ${className || ""}`} style={{ paddingBottom: "56.25%" }}>
            <iframe
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            />
        </div>
    );
};
