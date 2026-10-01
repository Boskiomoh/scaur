import { create } from "zustand";

import type { Cart } from "@/types/cart";

interface CartState {
  isOpen: boolean;
  cart: Cart | null;
  lineErrors: Record<string, string>;
  open: () => void;
  close: () => void;
  setCart: (cart: Cart | null) => void;
  setLineError: (lineId: string, error?: string) => void;
}

export const useCartStore = create<CartState>((set) => ({
  isOpen: false,
  cart: null,
  lineErrors: {},
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  setCart: (cart) => set({ cart }),
  setLineError: (lineId, error) =>
    set((state) => {
      const lineErrors = { ...state.lineErrors };
      if (error) lineErrors[lineId] = error;
      else delete lineErrors[lineId];
      return { lineErrors };
    }),
}));
