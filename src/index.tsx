import {
  ConnectionProvider,
  WalletProvider as SolanaWalletProvider,
} from "@solana/wallet-adapter-react";
import { WagmiConfig, createConfig } from "wagmi";
import { WalletProvider } from "./providers/WalletProvider";

const wagmiConfig = createConfig({
  // Configure wagmi here
});

export function App() {
  return (
    <WagmiConfig config={wagmiConfig}>
      <ConnectionProvider endpoint="https://api.mainnet-beta.solana.com">
        <SolanaWalletProvider wallets={[]}>
          <WalletProvider>{/* Your app content */}</WalletProvider>
        </SolanaWalletProvider>
      </ConnectionProvider>
    </WagmiConfig>
  );
}
