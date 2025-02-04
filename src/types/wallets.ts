export interface Wallet {
  id: string;
  name: string;
  icon: string;
}

export interface WalletConfig {
  evm: Wallet[];
  solana: Wallet[];
}
