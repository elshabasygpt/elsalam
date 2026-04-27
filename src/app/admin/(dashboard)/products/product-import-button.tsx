"use client";

import { useState } from "react";
import { FileSpreadsheet } from "lucide-react";
import { ProductImportModal } from "./product-import-modal";
import { useRouter } from "next/navigation";

export function ProductImportButton() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all shadow-sm active:scale-[0.97]"
            >
                <FileSpreadsheet className="w-5 h-5 text-green-600" />
                استيراد Excel
            </button>
            <ProductImportModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={() => {
                    router.refresh();
                }}
            />
        </>
    );
}
