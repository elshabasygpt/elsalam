"use client";

import { Trash2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteProductButton({ productId, productName }: { productId: number; productName: string }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (!confirm(`هل أنت متأكد من حذف المنتج "${productName}"؟\n\nهذا الإجراء لا يمكن التراجع عنه.`)) return;

        setLoading(true);
        try {
            const res = await fetch(`/api/admin/products/${productId}`, { method: "DELETE" });
            if (res.ok) {
                router.refresh();
            } else {
                alert("حدث خطأ أثناء حذف المنتج");
            }
        } catch {
            alert("حدث خطأ في الاتصال");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={loading}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
            title="حذف"
        >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
        </button>
    );
}
