"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";
import Link from "next/link";

/**
 * Global B2B Error Boundary
 * Catches all unhandled React exceptions and provides a professional fallback UI.
 */
export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // SRE Hook: Log the error to APM (e.g., Sentry, Datadog)
        console.error("[GLOBAL_UI_ERROR]", error);
        
        // Example: Sentry.captureException(error, { tags: { boundary: 'global' } });
    }, [error]);

    return (
        <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 px-4 font-sans">
            <div className="max-w-md w-full bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertTriangle className="w-8 h-8" />
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                    حدث خطأ غير متوقع
                </h2>
                
                <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                    نعتذر عن هذا الخلل. لقد قمنا بتسجيل الخطأ بشكل آلي وجاري العمل على حله من قبل فريق الدعم الفني لضمان استقرار الخدمة.
                </p>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => reset()}
                        className="w-full flex items-center justify-center gap-2 bg-primary text-white py-2.5 px-4 rounded-md font-medium hover:bg-primary-dark transition-all active:scale-95 shadow-sm"
                    >
                        <RefreshCcw className="w-4 h-4" />
                        إعادة المحاولة
                    </button>
                    
                    <Link 
                        href="/"
                        className="w-full flex items-center justify-center gap-2 bg-white text-gray-700 border border-gray-300 py-2.5 px-4 rounded-md font-medium hover:bg-gray-50 transition-colors"
                    >
                        <Home className="w-4 h-4" />
                        العودة للرئيسية
                    </Link>
                </div>

                {process.env.NODE_ENV === "development" && (
                    <div className="mt-6 text-left bg-red-50 p-3 rounded text-xs text-red-800 font-mono overflow-auto max-h-32 border border-red-100">
                        <strong>Developer Info:</strong>
                        <br />
                        {error.message}
                    </div>
                )}
            </div>
        </div>
    );
}
