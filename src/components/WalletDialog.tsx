import { Tab } from "@headlessui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useState } from "react";
import { supportedWallets } from "../config/wallets";
import { useWalletContext } from "../providers/WalletProvider";
import { SupportedChainType } from "../types/chains";
import type { Wallet } from "../types/wallets";
import { DialogRoot } from "./Dialog";

interface WalletDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WalletDialog({ open, onOpenChange }: WalletDialogProps) {
  const [selectedChainType, setSelectedChainType] =
    useState<SupportedChainType>("evm");
  const { connect } = useWalletContext();

  const handleConnect = async (walletId: string) => {
    try {
      await connect(selectedChainType, walletId);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  const wallet = useWallet();

  const renderWalletButton = (wallet: Wallet) => (
    <button
      key={wallet.id}
      className="w-full flex items-center gap-4 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
      onClick={() => handleConnect(wallet.id)}
    >
      <img src={wallet.icon} alt={wallet.name} className="h-6 w-6" />
      <span>{wallet.name}</span>
    </button>
  );

  return (
    <DialogRoot open={open} onOpenChange={onOpenChange} title="Connect Wallet">
      <Tab.Group
        selectedIndex={selectedChainType === "evm" ? 0 : 1}
        onChange={(index) =>
          setSelectedChainType(index === 0 ? "evm" : "solana")
        }
      >
        <Tab.List className="flex w-full mb-4 bg-gray-100 rounded-lg p-1">
          <Tab
            className={({ selected }) =>
              `flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                selected ? "bg-white shadow-sm" : "hover:bg-white/[0.12]"
              }`
            }
          >
            EVM
          </Tab>
          <Tab
            className={({ selected }) =>
              `flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                selected ? "bg-white shadow-sm" : "hover:bg-white/[0.12]"
              }`
            }
          >
            Solana
          </Tab>
        </Tab.List>

        <Tab.Panels>
          <Tab.Panel className="space-y-2">
            {supportedWallets.evm.map(renderWalletButton)}
          </Tab.Panel>

          <Tab.Panel className="space-y-2">
            {supportedWallets.solana.map(renderWalletButton)}

            <div className="space-y-2">
              {wallet.wallets.map((wallet) => (
                <button
                  key={wallet.adapter.name}
                  className="w-full flex items-center gap-4 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                  onClick={() => handleConnect(wallet.adapter.name)}
                >
                  <img
                    src={wallet.adapter.icon}
                    alt={wallet.adapter.name}
                    className="h-6 w-6"
                  />
                  <span>{wallet.adapter.name}</span>
                </button>
              ))}
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </DialogRoot>
  );
}
