import { useCallback, useMemo } from "react";
import {
  type SupportedChain,
  isEVMChain,
  isSolanaChain,
} from "../../types/chains";
import { type Wallet } from "../../types/wallets";
import { useWalletStore } from "../store/useWalletStore";
import { useWalletDialogStore } from "../store/useWalletDialogStore";
import { EVMWalletAdapter } from "../adapters/EVMWalletAdapter";
import { SolanaWalletAdapter } from "../adapters/SolanaWalletAdapter";
import { type WalletAdapter } from "../adapters/BaseWalletAdapter";

export interface UseWalletReturn {
  wallet: Wallet | null;
  chain: SupportedChain | null;
  isConnecting: boolean;
  isConnected: boolean;
  error: Error | null;
  connect: (wallet: Wallet) => Promise<void>;
  disconnect: () => Promise<void>;
  openWalletDialog: () => void;
  closeWalletDialog: () => void;
  switchChain: (chain: SupportedChain) => Promise<void>;
}

export function useWallet(): UseWalletReturn {
  const {
    wallet,
    chain,
    isConnecting,
    isConnected,
    error,
    setWallet,
    setChain,
    setIsConnecting,
    setIsConnected,
    setError,
  } = useWalletStore();

  const { openDialog, closeDialog } = useWalletDialogStore();

  // Create wallet adapter based on chain type
  const getWalletAdapter = useCallback(
    (chain: SupportedChain): WalletAdapter => {
      if (isEVMChain(chain)) {
        return new EVMWalletAdapter();
      }
      if (isSolanaChain(chain)) {
        return new SolanaWalletAdapter();
      }
      // Exhaustive type check
      const _exhaustiveCheck: never = chain;
      throw new Error(`Unsupported chain type`);
    },
    [],
  );

  const connect = useCallback(
    async (selectedWallet: Wallet) => {
      if (!chain) {
        throw new Error("No chain selected");
      }

      try {
        setIsConnecting(true);
        setError(null);

        const adapter = getWalletAdapter(chain);
        await adapter.connect(selectedWallet, chain);

        setWallet(selectedWallet);
        setIsConnected(true);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to connect wallet"),
        );
        throw err;
      } finally {
        setIsConnecting(false);
      }
    },
    [
      chain,
      setWallet,
      setIsConnecting,
      setIsConnected,
      setError,
      getWalletAdapter,
    ],
  );

  const disconnect = useCallback(async () => {
    if (!chain || !wallet) return;

    try {
      const adapter = getWalletAdapter(chain);
      await adapter.disconnect();

      setWallet(null);
      setIsConnected(false);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to disconnect wallet"),
      );
      throw err;
    }
  }, [chain, wallet, setWallet, setIsConnected, setError, getWalletAdapter]);

  const switchChain = useCallback(
    async (newChain: SupportedChain) => {
      if (!wallet) {
        setChain(newChain);
        return;
      }

      try {
        const adapter = getWalletAdapter(newChain);
        await adapter.switchChain(newChain);

        setChain(newChain);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to switch chain"),
        );
        throw err;
      }
    },
    [wallet, setChain, setError, getWalletAdapter],
  );

  return useMemo(
    () => ({
      wallet,
      chain,
      isConnecting,
      isConnected,
      error,
      connect,
      disconnect,
      openWalletDialog: openDialog,
      closeWalletDialog: closeDialog,
      switchChain,
    }),
    [
      wallet,
      chain,
      isConnecting,
      isConnected,
      error,
      connect,
      disconnect,
      openDialog,
      closeDialog,
      switchChain,
    ],
  );
}
