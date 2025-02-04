import { create } from "zustand";
import { type SupportedChain } from "../../types/chains";
import { type Wallet } from "../../types/wallets";

interface WalletState {
  wallet: Wallet | null;
  chain: SupportedChain | null;
  isConnecting: boolean;
  isConnected: boolean;
  error: Error | null;

  // Actions
  setWallet: (wallet: Wallet | null) => void;
  setChain: (chain: SupportedChain | null) => void;
  setIsConnecting: (isConnecting: boolean) => void;
  setIsConnected: (isConnected: boolean) => void;
  setError: (error: Error | null) => void;
  reset: () => void;
}

const initialState = {
  wallet: null,
  chain: null,
  isConnecting: false,
  isConnected: false,
  error: null,
};

export const useWalletStore = create<WalletState>((set) => ({
  ...initialState,

  // Actions
  setWallet: (wallet) => set({ wallet }),
  setChain: (chain) => set({ chain }),
  setIsConnecting: (isConnecting) => set({ isConnecting }),
  setIsConnected: (isConnected) => set({ isConnected }),
  setError: (error) => set({ error }),
  reset: () => set(initialState),
}));
