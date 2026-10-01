import { create } from "zustand";

interface CartState {
  isOpen: boolean;
  totalQuantity: number;
  open: () => void;
  close: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  isOpen: false,
  totalQuantity: 0,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
