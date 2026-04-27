"use client";

import { useState, useRef } from "react";
import * as xlsx from "xlsx";
import { Upload, X, FileSpreadsheet, CheckCircle, AlertCircle, Loader2, Download } from "lucide-react";
import toast from "react-hot-toast";

interface ProductImportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function ProductImportModal({ isOpen, onClose, onSuccess }: ProductImportModalProps) {
    const [file, setFile] = useState<File | null>(null);
    const [parsedData, setParsedData] = useState<any[]>([]);
    const [isParsing, setIsParsing] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    const downloadTemplate = () => {
        const template = [
            {
                slug: "product-slug-english",
                name_ar: "اسم المنتج بالعربي",
                name_en: "Product Name in English",
                short_description_ar: "وصف قصير عربي",
                short_description_en: "Short Description EN",
                description_ar: "وصف تفصيلي عربي",
                description_en: "Detailed Description EN",
                price: 150.5,
                categoryId: 1,
                is_featured: "true",
                is_exportable: "false",
                features: "ميزة 1:Feature 1 | ميزة 2:Feature 2",
                packagings: "1 لتر:1 Liter:50 | 5 لتر:5 Liters:200"
            }
        ];
        const ws = xlsx.utils.json_to_sheet(template);
        const wb = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(wb, ws, "Products Template");
        xlsx.writeFile(wb, "products_import_template.xlsx");
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;
        setFile(selectedFile);
        parseExcel(selectedFile);
    };

    const parseExcel = (file: File) => {
        setIsParsing(true);
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = e.target?.result;
                const workbook = xlsx.read(data, { type: "array" });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const json = xlsx.utils.sheet_to_json(worksheet);
                setParsedData(json);
            } catch (error) {
                toast.error("فشل في قراءة الملف. تأكد من أنه بصيغة Excel صحيحة.");
            } finally {
                setIsParsing(false);
            }
        };
        reader.readAsArrayBuffer(file);
    };

    const handleUpload = async () => {
        if (parsedData.length === 0) {
            toast.error("لا توجد بيانات للاستيراد");
            return;
        }

        setIsUploading(true);
        let successCount = 0;
        let errorCount = 0;

        for (const row of parsedData) {
            try {
                // Parse delimited relations
                let features: { feature_ar: string; feature_en: string }[] = [];
                if (row.features) {
                    features = String(row.features).split('|').map(f => {
                        const parts = f.split(':');
                        return { feature_ar: parts[0]?.trim() || "", feature_en: parts[1]?.trim() || parts[0]?.trim() || "" };
                    });
                }

                let packagings: { size_ar: string; size_en: string; price: number }[] = [];
                if (row.packagings) {
                    packagings = String(row.packagings).split('|').map(p => {
                        const parts = p.split(':');
                        return {
                            size_ar: parts[0]?.trim() || "",
                            size_en: parts[1]?.trim() || parts[0]?.trim() || "",
                            price: parseFloat(parts[2]?.trim() || "0")
                        };
                    });
                }

                const payload = {
                    slug: row.slug?.toString()?.trim(),
                    name_ar: row.name_ar,
                    name_en: row.name_en,
                    short_description_ar: row.short_description_ar,
                    short_description_en: row.short_description_en,
                    description_ar: row.description_ar,
                    description_en: row.description_en,
                    price: row.price ? parseFloat(row.price) : null,
                    categoryId: row.categoryId ? parseInt(row.categoryId) : null,
                    is_featured: row.is_featured === "true" || row.is_featured === true,
                    is_exportable: row.is_exportable === "true" || row.is_exportable === true,
                    features,
                    packagings
                };

                // Basic validation
                if (!payload.slug || !payload.name_ar || !payload.name_en) {
                    errorCount++;
                    continue;
                }

                const res = await fetch("/api/admin/products", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });

                if (res.ok) {
                    successCount++;
                } else {
                    errorCount++;
                }
            } catch (error) {
                errorCount++;
            }
        }

        setIsUploading(false);
        if (successCount > 0) {
            toast.success(`تم استيراد ${successCount} منتج بنجاح`);
            if (errorCount > 0) toast.error(`فشل استيراد ${errorCount} منتج (ربما الرابط مكرر أو البيانات ناقصة)`);
            onSuccess();
            onClose();
        } else {
            toast.error("فشل في استيراد جميع المنتجات. راجع البيانات وحاول مرة أخرى.");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
            
            <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                            <FileSpreadsheet className="w-5 h-5 text-green-700" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-800">استيراد المنتجات (Excel)</h2>
                            <p className="text-sm text-slate-500 font-medium mt-0.5">أضف عدة منتجات دفعة واحدة عبر ملف إكسل</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto flex-1">
                    {!file ? (
                        <div className="space-y-6">
                            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
                                <h3 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                                    <AlertCircle className="w-5 h-5" />
                                    تنبيهات هامة قبل الاستيراد
                                </h3>
                                <ul className="list-disc list-inside text-sm text-blue-700/80 space-y-1">
                                    <li>تأكد من أن <strong>الرابط (slug)</strong> فريد لكل منتج باللغة الإنجليزية ولا يحتوي على مسافات.</li>
                                    <li>الأعمدة الإجبارية هي: <code className="bg-white px-1 py-0.5 rounded text-blue-900">slug</code>, <code className="bg-white px-1 py-0.5 rounded text-blue-900">name_ar</code>, <code className="bg-white px-1 py-0.5 rounded text-blue-900">name_en</code>.</li>
                                    <li>لإضافة خصائص التعبئة افصل بين كل خيار بـ <code>|</code> وبين بيانات الخيار بـ <code>:</code> (مثال: الحجم:الوزن:السعر | الحجم2:الوزن2:السعر2)</li>
                                </ul>
                                <button onClick={downloadTemplate} className="mt-4 inline-flex items-center gap-2 text-blue-700 font-bold text-sm bg-white border border-blue-200 px-4 py-2 rounded-xl hover:bg-blue-100 transition-colors">
                                    <Download className="w-4 h-4" /> تحميل نموذج إكسل فارغ للملء
                                </button>
                            </div>

                            <div 
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-slate-300 rounded-3xl p-12 text-center hover:border-green-500 hover:bg-green-50/50 transition-colors cursor-pointer group"
                            >
                                <input type="file" accept=".xlsx, .xls, .csv" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
                                <div className="w-16 h-16 rounded-2xl bg-slate-100 group-hover:bg-green-100 flex items-center justify-center mx-auto mb-4 transition-colors">
                                    <Upload className="w-8 h-8 text-slate-400 group-hover:text-green-600 transition-colors" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-700 mb-1">اضغط هنا لاختيار ملف</h3>
                                <p className="text-sm text-slate-400">يدعم صيغ Excel (.xlsx, .xls) و CSV</p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-200">
                                <div className="flex items-center gap-3">
                                    <FileSpreadsheet className="w-6 h-6 text-green-600" />
                                    <div>
                                        <h4 className="font-bold text-slate-700">{file.name}</h4>
                                        <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB • {parsedData.length} منتج</p>
                                    </div>
                                </div>
                                <button onClick={() => { setFile(null); setParsedData([]); }} className="text-sm font-bold text-red-500 hover:text-red-700 px-3 py-1.5 bg-red-50 rounded-lg">إلغاء واختيار ملف آخر</button>
                            </div>

                            {isParsing ? (
                                <div className="py-12 flex flex-col items-center justify-center text-slate-400">
                                    <Loader2 className="w-8 h-8 animate-spin mb-4" />
                                    <p>جاري قراءة الملف...</p>
                                </div>
                            ) : parsedData.length > 0 ? (
                                <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm max-h-[300px] overflow-y-auto">
                                    <table className="w-full text-sm text-right">
                                        <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
                                            <tr>
                                                <th className="px-4 py-3 font-bold text-slate-600">الاسم (AR)</th>
                                                <th className="px-4 py-3 font-bold text-slate-600">الرابط (Slug)</th>
                                                <th className="px-4 py-3 font-bold text-slate-600">السعر</th>
                                                <th className="px-4 py-3 font-bold text-slate-600">الحالة</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {parsedData.map((row, i) => {
                                                const isValid = row.slug && row.name_ar && row.name_en;
                                                return (
                                                    <tr key={i} className="bg-white">
                                                        <td className="px-4 py-3 font-medium text-slate-800">{row.name_ar || "-"}</td>
                                                        <td className="px-4 py-3 text-slate-500 font-english">{row.slug || "-"}</td>
                                                        <td className="px-4 py-3 text-slate-600">{row.price || "-"}</td>
                                                        <td className="px-4 py-3">
                                                            {isValid ? (
                                                                <span className="inline-flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-lg text-xs font-bold"><CheckCircle className="w-3.5 h-3.5"/> جاهز</span>
                                                            ) : (
                                                                <span className="inline-flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded-lg text-xs font-bold"><AlertCircle className="w-3.5 h-3.5"/> ناقص</span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-12 text-slate-500">لم يتم العثور على بيانات صالحة في الملف</div>
                            )}
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 shrink-0">
                    <button
                        onClick={onClose}
                        disabled={isUploading}
                        className="px-6 py-2.5 rounded-xl font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
                    >
                        إلغاء
                    </button>
                    <button
                        onClick={handleUpload}
                        disabled={!file || parsedData.length === 0 || isUploading}
                        className="px-8 py-2.5 rounded-xl font-bold text-white bg-gradient-to-l from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 transition-colors shadow-lg shadow-green-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isUploading ? (
                            <><Loader2 className="w-5 h-5 animate-spin" /> جاري الحفظ...</>
                        ) : (
                            <><Upload className="w-5 h-5" /> تأكيد الاستيراد</>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
