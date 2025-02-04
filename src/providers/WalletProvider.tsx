import { WalletName } from "@solana/wallet-adapter-base";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Connection } from "@solana/web3.js";
import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
} from "react";
import {
  useAccount,
  useChainId,
  useConnect,
  useDisconnect,
  useSwitchChain,
} from "wagmi";
import { injected } from "wagmi/connectors";
import { defaultSolanaChains, defaultEVMChains } from "../config/chains";
import { useWalletStore } from "../store/useWalletStore";
import { SupportedChainType } from "../types/chains";

interface WalletContextType {
  connect: (chainType: SupportedChainType, walletId: string) => Promise<void>;
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
  const {
    connected: isSolanaConnected,
    publicKey,
    connect: connectSolana,
    disconnect: disconnectSolana,
  } = wallet;

  const { setVisible } = useWalletModal();

  const { setAddress, setChainId, setConnected } = useWalletStore();

  const { chains, switchChainAsync } = useSwitchChain();

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
    async (chainType: SupportedChainType, walletId: string) => {
      try {
        if (chainType === "evm") {
          const connector =
            connectors.find((c) => c.id === walletId) || injected();
          await connectEVM({ connector });
        }

        if (chainType === "solana") {
          // If a different wallet is selected, disconnect it first
          if (wallet.wallet && wallet.wallet.adapter.name !== walletId) {
            await disconnectSolana();
          }

          if (!wallet.wallet) {
            wallet.select(walletId as WalletName);
          } else {
            await connectSolana();
          }
        }
      } catch (error) {
        console.error("Failed to connect wallet:", error);
        throw error;
      }
    },
    [
      connectEVM,
      connectSolana,
      disconnectSolana,
      connectors,
      wallet,
      setVisible,
    ],
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

  const switchChain = useCallback(
    async (chainId: number | string) => {
      try {
        // For EVM chains
        if (typeof chainId === "number") {
          const targetChain = defaultEVMChains.find(
            (chain) => chain.id === chainId,
          );
          if (!targetChain) {
            throw new Error(`Chain with ID ${chainId} not supported`);
          }

          if (!switchChainAsync) {
            throw new Error("Chain switching not available");
          }

          await switchChainAsync({ chainId });
          setChainId(chainId);
          return;
        }

        // For Solana chains
        if (typeof chainId === "string") {
          const targetChain = defaultSolanaChains.find(
            (chain) => chain.id === chainId,
          );
          if (!targetChain) {
            throw new Error(`Solana network ${chainId} not supported`);
          }

          // Create new connection with the target endpoint
          const connection = new Connection(targetChain.endpoint);

          // Disconnect current wallet if connected
          if (isSolanaConnected) {
            await disconnectSolana();
          }

          // Update the connection and reconnect
          if (wallet.wallet) {
            await connectSolana();
          }

          setChainId(chainId);
          return;
        }

        throw new Error("Invalid chain ID format");
      } catch (error) {
        console.error("Failed to switch chain:", error);
        throw error;
      }
    },
    [
      switchChainAsync,
      isSolanaConnected,
      disconnectSolana,
      connectSolana,
      wallet,
      setChainId,
    ],
  );

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
