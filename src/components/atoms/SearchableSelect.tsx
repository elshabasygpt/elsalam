"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Search } from "lucide-react";
import { useLanguage } from "@/lib/i18n-context";

interface Option {
    label: string;
    value: string;
}

interface SearchableSelectProps {
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    searchPlaceholder?: string;
    disabled?: boolean;
    required?: boolean;
}

export function SearchableSelect({
    options,
    value,
    onChange,
    placeholder,
    searchPlaceholder,
    disabled = false,
    required = false,
}: SearchableSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { isRTL, locale } = useLanguage();

    const selectedOption = options.find((opt) => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const filteredOptions = options.filter((opt) =>
        opt.label.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                disabled={disabled}
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full px-5 py-4 bg-slate-50/50 border border-slate-200 hover:border-green-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-600/10 focus:border-green-600 focus:bg-white transition-all font-medium text-slate-800 flex items-center justify-between ${
                    disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                }`}
            >
                <span className={selectedOption ? "text-slate-800" : "text-slate-400"}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform ${
                        isOpen ? "rotate-180" : ""
                    }`}
                />
            </button>

            <AnimatePresence>
                {isOpen && !disabled && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden"
                    >
                        <div className="p-2 border-b border-slate-100 relative">
                            <Search className={`absolute ${isRTL ? "right-4" : "left-4"} top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400`} />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={searchPlaceholder || (locale === "ar" ? "ابحث هنا..." : "Search here...")}
                                className={`w-full py-2 ${isRTL ? "pr-9 pl-3" : "pl-9 pr-3"} bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 text-sm`}
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                        <ul className="max-h-60 overflow-y-auto p-1 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                            {filteredOptions.length > 0 ? (
                                filteredOptions.map((opt) => (
                                    <li key={opt.value}>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                onChange(opt.value);
                                                setIsOpen(false);
                                                setSearchQuery("");
                                            }}
                                            className={`w-full text-start px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                                value === opt.value
                                                    ? "bg-green-50 text-green-700"
                                                    : "text-slate-700 hover:bg-slate-50"
                                            }`}
                                        >
                                            {opt.label}
                                        </button>
                                    </li>
                                ))
                            ) : (
                                <li className="px-4 py-3 text-sm text-slate-500 text-center">
                                    {locale === "ar" ? "لا توجد نتائج" : "No results found"}
                                </li>
                            )}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
            
            {/* Hidden select for HTML5 validation */}
            {required && (
                <select 
                    value={value} 
                    onChange={() => {}} 
                    required 
                    className="opacity-0 w-0 h-0 absolute z-[-1] pointer-events-none"
                    tabIndex={-1}
                >
                    <option value="" disabled></option>
                    {options.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
            )}
        </div>
    );
}
