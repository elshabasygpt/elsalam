"use client";

import React, { useState, useMemo } from 'react';
import { useCartStore } from '@/lib/store/useCartStore';
import Image from 'next/image';
import { Search, ShoppingCart, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/lib/i18n-context';

export interface B2BProduct {
    id: number;
    name_ar: string;
    name_en: string;
    slug: string;
    basePrice: number;
    image: string;
    packagings: {
        id: number;
        size_ar: string;
        size_en: string;
        price: number | null;
    }[];
}

interface QuickOrderTableProps {
    products: B2BProduct[];
}

/**
 * Enterprise B2B High-Density Order Table
 * Designed for speed, tight paddings, and bulk selection.
 */
export function QuickOrderTable({ products }: QuickOrderTableProps) {
    const { locale } = useLanguage();
    const isAr = locale === "ar";
    const addItem = useCartStore((state) => state.addItem);
    const toggleCart = useCartStore((state) => state.toggleCart);

    const [searchQuery, setSearchQuery] = useState("");
    
    // State to track what the user is currently editing inline
    // Key is productId, value is { quantity, selectedVariantId }
    const [draftOrders, setDraftOrders] = useState<Record<number, { quantity: number; variantName: string; price: number }>>({});
    const [isSuccess, setIsSuccess] = useState(false);

    // Filter products based on search
    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            const name = isAr ? p.name_ar : p.name_en;
            return name.toLowerCase().includes(searchQuery.toLowerCase());
        });
    }, [products, searchQuery, isAr]);

    const handleQuantityChange = (productId: number, qty: number, defaultVariant: string, defaultPrice: number) => {
        setDraftOrders(prev => {
            const current = prev[productId];
            if (qty <= 0) {
                const next = { ...prev };
                delete next[productId];
                return next;
            }
            return {
                ...prev,
                [productId]: {
                    quantity: qty,
                    variantName: current?.variantName || defaultVariant,
                    price: current?.price || defaultPrice,
                }
            };
        });
    };

    const handleVariantChange = (productId: number, variantName: string, variantPrice: number) => {
        setDraftOrders(prev => {
            const current = prev[productId];
            return {
                ...prev,
                [productId]: {
                    quantity: current?.quantity || 1, // Auto-set qty to 1 if they select a variant but hadn't typed qty
                    variantName: variantName,
                    price: variantPrice,
                }
            };
        });
    };

    const handleAddAllToCart = () => {
        const orderIds = Object.keys(draftOrders);
        if (orderIds.length === 0) return;

        orderIds.forEach(idStr => {
            const id = parseInt(idStr);
            const draft = draftOrders[id];
            const product = products.find(p => p.id === id);
            
            if (product && draft.quantity > 0) {
                addItem({
                    id: `${product.id}-${draft.variantName}`,
                    productId: product.id,
                    name_ar: product.name_ar,
                    name_en: product.name_en,
                    price: draft.price,
                    quantity: draft.quantity,
                    image: product.image,
                    slug: product.slug,
                    weightVariant: draft.variantName
                });
            }
        });

        // Clear drafts and show success feedback
        setDraftOrders({});
        setIsSuccess(true);
        setTimeout(() => {
            setIsSuccess(false);
            // Optional: Open cart drawer to confirm addition
            const store = useCartStore.getState();
            if (!store.isOpen) {
                toggleCart(); 
            }
        }, 1200);
    };

    const totalSelectedItems = Object.keys(draftOrders).length;
    const totalSelectedPrice = Object.entries(draftOrders).reduce((sum, [id, draft]) => {
        return sum + (draft.quantity * draft.price);
    }, 0);

    return (
        <div className="flex flex-col gap-0 bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden font-sans">
            {/* Toolbar Area */}
            <div className="flex justify-between items-center px-3 py-2 border-b border-gray-200 bg-gray-50/80">
                <div className="relative w-72">
                    <Search className={`absolute ${isAr ? 'right-2' : 'left-2'} top-2 h-4 w-4 text-gray-400`} />
                    <input 
                        type="text" 
                        placeholder={isAr ? "بحث سريع بالاسم..." : "Quick Search..."}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={`w-full ${isAr ? 'pr-8 pl-3' : 'pl-8 pr-3'} py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all`}
                    />
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="text-sm text-gray-600 hidden sm:block">
                        <span className="font-semibold text-gray-900">{totalSelectedItems}</span> {isAr ? 'منتجات' : 'items'} 
                        <span className="mx-2 text-gray-300">|</span>
                        <span className="font-semibold text-primary">{totalSelectedPrice.toFixed(2)} EGP</span>
                    </div>
                    <button 
                        onClick={handleAddAllToCart}
                        disabled={totalSelectedItems === 0 || isSuccess}
                        className="flex items-center gap-2 px-4 py-1.5 text-sm font-medium text-white bg-primary hover:bg-primary-dark disabled:bg-gray-300 rounded shadow-sm transition-all active:scale-95"
                    >
                        {isSuccess ? <CheckCircle2 className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
                        {isSuccess ? (isAr ? 'تمت الإضافة' : 'Added!') : (isAr ? 'إضافة للـعربة' : 'Add Selected')}
                    </button>
                </div>
            </div>

            {/* High-Density Data Grid */}
            <div className="overflow-x-auto max-h-[60vh] scrollbar-thin scrollbar-thumb-gray-300">
                <table className="w-full text-sm text-left rtl:text-right text-gray-700 whitespace-nowrap">
                    <thead className="text-xs text-gray-500 uppercase bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
                        <tr>
                            <th className="px-2 py-2 w-10 text-center">#</th>
                            <th className="px-3 py-2 w-12"></th>
                            <th className="px-3 py-2 min-w-[200px]">{isAr ? 'المنتج' : 'Product'}</th>
                            <th className="px-3 py-2 w-40">{isAr ? 'الوزن / التعبئة' : 'Packaging'}</th>
                            <th className="px-3 py-2 w-24 text-center">{isAr ? 'السعر' : 'Unit Price'}</th>
                            <th className="px-3 py-2 w-32 text-center">{isAr ? 'الكمية' : 'Qty'}</th>
                            <th className="px-3 py-2 w-28 text-center">{isAr ? 'الإجمالي' : 'Total'}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredProducts.map((product, index) => {
                            const draft = draftOrders[product.id];
                            
                            // Defaults logic
                            const hasPackagings = product.packagings && product.packagings.length > 0;
                            const defaultVariantName = hasPackagings ? (isAr ? product.packagings[0].size_ar : product.packagings[0].size_en) : (isAr ? 'أساسي' : 'Standard');
                            const defaultPrice = hasPackagings ? (product.packagings[0].price || product.basePrice) : product.basePrice;
                            
                            // Current Row State
                            const selectedVariantName = draft?.variantName || defaultVariantName;
                            const selectedPrice = draft?.price || defaultPrice;
                            const currentQty = draft?.quantity || 0;
                            const lineTotal = selectedPrice * currentQty;
                            const isSelected = currentQty > 0;

                            return (
                                <tr key={product.id} className={`hover:bg-gray-50 transition-colors ${isSelected ? 'bg-primary/5' : ''}`}>
                                    <td className="px-2 py-1.5 text-center text-xs text-gray-400">
                                        {index + 1}
                                    </td>
                                    <td className="px-3 py-1.5">
                                        <div className="w-7 h-7 relative rounded border border-gray-200 overflow-hidden bg-white">
                                            <Image src={product.image} alt={isAr ? product.name_ar : product.name_en} fill className="object-cover" />
                                        </div>
                                    </td>
                                    <td className="px-3 py-1.5 font-medium text-gray-800">
                                        {isAr ? product.name_ar : product.name_en}
                                    </td>
                                    <td className="px-3 py-1.5">
                                        {hasPackagings ? (
                                            <select 
                                                value={selectedVariantName}
                                                onChange={(e) => {
                                                    const pkg = product.packagings.find(p => (isAr ? p.size_ar : p.size_en) === e.target.value);
                                                    handleVariantChange(product.id, e.target.value, pkg?.price || product.basePrice);
                                                }}
                                                className={`w-full border rounded text-xs py-1 px-1 outline-none transition-colors ${isSelected ? 'border-primary/30 bg-white' : 'border-gray-200 bg-gray-50 hover:border-gray-300'}`}
                                            >
                                                {product.packagings.map(pkg => (
                                                    <option key={pkg.id} value={isAr ? pkg.size_ar : pkg.size_en}>
                                                        {isAr ? pkg.size_ar : pkg.size_en}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            <span className="text-gray-400 text-xs px-1">{defaultVariantName}</span>
                                        )}
                                    </td>
                                    <td className="px-3 py-1.5 text-center font-mono text-xs text-gray-600">
                                        {selectedPrice.toFixed(2)}
                                    </td>
                                    <td className="px-3 py-1.5">
                                        <div className="flex items-center justify-center">
                                            <input 
                                                type="number"
                                                min="0"
                                                value={currentQty === 0 ? '' : currentQty}
                                                onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value) || 0, defaultVariantName, defaultPrice)}
                                                placeholder="0"
                                                className={`w-16 text-center border py-0.5 text-sm rounded outline-none transition-all ${isSelected ? 'border-primary bg-white text-primary font-bold shadow-inner' : 'border-gray-200 bg-gray-50 focus:border-gray-400 focus:bg-white'}`}
                                            />
                                        </div>
                                    </td>
                                    <td className={`px-3 py-1.5 text-center font-mono text-xs font-semibold ${isSelected ? 'text-primary' : 'text-gray-400'}`}>
                                        {lineTotal > 0 ? lineTotal.toFixed(2) : '-'}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                
                {filteredProducts.length === 0 && (
                    <div className="text-center py-10 text-gray-500 text-sm bg-gray-50">
                        {isAr ? 'لا توجد منتجات مطابقة للبحث' : 'No products found matching your search.'}
                    </div>
                )}
            </div>
        </div>
    );
}
