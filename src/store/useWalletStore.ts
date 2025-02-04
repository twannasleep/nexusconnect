import type { StateCreator } from "zustand";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ChainConfig } from "../types/chains";

interface WalletState {
  address: string | null;
  chainId: number | string | null;
  isConnected: boolean;
  supportedChains: ChainConfig[];

  // Actions
  setAddress: (address: string | null) => void;
  setChainId: (chainId: number | string | null) => void;
  setConnected: (isConnected: boolean) => void;
  addChain: (chain: ChainConfig) => void;
  removeChain: (chainId: number | string) => void;
}

type WalletStore = StateCreator<WalletState, [], [], WalletState>;

export const useWalletStore = create<WalletState>()(
  persist(
    ((set) => ({
      address: null,
      chainId: null,
      isConnected: false,
      supportedChains: [],

      setAddress: (address: string | null) => set({ address }),
      setChainId: (chainId: number | string | null) => set({ chainId }),
      setConnected: (isConnected: boolean) => set({ isConnected }),
      addChain: (chain: ChainConfig) =>
        set((state) => ({
          supportedChains: [...state.supportedChains, chain],
        })),
      removeChain: (chainId: number | string) =>
        set((state) => ({
          supportedChains: state.supportedChains.filter(
            (chain) => chain.id !== chainId
          ),
        })),
    })) as WalletStore,
    {
      name: "wallet-storage",
    }
  )
);
