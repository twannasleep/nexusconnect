import { Wallet } from "@/types/wallets";
import { type ReactNode, createContext, useContext, useMemo } from "react";
import {
  type SupportedChain,
  type SupportedChainType,
} from "../../types/chains";
import { type SDKConfig } from "../../types/customization";
import { WalletAdapter } from "../adapters/BaseWalletAdapter";
import { NexusConnect } from "../NexusConnect";
import { validateChainConfig } from "../utils";
import { defaultEVMChains } from "@/config/chains";

interface WalletProviderProps {
  children: ReactNode;
  chains: SupportedChain[];
  wallets: Wallet[];
  config?: Partial<SDKConfig>;
}

export interface WalletContextValue {
  getAdapter: (chainType: SupportedChainType) => WalletAdapter;
  sdk: NexusConnect;
}

export const WalletContext = createContext<WalletContextValue>({
  getAdapter: () => {
    throw new Error("WalletContext not initialized");
  },
  sdk: new NexusConnect(defaultEVMChains, [], {}),
});

export function WalletProvider({
  children,
  chains,
  wallets,
  config,
}: WalletProviderProps) {
  // Validate chain configurations
  chains.forEach(validateChainConfig);

  const sdk = useMemo(
    () => new NexusConnect(chains, wallets, config),
    [chains, wallets, config],
  );

  const contextValue = useMemo(
    () => ({
      sdk,
      getAdapter: (chainType: SupportedChainType) => sdk.getAdapter(chainType),
    }),
    [sdk],
  );

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWalletContext(): WalletContextValue {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWalletContext must be used within a WalletProvider");
  }
  return context;
}
