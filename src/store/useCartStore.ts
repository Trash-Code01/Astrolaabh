import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Colorway, Product } from '../types';

interface CartState {
  items: CartItem[];
  addItem: (product: Product, selectedColor: Colorway, quantity?: number) => void;
  removeItem: (productId: string, colorwayId: string) => void;
  updateQuantity: (productId: string, colorwayId: string, delta: number) => void;
  clearCart: () => void;
  getTotalCount: () => number;
  getSubtotal: () => number;
}

export const useCartStore = create<CartState>()(persist((set, get) => ({
  items: [],

  addItem: (product, selectedColor, quantity = 1) => {
    set((state) => {
      const existingIndex = state.items.findIndex(
        (item) => item.product.id === product.id && item.selectedColor.id === selectedColor.id
      );

      if (existingIndex > -1) {
        const nextItems = [...state.items];
        const item = nextItems[existingIndex];
        nextItems[existingIndex] = { ...item, quantity: item.quantity + quantity };
        return { items: nextItems };
      }

      return {
        items: [...state.items, { product, selectedColor, quantity }],
      };
    });
  },

  removeItem: (productId, colorwayId) => {
    set((state) => ({
      items: state.items.filter(
        (item) => !(item.product.id === productId && item.selectedColor.id === colorwayId)
      ),
    }));
  },

  updateQuantity: (productId, colorwayId, delta) => {
    set((state) => {
      const nextItems = state.items
        .map((item) => {
          if (item.product.id === productId && item.selectedColor.id === colorwayId) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];

      return { items: nextItems };
    });
  },

  clearCart: () => set({ items: [] }),

  getTotalCount: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  },

  getSubtotal: () => {
    return get().items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  },
}), { name: 'astrolaabh-bag', partialize: ({ items }) => ({ items }) }));
