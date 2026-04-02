"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/lib/i18n-context";

interface CountdownTimerProps {
    endDate: string;
    className?: string;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ endDate, className }) => {
    const { locale } = useLanguage();
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const calculate = () => {
            const diff = new Date(endDate).getTime() - Date.now();
            if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
            return {
                days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((diff / (1000 * 60)) % 60),
                seconds: Math.floor((diff / 1000) % 60),
            };
        };

        setTimeLeft(calculate());
        const timer = setInterval(() => setTimeLeft(calculate()), 1000);
        return () => clearInterval(timer);
    }, [endDate]);

    if (!mounted) return null;

    const labels = locale === "ar"
        ? { days: "يوم", hours: "ساعة", minutes: "دقيقة", seconds: "ثانية" }
        : { days: "Days", hours: "Hrs", minutes: "Min", seconds: "Sec" };

    const units = [
        { value: timeLeft.days, label: labels.days },
        { value: timeLeft.hours, label: labels.hours },
        { value: timeLeft.minutes, label: labels.minutes },
        { value: timeLeft.seconds, label: labels.seconds },
    ];

    return (
        <div className={`flex items-center gap-2 ${className || ""}`}>
            {units.map((unit, i) => (
                <React.Fragment key={i}>
                    <div className="flex flex-col items-center">
                        <span className="bg-white/20 backdrop-blur-sm text-white font-black text-lg md:text-xl w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center tabular-nums">
                            {String(unit.value).padStart(2, "0")}
                        </span>
                        <span className="text-white/60 text-[10px] font-bold mt-1 uppercase tracking-wider">
                            {unit.label}
                        </span>
                    </div>
                    {i < units.length - 1 && (
                        <span className="text-white/40 font-bold text-lg mb-4">:</span>
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};
