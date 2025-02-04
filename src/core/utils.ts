import {
  type SupportedChain,
  isEVMChain,
  isSolanaChain,
} from "../types/chains";
import { type Wallet } from "../types/wallets";
import { type SDKConfig } from "../types/customization";

export function isWalletCompatible(
  wallet: Wallet,
  chain: SupportedChain,
): boolean {
  return wallet.supportedChainTypes.includes(chain.type);
}

export function filterWalletsByChain(
  wallets: Wallet[],
  chain: SupportedChain,
): Wallet[] {
  return wallets.filter((wallet) => isWalletCompatible(wallet, chain));
}

export function mergeSDKConfig(
  defaultConfig: SDKConfig,
  userConfig?: Partial<SDKConfig>,
): SDKConfig {
  if (!userConfig) return defaultConfig;

  return {
    ...defaultConfig,
    ...userConfig,
    theme: {
      ...defaultConfig.theme,
      ...userConfig.theme,
      colors: {
        ...defaultConfig.theme?.colors,
        ...userConfig.theme?.colors,
      },
    },
    customComponents: {
      ...defaultConfig.customComponents,
      ...userConfig.customComponents,
    },
  };
}

export function getChainIcon(chain: SupportedChain): string {
  // First try chain's own icon
  if (chain.icon) return chain.icon;

  // Then try block explorer icon
  if (chain.blockExplorers?.default?.icon) {
    return chain.blockExplorers.default.icon;
  }

  return "";
}

export function formatChainName(chain: SupportedChain): string {
  return chain.name || `Chain ${chain.id}`;
}

export function getChainRpcUrl(chain: SupportedChain): string {
  validateChainConfig(chain); // This will throw if the chain config is invalid

  if (isEVMChain(chain)) {
    const urls = chain.rpcUrls.default.http;
    if (!urls.length) {
      throw new Error(`No RPC URLs available for chain ${chain.name}`);
    }
    const url = urls[0];
    if (!url) {
      throw new Error(`Invalid RPC URL for chain ${chain.name}`);
    }
    return url;
  }

  if (isSolanaChain(chain)) {
    return chain.endpoint;
  }

  // This should never happen due to type system, but keeping for runtime safety
  throw new Error(`Unsupported chain type: ${(chain as SupportedChain).type}`);
}

export function isTestnet(chain: SupportedChain): boolean {
  return !!chain.testnet;
}

export function validateChainConfig(
  chain: SupportedChain,
): asserts chain is SupportedChain {
  if (!chain.id) throw new Error("Chain ID is required");
  if (!chain.name) throw new Error("Chain name is required");
  if (!chain.type) throw new Error("Chain type is required");

  if (isEVMChain(chain)) {
    if (!chain.rpcUrls?.default?.http?.length) {
      throw new Error(`EVM chain ${chain.name} requires at least one RPC URL`);
    }
    if (!chain.chainId)
      throw new Error(`EVM chain ${chain.name} requires chainId`);
  }

  if (isSolanaChain(chain)) {
    if (!chain.endpoint)
      throw new Error(`Solana chain ${chain.name} requires endpoint`);
  }
}
