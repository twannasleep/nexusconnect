import { injected, walletConnect } from "@wagmi/connectors";
import {
  connect,
  createConfig,
  disconnect,
  http,
  switchChain,
} from "@wagmi/core";
import { type Chain } from "viem";
import { wagmiConfig } from "../../config/wagmi";
import { type SupportedChain, isEVMChain } from "../../types/chains";
import { type Wallet } from "../../types/wallets";
import { BaseWalletAdapter } from "./BaseWalletAdapter";
import { getChainRpcUrl } from "../utils";

export class EVMWalletAdapter extends BaseWalletAdapter {
  private createWagmiConfig(chain: Chain) {
    return createConfig({
      chains: [chain],
      connectors: [
        injected(),
        walletConnect({
          projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "",
        }),
      ],
      transports: {
        [chain.id]: http(),
      },
    });
  }

  async connect(wallet: Wallet, chain: SupportedChain): Promise<void> {
    if (!isEVMChain(chain)) {
      throw new Error("EVMWalletAdapter only supports EVM chains");
    }

    this.validateWalletCompatibility(wallet, chain);

    try {
      // First switch to the correct chain
      const chainId =
        typeof chain.id === "string" ? parseInt(chain.id, 10) : chain.id;
      await switchChain(wagmiConfig, { chainId });

      // Then connect the wallet
      const result = await connect(wagmiConfig, {
        connector:
          wallet.id === "metamask"
            ? injected()
            : walletConnect({
                projectId:
                  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "",
              }),
      });

      if (!result.accounts?.[0]) {
        throw new Error("Failed to get account after connection");
      }

      this.wallet = wallet;
      this.chain = chain;
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error("Failed to connect EVM wallet");
    }
  }

  async disconnect(): Promise<void> {
    this.validateWalletConnected();
    this.validateChainSelected();

    try {
      if (!isEVMChain(this.chain)) {
        throw new Error("EVMWalletAdapter only supports EVM chains");
      }

      await disconnect(wagmiConfig);
      this.resetState();
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error("Failed to disconnect EVM wallet");
    }
  }

  async switchChain(chain: SupportedChain): Promise<void> {
    this.validateWalletConnected();

    if (!isEVMChain(chain)) {
      throw new Error("EVMWalletAdapter only supports EVM chains");
    }

    this.validateWalletCompatibility(this.wallet, chain);

    try {
      const chainId =
        typeof chain.id === "string" ? parseInt(chain.id, 10) : chain.id;
      await switchChain(wagmiConfig, { chainId });
      this.chain = chain;
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error("Failed to switch EVM chain");
    }
  }
}
