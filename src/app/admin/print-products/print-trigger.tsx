"use client";

import { useEffect } from "react";

export function PrintTrigger() {
    useEffect(() => {
        // Wait for images to load before printing
        const timer = setTimeout(() => {
            window.print();
        }, 1000);
        
        // Attach event listeners to the manual buttons
        const printBtn = document.getElementById("manual-print-btn");
        const closeBtn = document.getElementById("manual-close-btn");
        
        if (printBtn) printBtn.onclick = () => window.print();
        if (closeBtn) closeBtn.onclick = () => window.close();

        return () => clearTimeout(timer);
    }, []);

    return null;
}
