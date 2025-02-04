export type SupportedChainType = "evm" | "solana";

export interface Wallet {
  id: string;
  name: string;
  icon: string;
  supportedChainTypes: SupportedChainType[];
}

export interface WalletConfig {
  evm: Wallet[];
  solana: Wallet[];
}
