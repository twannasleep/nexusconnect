import { type PublicKey } from "@solana/web3.js";

export type SupportedChainType = "evm" | "solana";

export interface ChainBlockExplorer {
  name: string;
  url: string;
  icon?: string;
  standard: string;
}

export interface BaseChain {
  id: string | number;
  name: string;
  type: SupportedChainType;
  icon?: string;
  testnet?: boolean;
  blockExplorers?: {
    default: ChainBlockExplorer;
    [key: string]: ChainBlockExplorer;
  };
}

export interface EVMChain extends BaseChain {
  type: "evm";
  chainId: number;
  rpcUrls: {
    default: { http: string[] };
    public: { http: string[] };
  };
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
}

export interface SolanaChain extends BaseChain {
  type: "solana";
  endpoint: string;
  programId?: PublicKey;
}

export type SupportedChain = EVMChain | SolanaChain;

// Type guard functions
export function isEVMChain(chain: SupportedChain): chain is EVMChain {
  return chain.type === "evm";
}

export function isSolanaChain(chain: SupportedChain): chain is SolanaChain {
  return chain.type === "solana";
}
