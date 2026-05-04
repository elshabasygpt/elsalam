"use client";

import React, { useState, useTransition } from 'react';
import { Eye, FileText, CheckCircle, XCircle, Clock, Loader2, Download, CheckSquare, Printer } from 'lucide-react';
import { approveQuotation, rejectQuotation } from '@/actions/quotation.actions';
import { fetchQuotationForPdf } from '@/actions/pdf.actions';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export type QuotationStatus = 'PENDING' | 'REVIEWING' | 'APPROVED' | 'REJECTED';

export interface QuotationItem {
    id: string;
    productId: number;
    productName: string;
    quantity: number;
    price: number;
    weightVariant: string;
}

export interface Quotation {
    id: string;
    userEmail: string;
    status: QuotationStatus;
    totalAmount: number;
    discountAmount: number;
    createdAt: Date;
    items?: QuotationItem[];
}

const StatusBadge = ({ status }: { status: QuotationStatus }) => {
    switch (status) {
        case 'PENDING':
        case 'REVIEWING':
            return (
                <span className="inline-flex items-center gap-1.5 rounded-md bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 ring-1 ring-inset ring-amber-600/20">
                    <Clock className="w-3.5 h-3.5" />
                    {status === 'PENDING' ? 'قيد الانتظار' : 'جاري المراجعة'}
                </span>
            );
        case 'APPROVED':
            return (
                <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                    <CheckCircle className="w-3.5 h-3.5" />
                    موافق عليه
                </span>
            );
        case 'REJECTED':
            return (
                <span className="inline-flex items-center gap-1.5 rounded-md bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 ring-1 ring-inset ring-rose-600/20">
                    <XCircle className="w-3.5 h-3.5" />
                    مرفوض
                </span>
            );
        default:
            return null;
    }
};

export function QuotationsDataTable({ quotations }: { quotations: Quotation[] }) {
    const router = useRouter();
    const [selectedQuote, setSelectedQuote] = useState<Quotation | null>(null);
    const [isPending, startTransition] = useTransition();

    // Modal Form States
    const [discountAmount, setDiscountAmount] = useState<string>("");
    const [adminNotes, setAdminNotes] = useState<string>("");

    // PDF Generation State
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
    const [pdfData, setPdfData] = useState<any>(null);

    // Bulk Selection States
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [bulkDiscount, setBulkDiscount] = useState<string>("");

    // --- Bulk Selection Logic ---
    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedIds(new Set(quotations.map(q => q.id)));
        } else {
            setSelectedIds(new Set());
        }
    };

    const handleSelectRow = (id: string, checked: boolean) => {
        const newSet = new Set(selectedIds);
        if (checked) newSet.add(id);
        else newSet.delete(id);
        setSelectedIds(newSet);
    };

    const handleExportCSV = () => {
        if (quotations.length === 0) {
            toast.error("لا توجد بيانات لتصديرها");
            return;
        }

        const headers = ["معرف الطلب", "العميل", "التاريخ", "الإجمالي المبدئي", "الخصم", "الحالة"];
        const csvRows = [headers.join(",")];

        quotations.forEach(q => {
            const date = new Date(q.createdAt).toLocaleDateString('ar-EG');
            const row = [
                q.id,
                q.userEmail,
                date,
                q.totalAmount,
                q.discountAmount,
                q.status
            ];
            csvRows.push(row.join(","));
        });

        const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + csvRows.join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `quotations_export_${new Date().getTime()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("تم تصدير ملف CSV بنجاح!");
    };

    // --- Single Actions ---
    const handleOpenModal = (quote: Quotation) => {
        setSelectedQuote(quote);
        setDiscountAmount("");
        setAdminNotes("");
    };

    const handleApprove = () => {
        if (!selectedQuote) return;
        const discount = parseFloat(discountAmount) || 0;
        
        startTransition(async () => {
            const res = await approveQuotation(selectedQuote.id, discount, adminNotes);
            if (res.success) {
                toast.success('تم تطبيق الخصم والموافقة بنجاح!');
                setSelectedQuote(null);
                setSelectedIds(new Set());
                router.refresh();
            } else {
                toast.error((res as any).error || 'حدث خطأ أثناء الموافقة');
            }
        });
    };

    const handleReject = () => {
        if (!selectedQuote) return;
        startTransition(async () => {
            const res = await rejectQuotation(selectedQuote.id, adminNotes);
            if (res.success) {
                toast.success('تم رفض الطلبية.');
                setSelectedQuote(null);
                setSelectedIds(new Set());
                router.refresh();
            } else {
                toast.error((res as any).error || 'حدث خطأ أثناء الرفض');
            }
        });
    };

    // --- PDF Generation Logic ---
    const handleGeneratePDF = async () => {
        if (!selectedQuote) return;
        setIsGeneratingPdf(true);
        const toastId = toast.loading('جاري تجهيز وثيقة الـ PDF...');
        
        try {
            const res = await fetchQuotationForPdf(selectedQuote.id);
            if (!res.success) throw new Error(res.error);
            
            // Set the deep data to render the hidden template
            setPdfData(res.data);
            
            // Allow React to mount the hidden template in the DOM
            setTimeout(async () => {
                const element = document.getElementById('invoice-pdf-template');
                if (element) {
                    const canvas = await html2canvas(element, { 
                        scale: 2, 
                        useCORS: true,
                        logging: false 
                    });
                    const imgData = canvas.toDataURL('image/png');
                    const pdf = new jsPDF('p', 'mm', 'a4');
                    const pdfWidth = pdf.internal.pageSize.getWidth();
                    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                    
                    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                    pdf.save(`Proforma_Invoice_${selectedQuote.id.slice(-6).toUpperCase()}.pdf`);
                    toast.success('تم تحميل الفاتورة بنجاح!', { id: toastId });
                } else {
                    toast.error('حدث خطأ في تكوين الفاتورة', { id: toastId });
                }
                // Cleanup
                setPdfData(null);
                setIsGeneratingPdf(false);
            }, 800); // 800ms delay to ensure all fonts and DOM elements are rendered
        } catch (error: any) {
            toast.error(error.message, { id: toastId });
            setIsGeneratingPdf(false);
            setPdfData(null);
        }
    };

    // --- Bulk Actions ---
    const handleBulkApprove = () => {
        if (selectedIds.size === 0) return;
        const discount = parseFloat(bulkDiscount) || 0;
        
        startTransition(async () => {
            let successCount = 0;
            // Iterate and call Server Action sequentially for simplicity. 
            // In a huge system, a specialized bulk Server Action is better.
            for (const id of Array.from(selectedIds)) {
                const res = await approveQuotation(id, discount, "تمت الموافقة الجماعية بواسطة الإدارة.");
                if (res.success) successCount++;
            }
            
            toast.success(`تم اعتماد ${successCount} طلب بنجاح!`);
            setSelectedIds(new Set());
            setBulkDiscount("");
            router.refresh();
        });
    };

    const handleBulkReject = () => {
        if (selectedIds.size === 0) return;
        startTransition(async () => {
            let successCount = 0;
            for (const id of Array.from(selectedIds)) {
                const res = await rejectQuotation(id, "تم الرفض الجماعي.");
                if (res.success) successCount++;
            }
            
            toast.success(`تم رفض ${successCount} طلب بنجاح.`);
            setSelectedIds(new Set());
            router.refresh();
        });
    };

    const formatDate = (dateString: Date) => {
        const d = new Date(dateString);
        return d.toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    const isAllSelected = quotations.length > 0 && selectedIds.size === quotations.length;

    return (
        <div className="w-full font-sans relative pb-24">
            
            {/* Top Action Bar (Export to CSV) */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-slate-800">سجل عروض الأسعار</h2>
                <button 
                    onClick={handleExportCSV}
                    className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-slate-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                >
                    <Download className="w-4 h-4" />
                    تصدير إلى CSV (Excel)
                </button>
            </div>

            {/* ─── High-Density Scrollable Data Table ─── */}
            <div className={`bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden transition-opacity ${isPending ? 'opacity-60 pointer-events-none' : ''}`}>
                <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-300">
                    <table className="w-full text-sm text-right rtl:text-right text-slate-600 whitespace-nowrap">
                        <thead className="text-[13px] text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-4 py-3.5 w-12 text-center">
                                    <input 
                                        type="checkbox" 
                                        checked={isAllSelected}
                                        onChange={handleSelectAll}
                                        className="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-600 cursor-pointer"
                                    />
                                </th>
                                <th className="px-4 py-3.5 font-bold">رقم الطلب</th>
                                <th className="px-4 py-3.5 font-bold">حساب العميل</th>
                                <th className="px-4 py-3.5 font-bold">التاريخ</th>
                                <th className="px-4 py-3.5 font-bold">الإجمالي المبدئي</th>
                                <th className="px-4 py-3.5 font-bold">الحالة</th>
                                <th className="px-4 py-3.5 font-bold text-center">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {quotations.map((quote) => {
                                const isSelected = selectedIds.has(quote.id);
                                return (
                                    <tr key={quote.id} className={`transition-colors ${isSelected ? 'bg-emerald-50/50' : 'hover:bg-slate-50/80'}`}>
                                        <td className="px-4 py-3 text-center">
                                            <input 
                                                type="checkbox" 
                                                checked={isSelected}
                                                onChange={(e) => handleSelectRow(quote.id, e.target.checked)}
                                                className="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-600 cursor-pointer"
                                            />
                                        </td>
                                        <td className="px-4 py-3 font-mono text-xs text-slate-500">
                                            #{quote.id.slice(-6).toUpperCase()}
                                        </td>
                                        <td className="px-4 py-3 font-bold text-slate-900">
                                            {quote.userEmail}
                                        </td>
                                        <td className="px-4 py-3 text-slate-400 text-xs font-medium">
                                            {formatDate(quote.createdAt)}
                                        </td>
                                        <td className="px-4 py-3 font-mono text-emerald-700 font-bold">
                                            {(quote.totalAmount - quote.discountAmount).toFixed(2)} ج.م
                                        </td>
                                        <td className="px-4 py-3">
                                            <StatusBadge status={quote.status} />
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <button 
                                                onClick={() => handleOpenModal(quote)}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 ring-1 ring-inset ring-emerald-600/20 rounded-md transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
                                            >
                                                <Eye className="w-4 h-4" />
                                                مراجعة
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                            
                            {quotations.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-4 py-12 text-center text-slate-500 bg-slate-50/30">
                                        <div className="flex flex-col items-center justify-center gap-3">
                                            <FileText className="w-10 h-10 text-slate-300" />
                                            <span className="font-semibold text-sm">لا توجد عروض أسعار حالياً.</span>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ─── Floating Action Bar (Appears when items are selected) ─── */}
            {selectedIds.size > 0 && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 animate-in slide-in-from-bottom-10 fade-in duration-300">
                    <div className="bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-6 border border-slate-700">
                        <div className="flex items-center gap-2">
                            <span className="flex items-center justify-center w-6 h-6 bg-emerald-500 text-white rounded-full text-xs font-bold">
                                {selectedIds.size}
                            </span>
                            <span className="text-sm font-semibold text-slate-200">طلب محدد</span>
                        </div>
                        
                        <div className="h-6 w-px bg-slate-700" />

                        <div className="flex items-center gap-3">
                            <input 
                                type="number" 
                                value={bulkDiscount}
                                onChange={(e) => setBulkDiscount(e.target.value)}
                                placeholder="خصم موحد (ج.م) اختياري"
                                disabled={isPending}
                                className="w-48 text-sm rounded-lg border-0 py-1.5 px-3 bg-slate-800 text-white placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
                            />
                            <button 
                                onClick={handleBulkApprove}
                                disabled={isPending}
                                className="inline-flex items-center gap-2 px-4 py-1.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckSquare className="w-4 h-4" />}
                                اعتماد الكل
                            </button>
                            <button 
                                onClick={handleBulkReject}
                                disabled={isPending}
                                className="inline-flex items-center gap-2 px-4 py-1.5 text-sm font-bold text-rose-400 hover:text-white hover:bg-rose-500/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                                رفض الكل
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ─── Review Action Modal (Single Item) ─── */}
            {selectedQuote && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                مراجعة التسعيرة 
                                <span className="text-slate-400 font-mono text-sm bg-white px-2 py-0.5 rounded border border-slate-200">
                                    #{selectedQuote.id.slice(-6).toUpperCase()}
                                </span>
                            </h3>
                            <button 
                                onClick={() => setSelectedQuote(null)}
                                className="text-slate-400 hover:text-rose-500 p-1.5 rounded-full hover:bg-rose-50 transition-colors"
                            >
                                <XCircle className="w-6 h-6" />
                            </button>
                        </div>
                        
                        <div className="p-6 overflow-y-auto">
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                                    <div className="text-xs font-semibold text-slate-500 mb-1">العميل المُطالب</div>
                                    <div className="font-bold text-slate-900 text-sm">{selectedQuote.userEmail}</div>
                                </div>
                                <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                                    <div className="text-xs font-semibold text-slate-500 mb-1">الإجمالي المبدئي (قبل الخصم)</div>
                                    <div className="font-bold text-emerald-600 font-mono text-base">{(selectedQuote.totalAmount).toFixed(2)} ج.م</div>
                                </div>
                            </div>

                            <div className={`space-y-4 ${isPending ? 'pointer-events-none opacity-60' : ''}`}>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">خصم خاص للعميل (ج.م)</label>
                                    <input 
                                        type="number"
                                        value={discountAmount}
                                        onChange={(e) => setDiscountAmount(e.target.value)}
                                        placeholder="0.00"
                                        className="w-full text-left rounded-lg border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm font-mono" 
                                    />
                                    <p className="mt-1 text-xs text-slate-500">سيتم تطبيق هذا الخصم قبل إرسال الموافقة النهائية.</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">ملاحظات الإدارة (سرية)</label>
                                    <textarea 
                                        rows={3}
                                        value={adminNotes}
                                        onChange={(e) => setAdminNotes(e.target.value)}
                                        placeholder="مثال: تم إعطاء الخصم بناءً على مكالمة المدير..."
                                        className="w-full rounded-lg border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm resize-none" 
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
                            <div className="flex gap-2">
                                <button 
                                    onClick={handleReject}
                                    disabled={isPending || isGeneratingPdf}
                                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 ring-1 ring-inset ring-rose-500/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                                    رفض الطلبية
                                </button>
                                <button 
                                    onClick={handleGeneratePDF}
                                    disabled={isGeneratingPdf || isPending}
                                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isGeneratingPdf ? <Loader2 className="w-4 h-4 animate-spin" /> : <Printer className="w-4 h-4" />}
                                    Print Proforma
                                </button>
                            </div>
                            <div className="flex gap-3">
                                <button 
                                    onClick={() => setSelectedQuote(null)}
                                    disabled={isPending}
                                    className="px-5 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200 bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
                                >
                                    إلغاء
                                </button>
                                <button 
                                    onClick={handleApprove}
                                    disabled={isPending}
                                    className="inline-flex items-center gap-2 px-6 py-2 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-md shadow-emerald-500/20 transition-all active:scale-95 disabled:opacity-70"
                                >
                                    {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                                    تطبيق الخصم والموافقة
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ─── Hidden Proforma Invoice Template for PDF Generation ─── */}
            {pdfData && (
                <div className="fixed top-[200vh] left-[200vw]">
                    <div id="invoice-pdf-template" className="w-[800px] bg-white p-12 text-slate-800 font-sans border-2 border-slate-100" dir="rtl">
                        {/* Invoice Header */}
                        <div className="flex justify-between items-start border-b-2 border-emerald-600 pb-6 mb-8">
                            <div>
                                <h1 className="text-4xl font-black text-emerald-800 tracking-tight">PROFORMA INVOICE</h1>
                                <p className="text-xl text-slate-500 font-bold mt-2">فاتورة مبدئية / عرض سعر</p>
                                <div className="mt-4 space-y-1">
                                    <p className="text-sm"><strong>رقم الفاتورة:</strong> #{pdfData.id.slice(-8).toUpperCase()}</p>
                                    <p className="text-sm"><strong>تاريخ الإصدار:</strong> {new Date(pdfData.createdAt).toLocaleDateString('ar-EG')}</p>
                                    <p className="text-sm"><strong>تاريخ الصلاحية:</strong> {new Date(new Date(pdfData.createdAt).getTime() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString('ar-EG')} (15 يوم)</p>
                                </div>
                            </div>
                            <div className="text-left">
                                <h2 className="text-2xl font-black text-emerald-700">مصنع السلام للزيوت</h2>
                                <p className="text-sm text-slate-600 mt-1">المنطقة الصناعية، جمهورية مصر العربية</p>
                                <p className="text-sm text-slate-600">export@elsalamoils.com</p>
                                <p className="text-sm text-slate-600">+20 123 456 7890</p>
                            </div>
                        </div>

                        {/* Client Info */}
                        <div className="mb-8 p-6 bg-slate-50 rounded-xl border border-slate-200">
                            <h3 className="text-lg font-bold text-slate-800 mb-3 border-b border-slate-200 pb-2">بيانات العميل (Billed To):</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-slate-500">الاسم / الشركة</p>
                                    <p className="font-bold text-base">{pdfData.user?.name || "غير مسجل"}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">البريد الإلكتروني</p>
                                    <p className="font-bold text-base">{pdfData.user?.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">رقم الهاتف</p>
                                    <p className="font-bold text-base" dir="ltr">{pdfData.user?.phone || "غير مسجل"}</p>
                                </div>
                            </div>
                        </div>

                        {/* Items Table */}
                        <table className="w-full text-sm text-right mb-8">
                            <thead className="bg-emerald-600 text-white">
                                <tr>
                                    <th className="px-4 py-3 font-bold rounded-r-lg">المنتج (Product)</th>
                                    <th className="px-4 py-3 font-bold text-center">التعبئة (Variant)</th>
                                    <th className="px-4 py-3 font-bold text-center">الكمية (Qty)</th>
                                    <th className="px-4 py-3 font-bold text-center">سعر الوحدة</th>
                                    <th className="px-4 py-3 font-bold text-left rounded-l-lg">الإجمالي (Total)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {pdfData.items.map((item: any) => (
                                    <tr key={item.id}>
                                        <td className="px-4 py-4 font-bold">{item.product?.name_ar} <br/><span className="text-xs text-slate-400 font-normal">{item.product?.name_en}</span></td>
                                        <td className="px-4 py-4 text-center">{item.weightVariant || "أساسي"}</td>
                                        <td className="px-4 py-4 text-center font-mono">{item.quantity}</td>
                                        <td className="px-4 py-4 text-center font-mono">{item.price.toFixed(2)} ج.م</td>
                                        <td className="px-4 py-4 text-left font-mono font-bold">{(item.price * item.quantity).toFixed(2)} ج.م</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Totals */}
                        <div className="flex justify-end mb-12">
                            <div className="w-1/2 p-6 bg-slate-50 rounded-xl border border-slate-200">
                                <div className="flex justify-between py-2 border-b border-slate-200">
                                    <span className="font-semibold text-slate-600">الإجمالي المبدئي (Subtotal):</span>
                                    <span className="font-mono font-bold text-slate-800">{pdfData.totalAmount.toFixed(2)} ج.م</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-slate-200 text-rose-600">
                                    <span className="font-semibold">الخصم الممنوح (Discount):</span>
                                    <span className="font-mono font-bold">-{pdfData.discountAmount.toFixed(2)} ج.م</span>
                                </div>
                                <div className="flex justify-between py-3 text-lg">
                                    <span className="font-black text-emerald-800">الإجمالي النهائي (Grand Total):</span>
                                    <span className="font-mono font-black text-emerald-800">{(pdfData.totalAmount - pdfData.discountAmount).toFixed(2)} ج.م</span>
                                </div>
                            </div>
                        </div>

                        {/* Footer & Signature */}
                        <div className="flex justify-between items-end border-t border-slate-200 pt-8 mt-16">
                            <div>
                                <p className="text-xs text-slate-500 font-bold mb-1">ملاحظات هامة:</p>
                                <ul className="text-xs text-slate-400 list-disc list-inside space-y-1">
                                    <li>هذا العرض ساري لمدة 15 يوماً من تاريخ الإصدار.</li>
                                    <li>يجب تحويل 50% من المبلغ لبدء التجهيز و50% قبل الشحن.</li>
                                    <li>الأسعار قد تتغير بدون إشعار مسبق بعد انتهاء مدة الصلاحية.</li>
                                </ul>
                            </div>
                            <div className="text-center w-48">
                                <div className="border-b-2 border-slate-800 pb-2 mb-2">
                                    {/* Fake Signature */}
                                    <span className="font-mono text-xl text-slate-400 italic">ElSalam Management</span>
                                </div>
                                <p className="text-sm font-bold text-slate-800">توقيع الإدارة المعتمد</p>
                                <p className="text-xs text-slate-500">Authorized Signature</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
