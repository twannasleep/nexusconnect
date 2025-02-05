import { create } from "zustand";
import { type SupportedChain } from "../../types/chains";
import { type Wallet } from "../../types/wallets";

interface WalletState {
  // Connection state
  wallet: Wallet | null;
  chain: SupportedChain | null;
  isConnecting: boolean;
  isConnected: boolean;
  error: Error | null;

  // Dialog state
  isDialogOpen: boolean;
  pendingChain: SupportedChain | null;

  // Actions
  setWallet: (wallet: Wallet | null) => void;
  setChain: (chain: SupportedChain | null) => void;
  setConnectionState: (connecting: boolean, connected: boolean) => void;
  setError: (error: Error | null) => void;
  setPendingChain: (chain: SupportedChain | null) => void;
  toggleDialog: (open?: boolean) => void;
  reset: () => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  // Initial state
  wallet: null,
  chain: null,
  isConnecting: false,
  isConnected: false,
  error: null,
  isDialogOpen: false,
  pendingChain: null,

  // Actions
  setWallet: (wallet) => set({ wallet }),
  setChain: (chain) => set({ chain }),
  setConnectionState: (connecting, connected) =>
    set({ isConnecting: connecting, isConnected: connected }),
  setError: (error) => set({ error }),
  setPendingChain: (chain) => set({ pendingChain: chain }),
  toggleDialog: (open) =>
    set((state) => ({
      isDialogOpen: open ?? !state.isDialogOpen,
    })),
  reset: () =>
    set({
      wallet: null,
      chain: null,
      isConnecting: false,
      isConnected: false,
      error: null,
      pendingChain: null,
    }),
}));
