import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { type SupportedChain, isSolanaChain } from "../../types/chains";
import { type Wallet } from "../../types/wallets";
import { getChainRpcUrl } from "../utils";
import { BaseWalletAdapter } from "./BaseWalletAdapter";

export class SolanaWalletAdapter extends BaseWalletAdapter {
  private solanaWallets = {
    phantom: new PhantomWalletAdapter(),
    solflare: new SolflareWalletAdapter(),
  };

  async connect(wallet: Wallet, chain: SupportedChain): Promise<void> {
    if (!isSolanaChain(chain)) {
      throw new Error("SolanaWalletAdapter only supports Solana chains");
    }

    this.validateWalletCompatibility(wallet, chain);

    try {
      const adapter =
        this.solanaWallets[wallet.id as keyof typeof this.solanaWallets];
      if (!adapter) {
        throw new Error(`Unsupported Solana wallet: ${wallet.id}`);
      }

      await adapter.connect();

      if (!adapter.connected) {
        throw new Error("Failed to connect to Solana wallet");
      }

      this.wallet = wallet;
      this.chain = chain;
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error("Failed to connect Solana wallet");
    }
  }

  async disconnect(): Promise<void> {
    this.validateWalletConnected();
    this.validateChainSelected();

    try {
      if (!isSolanaChain(this.chain)) {
        throw new Error("SolanaWalletAdapter only supports Solana chains");
      }

      const adapter =
        this.solanaWallets[this.wallet.id as keyof typeof this.solanaWallets];
      if (!adapter) {
        throw new Error(`Unsupported Solana wallet: ${this.wallet.id}`);
      }

      await adapter.disconnect();
      this.resetState();
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error("Failed to disconnect Solana wallet");
    }
  }

  async switchChain(chain: SupportedChain): Promise<void> {
    this.validateWalletConnected();

    if (!isSolanaChain(chain)) {
      throw new Error("SolanaWalletAdapter only supports Solana chains");
    }

    this.validateWalletCompatibility(this.wallet, chain);

    try {
      const adapter =
        this.solanaWallets[this.wallet.id as keyof typeof this.solanaWallets];
      if (!adapter) {
        throw new Error(`Unsupported Solana wallet: ${this.wallet.id}`);
      }

      // For Solana, switching chains means connecting to a different RPC endpoint
      const endpoint = getChainRpcUrl(chain);

      // Disconnect from current chain
      await adapter.disconnect();

      // Reconnect with new endpoint
      await adapter.connect();

      if (!adapter.connected) {
        throw new Error("Failed to connect to new Solana chain");
      }

      this.chain = chain;
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error("Failed to switch Solana chain");
    }
  }
}
