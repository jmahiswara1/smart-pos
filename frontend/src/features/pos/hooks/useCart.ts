import { create } from 'zustand';
import type { Product, Customer } from '../../../types';

export interface CartItem extends Product {
    quantity: number;
}

interface CartState {
    items: CartItem[];
    customer: Customer | null;
    addItem: (product: Product) => void;
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    setCustomer: (customer: Customer | null) => void;
    clearCart: () => void;
    subtotal: () => number;
    tax: () => number;
    total: () => number;
}

export const useCart = create<CartState>((set, get) => ({
    items: [],
    customer: null,
    addItem: (product) => {
        set((state) => {
            const existingItem = state.items.find((item) => item.id === product.id);
            if (existingItem) {
                return {
                    items: state.items.map((item) =>
                        item.id === product.id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    ),
                };
            }
            return { items: [...state.items, { ...product, quantity: 1 }] };
        });
    },
    removeItem: (productId) => {
        set((state) => ({
            items: state.items.filter((item) => item.id !== productId),
        }));
    },
    updateQuantity: (productId, quantity) => {
        set((state) => ({
            items: state.items.map((item) =>
                item.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item
            ),
        }));
    },
    setCustomer: (customer) => set({ customer }),
    clearCart: () => set({ items: [], customer: null }),
    subtotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
    },
    tax: () => {
        return get().subtotal() * 0.1; // 10% tax example
    },
    total: () => {
        return get().subtotal();
    },
}));
