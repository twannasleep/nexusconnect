import { base, mainnet } from "viem/chains";
import { SupportedChain } from "../../types/chains";

export const CHAIN_MAINNET: SupportedChain[] = [
  {
    ...mainnet,
    type: "evm",
    chainId: mainnet.id,
  },
  {
    ...base,
    type: "evm",
    chainId: base.id,
  },

  // SOLANA
  {
    id: "Sol11111111111111111111111111111111",
    name: "Solana",
    nativeCurrency: { name: "Solana", symbol: "SOL", decimals: 9 },
    type: "solana",
    endpoint: "https://api.mainnet-beta.solana.com",
  },
];
