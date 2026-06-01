import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface BasketItem {
  id: string
  productId: string
  productName: string
  category: 'windows' | 'doors'
  selectedVariants: Record<string, string>
  variantSummary: string
  indicativePrice: number
  quantity: number
  addedAt: string
}

interface BasketStore {
  items: BasketItem[]
  addItem: (item: Omit<BasketItem, 'id' | 'addedAt'>) => void
  removeItem: (id: string) => void
  clearBasket: () => void
  getTotal: () => number
  getItemCount: () => number
}

export const useBasketStore = create<BasketStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const id = `${item.productId}-${Date.now()}`
        const addedAt = new Date().toISOString()
        set((state) => ({
          items: [...state.items, { ...item, id, addedAt }],
        }))
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }))
      },

      clearBasket: () => {
        set({ items: [] })
      },

      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.indicativePrice * item.quantity,
          0
        )
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0)
      },
    }),
    {
      name: 'wdo-basket',
    }
  )
)
