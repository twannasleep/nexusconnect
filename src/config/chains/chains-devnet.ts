import { baseSepolia, sepolia } from "viem/chains";
import { SupportedChain } from "../../types/chains";

export const CHAIN_DEVNET: SupportedChain[] = [
  {
    ...sepolia,
    type: "evm",
    chainId: sepolia.id,
  },
  {
    ...baseSepolia,
    type: "evm",
    chainId: baseSepolia.id,
  },
  {
    id: "Sol11111111111111111111111111111111",
    name: "Solana",
    nativeCurrency: { name: "Solana", symbol: "SOL", decimals: 9 },
    rpcUrls: {
      default: {
        http: ["https://api.devnet.solana.com"],
      },
    },
    type: "solana",
    endpoint: "https://api.devnet.solana.com",
  },
];
