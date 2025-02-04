import { type SDKConfig } from "../types/customization";
import { type SupportedChain } from "../types/chains";
import { type Wallet } from "../types/wallets";
import { mergeSDKConfig } from "./utils";
import * as DefaultUI from "../ui/components";

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

  constructor(
    chains: SupportedChain[],
    wallets: Wallet[],
    config?: Partial<SDKConfig>,
  ) {
    this.chains = chains;
    this.wallets = wallets;
    this.config = mergeSDKConfig(defaultConfig, config);
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
