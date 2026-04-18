"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface MarqueeProps {
    images: { src: string; alt: string }[];
    speed?: number; // Duration in seconds for one full cycle
    direction?: "left" | "right";
}

export const InfiniteMarquee = ({ images, speed = 40, direction = "left" }: MarqueeProps) => {
    // Duplicate the images array to create a seamless loop
    const duplicatedImages = [...images, ...images];

    return (
        <div className="relative w-full overflow-hidden bg-white py-10 flex border-y border-gray-100">
            {/* Gradient overlays for smooth fade at edges */}
            <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

            <motion.div
                className="flex min-w-max items-center"
                animate={{
                    x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"],
                }}
                transition={{
                    ease: "linear",
                    duration: speed,
                    repeat: Infinity,
                }}
            >
                {duplicatedImages.map((img, index) => (
                    <div
                        key={index}
                        className="mx-8 relative w-40 h-20 hover:scale-110 transition-transform duration-300 flex-shrink-0 flex items-center justify-center mix-blend-multiply"
                    >
                        <Image
                            src={img.src}
                            alt={img.alt}
                            fill
                            className="object-contain"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    </div>
                ))}
            </motion.div>
        </div>
    );
};
