import type { WalletConfig } from "../types/wallets";

export const supportedWallets: WalletConfig = {
  evm: [
    {
      id: "metamask",
      name: "MetaMask",
      icon: "/wallets/metamask.svg",
    },
    {
      id: "walletconnect",
      name: "WalletConnect",
      icon: "/wallets/walletconnect.svg",
    },
  ],
  solana: [
    {
      id: "Phantom",
      name: "Phantom",
      icon: "/wallets/phantom.svg",
    },
    {
      id: "Solflare",
      name: "Solflare",
      icon: "/wallets/solflare.svg",
    },
  ],
};
