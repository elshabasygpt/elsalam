"use client";

import React from "react";
import Image from "next/image";
import { useLanguage } from "@/lib/i18n-context";

interface MarqueeProps {
    images: { src: string; alt: string }[];
    speed?: number; // Duration in seconds for one full cycle
    direction?: "left" | "right";
}

export const InfiniteMarquee = ({ images, speed = 40, direction = "left" }: MarqueeProps) => {
    const { isRTL } = useLanguage();
    
    // Duplicate the images array to create a seamless loop
    const duplicatedImages = [...images, ...images];

    // Determine animation direction based on RTL and requested direction
    const transformStart = "0%";
    let transformEnd = "-50%";
    if (isRTL) {
        transformEnd = direction === "left" ? "50%" : "-50%";
    } else {
        transformEnd = direction === "left" ? "-50%" : "50%";
    }

    return (
        <div className="relative w-full overflow-hidden bg-transparent py-4 flex">
            <style>{`
                @keyframes marquee-scroll {
                    0% { transform: translateX(${transformStart}); }
                    100% { transform: translateX(${transformEnd}); }
                }
                .animate-marquee-scroll {
                    animation: marquee-scroll ${speed}s linear infinite;
                }
                .animate-marquee-scroll:hover {
                    animation-play-state: paused;
                }
            `}</style>

            {/* Gradient overlays for smooth fade at edges */}
            <div className="absolute top-0 left-0 w-24 md:w-40 h-full bg-gradient-to-r from-surface-soft to-transparent z-10 pointer-events-none" />
            <div className="absolute top-0 right-0 w-24 md:w-40 h-full bg-gradient-to-l from-surface-soft to-transparent z-10 pointer-events-none" />

            <div className="flex min-w-max items-center animate-marquee-scroll gap-4 md:gap-8 lg:gap-12" style={{ height: "220px", padding: "10px 0" }}>
                {duplicatedImages.map((img, index) => {
                    const isPlaceholder = img.src === "/images/placeholder.svg" || !img.src;
                    
                    return (
                        <div
                            key={index}
                            className="relative bg-white border border-slate-100 shadow-sm rounded-[2rem] flex-shrink-0 flex items-center justify-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden"
                            style={{ 
                                height: "100%", 
                                width: "clamp(250px, 20vw, 380px)",
                                minWidth: "300px"
                            }}
                        >
                            {isPlaceholder ? (
                                <span className="text-xl md:text-3xl font-bold text-slate-300 text-center select-none px-6">
                                    {img.alt}
                                </span>
                            ) : (
                                <div className="relative w-full h-full mix-blend-multiply flex items-center justify-center p-6">
                                    <Image
                                        src={img.src}
                                        alt={img.alt}
                                        fill
                                        className="object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                                        sizes="(max-width: 768px) 300px, 400px"
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

