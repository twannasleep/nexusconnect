import { CHAIN_MAINNET } from "./chains-mainnet";
import { CHAIN_DEVNET } from "./chains-devnet";
import { EVMChainConfig, SolanaChainConfig } from "../../types/chains";

const isProduction = false;

// Export all chains
export const allChains = isProduction ? CHAIN_MAINNET : CHAIN_DEVNET;

// Export EVM chains
export const defaultEVMChains = allChains.filter(
  (chain): chain is EVMChainConfig => chain.type === "evm",
);

// Export Solana chains
export const defaultSolanaChains = allChains.filter(
  (chain): chain is SolanaChainConfig => chain.type === "solana",
);

// Export mainnet and devnet chains separately
export { CHAIN_MAINNET, CHAIN_DEVNET };
