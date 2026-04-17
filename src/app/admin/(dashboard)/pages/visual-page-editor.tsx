"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
    Save, Loader2, ArrowRight, ChevronDown, ChevronUp,
    Plus, Trash2, Code2, Eye, CheckCircle2,
    Languages, Upload, ImageIcon, X, FileText,
    Type, Palette, Maximize2, Square, LayoutTemplate,
    Link2, AlignLeft, Image as ImageIcon2, GripVertical
} from "lucide-react";
import Link from "next/link";

// ─── Type Definitions ───

interface FieldConfig {
    key: string;
    labelAr: string;
    labelEn: string;
    type: "text" | "textarea" | "url" | "list" | "select" | "color" | "range" | "toggle";
    options?: { label: string; value: string }[];
    min?: number;
    max?: number;
    step?: number;
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

// ─── Hero Design Panel (Tabbed Visual Editor) ───────────────────────────────

const DESIGN_TABS = [
    { id: "typography", label: "الخط",      icon: Type          },
    { id: "colors",     label: "الألوان",   icon: Palette       },
    { id: "spacing",    label: "المسافات",  icon: Maximize2     },
    { id: "card",       label: "البطاقة",   icon: Square        },
    { id: "layout",     label: "التخطيط",   icon: LayoutTemplate },
] as const;

type DesignTabId = typeof DESIGN_TABS[number]["id"];

function HeroDesignPanel({
    data,
    onChange,
}: {
    data: Record<string, any>;
    onChange: (key: string, value: any) => void;
}) {
    const [tab, setTab] = useState<DesignTabId>("typography");

    const cls = {
        input: "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all text-sm font-medium",
    };

    // ── Shared helpers ──
    function SelectCtrl({ label, fieldKey, options }: { label: string; fieldKey: string; options: { l: string; v: string }[] }) {
        return (
            <div>
                <p className="text-xs font-bold text-slate-500 mb-2">{label}</p>
                <div className="flex flex-wrap gap-2">
                    {options.map(o => (
                        <button type="button" key={o.v} onClick={() => onChange(fieldKey, o.v)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                                (data[fieldKey] || options[0].v) === o.v
                                    ? "bg-green-600 text-white border-green-600 shadow"
                                    : "bg-white text-slate-600 border-slate-200 hover:border-green-400"
                            }`}>{o.l}</button>
                    ))}
                </div>
            </div>
        );
    }

    function ColorCtrl({ label, fieldKey, def }: { label: string; fieldKey: string; def: string }) {
        const val = data[fieldKey] || def;
        return (
            <div>
                <p className="text-xs font-bold text-slate-500 mb-2">{label}</p>
                <div className="flex items-center gap-3">
                    <input type="color" value={val}
                        onChange={e => onChange(fieldKey, e.target.value)}
                        className="w-12 h-10 rounded-lg cursor-pointer border border-slate-200 p-0.5" />
                    <input type="text" value={val}
                        onChange={e => onChange(fieldKey, e.target.value)}
                        className="w-28 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                        dir="ltr" />
                    <div className="w-8 h-8 rounded-lg border border-slate-200 shadow-inner flex-shrink-0"
                        style={{ backgroundColor: val }} />
                    <span className="text-xs text-slate-400 flex-1">معاينة</span>
                </div>
            </div>
        );
    }

    function RangeCtrl({ label, fieldKey, min, max, step = 4, unit = "px", def }: {
        label: string; fieldKey: string; min: number; max: number; step?: number; unit?: string; def: number;
    }) {
        const val = Number(data[fieldKey] ?? def);
        return (
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-600">{label}</span>
                    <span className="text-sm font-black text-green-600 tabular-nums">{val}{unit}</span>
                </div>
                <input type="range" min={min} max={max} step={step} value={val}
                    onChange={e => onChange(fieldKey, Number(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer accent-green-600" />
                <div className="flex justify-between text-[10px] text-slate-300 mt-1">
                    <span>{min}{unit}</span><span>{max}{unit}</span>
                </div>
            </div>
        );
    }

    function ToggleCtrl({ label, fieldKey, sub }: { label: string; fieldKey: string; sub?: string }) {
        const val = data[fieldKey] !== false;
        return (
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                    <p className="text-xs font-bold text-slate-700">{label}</p>
                    {sub && <p className="text-[10px] text-slate-400 mt-0.5">{sub}</p>}
                </div>
                <button type="button" onClick={() => onChange(fieldKey, !val)}
                    className={`relative w-11 h-6 rounded-full transition-colors duration-300 flex-shrink-0 ${
                        val ? "bg-green-500" : "bg-slate-300"
                    }`}>
                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${
                        val ? "translate-x-5" : "translate-x-0.5"
                    }`} />
                </button>
            </div>
        );
    }

    // ── Tab Contents ──
    const TYPOGRAPHY = (
        <div className="space-y-5">
            <SelectCtrl label="حجم العنوان الرئيسي (H1)" fieldKey="titleFontSize" options={[
                { l: "صغير – 36px",        v: "text-4xl" },
                { l: "متوسط – 48px",        v: "text-5xl" },
                { l: "كبير – 60px",          v: "text-6xl" },
                { l: "كبير جداً – 72px",    v: "text-7xl" },
                { l: "ضخم – 96px",           v: "text-8xl" },
            ]} />
            <SelectCtrl label="وزن خط العنوان" fieldKey="titleFontWeight" options={[
                { l: "Bold (700)",       v: "font-bold" },
                { l: "Extra Bold (800)", v: "font-extrabold" },
                { l: "Black (900)",      v: "font-black" },
            ]} />
            <SelectCtrl label="ارتفاع السطر (Line Height)" fieldKey="titleLineHeight" options={[
                { l: "ضيق – 1.1",   v: "leading-tight" },
                { l: "متقارب – 1.25", v: "leading-snug" },
                { l: "عادي – 1.5",   v: "leading-normal" },
                { l: "واسع – 1.75",  v: "leading-relaxed" },
            ]} />
            <SelectCtrl label="حجم خط العنوان الفرعي" fieldKey="subtitleFontSize" options={[
                { l: "صغير – 14px",     v: "text-sm" },
                { l: "عادي – 16px",     v: "text-base" },
                { l: "متوسط – 18px",    v: "text-lg" },
                { l: "كبير – 20px",     v: "text-xl" },
                { l: "كبير جداً – 24px", v: "text-2xl" },
            ]} />
        </div>
    );

    const COLORS = (
        <div className="space-y-5">
            <div className="grid grid-cols-1 gap-4">
                <ColorCtrl label="🔡 لون العنوان الرئيسي (السطر الأول)" fieldKey="titleColor" def="#ffffff" />
                <div className="border-t border-slate-100 pt-4">
                    <ColorCtrl label="✨ لون الكلمة المميزة (السطر الثاني)" fieldKey="titleLine2Color" def="#34d399" />
                </div>
                <div className="border-t border-slate-100 pt-4">
                    <ColorCtrl label="💬 لون النص التوضيحي" fieldKey="subtitleColor" def="#d1d5db" />
                </div>
            </div>
            {/* Live mini-preview */}
            <div className="rounded-xl overflow-hidden border border-slate-200">
                <div className="px-4 py-2 bg-slate-100 border-b border-slate-200">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">معاينة مصغرة للألوان</p>
                </div>
                <div className="p-5 bg-slate-800">
                    <p className="text-2xl font-black mb-1" style={{ color: data.titleColor || "#ffffff" }}>
                        العنوان الأول
                    </p>
                    <p className="text-2xl font-black mb-3" style={{ color: data.titleLine2Color || "#34d399" }}>
                        الكلمة المميزة
                    </p>
                    <p className="text-sm" style={{ color: data.subtitleColor || "#d1d5db" }}>
                        النص التوضيحي للهيرو يظهر هنا بهذا اللون
                    </p>
                </div>
            </div>
        </div>
    );

    const SPACING = (
        <div className="space-y-4">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">📦 حشو الصفحة (Content Padding)</p>
            <RangeCtrl label="حشو علوي" fieldKey="contentPaddingTop"    min={20}  max={240} def={144} />
            <RangeCtrl label="حشو سفلي" fieldKey="contentPaddingBottom" min={16}  max={160} def={96} />
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2 pt-2">🃏 حشو البطاقة (Card Padding)</p>
            <RangeCtrl label="أفقي (يسار/يمين)" fieldKey="cardPaddingX" min={8}   max={80}  def={48} />
            <RangeCtrl label="عمودي (أعلى/أسفل)" fieldKey="cardPaddingY" min={8}  max={80}  def={48} />
        </div>
    );

    const CARD = (
        <div className="space-y-4">
            <RangeCtrl
                label="شفافية خلفية البطاقة (0 = شفاف تام)"
                fieldKey="cardBgOpacity"
                min={0} max={80} step={5} unit="%" def={40}
            />
            {/* Opacity preview swatch */}
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 bg-slate-700">
                <div
                    className="w-12 h-8 rounded-lg border border-white/20"
                    style={{ backgroundColor: `rgba(0,0,0,${Number(data.cardBgOpacity ?? 40) / 100})` }}
                />
                <span className="text-xs text-white/60">معاينة شفافية الخلفية</span>
            </div>
            <RangeCtrl
                label="شدة تعتيم صورة الخلفية"
                fieldKey="overlayOpacity"
                min={0} max={95} step={5} unit="%" def={80}
            />
            <SelectCtrl label="تأثير الضبابية (Blur)" fieldKey="cardBlur" options={[
                { l: "بدون",      v: "backdrop-blur-none" },
                { l: "خفيف",     v: "backdrop-blur-sm" },
                { l: "متوسط",    v: "backdrop-blur-md" },
                { l: "قوي",       v: "backdrop-blur-xl" },
                { l: "قوي جداً", v: "backdrop-blur-3xl" },
            ]} />
            <SelectCtrl label="انحناء الحواف" fieldKey="cardRounded" options={[
                { l: "حاد",       v: "rounded-xl" },
                { l: "متوسط",    v: "rounded-2xl" },
                { l: "دائري",    v: "rounded-3xl" },
                { l: "كبسول",    v: "rounded-[2rem]" },
            ]} />
            <ToggleCtrl label="إظهار حدود البطاقة" fieldKey="cardBorderEnabled"
                sub="خط ناعم شبه شفاف حول البطاقة" />
        </div>
    );

    const LAYOUT = (
        <div className="space-y-5">
            <SelectCtrl label="محاذاة النص" fieldKey="textAlign" options={[
                { l: "يسار / بداية السطر", v: "text-start" },
                { l: "وسط الصفحة",         v: "text-center" },
            ]} />
            <SelectCtrl label="أقصى عرض للبطاقة" fieldKey="cardMaxWidth" options={[
                { l: "ضيق – 576px",    v: "max-w-xl" },
                { l: "متوسط – 672px",  v: "max-w-2xl" },
                { l: "واسع – 768px",   v: "max-w-3xl" },
                { l: "أوسع – 896px",   v: "max-w-4xl" },
                { l: "كامل العرض",     v: "max-w-full" },
            ]} />
            {/* Layout preview */}
            <div className="rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-4 py-2 bg-slate-100 border-b border-slate-200">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">معاينة التوزيع</p>
                </div>
                <div className="p-4 bg-slate-700 flex">
                    <div
                        className={`bg-white/10 border border-white/20 rounded-xl p-3 ${
                            (data.textAlign || "text-start") === "text-center"
                                ? "mx-auto text-center"
                                : "text-right"
                        } ${
                            (({ "max-w-xl": "w-1/2", "max-w-2xl": "w-2/3", "max-w-3xl": "w-3/4",
                               "max-w-4xl": "w-5/6", "max-w-full": "w-full" } as Record<string, string>)[data.cardMaxWidth || "max-w-3xl"] || "w-3/4")
                        }`}
                    >
                        <div className="text-white/80 text-xs font-bold">البطاقة</div>
                        <div className="text-white/40 text-[10px] mt-0.5">محاذاة: {(data.textAlign || "text-start") === "text-center" ? "وسط" : "يسار"}</div>
                    </div>
                </div>
            </div>
        </div>
    );

    const tabContent: Record<DesignTabId, React.ReactNode> = {
        typography: TYPOGRAPHY,
        colors:     COLORS,
        spacing:    SPACING,
        card:       CARD,
        layout:     LAYOUT,
    };

    return (
        <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            {/* ── Tab Bar ── */}
            <div className="flex border-b border-slate-200 bg-slate-50 overflow-x-auto">
                {DESIGN_TABS.map(t => {
                    const Icon = t.icon;
                    const active = tab === t.id;
                    return (
                        <button
                            key={t.id}
                            type="button"
                            onClick={() => setTab(t.id)}
                            className={`flex items-center gap-1.5 px-4 py-3 text-xs font-bold whitespace-nowrap border-b-2 transition-all ${
                                active
                                    ? "border-green-500 text-green-700 bg-white"
                                    : "border-transparent text-slate-400 hover:text-slate-600 hover:bg-white/60"
                            }`}
                        >
                            <Icon className="w-4 h-4" />
                            {t.label}
                            {active && <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />}
                        </button>
                    );
                })}
            </div>

            {/* ── Tab Content ── */}
            <div className="p-5 bg-white min-h-[260px]">
                {tabContent[tab]}
            </div>

            {/* ── Quick Stats Bar ── */}
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex flex-wrap gap-4">
                <span className="text-[10px] text-slate-400">العنوان: <span className="font-bold text-slate-600">{data.titleFontSize || "text-6xl"}</span></span>
                <span className="text-[10px] text-slate-400">الوزن: <span className="font-bold text-slate-600">{data.titleFontWeight || "font-extrabold"}</span></span>
                <span className="text-[10px] text-slate-400">التعتيم: <span className="font-bold text-slate-600">{data.overlayOpacity ?? 80}%</span></span>
                <span className="text-[10px] text-slate-400">البطاقة: <span className="font-bold text-slate-600">{data.cardBgOpacity ?? 40}%</span></span>
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-sm border border-slate-300" style={{ backgroundColor: data.titleColor || "#ffffff" }} />
                    <div className="w-3 h-3 rounded-sm border border-slate-300" style={{ backgroundColor: data.titleLine2Color || "#34d399" }} />
                    <div className="w-3 h-3 rounded-sm border border-slate-300" style={{ backgroundColor: data.subtitleColor || "#d1d5db" }} />
                    <span className="text-[10px] text-slate-400">الألوان النشطة</span>
                </div>
            </div>
        </div>
    );
}

// ─── Hero Slides Panel ────────────────────────────────────────────────────

const SLIDE_TABS = [
    { id: "content", label: "المحتوى",  icon: AlignLeft  },
    { id: "buttons", label: "الأزرار",   icon: Link2      },
    { id: "image",   label: "الصورة",    icon: ImageIcon2 },
] as const;

type SlideTabId = typeof SLIDE_TABS[number]["id"];

function SlideCard({
    slide,
    index,
    total,
    onChange,
    onRemove,
    onMoveUp,
    onMoveDown,
}: {
    slide: Record<string, any>;
    index: number;
    total: number;
    onChange: (key: string, val: string) => void;
    onRemove: () => void;
    onMoveUp: () => void;
    onMoveDown: () => void;
}) {
    const [open, setOpen] = useState(index === 0);
    const [tab, setTab]   = useState<SlideTabId>("content");
    const fileRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);

    const inputCls = "w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all";
    const label    = (ar: string, en: string) => (
        <div className="grid grid-cols-2 gap-3">
            <div>
                <p className="text-[10px] font-bold text-slate-400 mb-1 flex items-center gap-1">{ar} <span className="px-1 py-0.5 bg-green-50 text-green-600 text-[8px] rounded font-black">عربي</span></p>
                <input className={inputCls} dir="rtl"
                    value={slide[ar === "اسم التبويب" ? "tabName_ar" : ar === "الشارة" ? "badge_ar" : ar === "السطر الأول" ? "titleLine1_ar" : ar === "السطر الثاني" ? "titleLine2_ar" : ar === "نص الزر الأساسي" ? "ctaPrimary_ar" : "ctaSecondary_ar"] || ""}
                    onChange={e => onChange(ar === "اسم التبويب" ? "tabName_ar" : ar === "الشارة" ? "badge_ar" : ar === "السطر الأول" ? "titleLine1_ar" : ar === "السطر الثاني" ? "titleLine2_ar" : ar === "نص الزر الأساسي" ? "ctaPrimary_ar" : "ctaSecondary_ar", e.target.value)}
                    placeholder={`أدخل ${ar} بالعربية`} />
            </div>
            <div>
                <p className="text-[10px] font-bold text-slate-400 mb-1 flex items-center gap-1">{en} <span className="px-1 py-0.5 bg-blue-50 text-blue-600 text-[8px] rounded font-black">EN</span></p>
                <input className={`${inputCls} text-left`} dir="ltr"
                    value={slide[ar === "اسم التبويب" ? "tabName_en" : ar === "الشارة" ? "badge_en" : ar === "السطر الأول" ? "titleLine1_en" : ar === "السطر الثاني" ? "titleLine2_en" : ar === "نص الزر الأساسي" ? "ctaPrimary_en" : "ctaSecondary_en"] || ""}
                    onChange={e => onChange(ar === "اسم التبويب" ? "tabName_en" : ar === "الشارة" ? "badge_en" : ar === "السطر الأول" ? "titleLine1_en" : ar === "السطر الثاني" ? "titleLine2_en" : ar === "نص الزر الأساسي" ? "ctaPrimary_en" : "ctaSecondary_en", e.target.value)}
                    placeholder={`Enter ${en} in English`} />
            </div>
        </div>
    );

    const handleUpload = async (file: File) => {
        setUploading(true);
        try {
            const fd = new FormData(); fd.append("file", file);
            const r  = await fetch("/api/admin/upload", { method: "POST", body: fd });
            const d  = await r.json();
            if (r.ok) onChange("image", d.url);
        } finally { setUploading(false); }
    };

    // Title preview from ar fields
    const previewTitle = slide.titleLine2_ar || slide.titleLine2 || `شريحة ${index + 1}`;
    const tabName      = slide.tabName_ar   || slide.tabName    || `شريحة ${index + 1}`;

    return (
        <div className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
            open ? "border-green-200 shadow-md" : "border-slate-200 hover:border-slate-300"
        }`}>
            {/* ── Card Header ── */}
            <div
                className={`flex items-center gap-3 px-4 py-3 cursor-pointer ${
                    open ? "bg-green-50" : "bg-slate-50 hover:bg-slate-100"
                }`}
                onClick={() => setOpen(!open)}
            >
                {/* Drag handle */}
                <GripVertical className="w-4 h-4 text-slate-300 flex-shrink-0" />

                {/* Number badge */}
                <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0 ${
                    open ? "bg-green-600 text-white" : "bg-slate-200 text-slate-500"
                }`}>{index + 1}</span>

                {/* Thumbnail */}
                {slide.image && (
                    <img src={slide.image} alt="" className="w-10 h-7 rounded object-cover border border-slate-200 flex-shrink-0" />
                )}

                {/* Title */}
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-700 truncate">{tabName}</p>
                    <p className="text-[10px] text-slate-400 truncate">{previewTitle}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0" onClick={e => e.stopPropagation()}>
                    {index > 0 && (
                        <button type="button" onClick={onMoveUp}
                            className="p-1.5 rounded-lg hover:bg-white text-slate-400 hover:text-green-600 transition-colors" title="نقل لأعلى">
                            <ChevronUp className="w-4 h-4" />
                        </button>
                    )}
                    {index < total - 1 && (
                        <button type="button" onClick={onMoveDown}
                            className="p-1.5 rounded-lg hover:bg-white text-slate-400 hover:text-green-600 transition-colors" title="نقل لأسفل">
                            <ChevronDown className="w-4 h-4" />
                        </button>
                    )}
                    <button type="button" onClick={onRemove}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-slate-300 hover:text-red-500 transition-colors" title="حذف">
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>

                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform flex-shrink-0 ${
                    open ? "rotate-180" : ""
                }`} />
            </div>

            {/* ── Card Body ── */}
            {open && (
                <div className="bg-white">
                    {/* Inner Tab Bar */}
                    <div className="flex border-b border-slate-100 bg-slate-50/50">
                        {SLIDE_TABS.map(t => {
                            const Icon = t.icon;
                            const active = tab === t.id;
                            return (
                                <button key={t.id} type="button" onClick={() => setTab(t.id)}
                                    className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
                                        active
                                            ? "border-green-500 text-green-700 bg-white"
                                            : "border-transparent text-slate-400 hover:text-slate-600"
                                    }`}>
                                    <Icon className="w-3.5 h-3.5" />{t.label}
                                    {active && <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />}
                                </button>
                            );
                        })}
                    </div>

                    <div className="p-4 space-y-4">
                        {/* ── CONTENT TAB ── */}
                        {tab === "content" && (
                            <>
                                {/* Tab Name */}
                                <div>
                                    <p className="text-xs font-bold text-slate-500 mb-2">📌 اسم التبويب (يظهر أسفل الهيرو)</p>
                                    {label("اسم التبويب", "Tab Name")}
                                </div>
                                {/* Badge */}
                                <div>
                                    <p className="text-xs font-bold text-slate-500 mb-2">🏷 الشارة الصغيرة (أعلى اليسار)</p>
                                    {label("الشارة", "Badge")}
                                </div>
                                {/* Title Lines */}
                                <div className="rounded-xl border border-slate-100 p-3 space-y-3 bg-slate-50/50">
                                    <p className="text-xs font-bold text-slate-500">📝 العنوان الرئيسي (H1) — سطرين</p>
                                    <div>
                                        <p className="text-[10px] text-slate-400 mb-1">السطر الأول — باللون العادي</p>
                                        {label("السطر الأول", "Title Line 1")}
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-400 mb-1">السطر الثاني — باللون المميز (أخضر)</p>
                                        {label("السطر الثاني", "Title Line 2")}
                                    </div>
                                </div>
                                {/* Subtitle */}
                                <div>
                                    <p className="text-xs font-bold text-slate-500 mb-2">💬 النص التوضيحي</p>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 mb-1">عربي</p>
                                            <textarea className={`${inputCls} resize-none`} rows={3} dir="rtl"
                                                value={slide.subtitle_ar || slide.subtitle || ""}
                                                onChange={e => onChange("subtitle_ar", e.target.value)} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 mb-1">English</p>
                                            <textarea className={`${inputCls} resize-none text-left`} rows={3} dir="ltr"
                                                value={slide.subtitle_en || ""}
                                                onChange={e => onChange("subtitle_en", e.target.value)} />
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* ── BUTTONS TAB ── */}
                        {tab === "buttons" && (
                            <>
                                <div className="rounded-xl border border-green-100 bg-green-50/30 p-3 space-y-3">
                                    <p className="text-xs font-bold text-green-700">⭐ الزر الأساسي (Primary)</p>
                                    {label("نص الزر الأساسي", "Primary Button")}
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 mb-1">🔗 رابط الزر الأساسي</p>
                                        <input className={`${inputCls} text-left font-mono text-xs`} dir="ltr"
                                            type="url" placeholder="/products"
                                            value={slide.ctaPrimaryLink || ""}
                                            onChange={e => onChange("ctaPrimaryLink", e.target.value)} />
                                    </div>
                                </div>
                                <div className="rounded-xl border border-slate-100 bg-slate-50/30 p-3 space-y-3">
                                    <p className="text-xs font-bold text-slate-600">💠 الزر الثانوي (Secondary)</p>
                                    {label("نص الزر الثانوي", "Secondary Button")}
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 mb-1">🔗 رابط الزر الثانوي</p>
                                        <input className={`${inputCls} text-left font-mono text-xs`} dir="ltr"
                                            type="url" placeholder="/contact"
                                            value={slide.ctaSecondaryLink || ""}
                                            onChange={e => onChange("ctaSecondaryLink", e.target.value)} />
                                    </div>
                                </div>
                            </>
                        )}

                        {/* ── IMAGE TAB ── */}
                        {tab === "image" && (
                            <>
                                {slide.image && (
                                    <div className="relative rounded-xl overflow-hidden border border-slate-200 group">
                                        <img src={slide.image} alt="" className="w-full h-36 object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                            <button type="button"
                                                onClick={() => fileRef.current?.click()}
                                                className="px-3 py-1.5 bg-white text-slate-700 rounded-lg text-xs font-bold shadow">
                                                تغيير الصورة
                                            </button>
                                            <button type="button"
                                                onClick={() => onChange("image", "")}
                                                className="p-1.5 bg-red-500 text-white rounded-lg shadow">
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                                <input ref={fileRef} type="file" accept="image/*" className="hidden"
                                    onChange={async e => { const f = e.target.files?.[0]; if (f) { await handleUpload(f); e.target.value = ""; } }} />
                                {!slide.image && (
                                    <div
                                        onClick={() => fileRef.current?.click()}
                                        className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center cursor-pointer hover:border-green-300 hover:bg-green-50/30 transition-all">
                                        {uploading
                                            ? <Loader2 className="w-8 h-8 text-green-500 animate-spin mx-auto mb-2" />
                                            : <ImageIcon className="w-8 h-8 text-slate-300 mx-auto mb-2" />}
                                        <p className="text-xs font-bold text-slate-400">
                                            {uploading ? "جاري رفع الصورة..." : "اضغط لرفع صورة الخلفية"}
                                        </p>
                                    </div>
                                )}
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 mb-1">أو أدخل رابط الصورة مباشرةً</p>
                                    <input className={`${inputCls} font-mono text-xs text-left`} dir="ltr"
                                        type="url" placeholder="/images/hero-bg.png"
                                        value={slide.image || ""}
                                        onChange={e => onChange("image", e.target.value)} />
                                </div>
                                {uploading && (
                                    <div className="flex items-center gap-2 text-xs text-green-600 font-bold">
                                        <Loader2 className="w-4 h-4 animate-spin" /> جاري رفع الصورة...
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

function HeroSlidesPanel({
    data,
    onChange,
}: {
    data: Record<string, any>;
    onChange: (key: string, value: any) => void;
}) {
    const slides: Record<string, any>[] = data.slides || [];

    const update = (idx: number, key: string, val: string) => {
        const copy = [...slides];
        copy[idx] = { ...copy[idx], [key]: val };
        onChange("slides", copy);
    };

    const addSlide = () => {
        onChange("slides", [...slides, {
            tabName_ar: "", tabName_en: "",
            badge_ar: "", badge_en: "",
            titleLine1_ar: "", titleLine1_en: "",
            titleLine2_ar: "", titleLine2_en: "",
            subtitle_ar: "", subtitle_en: "",
            ctaPrimary_ar: "", ctaPrimary_en: "",
            ctaPrimaryLink: "/products",
            ctaSecondary_ar: "", ctaSecondary_en: "",
            ctaSecondaryLink: "/contact",
            image: "",
        }]);
    };

    const removeSlide = (idx: number) => {
        if (!confirm("تأكيد حذف هذه الشريحة؟")) return;
        onChange("slides", slides.filter((_, i) => i !== idx));
    };

    const moveSlide = (from: number, to: number) => {
        const copy = [...slides];
        const [m] = copy.splice(from, 1);
        copy.splice(to, 0, m);
        onChange("slides", copy);
    };

    return (
        <div className="space-y-3">
            {/* Stats */}
            <div className="flex items-center justify-between px-1">
                <span className="text-xs text-slate-400">
                    <span className="font-bold text-slate-600">{slides.length}</span> شريحة
                </span>
                <span className="text-[10px] text-slate-300">يمكن إضافة حتى 5 شرائح</span>
            </div>

            {/* Slide Cards */}
            {slides.map((slide, idx) => (
                <SlideCard
                    key={idx}
                    slide={slide}
                    index={idx}
                    total={slides.length}
                    onChange={(key, val) => update(idx, key, val)}
                    onRemove={() => removeSlide(idx)}
                    onMoveUp={() => moveSlide(idx, idx - 1)}
                    onMoveDown={() => moveSlide(idx, idx + 1)}
                />
            ))}

            {/* Add Slide Button */}
            {slides.length < 5 && (
                <button
                    type="button"
                    onClick={addSlide}
                    className="w-full flex items-center justify-center gap-2 px-4 py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 text-sm font-bold hover:border-green-400 hover:text-green-600 hover:bg-green-50/40 transition-all group"
                >
                    <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    إضافة شريحة جديدة
                </button>
            )}
        </div>
    );
}


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

// ── New Design Control Fields ──

function SelectField({
    label,
    value,
    onChange,
    options,
    description,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    options: { label: string; value: string }[];
    description?: string;
}) {
    return (
        <div>
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 mb-1.5">
                {label}
            </label>
            {description && <p className="text-[10px] text-slate-400 mb-2">{description}</p>}
            <div className="flex flex-wrap gap-2">
                {options.map((opt) => (
                    <button
                        type="button"
                        key={opt.value}
                        onClick={() => onChange(opt.value)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                            value === opt.value
                                ? "bg-green-600 text-white border-green-600 shadow-md"
                                : "bg-slate-50 text-slate-600 border-slate-200 hover:border-green-400 hover:text-green-700"
                        }`}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>
        </div>
    );
}

function ColorField({
    label,
    value,
    onChange,
    description,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    description?: string;
}) {
    return (
        <div>
            <label className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-1.5">
                {label}
            </label>
            {description && <p className="text-[10px] text-slate-400 mb-2">{description}</p>}
            <div className="flex items-center gap-3">
                <div className="relative">
                    <input
                        type="color"
                        value={value || "#ffffff"}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-12 h-10 rounded-lg cursor-pointer border border-slate-200 bg-slate-50 p-0.5"
                    />
                </div>
                <input
                    type="text"
                    value={value || ""}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="#ffffff"
                    className="w-32 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none"
                    dir="ltr"
                />
                <div
                    className="w-8 h-8 rounded-lg border border-slate-200 shadow-inner"
                    style={{ backgroundColor: value || "#ffffff" }}
                />
            </div>
        </div>
    );
}

function RangeField({
    label,
    value,
    onChange,
    min = 0,
    max = 100,
    step = 1,
    unit = "",
    description,
}: {
    label: string;
    value: number;
    onChange: (v: number) => void;
    min?: number;
    max?: number;
    step?: number;
    unit?: string;
    description?: string;
}) {
    return (
        <div>
            <label className="flex items-center justify-between text-xs font-bold text-slate-500 mb-1.5">
                <span>{label}</span>
                <span className="text-green-600 font-black text-sm">{value}{unit}</span>
            </label>
            {description && <p className="text-[10px] text-slate-400 mb-2">{description}</p>}
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-green-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>{min}{unit}</span>
                <span>{max}{unit}</span>
            </div>
        </div>
    );
}

function ToggleField({
    label,
    value,
    onChange,
    description,
}: {
    label: string;
    value: boolean;
    onChange: (v: boolean) => void;
    description?: string;
}) {
    return (
        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
            <div>
                <p className="text-xs font-bold text-slate-700">{label}</p>
                {description && <p className="text-[10px] text-slate-400 mt-0.5">{description}</p>}
            </div>
            <button
                type="button"
                onClick={() => onChange(!value)}
                className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${
                    value ? "bg-green-500" : "bg-slate-300"
                }`}
            >
                <span
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${
                        value ? "translate-x-5" : "translate-x-0.5"
                    }`}
                />
            </button>
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
                                            type={(lf.type === "text" || lf.type === "textarea" || lf.type === "url") ? lf.type : "text"}
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
                                            type={(lf.type === "text" || lf.type === "textarea") ? lf.type : "text"}
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
                type={(field.type === "text" || field.type === "textarea" || field.type === "url") ? field.type : "text"}
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

    if (field.type === "select" && field.options) {
        return (
            <SelectField
                label={field.labelAr}
                value={data[field.key] || field.options[0]?.value || ""}
                onChange={(v) => onChange(field.key, v)}
                options={field.options}
            />
        );
    }

    if (field.type === "color") {
        return (
            <ColorField
                label={field.labelAr}
                value={data[field.key] || ""}
                onChange={(v) => onChange(field.key, v)}
            />
        );
    }

    if (field.type === "range") {
        return (
            <RangeField
                label={field.labelAr}
                value={Number(data[field.key] ?? field.min ?? 0)}
                onChange={(v) => onChange(field.key, v)}
                min={field.min}
                max={field.max}
                step={field.step}
            />
        );
    }

    if (field.type === "toggle") {
        return (
            <ToggleField
                label={field.labelAr}
                value={Boolean(data[field.key])}
                onChange={(v) => onChange(field.key, v)}
            />
        );
    }

    const simpleType = (field.type === "text" || field.type === "textarea") ? field.type : "text";
    return (
        <SingleField
            label={field.labelAr}
            value={data[field.key] || ""}
            onChange={(v) => onChange(field.key, v)}
            type={simpleType}
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

                        // ── Special: Hero Slides Panel ──
                        if (section.id === "heroSlides") {
                            return (
                                <CollapsibleSection
                                    key={section.id}
                                    title={section.title}
                                    emoji={section.emoji}
                                    description={section.description}
                                    defaultOpen={true}
                                >
                                    <HeroSlidesPanel
                                        data={sectionData}
                                        onChange={(key, value) =>
                                            handleFieldChange(section.id, key, value)
                                        }
                                    />
                                </CollapsibleSection>
                            );
                        }

                        // ── Special: Hero Design Panel ──
                        if (section.id === "heroDesign") {
                            return (
                                <CollapsibleSection
                                    key={section.id}
                                    title={section.title}
                                    emoji={section.emoji}
                                    description={section.description}
                                    defaultOpen={true}
                                >
                                    <HeroDesignPanel
                                        data={sectionData}
                                        onChange={(key, value) =>
                                            handleFieldChange(section.id, key, value)
                                        }
                                    />
                                </CollapsibleSection>
                            );
                        }

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
