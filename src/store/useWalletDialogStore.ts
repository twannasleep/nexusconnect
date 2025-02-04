import { create } from "zustand";
import { EVMChainConfig, SolanaChainConfig } from "../types/chains";

interface WalletDialogState {
  isOpen: boolean;
  pendingChain: EVMChainConfig | SolanaChainConfig | null;
  setIsOpen: (isOpen: boolean) => void;
  setPendingChain: (chain: EVMChainConfig | SolanaChainConfig | null) => void;
}

export const useWalletDialogStore = create<WalletDialogState>((set) => ({
  isOpen: false,
  pendingChain: null,
  setIsOpen: (isOpen) => set({ isOpen }),
  setPendingChain: (pendingChain) => set({ pendingChain }),
}));
