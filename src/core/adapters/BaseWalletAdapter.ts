import { type SupportedChain } from "../../types/chains";
import { type Wallet } from "../../types/wallets";
import { isWalletCompatible } from "../utils";

export interface WalletAdapter {
  connect(wallet: Wallet, chain: SupportedChain): Promise<void>;
  disconnect(): Promise<void>;
  switchChain(chain: SupportedChain): Promise<void>;
}

export abstract class BaseWalletAdapter implements WalletAdapter {
  protected wallet: Wallet | null = null;
  protected chain: SupportedChain | null = null;

  protected validateWalletCompatibility(
    wallet: Wallet,
    chain: SupportedChain,
  ): void {
    if (!isWalletCompatible(wallet, chain)) {
      throw new Error(
        `Wallet ${wallet.name} is not compatible with ${chain.name}`,
      );
    }
  }

  protected validateChainSelected(): asserts this is { chain: SupportedChain } {
    if (!this.chain) {
      throw new Error("No chain selected");
    }
  }

  protected validateWalletConnected(): asserts this is { wallet: Wallet } {
    if (!this.wallet) {
      throw new Error("No wallet connected");
    }
  }

  protected resetState(): void {
    this.wallet = null;
    this.chain = null;
  }

  abstract connect(wallet: Wallet, chain: SupportedChain): Promise<void>;
  abstract disconnect(): Promise<void>;
  abstract switchChain(chain: SupportedChain): Promise<void>;
}
