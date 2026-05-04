import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { QuotationsDataTable, Quotation as QuotationType, QuotationStatus } from "@/components/admin/QuotationsDataTable";
import { FileText } from "lucide-react";

export const dynamic = "force-dynamic";

/**
 * ─── 1. Loading Skeleton Component ───
 * Shows a beautiful pulsing animation while Prisma fetches the heavy data.
 */
function TableSkeleton() {
    return (
        <div className="w-full bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden animate-pulse">
            {/* Header Fake */}
            <div className="h-[50px] bg-slate-50 border-b border-slate-200 w-full" />
            {/* Rows Fake */}
            <div className="divide-y divide-slate-100">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="flex items-center justify-between px-6 py-4">
                        <div className="h-4 bg-slate-200 rounded w-16" />
                        <div className="h-4 bg-slate-200 rounded w-48" />
                        <div className="h-4 bg-slate-200 rounded w-24" />
                        <div className="h-4 bg-slate-200 rounded w-24" />
                        <div className="h-6 bg-slate-200 rounded-md w-20" />
                        <div className="h-8 bg-slate-200 rounded-md w-24" />
                    </div>
                ))}
            </div>
        </div>
    );
}

/**
 * ─── 2. Server Component Data Fetcher ───
 * Securely fetches quotations only for authenticated Admins.
 */
async function QuotationsData() {
    // Edge-Safe Admin Validation
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "ADMIN") {
        redirect("/admin/login");
    }

    // Fetch from Prisma (Casted to any temporarily until user runs prisma generate)
    const rawQuotations = await (prisma as any).quotation.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            user: { select: { email: true } }
        }
    });

    // Map Prisma response to our strictly typed component props
    const mappedQuotations: QuotationType[] = rawQuotations.map((q: any) => ({
        id: q.id,
        userEmail: q.user?.email || 'حساب محذوف',
        status: q.status as QuotationStatus,
        totalAmount: q.totalAmount,
        discountAmount: q.discountAmount,
        createdAt: q.createdAt,
    }));

    return <QuotationsDataTable quotations={mappedQuotations} />;
}

/**
 * ─── 3. Main Page Layout ───
 */
export default function QuotationsPage() {
    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                        <FileText className="w-6 h-6 text-emerald-600" />
                        إدارة عروض الأسعار (RFQ)
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        قم بمراجعة واعتماد أو رفض طلبات التسعير والكميات المقدمة من تجار الجملة والموزعين.
                    </p>
                </div>
            </div>

            {/* Suspense Boundary wrapping our async data fetcher */}
            <Suspense fallback={<TableSkeleton />}>
                <QuotationsData />
            </Suspense>
        </div>
    );
}
