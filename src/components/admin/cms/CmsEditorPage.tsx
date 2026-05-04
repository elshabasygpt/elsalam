"use client";

import React, { useEffect, useState } from 'react';
import { useCmsStore } from '@/store/useCmsStore';
import { CmsAccordion } from './CmsAccordion';
import { Layout, Star, Boxes, ShieldCheck, Loader2, Save, XCircle } from 'lucide-react';
import { toast } from 'sonner';

// Mock initial data simulating Prisma DB fetch
const MOCK_DB_DATA = {
  hero: { title: "مرحباً بكم في مصنع السلام", subtitle: "أجود أنواع الزيوت" },
  stats: { factories: "3", experience: "20" },
  products: { maxItems: 6 },
  trust: { displayCertificates: "true" }
};

export function CmsEditorPage() {
  const { initialize, isDirty, getDirtyCount, resetAll } = useCmsStore();
  const [activeSection, setActiveSection] = useState('group-header');
  const [isSaving, setIsSaving] = useState(false);

  // Initialize Zustand with data from Server
  useEffect(() => {
    initialize(MOCK_DB_DATA);
  }, [initialize]);

  // ScrollSpy Implementation using IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      // Find the first visible section
      const visible = entries.find(entry => entry.isIntersecting);
      if (visible) {
        setActiveSection(visible.target.id);
      }
    }, { 
      // Trigger area is slightly offset to account for scrolling
      rootMargin: '-20% 0px -60% 0px' 
    });

    document.querySelectorAll('section[data-spy]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    const toastId = toast.loading("جاري حفظ التعديلات في قاعدة البيانات...");
    
    // Simulate Server Action Call
    await new Promise(r => setTimeout(r, 1500));
    
    // Refresh the clean state with the newly saved draft data
    initialize(useCmsStore.getState().draftData);
    
    setIsSaving(false);
    toast.success("تم حفظ جميع التعديلات ونشرها بنجاح! 🎉", { id: toastId });
  };

  const navItems = [
    { id: 'group-header', label: 'الهيدر والسلايدر' },
    { id: 'group-content', label: 'المحتوى المؤسسي' },
    { id: 'group-products', label: 'المنتجات والشهادات' },
  ];

  const hasChanges = isDirty();
  const dirtyCount = getDirtyCount();

  return (
    <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto items-start relative pb-32 pt-8 font-sans" dir="rtl">
      
      {/* ─── 1. Sticky Sidebar Navigation (ScrollSpy) ─── */}
      <aside className="hidden lg:block w-72 shrink-0 sticky top-24 z-10">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <h3 className="font-black text-slate-800 mb-5 flex items-center gap-2">
            <Layout className="w-5 h-5 text-emerald-600" />
            أقسام الصفحة (التنقل السريع)
          </h3>
          <nav className="space-y-1.5">
            {navItems.map((item) => (
              <a 
                key={item.id}
                href={`#${item.id}`} 
                className={`block px-4 py-3 text-sm font-bold rounded-xl transition-all ${
                  activeSection === item.id 
                    ? 'text-emerald-700 bg-emerald-50 ring-1 ring-emerald-600/20 translate-x-1' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </aside>

      {/* ─── 2. Main Content (Grouped Cards) ─── */}
      <main className="flex-1 space-y-10 w-full min-w-0">
        
        {/* Group 1: Header */}
        <section id="group-header" data-spy className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden scroll-mt-28">
          <div className="bg-slate-50/80 border-b border-slate-200 px-6 py-5">
            <h2 className="text-lg font-black text-slate-800">الهيدر والسلايدر</h2>
            <p className="text-sm text-slate-500 mt-1">الواجهة الأمامية الأولى التي يراها العميل</p>
          </div>
          <div className="divide-y divide-slate-100">
            <CmsAccordion id="hero" title="السلايدر الرئيسي (Hero Slides)" description="الصور والنصوص البارزة أعلى الصفحة الرئيسية" icon={<Star />}>
               <DemoInput id="hero" field="title" label="عنوان السلايدر الرئيسي" />
               <div className="mt-4"><DemoInput id="hero" field="subtitle" label="النص الفرعي" /></div>
            </CmsAccordion>
            <CmsAccordion id="stats" title="الإحصائيات والأرقام" description="أرقام إنجازات المصنع (سنوات خبرة، عدد المصانع)" icon={<Layout />}>
               <div className="grid grid-cols-2 gap-4">
                 <DemoInput id="stats" field="factories" label="عدد المصانع" type="number" />
                 <DemoInput id="stats" field="experience" label="سنوات الخبرة" type="number" />
               </div>
            </CmsAccordion>
          </div>
        </section>

        {/* Group 2: Content */}
        <section id="group-content" data-spy className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden scroll-mt-28">
          <div className="bg-slate-50/80 border-b border-slate-200 px-6 py-5">
            <h2 className="text-lg font-black text-slate-800">المنتجات والشهادات</h2>
            <p className="text-sm text-slate-500 mt-1">المحتوى التجاري والمعلومات عن بضائعنا</p>
          </div>
          <div className="divide-y divide-slate-100">
            <CmsAccordion id="products" title="المنتجات المميزة" description="المنتجات الرئيسية المعروضة في الرئيسية" icon={<Boxes />}>
               <DemoInput id="products" field="maxItems" label="أقصى عدد للمنتجات المعروضة" type="number" />
            </CmsAccordion>
            <CmsAccordion id="trust" title="شهادات الجودة والاعتمادات" description="الشهادات الدولية (ISO وغيرها)" icon={<ShieldCheck />}>
               <DemoInput id="trust" field="displayCertificates" label="إظهار الشهادات (true/false)" />
            </CmsAccordion>
          </div>
        </section>
      </main>

      {/* ─── 3. Sticky Action Bar (Unsaved Changes Indicator) ─── */}
      <div 
        className={`fixed bottom-0 right-0 lg:right-72 left-0 bg-white/80 backdrop-blur-xl border-t border-slate-200 p-4 lg:px-8 px-4 flex flex-col sm:flex-row justify-between items-center gap-4 z-50 shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.1)] transition-transform duration-500 ease-out ${
          hasChanges ? 'translate-y-0' : 'translate-y-[150%]'
        }`}
      >
        <div className="text-sm font-bold text-amber-600 flex items-center gap-3 w-full sm:w-auto">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]"></span>
          </span>
          لديك ({dirtyCount}) أقسام غير محفوظة
        </div>
        
        <div className="flex gap-3 w-full sm:w-auto">
          <button 
            onClick={resetAll}
            disabled={isSaving}
            className="flex-1 sm:flex-none px-6 py-2.5 text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <XCircle className="w-4 h-4" />
            إلغاء التعديلات
          </button>
          
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 sm:flex-none px-8 py-2.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-md shadow-emerald-500/20 transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isSaving ? 'جاري الحفظ...' : 'نشر التعديلات'}
          </button>
        </div>
      </div>

    </div>
  );
}

/**
 * ─── Dummy Input Component for Data Binding Demo ───
 */
function DemoInput({ id, field, label, type = "text" }: { id: string, field: string, label: string, type?: string }) {
  const updateSection = useCmsStore(s => s.updateSection);
  const val = useCmsStore(s => s.draftData[id]?.[field] || '');

  return (
    <div className="max-w-md">
      <label className="block text-sm font-bold text-slate-700 mb-2">{label}</label>
      <input 
        type={type}
        value={val}
        onChange={(e) => updateSection(id, { [field]: e.target.value })}
        className="w-full rounded-xl border border-slate-300 py-3 px-4 text-slate-900 shadow-sm focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none transition-all" 
      />
    </div>
  );
}
