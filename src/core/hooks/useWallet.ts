import { useCallback, useMemo } from "react";
import { type SupportedChain } from "../../types/chains";
import { type Wallet } from "../../types/wallets";
import { useWalletStore } from "../store/useWalletStore";
import { useWalletContext } from "../providers/WalletProvider";

export interface UseWalletReturn {
  wallet: Wallet | null;
  chain: SupportedChain | null;
  isConnecting: boolean;
  isConnected: boolean;
  error: Error | null;
  connect: (wallet: Wallet) => Promise<void>;
  disconnect: () => Promise<void>;
  switchChain: (chain: SupportedChain) => Promise<void>;
}

export function useWallet(): UseWalletReturn {
  const store = useWalletStore();
  const sdk = useWalletContext();

  const connect = useCallback(
    async (wallet: Wallet) => {
      if (!store.chain) throw new Error("No chain selected");

      try {
        store.setConnectionState(true, false);
        store.setError(null);

        const adapter = sdk.getAdapter(store.chain.type);
        await adapter.connect(wallet, store.chain);

        store.setWallet(wallet);
        store.setConnectionState(false, true);
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("Connection failed");
        store.setError(error);
        throw error;
      }
    },
    [store.chain],
  );

  const disconnect = useCallback(async () => {
    if (!store.chain || !store.wallet) return;

    try {
      const adapter = sdk.getAdapter(store.chain.type);
      await adapter.disconnect();

      store.setWallet(null);
      store.setConnectionState(false, false);
      store.setError(null);
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Failed to disconnect wallet");
      store.setError(error);
      throw error;
    }
  }, [store.chain, store.wallet]);

  const switchChain = useCallback(
    async (newChain: SupportedChain) => {
      if (!store.wallet) {
        store.setChain(newChain);
        return;
      }

      try {
        const adapter = sdk.getAdapter(newChain.type);
        await adapter.switchChain(newChain);

        store.setChain(newChain);
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("Failed to switch chain");
        store.setError(error);
        throw error;
      }
    },
    [store.wallet],
  );

  return useMemo(
    () => ({
      ...store,
      connect,
      disconnect,
      switchChain,
    }),
    [store, connect, disconnect, switchChain],
  );
}
