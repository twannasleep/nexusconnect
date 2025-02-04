import { useWallet } from "@solana/wallet-adapter-react";
import type { WalletError } from "@solana/wallet-adapter-base";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
} from "react";
import { useAccount, useChainId, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";
import { useWalletStore } from "../store/useWalletStore";
import { SupportedChainType } from "../types/chains";
import { defaultSolanaChains } from "../config/chains";

interface WalletContextType {
  connect: (chainType: SupportedChainType) => Promise<void>;
  disconnect: () => Promise<void>;
  switchChain: (chainId: number | string) => Promise<void>;
}

const WalletContext = createContext<WalletContextType | null>(null);

export const WalletProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { connect: connectEVM, connectors } = useConnect();
  const { disconnect: disconnectEVM } = useDisconnect();
  const { address: evmAddress, isConnected: isEVMConnected } = useAccount();
  const chainId = useChainId();

  const wallet = useWallet();
  const { connected: isSolanaConnected, publicKey } = wallet;

  const connectSolana = wallet.connect.bind(wallet);
  const disconnectSolana = wallet.disconnect.bind(wallet);

  const { setVisible } = useWalletModal();

  const { setAddress, setChainId, setConnected } = useWalletStore();

  useEffect(() => {
    if (isEVMConnected) {
      setAddress(evmAddress ?? null);
      setChainId(chainId ?? null);
      setConnected(true);
    } else if (isSolanaConnected && publicKey) {
      setAddress(publicKey.toString());
      setChainId(defaultSolanaChains[0].id);
      setConnected(true);
    } else {
      setAddress(null);
      setChainId(null);
      setConnected(false);
    }
  }, [
    isEVMConnected,
    isSolanaConnected,
    evmAddress,
    publicKey,
    chainId,
    setAddress,
    setChainId,
    setConnected,
  ]);

  const connect = useCallback(
    async (chainType: SupportedChainType) => {
      try {
        if (chainType === "evm") {
          const connector =
            connectors.find((c) => c.id === "injected") || injected();
          connectEVM({ connector });
        } else {
          try {
            await connectSolana();
          } catch (error) {
            if ((error as WalletError).name === "WalletNotSelectedError") {
              setVisible(true);
            } else {
              throw error;
            }
          }
        }
      } catch (error) {
        console.error("Failed to connect wallet:", error);
        throw error;
      }
    },
    [connectEVM, connectSolana, connectors, setVisible],
  );

  const disconnect = useCallback(async () => {
    try {
      if (isEVMConnected) {
        await disconnectEVM();
      } else if (isSolanaConnected) {
        await disconnectSolana();
      }
      setAddress(null);
      setChainId(null);
      setConnected(false);
    } catch (error) {
      console.error("Failed to disconnect wallet:", error);
      throw error;
    }
  }, [
    isEVMConnected,
    isSolanaConnected,
    disconnectEVM,
    disconnectSolana,
    setAddress,
    setChainId,
    setConnected,
  ]);

  const switchChain = useCallback(async (chainId: number | string) => {
    // TODO: Implement chain switching logic
    throw new Error("Chain switching not implemented");
  }, []);

  return (
    <WalletContext.Provider value={{ connect, disconnect, switchChain }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWalletContext = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWalletContext must be used within a WalletProvider");
  }
  return context;
};
