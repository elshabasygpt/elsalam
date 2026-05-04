"use client";

import React, { useState, useEffect, useRef } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface DangerActionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    expectedInput: string;
    isPending?: boolean;
}

/**
 * A highly secure Confirmation Modal for Destructive Actions.
 * Enforces "Positive Friction" by requiring the user to type an exact string.
 */
export function DangerActionModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    expectedInput,
    isPending = false
}: DangerActionModalProps) {
    const [inputValue, setInputValue] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    // Reset input state and trap focus when the modal opens
    useEffect(() => {
        if (isOpen) {
            setInputValue("");
            // Tiny delay ensures the modal is fully rendered before focusing
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [isOpen]);

    // Keyboard accessibility: Escape to close
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen && !isPending) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose, isPending]);

    // Don't render anything if it's closed
    if (!isOpen) return null;

    // The validation check
    const isMatch = inputValue === expectedInput;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0">
            {/* Backdrop with blur effect */}
            <div 
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
                onClick={() => !isPending && onClose()}
                aria-hidden="true"
            />

            {/* Modal Panel */}
            <div 
                role="dialog" 
                aria-modal="true"
                aria-labelledby="danger-modal-title"
                className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-rose-100 animate-in zoom-in-95 duration-200"
            >
                {/* ─── Header ─── */}
                <div className="bg-rose-50/80 px-6 py-5 border-b border-rose-100 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0 shadow-sm">
                        <AlertTriangle className="w-5 h-5 text-rose-600" />
                    </div>
                    <div className="flex-1 pt-1">
                        <h3 id="danger-modal-title" className="text-lg font-bold text-slate-900 leading-none mb-2">
                            {title}
                        </h3>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            {description}
                        </p>
                    </div>
                    <button 
                        onClick={onClose}
                        disabled={isPending}
                        aria-label="إغلاق النافذة"
                        className="text-slate-400 hover:text-rose-600 hover:bg-rose-100 p-1.5 rounded-full transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* ─── Body (Friction Area) ─── */}
                <div className="p-6 bg-white">
                    <label className="block text-sm font-semibold text-slate-800 mb-3">
                        يرجى كتابة <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-rose-600 font-bold select-all mx-1">{expectedInput}</span> للتأكيد:
                    </label>
                    <input
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        disabled={isPending}
                        autoComplete="off"
                        className="w-full text-center rounded-xl border-0 py-3.5 px-4 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-300 focus:ring-2 focus:ring-inset focus:ring-rose-600 sm:text-base font-mono disabled:opacity-50 disabled:bg-slate-50 transition-shadow"
                        placeholder={expectedInput}
                        aria-invalid={!isMatch && inputValue.length > 0}
                    />
                </div>

                {/* ─── Footer ─── */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
                    <button 
                        onClick={onClose}
                        disabled={isPending}
                        className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200 bg-white border border-slate-200 rounded-xl transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
                    >
                        إلغاء التراجع
                    </button>
                    <button 
                        onClick={onConfirm}
                        disabled={!isMatch || isPending}
                        className="px-6 py-2.5 text-sm font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl shadow-md shadow-rose-600/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-2"
                    >
                        {isPending ? 'جاري التنفيذ...' : 'تأكيد الإجراء الخطير'}
                    </button>
                </div>
            </div>
        </div>
    );
}
