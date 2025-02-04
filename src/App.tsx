import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
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
  const [count, setCount] = useState(0);

  return (
    <WagmiConfig config={wagmiConfig}>
      <ConnectionProvider endpoint="https://api.mainnet-beta.solana.com">
        <SolanaWalletProvider wallets={[]}>
          <WalletProvider>
            <div>
              <a href="https://vite.dev" target="_blank">
                <img src={viteLogo} className="logo" alt="Vite logo" />
              </a>
              <a href="https://react.dev" target="_blank">
                <img src={reactLogo} className="logo react" alt="React logo" />
              </a>
            </div>
            <h1>Vite + React</h1>
            <div className="card">
              <button onClick={() => setCount((count) => count + 1)}>
                count is {count}
              </button>
              <p>
                Edit <code>src/App.tsx</code> and save to test HMR
              </p>
            </div>
            <p className="read-the-docs">
              Click on the Vite and React logos to learn more
            </p>
          </WalletProvider>
        </SolanaWalletProvider>
      </ConnectionProvider>
    </WagmiConfig>
  );
}
