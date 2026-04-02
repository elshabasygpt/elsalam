"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";

interface LightboxProps {
    isOpen: boolean;
    onClose: () => void;
    src: string;
    type: "image" | "video";
    title?: string;
}

export const Lightbox: React.FC<LightboxProps> = ({ isOpen, onClose, src, type, title }) => {
    // Prevent scrolling when lightbox is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    // Handle escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-300"
            onClick={onClose}
        >
            <button
                onClick={onClose}
                className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-50 bg-black/50 p-2 rounded-full hover:bg-black/80"
                aria-label="إغلاق"
            >
                <X className="w-6 h-6" />
            </button>

            <div
                className="relative w-full max-w-5xl rounded-lg overflow-hidden flex flex-col items-center animate-in zoom-in-95 duration-300"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on the content
            >
                {type === "video" ? (
                    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
                        <iframe
                            src={src.includes("youtube") ? `${src}?autoplay=1` : src}
                            title={title || "Video player"}
                            className="absolute inset-0 w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                ) : (
                    <div className="relative w-full max-w-4xl max-h-[85vh] flex items-center justify-center">
                        <img
                            src={src}
                            alt={title || "Gallery image"}
                            className="max-w-full max-h-[85vh] object-contain rounded-sm shadow-2xl"
                        />
                    </div>
                )}

                {title && (
                    <div className="w-full mt-4 text-center">
                        <p className="text-white text-lg font-medium">{title}</p>
                    </div>
                )}
            </div>
        </div>
    );
};
