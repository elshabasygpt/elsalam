"use client";

import { useCartStore } from "@/lib/store/useCartStore";
import { useLanguage } from "@/lib/i18n-context";
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/utils/classnames";

export function CartDrawer() {
    const { isOpen, setIsOpen, items, updateQuantity, removeItem, getTotalPrice, getTotalItems } = useCartStore();
    const { t, locale, isRTL } = useLanguage();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Prevent body scroll when drawer is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!mounted) return null;

    const CloseIcon = isRTL ? ArrowRight : ArrowLeft;

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Drawer */}
            <div 
                className={cn(
                    "fixed top-0 bottom-0 z-50 w-full max-w-md bg-surface-soft shadow-2xl transition-transform duration-300 ease-in-out flex flex-col font-arabic",
                    isRTL ? "right-0" : "left-0",
                    isOpen ? "translate-x-0" : isRTL ? "translate-x-full" : "-translate-x-full"
                )}
                dir={isRTL ? "rtl" : "ltr"}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-white">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <ShoppingBag className="w-8 h-8 text-green-700" />
                            <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[12px] font-bold text-white shadow-sm">
                                {getTotalItems()}
                            </span>
                        </div>
                        <h2 className="text-2xl font-black text-gray-900">
                            {locale === "ar" ? "سلة المشتريات" : "Shopping Cart"}
                        </h2>
                    </div>
                    <button 
                        onClick={() => setIsOpen(false)}
                        className="p-3 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-7 h-7 text-gray-500" />
                    </button>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-5 scrollbar-thin scrollbar-thumb-gray-200">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-4">
                            <ShoppingBag className="w-16 h-16 opacity-30" />
                            <p className="font-bold text-lg">{locale === "ar" ? "السلة فارغة" : "Your cart is empty"}</p>
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="px-6 py-2 bg-green-50 text-green-700 font-bold rounded-xl mt-2"
                            >
                                {locale === "ar" ? "تصفح المنتجات" : "Browse Products"}
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {items.map((item) => (
                                <div key={item.id} className="flex gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm relative group">
                                    <div className="w-28 h-28 bg-gray-50 rounded-2xl p-2 shrink-0 border border-gray-100 flex items-center justify-center overflow-hidden">
                                        <img src={item.image} alt={locale === "ar" ? item.name_ar : item.name_en} className="w-full h-full object-contain mix-blend-multiply" />
                                    </div>
                                    
                                    <div className="flex flex-col flex-1 py-1">
                                        <div className="flex justify-between items-start gap-2">
                                            <div>
                                                <Link href={`/products/${item.slug}`} className="font-bold text-sm text-gray-900 hover:text-green-700 line-clamp-2">{locale === "ar" ? item.name_ar : item.name_en}</Link>
                                                {item.weightVariant && (
                                                    <span className="text-xs text-gray-500 mt-1 block">{item.weightVariant}</span>
                                                )}
                                            </div>
                                            <button 
                                                onClick={() => removeItem(item.id)}
                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all shrink-0"
                                                title={locale === "ar" ? "حذف" : "Remove"}
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                        
                                        <div className="flex items-center justify-between mt-auto pt-3">
                                            <span className="font-black text-green-700">
                                                {item.price.toLocaleString(locale === "ar" ? "ar-EG" : "en-US")} {locale === "ar" ? "ج.م" : "EGP"}
                                            </span>
                                            
                                            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl p-1.5">
                                                <button 
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="w-10 h-10 shrink-0 flex items-center justify-center bg-white border border-gray-200 rounded-lg text-gray-500 hover:text-green-600 hover:border-green-300 shadow-sm transition-colors"
                                                >
                                                    <Minus className="w-6 h-6 stroke-[2.5]" />
                                                </button>
                                                <span className="w-10 text-center text-base font-black text-gray-700">{item.quantity}</span>
                                                <button 
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="w-10 h-10 shrink-0 flex items-center justify-center bg-white border border-gray-200 rounded-lg text-gray-500 hover:text-green-600 hover:border-green-300 shadow-sm transition-colors"
                                                >
                                                    <Plus className="w-6 h-6 stroke-[2.5]" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer / Summary */}
                {items.length > 0 && (
                    <div className="border-t border-gray-100 bg-white p-5">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-gray-500 font-bold">{locale === "ar" ? "الإجمالي" : "Subtotal"}</span>
                            <span className="text-2xl font-black text-gray-900">
                                {getTotalPrice().toLocaleString(locale === "ar" ? "ar-EG" : "en-US")} <span className="text-sm text-gray-500">{locale === "ar" ? "ج.م" : "EGP"}</span>
                            </span>
                        </div>
                        <p className="text-xs text-gray-400 mb-4">{locale === "ar" ? "مصاريف الشحن يتم حسابها عند إتمام الطلب." : "Shipping calculated at checkout."}</p>
                        
                        <div className="flex gap-3">
                            <Link 
                                href="/cart"
                                onClick={() => setIsOpen(false)}
                                className="flex-1 py-3 text-center border-2 border-green-700 text-green-700 font-bold rounded-xl hover:bg-green-50 transition-colors"
                            >
                                {locale === "ar" ? "عرض السلة" : "View Cart"}
                            </Link>
                            <Link 
                                href="/checkout"
                                onClick={() => setIsOpen(false)}
                                className="flex-1 py-3 text-center bg-green-700 text-white font-bold rounded-xl hover:bg-green-800 shadow-xl shadow-green-700/20 transition-all"
                            >
                                {locale === "ar" ? "إتمام الطلب" : "Checkout"}
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
