export interface ChainConfig {
  id: number | string;
  name: string;
  network: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: string[];
  blockExplorers?: {
    name: string;
    url: string;
  }[];
  testnet?: boolean;
}

export interface EVMChainConfig extends ChainConfig {
  chainId: number;
}

export interface SolanaChainConfig extends ChainConfig {
  endpoint: string;
}

export type SupportedChainType = 'evm' | 'solana'; 