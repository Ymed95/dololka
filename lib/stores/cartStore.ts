import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
    id: string
    productId: string
    productName: string
    productPrice: number
    productImage: string
    quantity: number
    customization?: {
        designFileUrl?: string
        designFileName?: string
        position?: string
        designX?: number
        designY?: number
        designWidth?: number
        designHeight?: number
        designRotation?: number
        customNotes?: string
    }
}

interface CartStore {
    items: CartItem[]
    addItem: (item: CartItem) => void
    removeItem: (id: string) => void
    updateQuantity: (id: string, quantity: number) => void
    clearCart: () => void
    getTotalPrice: () => number
    getItemCount: () => number
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],

            addItem: (item) => {
                set((state) => {
                    // Check if item with same customization already exists
                    const existingItemIndex = state.items.findIndex(
                        (i) => i.productId === item.productId &&
                            JSON.stringify(i.customization) === JSON.stringify(item.customization)
                    )

                    if (existingItemIndex > -1) {
                        // Update quantity if same item exists
                        const newItems = [...state.items]
                        newItems[existingItemIndex].quantity += item.quantity
                        return { items: newItems }
                    } else {
                        // Add new item
                        return { items: [...state.items, { ...item, id: `${Date.now()}-${Math.random()}` }] }
                    }
                })
            },

            removeItem: (id) => {
                set((state) => ({
                    items: state.items.filter((item) => item.id !== id),
                }))
            },

            updateQuantity: (id, quantity) => {
                set((state) => ({
                    items: state.items.map((item) =>
                        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
                    ),
                }))
            },

            clearCart: () => {
                set({ items: [] })
            },

            getTotalPrice: () => {
                const items = get().items
                return items.reduce((total, item) => total + item.productPrice * item.quantity, 0)
            },

            getItemCount: () => {
                const items = get().items
                return items.reduce((count, item) => count + item.quantity, 0)
            },
        }),
        {
            name: 'cart-storage',
        }
    )
)
