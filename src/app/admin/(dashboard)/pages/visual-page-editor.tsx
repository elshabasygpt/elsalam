"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Save, Loader2, ArrowRight, ChevronDown, ChevronUp,
    Plus, Trash2, Code2, Eye, CheckCircle2,
    Languages, Upload, ImageIcon, X, FileText,
    Type, Palette, Maximize2, Square, LayoutTemplate,
    Link2, AlignLeft, Image as ImageIcon2, GripVertical,
    Monitor, Smartphone, History, RotateCcw, AlertCircle,
    PanelRight, ChevronRight, Zap, Star
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
    const [lang, setLang] = useState<"ar" | "en">("ar");
    const fileRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);

    const inputCls = "w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all shadow-sm";
    
    const labelField = (ar: string, en: string, fieldAr: string, fieldEn: string) => {
        const isAr = lang === "ar";
        const key = isAr ? fieldAr : fieldEn;
        const displayName = isAr ? ar : en;
        return (
            <div>
                <p className="text-xs font-bold text-slate-500 mb-1.5">{displayName}</p>
                <input className={inputCls} dir={isAr ? "rtl" : "ltr"}
                    value={slide[key] || ""}
                    onChange={e => onChange(key, e.target.value)}
                    placeholder={isAr ? `أدخل ${ar}` : `Enter ${en}`} />
            </div>
        );
    };

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
            open ? "border-green-300 shadow-[0_8px_30px_rgb(0,0,0,0.04)]" : "border-slate-200 hover:border-green-400"
        }`}>
            {/* ── Card Header ── */}
            <div
                className={`flex items-center gap-4 px-5 py-4 cursor-pointer transition-colors ${
                    open ? "bg-green-50/50" : "bg-white hover:bg-slate-50"
                }`}
                onClick={() => setOpen(!open)}
            >
                {/* Number badge & Drag handle */}
                <div className="flex items-center gap-2 flex-shrink-0">
                    <GripVertical className="w-5 h-5 text-slate-300 hover:text-slate-500 cursor-grab" />
                    <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shadow-sm ${
                        open ? "bg-green-600 text-white" : "bg-slate-100 text-slate-500 border border-slate-200"
                    }`}>{index + 1}</span>
                </div>

                {/* Thumbnail */}
                {slide.image && (
                    <img src={slide.image} alt="" className="w-12 h-8 rounded-md object-cover border border-slate-200 shadow-sm flex-shrink-0" />
                )}

                {/* Title */}
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-800 truncate">{tabName}</p>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">{previewTitle}</p>
                </div>

                {/* Actions (Hover) */}
                <div className="flex items-center gap-1.5 flex-shrink-0" onClick={e => e.stopPropagation()}>
                    {index > 0 && (
                        <button type="button" onClick={onMoveUp}
                            className="p-2 rounded-lg hover:bg-white text-slate-400 hover:text-green-600 border border-transparent hover:border-slate-200 transition-all shadow-sm" title="نقل لأعلى">
                            <ChevronUp className="w-4 h-4" />
                        </button>
                    )}
                    {index < total - 1 && (
                        <button type="button" onClick={onMoveDown}
                            className="p-2 rounded-lg hover:bg-white text-slate-400 hover:text-green-600 border border-transparent hover:border-slate-200 transition-all shadow-sm" title="نقل لأسفل">
                            <ChevronDown className="w-4 h-4" />
                        </button>
                    )}
                    <button type="button" onClick={onRemove}
                        className="p-2 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-transparent hover:border-rose-100 transition-all shadow-sm ml-2" title="حذف الشريحة">
                        <Trash2 className="w-4 h-4" />
                    </button>
                    
                    <div className="w-px h-6 bg-slate-200 mx-1"></div>
                    <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform flex-shrink-0 ml-1 ${
                        open ? "rotate-180 text-green-600" : ""
                    }`} />
                </div>
            </div>

            {/* ── Card Body ── */}
            {open && (
                <div className="bg-slate-50/50 p-6 border-t border-slate-100">
                    
                    {/* Language Switcher & Tabs Header */}
                    <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 border-b border-slate-200 pb-4">
                        
                        {/* Segmented Control Tabs */}
                        <div className="flex p-1 bg-slate-200/60 rounded-xl max-w-fit shadow-inner">
                            {SLIDE_TABS.map(t => {
                                const Icon = t.icon;
                                const active = tab === t.id;
                                return (
                                    <button key={t.id} type="button" onClick={() => setTab(t.id)}
                                        className={`flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-lg transition-all duration-200 ${
                                            active
                                                ? "bg-white text-slate-800 shadow-sm"
                                                : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                                        }`}>
                                        <Icon className="w-4 h-4" />{t.label}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Language Switcher */}
                        {(tab === "content" || tab === "buttons") && (
                            <div className="flex p-1 bg-white border border-slate-200 rounded-xl shadow-sm">
                                <button type="button" onClick={() => setLang("ar")}
                                    className={`flex items-center gap-2 px-6 py-2 text-xs font-bold rounded-lg transition-all ${
                                        lang === "ar" ? "bg-green-50 text-green-700" : "text-slate-500 hover:bg-slate-50"
                                    }`}>
                                    <span>🇪🇬</span> العربية
                                </button>
                                <button type="button" onClick={() => setLang("en")}
                                    className={`flex items-center gap-2 px-6 py-2 text-xs font-bold rounded-lg transition-all ${
                                        lang === "en" ? "bg-blue-50 text-blue-700" : "text-slate-500 hover:bg-slate-50"
                                    }`}>
                                    <span>🇬🇧</span> English
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="max-w-4xl mx-auto space-y-6">
                        {/* ── CONTENT TAB ── */}
                        {tab === "content" && (
                            <>
                                {/* Row 1: Tab & Badge */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-5 bg-white rounded-2xl border border-slate-100 shadow-sm">
                                    {labelField("اسم التبويب (يظهر أسفل الهيرو)", "Tab Name (Below Hero)", "tabName_ar", "tabName_en")}
                                    {labelField("الشارة الصغيرة (أعلى اليسار)", "Small Badge (Top Left)", "badge_ar", "badge_en")}
                                </div>

                                {/* Row 2: Title Lines */}
                                <div className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-5">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-1 h-4 bg-green-500 rounded-full"></div>
                                        <p className="text-sm font-black text-slate-800">العنوان الرئيسي (H1)</p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        {labelField("السطر الأول (اللون العادي)", "First Line (Normal Color)", "titleLine1_ar", "titleLine1_en")}
                                        {labelField("السطر الثاني (اللون المميز)", "Second Line (Accent Color)", "titleLine2_ar", "titleLine2_en")}
                                    </div>
                                </div>

                                {/* Row 3: Subtitle */}
                                <div className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm">
                                    <p className="text-xs font-bold text-slate-500 mb-2">{lang === "ar" ? "النص التوضيحي (الوصف الطويل)" : "Subtitle (Long Description)"}</p>
                                    <textarea className={`${inputCls} resize-none min-h-[120px]`} dir={lang === "ar" ? "rtl" : "ltr"}
                                        value={slide[lang === "ar" ? "subtitle_ar" : "subtitle_en"] || ""}
                                        onChange={e => onChange(lang === "ar" ? "subtitle_ar" : "subtitle_en", e.target.value)} 
                                        placeholder={lang === "ar" ? "اكتب تفاصيل الشريحة هنا..." : "Write slide details here..."}
                                    />
                                </div>
                            </>
                        )}

                        {/* ── BUTTONS TAB ── */}
                        {tab === "buttons" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Primary Button */}
                                <div className="p-5 bg-white rounded-2xl border-2 border-green-100 shadow-sm space-y-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="p-1.5 bg-green-100 rounded-lg text-green-600"><Star className="w-4 h-4" /></div>
                                        <p className="text-sm font-black text-slate-800">الزر الأساسي (Primary CTA)</p>
                                    </div>
                                    {labelField("نص الزر", "Button Text", "ctaPrimary_ar", "ctaPrimary_en")}
                                    <div>
                                        <p className="text-xs font-bold text-slate-500 mb-1.5">🔗 رابط الزر (URL)</p>
                                        <input className={`${inputCls} text-left font-mono text-xs`} dir="ltr"
                                            type="text" placeholder="/products"
                                            value={slide.ctaPrimaryLink || ""}
                                            onChange={e => onChange("ctaPrimaryLink", e.target.value)} />
                                    </div>
                                </div>

                                {/* Secondary Button */}
                                <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="p-1.5 bg-slate-100 rounded-lg text-slate-500"><Link2 className="w-4 h-4" /></div>
                                        <p className="text-sm font-black text-slate-800">الزر الثانوي (Secondary CTA)</p>
                                    </div>
                                    {labelField("نص الزر", "Button Text", "ctaSecondary_ar", "ctaSecondary_en")}
                                    <div>
                                        <p className="text-xs font-bold text-slate-500 mb-1.5">🔗 رابط الزر (URL)</p>
                                        <input className={`${inputCls} text-left font-mono text-xs`} dir="ltr"
                                            type="text" placeholder="/contact"
                                            value={slide.ctaSecondaryLink || ""}
                                            onChange={e => onChange("ctaSecondaryLink", e.target.value)} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── IMAGE TAB ── */}
                        {tab === "image" && (
                            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
                                {slide.image && (
                                    <div className="relative rounded-2xl overflow-hidden border-2 border-green-100 group mb-6">
                                        <img src={slide.image} alt="" className="w-full h-64 object-cover" />
                                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-sm">
                                            <button type="button"
                                                onClick={() => fileRef.current?.click()}
                                                className="px-5 py-2.5 bg-white text-slate-800 rounded-xl text-sm font-bold shadow-lg hover:scale-105 transition-transform">
                                                تغيير الصورة
                                            </button>
                                            <button type="button"
                                                onClick={() => onChange("image", "")}
                                                className="p-2.5 bg-rose-500 text-white rounded-xl shadow-lg hover:bg-rose-600 hover:scale-105 transition-transform" title="إزالة الصورة">
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                                <input ref={fileRef} type="file" accept="image/*" className="hidden"
                                    onChange={async e => { const f = e.target.files?.[0]; if (f) { await handleUpload(f); e.target.value = ""; } }} />
                                
                                {!slide.image && (
                                    <div
                                        onClick={() => fileRef.current?.click()}
                                        className="border-2 border-dashed border-slate-300 rounded-2xl p-12 text-center cursor-pointer hover:border-green-400 hover:bg-green-50/50 transition-all mb-6 group">
                                        {uploading
                                            ? <Loader2 className="w-12 h-12 text-green-500 animate-spin mx-auto mb-4" />
                                            : <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-green-100 transition-all"><ImageIcon className="w-8 h-8 text-slate-400 group-hover:text-green-600" /></div>}
                                        <p className="text-sm font-bold text-slate-700 mb-1">
                                            {uploading ? "جاري الرفع..." : "اضغط هنا لرفع صورة الخلفية"}
                                        </p>
                                        <p className="text-xs text-slate-400">يدعم PNG, JPG, WebP بمقاس 1920x1080</p>
                                    </div>
                                )}
                                <div>
                                    <p className="text-xs font-bold text-slate-500 mb-2">أو أدخل رابط الصورة (URL) مباشرةً</p>
                                    <input className={`${inputCls} font-mono text-xs text-left bg-slate-50`} dir="ltr"
                                        type="text" placeholder="https://example.com/image.jpg"
                                        value={slide.image || ""}
                                        onChange={e => onChange("image", e.target.value)} />
                                </div>
                            </div>
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
    const [lang, setLang] = useState<"ar" | "en">("ar");
    const inputCls = "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all text-sm font-medium placeholder:text-slate-300";

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                    {lang === "ar" ? labelAr : labelEn}
                    {required && <span className="text-red-400">*</span>}
                </label>
                <div className="flex bg-slate-100 p-1 rounded-lg">
                    <button type="button" onClick={() => setLang("ar")} className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${lang === "ar" ? "bg-white text-green-700 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>🇪🇬 العربية</button>
                    <button type="button" onClick={() => setLang("en")} className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${lang === "en" ? "bg-white text-blue-700 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>🇬🇧 English</button>
                </div>
            </div>

            {lang === "ar" ? (
                type === "textarea" ? (
                    <textarea value={valueAr} onChange={(e) => onChangeAr(e.target.value)} rows={3} className={`${inputCls} resize-none`} placeholder={placeholder} dir="rtl" />
                ) : (
                    <input type={type === "url" ? "url" : "text"} value={valueAr} onChange={(e) => onChangeAr(e.target.value)} className={inputCls} placeholder={placeholder} dir={type === "url" ? "ltr" : "rtl"} />
                )
            ) : (
                type === "textarea" ? (
                    <textarea value={valueEn} onChange={(e) => onChangeEn(e.target.value)} rows={3} className={`${inputCls} resize-none text-left`} placeholder={placeholderEn || placeholder} dir="ltr" />
                ) : (
                    <input type={type === "url" ? "url" : "text"} value={valueEn} onChange={(e) => onChangeEn(e.target.value)} className={`${inputCls} text-left`} placeholder={placeholderEn || placeholder} dir="ltr" />
                )
            )}
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
                <div>
                    <textarea
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        rows={3}
                        className={`${inputCls} resize-none ${dir === "ltr" ? "text-left" : ""}`}
                        placeholder={placeholder}
                        dir={dir}
                    />
                    <p className="text-[10px] text-slate-300 text-left mt-1">{value.length} حرف · {value.trim() ? value.trim().split(/\s+/).length : 0} كلمة</p>
                </div>
            ) : (
                <input
                    type="text"
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
                <div className="relative mb-4 w-full h-56 rounded-2xl overflow-hidden border-2 border-slate-200 bg-white shadow-sm group">
                    <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/cubes.png')] bg-slate-50 flex items-center justify-center p-4">
                        <img
                            src={value}
                            alt="preview"
                            className="max-w-full max-h-full object-contain drop-shadow-md"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                    </div>
                    <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); onChange(""); }}
                        className="absolute top-3 left-3 p-2 bg-red-500/90 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600 hover:scale-105 active:scale-95"
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
                    type="text"
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
    itemLabel,
    itemImage,
    children,
    addLabel = "إضافة عنصر جديد",
}: {
    items: any[];
    onAdd: () => void;
    onRemove: (index: number) => void;
    onMove: (from: number, to: number) => void;
    itemLabel?: (item: any, index: number) => string;
    itemImage?: (item: any, index: number) => string | undefined;
    children: (item: any, index: number) => React.ReactNode;
    addLabel?: string;
}) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <div className="space-y-3">
            {items.map((item, idx) => {
                const isOpen = openIndex === idx;
                return (
                <div key={idx} className={`relative bg-white rounded-2xl border transition-all duration-300 group ${isOpen ? "border-green-200 shadow-md ring-4 ring-green-50/50" : "border-slate-200 hover:border-slate-300 shadow-sm"}`}>
                    
                    {/* Collapsed Header Bar */}
                    <div 
                        onClick={() => setOpenIndex(isOpen ? null : idx)}
                        className={`flex items-center justify-between p-3 cursor-pointer transition-colors ${isOpen ? "bg-slate-50/50 border-b border-slate-100" : ""}`}
                    >
                        <div className="flex items-center gap-3 min-w-0">
                            <span className="shrink-0 w-6 h-6 rounded-md bg-slate-100 text-slate-500 flex items-center justify-center text-[10px] font-black">
                                {idx + 1}
                            </span>
                            {itemImage?.(item, idx) && (
                                <img src={itemImage(item, idx)!} alt="" className="w-8 h-8 rounded border border-slate-200 object-contain bg-white shrink-0" />
                            )}
                            <span className="text-sm font-bold text-slate-700 truncate">
                                {itemLabel ? itemLabel(item, idx) : `عنصر ${idx + 1}`}
                            </span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                            {/* Controls */}
                            <div className={`flex items-center gap-1 transition-opacity ${isOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
                                {idx > 0 && (
                                    <button type="button" onClick={(e) => { e.stopPropagation(); onMove(idx, idx - 1); }} className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors" title="نقل لأعلى">
                                        <ChevronUp className="w-4 h-4" />
                                    </button>
                                )}
                                {idx < items.length - 1 && (
                                    <button type="button" onClick={(e) => { e.stopPropagation(); onMove(idx, idx + 1); }} className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors" title="نقل لأسفل">
                                        <ChevronDown className="w-4 h-4" />
                                    </button>
                                )}
                                <button type="button" onClick={(e) => { e.stopPropagation(); onRemove(idx); }} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors" title="حذف">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="ml-2 pl-2 border-l border-slate-200">
                                <button type="button" className={`p-1 text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180 text-green-600" : ""}`}>
                                    <ChevronDown className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    {/* Expanded Content */}
                    {isOpen && (
                        <div className="p-5 bg-slate-50/30 rounded-b-2xl">
                            {children(item, idx)}
                        </div>
                    )}
                </div>
            )})}
            <button
                type="button"
                onClick={() => {
                    onAdd();
                    setOpenIndex(items.length); // Open the newly added item
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 text-sm font-bold hover:border-green-300 hover:text-green-600 hover:bg-green-50/50 transition-all"
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
                    itemLabel={(item, idx) => {
                        const titleField = field.listFields?.find(f => f.key === "title" || f.key === "name" || f.key === "label" || f.key.includes("title") || f.key.includes("name"));
                        if (titleField) {
                            return item[titleField.key + "_ar"] || item[titleField.key] || item[titleField.key + "_en"] || `عنصر ${idx + 1}`;
                        }
                        const firstTxt = field.listFields?.find(f => f.type === "text");
                        if (firstTxt) return item[firstTxt.key + "_ar"] || item[firstTxt.key] || `عنصر ${idx + 1}`;
                        return `عنصر ${idx + 1}`;
                    }}
                    itemImage={(item) => {
                        const imgField = field.listFields?.find(f => f.type === "url" || f.key.includes("image") || f.key.includes("icon") || f.key.includes("logo"));
                        if (imgField) return item[imgField.key];
                        return undefined;
                    }}
                    addLabel={`إضافة ${field.labelAr}`}
                >
                    {(item, idx) => (
                        <div className="space-y-4">
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

const MAX_HISTORY = 10;

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
    const [isDirty, setIsDirty] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
    const [localHistory, setLocalHistory] = useState<{ ts: number; label: string; data: string }[]>([]);
    
    // Load local history only on the client side to avoid hydration mismatch
    useEffect(() => {
        try {
            const stored = localStorage.getItem(`page_history_${slug}`);
            if (stored) {
                setLocalHistory(JSON.parse(stored));
            }
        } catch {}
    }, [slug]);

    const [showHistory, setShowHistory] = useState(false);
    const [activeSection, setActiveSection] = useState<string | null>(null);
    const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
    const autosaveRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const parseInitialData = useCallback(() => {
        try { return JSON.parse(initialContent); } catch { return {}; }
    }, [initialContent]);

    const [formData, setFormData] = useState<Record<string, any>>(parseInitialData);

    // ── beforeunload warning ──
    useEffect(() => {
        const handler = (e: BeforeUnloadEvent) => {
            if (isDirty) { e.preventDefault(); e.returnValue = ""; }
        };
        window.addEventListener("beforeunload", handler);
        return () => window.removeEventListener("beforeunload", handler);
    }, [isDirty]);

    // ── Ctrl+S shortcut ──
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "s") {
                e.preventDefault();
                if (!loading) doSave();
            }
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [loading, formData, advancedMode, rawJson]);

    // ── Autosave draft to localStorage every 60s ──
    useEffect(() => {
        if (!isDirty) return;
        if (autosaveRef.current) clearTimeout(autosaveRef.current);
        autosaveRef.current = setTimeout(() => {
            try {
                const draft = advancedMode ? rawJson : JSON.stringify(formData, null, 2);
                localStorage.setItem(`page_draft_${slug}`, draft);
            } catch {}
        }, 60_000);
        return () => { if (autosaveRef.current) clearTimeout(autosaveRef.current); };
    }, [isDirty, formData, rawJson, advancedMode, slug]);

    const handleFieldChange = (sectionId: string, key: string, value: any) => {
        setFormData((prev) => ({ ...prev, [sectionId]: { ...(prev[sectionId] || {}), [key]: value } }));
        setIsDirty(true);
    };

    const getFormDataAsJson = () => JSON.stringify(formData, null, 2);

    const pushHistory = (label: string, data: string) => {
        setLocalHistory(prev => {
            const next = [{ ts: Date.now(), label, data }, ...prev].slice(0, MAX_HISTORY);
            try { localStorage.setItem(`page_history_${slug}`, JSON.stringify(next)); } catch {}
            return next;
        });
    };

    const doSave = async () => {
        setLoading(true); setError(""); setSuccess(false);
        try {
            const contentToSave = advancedMode ? rawJson : getFormDataAsJson();
            try { JSON.parse(contentToSave); } catch {
                setError("صيغة JSON غير صحيحة"); setLoading(false); return;
            }
            const res = await fetch(`/api/admin/pages/${slug}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: contentToSave }),
            });
            if (res.ok) {
                const label = new Date().toLocaleString("ar-EG");
                pushHistory(label, contentToSave);
                // Also persist to server-side history
                fetch("/api/admin/pages/history", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ slug, content: contentToSave, label }),
                }).catch(() => {});
                setSuccess(true); setIsDirty(false);
                router.refresh();
                setTimeout(() => setSuccess(false), 4000);
            } else {
                const d = await res.json();
                setError(d.error || "حدث خطأ أثناء الحفظ");
            }
        } catch { setError("حدث خطأ في الاتصال"); }
        finally { setLoading(false); }
    };

    const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); await doSave(); };

    const restoreHistory = (data: string) => {
        try {
            setFormData(JSON.parse(data)); setRawJson(data);
            setIsDirty(true); setShowHistory(false);
        } catch { setError("فشل استعادة النسخة"); }
    };

    const switchToAdvanced = () => { setRawJson(getFormDataAsJson()); setAdvancedMode(true); };
    const switchToVisual = () => {
        try { setFormData(JSON.parse(rawJson)); setAdvancedMode(false); }
        catch { setError("لا يمكن التبديل — JSON غير صالح."); }
    };

    const scrollToSection = (id: string) => {
        const el = sectionRefs.current[id];
        if (el) {
            const y = el.getBoundingClientRect().top + window.scrollY - 100; // Offset for top bar
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    // ScrollSpy Effect
    useEffect(() => {
        if (advancedMode) return;
        const observer = new IntersectionObserver((entries) => {
            const visible = entries.find(entry => entry.isIntersecting);
            if (visible) {
                setActiveSection(visible.target.id);
            }
        }, { rootMargin: "-30% 0px -60% 0px" });

        const refs = Object.values(sectionRefs.current);
        refs.forEach(ref => { if (ref) observer.observe(ref); });

        return () => observer.disconnect();
    }, [sections, advancedMode]);

    const pageHref = slug === "home" ? "/" : `/${slug}`;

    return (
        <form onSubmit={handleSubmit} className="relative pb-32">
            
            {/* ── Top Control Bar ── */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white/90 backdrop-blur-md px-6 py-4 sticky top-0 z-40 border-b border-gray-200 shadow-sm mb-8">
                <div className="flex items-center gap-2">
                    <Link href="/admin/pages" className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 text-sm font-bold transition-colors">
                        <ArrowRight className="w-4 h-4" /> الصفحات
                    </Link>
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                    <span className="text-sm font-black text-slate-800">{pageNameAr}</span>
                </div>

                <div className="flex items-center gap-3">
                    {/* History */}
                    <div className="relative">
                        <button type="button" onClick={() => setShowHistory(v => !v)}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200 text-xs font-bold transition-all shadow-sm">
                            <History className="w-4 h-4" />
                            السجل ({localHistory.length})
                        </button>
                        {showHistory && localHistory.length > 0 && (
                            <div className="absolute left-0 top-full mt-2 w-72 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden">
                                <p className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase border-b border-gray-100 bg-slate-50/50">آخر {localHistory.length} نسخ محفوظة</p>
                                <div className="max-h-64 overflow-y-auto">
                                    {localHistory.map((h, i) => (
                                        <button key={i} type="button" onClick={() => restoreHistory(h.data)}
                                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-green-50 text-right transition-colors border-b border-slate-50 last:border-0 group">
                                            <div className="p-1.5 bg-slate-100 text-slate-400 rounded-lg group-hover:bg-green-100 group-hover:text-green-600 transition-colors">
                                                <RotateCcw className="w-3.5 h-3.5" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-bold text-slate-700 truncate">{h.label}</p>
                                                <p className="text-[10px] text-slate-400 truncate mt-0.5">اضغط للاستعادة</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Preview toggle */}
                    <button type="button" onClick={() => setShowPreview(v => !v)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm border ${showPreview ? "bg-green-600 text-white border-green-600 shadow-green-600/20" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"}`}>
                        <PanelRight className="w-4 h-4" />
                        {showPreview ? "إخفاء المعاينة" : "معاينة الصفحة"}
                    </button>

                    {/* Advanced mode */}
                    <button type="button" onClick={advancedMode ? switchToVisual : switchToAdvanced}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm border ${advancedMode ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"}`}>
                        {advancedMode ? <><Eye className="w-4 h-4" /> الوضع المرئي</> : <><Code2 className="w-4 h-4" /> وضع المطور (JSON)</>}
                    </button>
                </div>
            </div>

            {/* ── Main Layout Wrapper ── */}
            <div className="flex gap-8 max-w-[1800px] mx-auto px-6">
                
                {/* ── 1. Sticky Navigation Sidebar (Only show if not advanced/preview mode) ── */}
                {!advancedMode && !showPreview && (
                    <aside className="hidden lg:block w-72 shrink-0 relative">
                        <div className="sticky top-28 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="bg-slate-50/80 border-b border-slate-100 px-5 py-4 flex items-center gap-2">
                                <LayoutTemplate className="w-4 h-4 text-slate-400" />
                                <div>
                                    <h3 className="font-black text-slate-800 text-sm">أقسام الصفحة</h3>
                                    <p className="text-[10px] text-slate-500 mt-0.5">انقر للوصول السريع ({sections.length} أقسام)</p>
                                </div>
                            </div>
                            <nav className="p-3 max-h-[calc(100vh-220px)] overflow-y-auto space-y-1 custom-scrollbar">
                                {sections.map(s => (
                                    <button key={s.id} type="button" onClick={() => scrollToSection(s.id)}
                                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-right group ${
                                            activeSection === s.id 
                                                ? "bg-green-50 text-green-700 shadow-sm border border-green-200/50" 
                                                : "text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-100"
                                        }`}>
                                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-base shadow-sm transition-colors ${
                                            activeSection === s.id ? "bg-white" : "bg-slate-100 group-hover:bg-white"
                                        }`}>{s.emoji}</span>
                                        <span className="truncate flex-1">{s.title.split("(")[0].trim()}</span>
                                        {activeSection === s.id && <ChevronRight className="w-4 h-4 text-green-500 rotate-180" />}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </aside>
                )}

                {/* ── 2. Editor Pane ── */}
                <main className={`flex-1 min-w-0 transition-all duration-300 ${showPreview ? "w-1/2" : "w-full"}`}>
                    
                    {/* Toast messages */}
                    {error && (
                        <div className="flex items-center gap-3 p-4 bg-rose-50 text-rose-700 rounded-2xl font-bold text-sm border border-rose-100 shadow-sm mb-6">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" /> {error}
                            <button type="button" onClick={() => setError("")} className="mr-auto p-1 hover:bg-rose-100 rounded-lg transition-colors"><X className="w-4 h-4" /></button>
                        </div>
                    )}
                    {success && (
                        <div className="flex items-center gap-3 p-4 bg-green-50 text-green-800 rounded-2xl font-bold text-sm border border-green-200 shadow-sm mb-6">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600"><CheckCircle2 className="w-5 h-5" /></div>
                            تم حفظ التعديلات ونشرها بنجاح! 🎉
                        </div>
                    )}

                    {/* Content area */}
                    {advancedMode ? (
                        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                            <div className="px-6 py-4 border-b border-gray-100 bg-amber-50/30 flex items-center gap-3">
                                <div className="p-2 bg-amber-100 text-amber-600 rounded-lg"><Code2 className="w-5 h-5" /></div>
                                <div>
                                    <span className="block text-sm font-black text-amber-900">الوضع المتقدم (Advanced JSON)</span>
                                    <span className="block text-[11px] text-amber-700 mt-0.5">تعديل بنية البيانات مباشرة. كن حذراً، الأخطاء قد تكسر الصفحة.</span>
                                </div>
                            </div>
                            <div className="p-4 bg-slate-950">
                                <textarea value={rawJson} onChange={(e) => { setRawJson(e.target.value); setIsDirty(true); }}
                                    rows={32} dir="ltr"
                                    className="w-full p-6 bg-slate-900 text-emerald-400 border border-slate-800 rounded-xl focus:ring-2 focus:ring-emerald-500/30 outline-none font-mono text-sm resize-y leading-relaxed shadow-inner custom-scrollbar" />
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {sections.map((section, sIdx) => {
                                const sectionData = formData[section.id] || {};
                                return (
                                    <div key={section.id} id={section.id} ref={el => { sectionRefs.current[section.id] = el; }} className="scroll-mt-32">
                                        {section.id === "heroSlides" ? (
                                            <CollapsibleSection title={section.title} emoji={section.emoji} description={section.description} defaultOpen={true}>
                                                <HeroSlidesPanel data={sectionData} onChange={(key, value) => handleFieldChange(section.id, key, value)} />
                                            </CollapsibleSection>
                                        ) : section.id === "heroDesign" ? (
                                            <CollapsibleSection title={section.title} emoji={section.emoji} description={section.description} defaultOpen={true}>
                                                <HeroDesignPanel data={sectionData} onChange={(key, value) => handleFieldChange(section.id, key, value)} />
                                            </CollapsibleSection>
                                        ) : (
                                            <CollapsibleSection title={section.title} emoji={section.emoji} description={section.description} defaultOpen={sIdx < 2}>
                                                {section.fields.map((field) => (
                                                    <FieldRenderer key={field.key} field={field} data={sectionData}
                                                        onChange={(key, value) => handleFieldChange(section.id, key, value)} />
                                                ))}
                                            </CollapsibleSection>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </main>

                {/* ── 3. Live Preview Pane ── */}
                {showPreview && (
                    <aside className="w-[45%] flex flex-col gap-4 sticky top-28 h-[calc(100vh-140px)]">
                        <div className="flex items-center justify-between bg-white px-5 py-3 rounded-2xl border border-gray-200 shadow-sm">
                            <div className="flex items-center gap-2">
                                <span className="relative flex h-3 w-3">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                </span>
                                <span className="text-sm font-bold text-slate-800">معاينة مباشرة</span>
                            </div>
                            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
                                <button type="button" onClick={() => setPreviewDevice("desktop")}
                                    className={`p-2 rounded-lg transition-all ${previewDevice === "desktop" ? "bg-white text-green-700 shadow-sm" : "text-slate-400 hover:text-slate-700"}`}>
                                    <Monitor className="w-4 h-4" />
                                </button>
                                <button type="button" onClick={() => setPreviewDevice("mobile")}
                                    className={`p-2 rounded-lg transition-all ${previewDevice === "mobile" ? "bg-white text-green-700 shadow-sm" : "text-slate-400 hover:text-slate-700"}`}>
                                    <Smartphone className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <div className={`flex-1 bg-slate-100 rounded-3xl overflow-hidden border-4 border-slate-200/50 shadow-inner flex items-center justify-center transition-all duration-500 ${previewDevice === "mobile" ? "py-8" : ""}`}>
                            <div className={`relative transition-all duration-500 h-full ${previewDevice === "mobile" ? "w-[375px] h-[812px] bg-white rounded-[2rem] shadow-2xl border-[8px] border-slate-800 overflow-hidden" : "w-full"}`}>
                                <iframe
                                    src={pageHref}
                                    title="معاينة"
                                    className="w-full h-full border-0 bg-white"
                                />
                            </div>
                        </div>
                    </aside>
                )}
            </div>

            {/* ── Sticky Save Bar ── */}
            <div className={`fixed bottom-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${isDirty || loading ? "translate-y-0 opacity-100" : "translate-y-[150%] opacity-0 pointer-events-none"}`}>
                <div className="bg-white/80 backdrop-blur-xl border-t border-slate-200 shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.1)] px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]"></span>
                        </span>
                        <span className="text-sm font-bold text-amber-700">
                            {loading ? "جاري الحفظ والمزامنة..." : "لديك تعديلات غير محفوظة، لا تنسَ النشر!"}
                        </span>
                    </div>
                    <div className="flex gap-3 w-full sm:w-auto">
                        <button type="button" onClick={() => { setFormData(parseInitialData()); setIsDirty(false); }} disabled={loading}
                            className="flex-1 sm:flex-none px-6 py-2.5 text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                            <RotateCcw className="w-4 h-4" /> تجاهل
                        </button>
                        <button type="submit" disabled={loading}
                            className="flex-1 sm:flex-none px-8 py-2.5 text-sm font-bold text-white bg-green-600 hover:bg-green-500 rounded-xl shadow-md shadow-green-500/20 transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2">
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                            {loading ? 'جاري النشر...' : 'نشر التعديلات'}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
}
