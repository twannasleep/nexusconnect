import {
  ConnectionProvider,
  WalletProvider as SolanaWalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode, useMemo } from "react";
import { createRoot } from "react-dom/client";
import { WagmiProvider } from "wagmi";
import App from "./App";
import { defaultSolanaChains, defaultEVMChains } from "./config/chains";
import { wagmiConfig } from "./config/wagmi";
import { WalletProvider } from "./core/providers/WalletProvider";
import "./index.css";

// Import Solana wallet styles
import "@solana/wallet-adapter-react-ui/styles.css";

function Root() {
  const solanaWallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
    [],
  );

  const queryClient = new QueryClient();

  // Use the first Solana chain's endpoint from config
  const solanaEndpoint =
    defaultSolanaChains[0]?.endpoint ?? "https://api.mainnet-beta.solana.com";

  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig}>
          <ConnectionProvider endpoint={solanaEndpoint}>
            <SolanaWalletProvider wallets={solanaWallets}>
              <WalletModalProvider>
                <WalletProvider
                  chains={[...defaultEVMChains, ...defaultSolanaChains]}
                  wallets={[
                    {
                      id: "metamask",
                      name: "MetaMask",
                      icon: "https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg",
                      supportedChainTypes: ["evm"],
                    },
                    {
                      id: "walletconnect",
                      name: "WalletConnect",
                      icon: "https://avatars.githubusercontent.com/u/37784886",
                      supportedChainTypes: ["evm"],
                    },
                    {
                      id: "phantom",
                      name: "Phantom",
                      icon: "https://avatars.githubusercontent.com/u/78782331",
                      supportedChainTypes: ["solana"],
                    },
                    {
                      id: "solflare",
                      name: "Solflare",
                      icon: "https://avatars.githubusercontent.com/u/71836411",
                      supportedChainTypes: ["solana"],
                    },
                  ]}
                >
                  <App />
                </WalletProvider>
              </WalletModalProvider>
            </SolanaWalletProvider>
          </ConnectionProvider>
        </WagmiProvider>
      </QueryClientProvider>
    </StrictMode>
  );
}

createRoot(document.getElementById("root")!).render(<Root />);
