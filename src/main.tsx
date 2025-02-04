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
import { WagmiProvider, createConfig, http } from "wagmi";
import { mainnet } from "wagmi/chains";
import { injected } from "wagmi/connectors";
import App from "./App";
import { defaultSolanaChains } from "./config/chains";
import "./index.css";
import { WalletProvider } from "./providers/WalletProvider";

// Import Solana wallet styles
import "@solana/wallet-adapter-react-ui/styles.css";

function Root() {
  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
    [],
  );

  const config = createConfig({
    chains: [mainnet],
    connectors: [injected()],
    transports: {
      [mainnet.id]: http(),
    },
  });

  const queryClient = new QueryClient();

  // Use the first Solana chain's endpoint from config
  const solanaEndpoint =
    defaultSolanaChains[0]?.endpoint ?? "https://api.mainnet-beta.solana.com";

  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={config}>
          <ConnectionProvider endpoint={solanaEndpoint}>
            <SolanaWalletProvider autoConnect wallets={wallets}>
              <WalletModalProvider>
                <WalletProvider>
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
