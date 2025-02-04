import { type ReactNode, createContext, useContext, useMemo } from "react";
import { type SupportedChain } from "../../types/chains";
import { type Wallet } from "../../types/wallets";
import { type SDKConfig } from "../../types/customization";
import { NexusConnect } from "../NexusConnect";
import { validateChainConfig } from "../utils";

interface WalletProviderProps {
  children: ReactNode;
  chains: SupportedChain[];
  wallets: Wallet[];
  config?: Partial<SDKConfig>;
}

interface WalletContextValue {
  sdk: NexusConnect;
}

const WalletContext = createContext<WalletContextValue | null>(null);

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

  const contextValue = useMemo(() => ({ sdk }), [sdk]);

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
