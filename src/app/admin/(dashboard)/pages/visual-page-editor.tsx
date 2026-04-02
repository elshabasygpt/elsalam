"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
    Save, Loader2, ArrowRight, ChevronDown, ChevronUp,
    Plus, Trash2, GripVertical, Code2, Eye, CheckCircle2,
    Languages, Upload, ImageIcon, X, FileText
} from "lucide-react";
import Link from "next/link";

// ─── Type Definitions ───

interface FieldConfig {
    key: string;
    labelAr: string;
    labelEn: string;
    type: "text" | "textarea" | "url" | "list";
    bilingual: boolean;
    required?: boolean;
    placeholder?: string;
    placeholderEn?: string;
    listFields?: FieldConfig[]; // For nested list items
}

interface SectionConfig {
    id: string;
    title: string;
    emoji: string;
    description?: string;
    fields: FieldConfig[];
}

interface VisualPageEditorProps {
    slug: string;
    pageNameAr: string;
    pageNameEn: string;
    sections: SectionConfig[];
    initialContent: string;
}

// ─── Sub-Components ───

function CollapsibleSection({
    title,
    emoji,
    description,
    defaultOpen = true,
    children,
}: {
    title: string;
    emoji: string;
    description?: string;
    defaultOpen?: boolean;
    children: React.ReactNode;
}) {
    const [open, setOpen] = useState(defaultOpen);

    return (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm transition-all duration-200">
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="w-full px-6 py-4 flex items-center justify-between text-right hover:bg-slate-50/50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <span className="text-xl">{emoji}</span>
                    <div>
                        <h3 className="font-bold text-sm text-slate-800">{title}</h3>
                        {description && <p className="text-[11px] text-slate-400 mt-0.5">{description}</p>}
                    </div>
                </div>
                <div className={`p-1.5 rounded-lg transition-colors ${open ? "bg-green-50 text-green-600" : "bg-slate-100 text-slate-400"}`}>
                    {open ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
            </button>
            {open && (
                <div className="px-6 pb-6 pt-2 space-y-5 border-t border-gray-50">
                    {children}
                </div>
            )}
        </div>
    );
}

function BilingualField({
    labelAr,
    labelEn,
    valueAr,
    valueEn,
    onChangeAr,
    onChangeEn,
    type = "text",
    required,
    placeholder,
    placeholderEn,
}: {
    labelAr: string;
    labelEn: string;
    valueAr: string;
    valueEn: string;
    onChangeAr: (v: string) => void;
    onChangeEn: (v: string) => void;
    type?: "text" | "textarea" | "url";
    required?: boolean;
    placeholder?: string;
    placeholderEn?: string;
}) {
    const inputCls = "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all text-sm font-medium placeholder:text-slate-300";

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Arabic */}
            <div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 mb-2">
                    {labelAr}
                    {required && <span className="text-red-400">*</span>}
                    <span className="mr-auto px-1.5 py-0.5 bg-green-50 text-green-600 text-[9px] font-bold rounded">عربي</span>
                </label>
                {type === "textarea" ? (
                    <textarea
                        value={valueAr}
                        onChange={(e) => onChangeAr(e.target.value)}
                        rows={3}
                        className={`${inputCls} resize-none`}
                        placeholder={placeholder}
                        dir="rtl"
                    />
                ) : (
                    <input
                        type={type === "url" ? "url" : "text"}
                        value={valueAr}
                        onChange={(e) => onChangeAr(e.target.value)}
                        className={inputCls}
                        placeholder={placeholder}
                        dir={type === "url" ? "ltr" : "rtl"}
                    />
                )}
            </div>
            {/* English */}
            <div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 mb-2">
                    {labelEn}
                    {required && <span className="text-red-400">*</span>}
                    <span className="mr-auto px-1.5 py-0.5 bg-blue-50 text-blue-600 text-[9px] font-bold rounded">EN</span>
                </label>
                {type === "textarea" ? (
                    <textarea
                        value={valueEn}
                        onChange={(e) => onChangeEn(e.target.value)}
                        rows={3}
                        className={`${inputCls} resize-none text-left`}
                        placeholder={placeholderEn || placeholder}
                        dir="ltr"
                    />
                ) : (
                    <input
                        type={type === "url" ? "url" : "text"}
                        value={valueEn}
                        onChange={(e) => onChangeEn(e.target.value)}
                        className={`${inputCls} text-left`}
                        placeholder={placeholderEn || placeholder}
                        dir="ltr"
                    />
                )}
            </div>
        </div>
    );
}

function SingleField({
    label,
    value,
    onChange,
    type = "text",
    required,
    placeholder,
    dir = "rtl",
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    type?: "text" | "textarea" | "url";
    required?: boolean;
    placeholder?: string;
    dir?: string;
}) {
    const inputCls = "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all text-sm font-medium placeholder:text-slate-300";

    return (
        <div>
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 mb-2">
                {label}
                {required && <span className="text-red-400">*</span>}
            </label>
            {type === "textarea" ? (
                <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    rows={3}
                    className={`${inputCls} resize-none ${dir === "ltr" ? "text-left" : ""}`}
                    placeholder={placeholder}
                    dir={dir}
                />
            ) : (
                <input
                    type={type === "url" ? "url" : "text"}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={`${inputCls} ${dir === "ltr" ? "text-left" : ""}`}
                    placeholder={placeholder}
                    dir={dir}
                />
            )}
        </div>
    );
}

function ImageUploadField({
    label,
    value,
    onChange,
    placeholder,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
}) {
    const [uploading, setUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const [error, setError] = useState("");
    const fileRef = useRef<HTMLInputElement>(null);

    const handleUpload = async (file: File) => {
        setUploading(true);
        setError("");
        try {
            const formData = new FormData();
            formData.append("file", file);
            const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
            const data = await res.json();
            if (res.ok) {
                onChange(data.url);
            } else {
                setError(data.error || "فشل رفع الصورة");
            }
        } catch {
            setError("خطأ في الاتصال");
        } finally {
            setUploading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleUpload(file);
        e.target.value = "";
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleUpload(file);
    };

    const isImage = value && (value.startsWith("/") || value.startsWith("http"));
    const isPdf = value && value.toLowerCase().endsWith(".pdf");
    const inputCls = "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all text-sm font-medium placeholder:text-slate-300";

    return (
        <div>
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 mb-2">
                <ImageIcon className="w-5 h-5" />
                {label}
            </label>

            {/* Preview */}
            {isImage && !isPdf && (
                <div className="relative mb-2 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 group">
                    <img
                        src={value}
                        alt="preview"
                        className="w-full h-32 object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                    <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); onChange(""); }}
                        className="absolute top-2 left-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                        title="حذف الصورة"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            )}
            {isPdf && (
                <div className="relative mb-2 flex items-center gap-3 p-3 rounded-xl border border-red-200 bg-red-50/50 group">
                    <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-red-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-700 truncate" dir="ltr">{value.split('/').pop()}</p>
                        <p className="text-[10px] text-slate-400">ملف PDF</p>
                    </div>
                    <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); onChange(""); }}
                        className="p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                        title="حذف الملف"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            )}

            {/* Upload zone */}
            <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className={`relative flex items-center gap-3 p-3 border-2 border-dashed rounded-xl transition-all cursor-pointer ${
                    dragOver
                        ? "border-green-400 bg-green-50"
                        : "border-slate-200 hover:border-green-300 hover:bg-green-50/30"
                }`}
                onClick={() => fileRef.current?.click()}
            >
                <input
                    ref={fileRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/svg+xml,image/gif,application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                />
                <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                    uploading ? "bg-green-100" : "bg-slate-100"
                }`}>
                    {uploading
                        ? <Loader2 className="w-5 h-5 text-green-600 animate-spin" />
                        : <Upload className="w-5 h-5 text-slate-400" />
                    }
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-600">
                        {uploading ? "جاري رفع الملف..." : "اضغط أو اسحب ملف هنا"}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                        JPG, PNG, WebP, SVG, PDF — الحد الأقصى 10MB
                    </p>
                </div>
            </div>

            {/* URL input fallback */}
            <div className="mt-2">
                <input
                    type="url"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={`${inputCls} text-left text-[11px]`}
                    placeholder={placeholder || "أو أدخل الرابط مباشرة"}
                    dir="ltr"
                />
            </div>

            {error && (
                <p className="text-xs text-red-500 font-bold mt-1.5">❌ {error}</p>
            )}
        </div>
    );
}

function ListEditor({
    items,
    onAdd,
    onRemove,
    onMove,
    children,
    addLabel = "إضافة عنصر جديد",
}: {
    items: any[];
    onAdd: () => void;
    onRemove: (index: number) => void;
    onMove: (from: number, to: number) => void;
    children: (item: any, index: number) => React.ReactNode;
    addLabel?: string;
}) {
    return (
        <div className="space-y-3">
            {items.map((item, idx) => (
                <div key={idx} className="relative bg-slate-50/50 rounded-xl border border-slate-100 p-4 group">
                    {/* Item header bar */}
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                        <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded bg-slate-200 text-slate-500 flex items-center justify-center text-[10px] font-black">
                                {idx + 1}
                            </span>
                            عنصر {idx + 1}
                        </span>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {idx > 0 && (
                                <button type="button" onClick={() => onMove(idx, idx - 1)} className="p-1 rounded hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors" title="نقل لأعلى">
                                    <ChevronUp className="w-5 h-5" />
                                </button>
                            )}
                            {idx < items.length - 1 && (
                                <button type="button" onClick={() => onMove(idx, idx + 1)} className="p-1 rounded hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors" title="نقل لأسفل">
                                    <ChevronDown className="w-5 h-5" />
                                </button>
                            )}
                            <button type="button" onClick={() => onRemove(idx)} className="p-1 rounded hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors" title="حذف">
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                    {children(item, idx)}
                </div>
            ))}
            <button
                type="button"
                onClick={onAdd}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-sm font-bold hover:border-green-300 hover:text-green-600 hover:bg-green-50/50 transition-all"
            >
                <Plus className="w-5 h-5" />
                {addLabel}
            </button>
        </div>
    );
}

// ─── Field Renderer ───

function FieldRenderer({
    field,
    data,
    onChange,
}: {
    field: FieldConfig;
    data: Record<string, any>;
    onChange: (key: string, value: any) => void;
}) {
    if (field.type === "list" && field.listFields) {
        const items: any[] = data[field.key] || [];

        const handleAdd = () => {
            const newItem: Record<string, any> = {};
            field.listFields!.forEach((lf) => {
                if (lf.bilingual) {
                    newItem[lf.key + "_ar"] = "";
                    newItem[lf.key + "_en"] = "";
                } else {
                    newItem[lf.key] = "";
                }
            });
            onChange(field.key, [...items, newItem]);
        };

        const handleRemove = (idx: number) => {
            if (confirm("هل أنت متأكد من حذف هذا العنصر؟")) {
                onChange(field.key, items.filter((_, i) => i !== idx));
            }
        };

        const handleMove = (from: number, to: number) => {
            const copy = [...items];
            const [moved] = copy.splice(from, 1);
            copy.splice(to, 0, moved);
            onChange(field.key, copy);
        };

        const handleItemChange = (idx: number, itemKey: string, value: any) => {
            const copy = [...items];
            copy[idx] = { ...copy[idx], [itemKey]: value };
            onChange(field.key, copy);
        };

        return (
            <div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-600 mb-3">
                    <span className="text-base">{field.labelAr}</span>
                    <span className="text-slate-400 font-normal">({items.length} عنصر)</span>
                </label>
                <ListEditor
                    items={items}
                    onAdd={handleAdd}
                    onRemove={handleRemove}
                    onMove={handleMove}
                    addLabel={`إضافة ${field.labelAr}`}
                >
                    {(item, idx) => (
                        <div className="space-y-3">
                            {field.listFields!.map((lf) => {
                                if (lf.bilingual) {
                                    return (
                                        <BilingualField
                                            key={lf.key}
                                            labelAr={lf.labelAr}
                                            labelEn={lf.labelEn}
                                            valueAr={item[lf.key + "_ar"] || item[lf.key] || ""}
                                            valueEn={item[lf.key + "_en"] || ""}
                                            onChangeAr={(v) => handleItemChange(idx, lf.key + "_ar", v)}
                                            onChangeEn={(v) => handleItemChange(idx, lf.key + "_en", v)}
                                            type={lf.type === "list" ? "text" : lf.type}
                                            placeholder={lf.placeholder}
                                            placeholderEn={lf.placeholderEn}
                                        />
                                    );
                                } else if (lf.type === "url") {
                                    return (
                                        <ImageUploadField
                                            key={lf.key}
                                            label={lf.labelAr}
                                            value={item[lf.key] || ""}
                                            onChange={(v) => handleItemChange(idx, lf.key, v)}
                                            placeholder={lf.placeholder}
                                        />
                                    );
                                } else {
                                    return (
                                        <SingleField
                                            key={lf.key}
                                            label={lf.labelAr}
                                            value={item[lf.key] || ""}
                                            onChange={(v) => handleItemChange(idx, lf.key, v)}
                                            type={lf.type === "list" ? "text" : lf.type}
                                            placeholder={lf.placeholder}
                                        />
                                    );
                                }
                            })}
                        </div>
                    )}
                </ListEditor>
            </div>
        );
    }

    if (field.bilingual) {
        return (
            <BilingualField
                labelAr={field.labelAr}
                labelEn={field.labelEn}
                valueAr={data[field.key + "_ar"] || data[field.key] || ""}
                valueEn={data[field.key + "_en"] || ""}
                onChangeAr={(v) => onChange(field.key + "_ar", v)}
                onChangeEn={(v) => onChange(field.key + "_en", v)}
                type={field.type}
                required={field.required}
                placeholder={field.placeholder}
                placeholderEn={field.placeholderEn}
            />
        );
    }

    if (field.type === "url") {
        return (
            <ImageUploadField
                label={field.labelAr}
                value={data[field.key] || ""}
                onChange={(v) => onChange(field.key, v)}
                placeholder={field.placeholder}
            />
        );
    }

    return (
        <SingleField
            label={field.labelAr}
            value={data[field.key] || ""}
            onChange={(v) => onChange(field.key, v)}
            type={field.type}
            required={field.required}
            placeholder={field.placeholder}
            dir="rtl"
        />
    );
}

// ─── Main Editor ───

export function VisualPageEditor({
    slug,
    pageNameAr,
    pageNameEn,
    sections,
    initialContent,
}: VisualPageEditorProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [advancedMode, setAdvancedMode] = useState(false);
    const [rawJson, setRawJson] = useState(initialContent);

    // Parse initial data from JSON
    const parseInitialData = useCallback(() => {
        try {
            return JSON.parse(initialContent);
        } catch {
            return {};
        }
    }, [initialContent]);

    const [formData, setFormData] = useState<Record<string, any>>(parseInitialData);

    const handleFieldChange = (sectionId: string, key: string, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [sectionId]: {
                ...(prev[sectionId] || {}),
                [key]: value,
            },
        }));
    };

    const getFormDataAsJson = () => {
        return JSON.stringify(formData, null, 2);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess(false);

        try {
            const contentToSave = advancedMode ? rawJson : getFormDataAsJson();

            // Validate JSON
            try {
                JSON.parse(contentToSave);
            } catch {
                setError("صيغة JSON غير صحيحة");
                setLoading(false);
                return;
            }

            const res = await fetch(`/api/admin/pages/${slug}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: contentToSave }),
            });

            if (res.ok) {
                setSuccess(true);
                router.refresh();
                setTimeout(() => setSuccess(false), 4000);
            } else {
                const data = await res.json();
                setError(data.error || "حدث خطأ أثناء حفظ المحتوى");
            }
        } catch {
            setError("حدث خطأ في الاتصال");
        } finally {
            setLoading(false);
        }
    };

    const switchToAdvanced = () => {
        setRawJson(getFormDataAsJson());
        setAdvancedMode(true);
    };

    const switchToVisual = () => {
        try {
            setFormData(JSON.parse(rawJson));
            setAdvancedMode(false);
        } catch {
            setError("لا يمكن التبديل — JSON غير صالح. أصلح الأخطاء أولاً.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {/* Toast Messages */}
            {error && (
                <div className="flex items-center gap-2 p-4 bg-red-50 text-red-600 rounded-xl font-bold text-sm border border-red-100">
                    <span>❌</span> {error}
                </div>
            )}
            {success && (
                <div className="flex items-center gap-2 p-4 bg-green-50 text-green-600 rounded-xl font-bold text-sm border border-green-100">
                    <CheckCircle2 className="w-5 h-5" /> تم حفظ المحتوى بنجاح
                </div>
            )}

            {/* Mode Toggle */}
            <div className="flex items-center justify-between bg-white px-5 py-3 rounded-xl border border-gray-100">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Languages className="w-5 h-5" />
                    <span>تعديل محتوى: <span className="font-bold text-slate-700">{pageNameAr}</span></span>
                </div>
                <button
                    type="button"
                    onClick={advancedMode ? switchToVisual : switchToAdvanced}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                        advancedMode
                            ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
                            : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                    }`}
                >
                    {advancedMode ? (
                        <>
                            <Eye className="w-5 h-5" />
                            العودة للوضع المرئي
                        </>
                    ) : (
                        <>
                            <Code2 className="w-5 h-5" />
                            وضع متقدم (JSON)
                        </>
                    )}
                </button>
            </div>

            {advancedMode ? (
                /* ── Advanced JSON Mode ── */
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                    <div className="px-6 py-4 border-b border-gray-50 bg-amber-50/30 flex items-center gap-2">
                        <Code2 className="w-5 h-5 text-amber-600" />
                        <span className="text-sm font-bold text-amber-800">الوضع المتقدم — تعديل JSON مباشر</span>
                    </div>
                    <div className="p-4">
                        <textarea
                            value={rawJson}
                            onChange={(e) => setRawJson(e.target.value)}
                            rows={24}
                            dir="ltr"
                            className="w-full px-4 py-3 bg-slate-900 text-green-400 border border-slate-700 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all font-mono text-xs resize-y text-left leading-relaxed"
                        />
                    </div>
                </div>
            ) : (
                /* ── Visual Mode ── */
                <div className="space-y-4">
                    {sections.map((section, sIdx) => {
                        const sectionData = formData[section.id] || {};
                        return (
                            <CollapsibleSection
                                key={section.id}
                                title={section.title}
                                emoji={section.emoji}
                                description={section.description}
                                defaultOpen={sIdx < 2}
                            >
                                {section.fields.map((field) => (
                                    <FieldRenderer
                                        key={field.key}
                                        field={field}
                                        data={sectionData}
                                        onChange={(key, value) =>
                                            handleFieldChange(section.id, key, value)
                                        }
                                    />
                                ))}
                            </CollapsibleSection>
                        );
                    })}
                </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
                <Link
                    href="/admin/pages"
                    className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-600 font-bold text-sm transition-colors"
                >
                    <ArrowRight className="w-5 h-5" />
                    العودة لقائمة الصفحات
                </Link>
                <div className="flex items-center gap-3">
                    <a
                        href={`/${slug === "home" ? "" : slug}`}
                        target="_blank"
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors"
                    >
                        <Eye className="w-5 h-5" />
                        معاينة الصفحة
                    </a>
                    <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex items-center gap-2 bg-gradient-to-l from-green-600 to-green-700 text-white px-8 py-3 rounded-xl font-bold text-sm hover:from-green-700 hover:to-green-800 transition-all shadow-lg shadow-green-600/15 disabled:opacity-50 active:scale-[0.97]"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        حفظ المحتوى
                    </button>
                </div>
            </div>
        </form>
    );
}
