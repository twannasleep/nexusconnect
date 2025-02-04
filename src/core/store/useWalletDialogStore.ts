import { create } from "zustand";
import { type SupportedChain } from "../../types/chains";

interface WalletDialogState {
  isOpen: boolean;
  pendingChain: SupportedChain | null;
  openDialog: () => void;
  closeDialog: () => void;
  setPendingChain: (chain: SupportedChain | null) => void;
}

export const useWalletDialogStore = create<WalletDialogState>((set) => ({
  isOpen: false,
  pendingChain: null,
  openDialog: () => set({ isOpen: true }),
  closeDialog: () => set({ isOpen: false }),
  setPendingChain: (pendingChain) => set({ pendingChain }),
}));
