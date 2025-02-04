import { EVMChainConfig, SolanaChainConfig } from "../types/chains";

export const defaultEVMChains: EVMChainConfig[] = [
  {
    id: 11155111,
    chainId: 11155111,
    name: "Ethereum",
    network: "sepolia",
    nativeCurrency: {
      name: "Sepolia Ether",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://ethereum-sepolia.publicnode.com"],
    blockExplorers: [
      {
        name: "Etherscan",
        url: "https://sepolia.etherscan.io",
      },
    ],
  },
  // Add more chains as needed
];

export const defaultSolanaChains: SolanaChainConfig[] = [
  {
    id: "solana-devnet",
    name: "Solana",
    network: "devnet",
    endpoint: "https://api.devnet.solana.com",
    nativeCurrency: {
      name: "SOL",
      symbol: "SOL",
      decimals: 9,
    },
    rpcUrls: ["https://api.devnet.solana.com"],
  },
  // Add more Solana networks as needed
];
