import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem } from '@/lib/types/customization'

export type { CartItem } from '@/lib/types/customization'

interface CartState {
    items: CartItem[]
    addItem: (item: Omit<CartItem, 'id'>) => void
    removeItem: (id: string) => void
    updateQuantity: (id: string, quantity: number) => void
    clearCart: () => void
    getTotalPrice: () => number
    getItemCount: () => number
}

function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],

            addItem: (item) => {
                const newItem: CartItem = {
                    ...item,
                    id: generateId(),
                    quantity: Math.max(1, item.quantity),
                    unitPrice: item.unitPrice,
                    totalPrice: item.unitPrice * Math.max(1, item.quantity),
                }
                set((state) => ({ items: [...state.items, newItem] }))
            },

            removeItem: (id) => {
                set((state) => ({ items: state.items.filter((i) => i.id !== id) }))
            },

            updateQuantity: (id, quantity) => {
                const qty = Math.max(1, Math.min(99, quantity))
                set((state) => ({
                    items: state.items.map((i) =>
                        i.id === id
                            ? { ...i, quantity: qty, totalPrice: i.unitPrice * qty }
                            : i
                    ),
                }))
            },

            clearCart: () => set({ items: [] }),

            getTotalPrice: () =>
                get().items.reduce((sum, i) => sum + i.totalPrice, 0),

            getItemCount: () =>
                get().items.reduce((sum, i) => sum + i.quantity, 0),
        }),
        {
            name: 'cart-storage',
            version: 2,
        }
    )
)
