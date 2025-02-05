import { type SupportedChain } from "../types/chains";
import { type SDKConfig } from "../types/customization";
import { type SupportedChainType, type Wallet } from "../types/wallets";
import * as DefaultUI from "../ui/components";
import { WalletAdapter } from "./adapters/BaseWalletAdapter";
import { EVMWalletAdapter } from "./adapters/EVMWalletAdapter";
import { SolanaWalletAdapter } from "./adapters/SolanaWalletAdapter";
import { mergeSDKConfig } from "./utils";

const defaultConfig: SDKConfig = {
  theme: {
    colors: {
      primary: "#3b82f6",
      secondary: "#6b7280",
      background: "#ffffff",
      text: "#1f2937",
    },
    borderRadius: "0.5rem",
  },
  customComponents: DefaultUI,
};

export class NexusConnect {
  private config: SDKConfig;
  private chains: SupportedChain[];
  private wallets: Wallet[];
  private adapters: Map<SupportedChainType, WalletAdapter>;

  constructor(
    chains: SupportedChain[],
    wallets: Wallet[],
    config?: Partial<SDKConfig>,
  ) {
    this.chains = chains;
    this.wallets = wallets;
    this.config = mergeSDKConfig(defaultConfig, config);
    this.adapters = this.initializeAdapters();
  }

  private initializeAdapters(): Map<SupportedChainType, WalletAdapter> {
    if (!this.chains.length) {
      throw new Error("At least one chain must be provided");
    }
    return new Map<SupportedChainType, WalletAdapter>([
      ["evm", new EVMWalletAdapter()],
      ["solana", new SolanaWalletAdapter()],
    ]);
  }

  public getAdapter(chainType: SupportedChainType): WalletAdapter {
    const adapter = this.adapters.get(chainType);
    if (!adapter) {
      throw new Error(
        `Unsupported chain type: ${chainType}. Available types: ${Array.from(this.adapters.keys()).join(", ")}`,
      );
    }
    return adapter;
  }

  public getConfig(): SDKConfig {
    return this.config;
  }

  public getChains(): SupportedChain[] {
    return this.chains;
  }

  public getWallets(): Wallet[] {
    return this.wallets;
  }

  public updateConfig(newConfig: Partial<SDKConfig>): void {
    this.config = mergeSDKConfig(this.config, newConfig);
  }

  // Export UI components (either custom or default)
  public get UI() {
    return this.config.customComponents || DefaultUI;
  }
}
