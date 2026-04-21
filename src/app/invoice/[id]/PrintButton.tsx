"use client";

import { Printer } from "lucide-react";

export default function PrintButton() {
    return (
        <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 bg-[#15803d] text-white px-5 py-2.5 rounded-lg shadow-md hover:bg-green-800 transition-all font-bold text-sm hover:-translate-y-0.5"
        >
            <Printer className="w-4 h-4" />
            Print Invoice
        </button>
    );
}
