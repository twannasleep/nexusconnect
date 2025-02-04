import { useWallet } from "@solana/wallet-adapter-react";
import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
} from "react";
import { useAccount, useChainId, useConnect, useDisconnect } from "wagmi";
import { useWalletStore } from "../store/useWalletStore";
import { SupportedChainType } from "../types/chains";

interface WalletContextType {
  connect: (chainType: SupportedChainType) => Promise<void>;
  disconnect: () => Promise<void>;
  switchChain: (chainId: number | string) => Promise<void>;
}

const WalletContext = createContext<WalletContextType | null>(null);

export const WalletProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { connect: connectEVM } = useConnect({
    connector: undefined, // or specify your connector
  });
  const { disconnect: disconnectEVM } = useDisconnect();
  const { address: evmAddress, isConnected: isEVMConnected } = useAccount();
  const chainId = useChainId();

  // Solana wallet
  const {
    connect: connectSolana,
    disconnect: disconnectSolana,
    connected: isSolanaConnected,
    publicKey,
  } = useWallet();

  const { setAddress, setChainId, setConnected } = useWalletStore();

  useEffect(() => {
    if (isEVMConnected) {
      setAddress(evmAddress ?? null);
      setChainId(chainId ?? null);
      setConnected(true);
    } else if (isSolanaConnected && publicKey) {
      setAddress(publicKey.toString());
      setChainId("solana");
      setConnected(true);
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
          await connectEVM();
        } else {
          await connectSolana();
        }
      } catch (error) {
        console.error("Failed to connect wallet:", error);
        throw error;
      }
    },
    [connectEVM, connectSolana],
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
    // Implement chain switching logic here
    throw new Error("Not implemented");
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
