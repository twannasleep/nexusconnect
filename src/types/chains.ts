import { Chain } from "viem";

export type SupportedChainType = "evm" | "solana";

export type ChainConfig = Omit<Chain, "id"> & {
  id: number | string;
  type: SupportedChainType;
};

export interface EVMChainConfig extends ChainConfig {
  chainId: number;
}

export interface SolanaChainConfig extends Omit<ChainConfig, "rpcUrls"> {
  endpoint: string;
}

export type SupportedChain = EVMChainConfig | SolanaChainConfig;
