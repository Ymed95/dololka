import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
    id: string
    email: string
    name: string | null
    role: 'client' | 'admin'
}

interface UserStore {
    currentUser: User | null
    setUser: (user: User | null) => void
    logout: () => void
    isAdmin: () => boolean
}

export const useUserStore = create<UserStore>()(
    persist(
        (set, get) => ({
            currentUser: null,

            setUser: (user) => {
                set({ currentUser: user })
            },

            logout: () => {
                set({ currentUser: null })
            },

            isAdmin: () => {
                const user = get().currentUser
                return user?.role === 'admin'
            },
        }),
        {
            name: 'user-storage',
        }
    )
)

// Helper function to get admin ID (for demo purposes)
export const getAdminId = () => {
    // This would normally come from the database or auth system
    // For now, we'll use a hardcoded ID from our seed data
    return 'admin-id-placeholder'
}
