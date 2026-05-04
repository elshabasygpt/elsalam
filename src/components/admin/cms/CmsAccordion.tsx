"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useCmsStore } from '@/store/useCmsStore';

interface CmsAccordionProps {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

export function CmsAccordion({ id, title, description, icon, children }: CmsAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Real-time Dirty Check from Zustand
  const isDirty = useCmsStore((state) => state.isDirty(id));

  return (
    <div className="group border-b border-slate-100 last:border-0">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between p-5 hover:bg-slate-50 cursor-pointer transition-colors"
      >
        {/* Proximity Law: Icon, Title, and Chevron grouped logically */}
        <div className="flex items-center gap-4">
          <div className="bg-emerald-50 text-emerald-600 p-2.5 rounded-xl shrink-0 shadow-sm border border-emerald-100/50">
            {icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 text-sm">{title}</h3>
              {/* The Yellow Dot indicating unsaved changes */}
              {isDirty && (
                <span 
                  className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)] animate-pulse" 
                  title="توجد تعديلات لم يتم حفظها"
                />
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1">{description}</p>
          </div>
          
          <div className="text-slate-400 group-hover:text-emerald-600 transition-colors mr-2">
            {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </div>
      </div>

      {/* Framer Motion for Smooth Height Animation */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="p-6 bg-slate-50/50 border-t border-slate-100 shadow-inner">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
