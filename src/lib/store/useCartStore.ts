import { create } from "zustand";
import { persist } from "zustand/middleware";
import { syncCartWithDb } from "@/actions/cart.actions";

export interface CartItem {
    id: string; // Unique ID (productId + packaging details if any)
    productId: number;
    name_ar: string;
    name_en: string;
    price: number;
    quantity: number;
    image: string;
    slug: string;
    weightVariant?: string; // Optional if there are weights
}

interface CartStore {
    items: CartItem[];
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    toggleCart: () => void;
    addItem: (item: CartItem) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    getTotalItems: () => number;
    getTotalPrice: () => number;
    // Sync & Hydration
    isHydrated: boolean;
    setHydrated: (state: boolean) => void;
    syncWithDb: () => Promise<void>;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,
            isHydrated: false,
            setHydrated: (state) => set({ isHydrated: state }),
            setIsOpen: (isOpen) => set({ isOpen }),
            toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
            
            addItem: (item) => {
                set((state) => {
                    const existingItem = state.items.find((i) => i.id === item.id);
                    if (existingItem) {
                        return {
                            items: state.items.map((i) =>
                                i.id === item.id
                                    ? { ...i, quantity: i.quantity + item.quantity, image: item.image, price: item.price, name_ar: item.name_ar, name_en: item.name_en }
                                    : i
                            ),
                            isOpen: true, // open cart when adding
                        };
                    }
                    return { items: [...state.items, item], isOpen: true };
                });
            },

            removeItem: (id) =>
                set((state) => ({
                    items: state.items.filter((i) => i.id !== id),
                })),

            updateQuantity: (id, quantity) =>
                set((state) => ({
                    items: state.items.map((i) =>
                        i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i
                    ),
                })),

            clearCart: () => set({ items: [] }),

            getTotalItems: () => {
                const { items } = get();
                return items.reduce((total, item) => total + item.quantity, 0);
            },

            getTotalPrice: () => {
                const { items } = get();
                return items.reduce((total, item) => total + item.price * item.quantity, 0);
            },

            syncWithDb: async () => {
                const { items } = get();
                try {
                    const result = await syncCartWithDb(items);
                    if (result.success && result.items) {
                        set({ items: result.items });
                    }
                } catch (error) {
                    console.error("Failed to sync cart with DB:", error);
                }
            },
        }),
        {
            name: "elsalam-cart-storage",
            partialize: (state) => ({ items: state.items }), // Only persist items
            onRehydrateStorage: () => (state) => {
                state?.setHydrated(true);
            },
        }
    )
);
