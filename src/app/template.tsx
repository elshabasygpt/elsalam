"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/lib/i18n-context";

export default function Template({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { isRTL } = useLanguage();

    return (
        <motion.div
            key={pathname}
            initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ease: "easeInOut", duration: 0.5 }}
            className="w-full flex-grow flex flex-col"
        >
            {children}
        </motion.div>
    );
}
