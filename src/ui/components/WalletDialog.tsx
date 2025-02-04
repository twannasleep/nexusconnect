import { Tab } from "@headlessui/react";
import { type SupportedChain, isEVMChain } from "../../types/chains";
import { type Wallet, type SupportedChainType } from "../../types/wallets";
import { Dialog } from "./Dialog";
import { useWallet } from "../../core/hooks/useWallet";
import { Fragment, useState, useEffect } from "react";
import { defaultEVMChains, defaultSolanaChains } from "../../config/chains";
import { useWalletDialogStore } from "../../core/store/useWalletDialogStore";

export interface WalletDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pendingChain?: SupportedChain | null;
}

interface WalletOption {
  id: string;
  name: string;
  icon: string;
  supportedChainTypes: SupportedChainType[];
}

const MOCK_WALLETS: Record<"evm" | "solana", WalletOption[]> = {
  evm: [
    {
      id: "metamask",
      name: "MetaMask",
      icon: "https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg",
      supportedChainTypes: ["evm"],
    },
    {
      id: "walletconnect",
      name: "WalletConnect",
      icon: "https://avatars.githubusercontent.com/u/37784886",
      supportedChainTypes: ["evm"],
    },
  ],
  solana: [
    {
      id: "phantom",
      name: "Phantom",
      icon: "https://avatars.githubusercontent.com/u/78782331",
      supportedChainTypes: ["solana"],
    },
    {
      id: "solflare",
      name: "Solflare",
      icon: "https://avatars.githubusercontent.com/u/71836411",
      supportedChainTypes: ["solana"],
    },
  ],
};

export function WalletDialog({
  open,
  onOpenChange,
  pendingChain,
}: WalletDialogProps) {
  const { connect, switchChain, isConnecting, error } = useWallet();
  const { setPendingChain } = useWalletDialogStore();
  const [selectedTab, setSelectedTab] = useState(
    pendingChain && isEVMChain(pendingChain) ? 0 : 1,
  );

  // Update pending chain when tab changes
  const handleTabChange = (index: number) => {
    setSelectedTab(index);
    // Set the first chain of the selected type as pending
    const chain = index === 0 ? defaultEVMChains[0] : defaultSolanaChains[0];
    if (chain) {
      setPendingChain(chain);
    }
  };

  // Initialize pending chain if not set
  useEffect(() => {
    if (!pendingChain) {
      const chain =
        selectedTab === 0 ? defaultEVMChains[0] : defaultSolanaChains[0];
      if (chain) {
        setPendingChain(chain);
      }
    }
  }, [pendingChain, selectedTab, setPendingChain]);

  const handleWalletSelect = async (wallet: WalletOption) => {
    try {
      if (!pendingChain) {
        throw new Error("No chain selected");
      }

      // First switch to the selected chain
      await switchChain(pendingChain);
      // Then connect the wallet
      await connect(wallet as Wallet);
      onOpenChange(false);
    } catch (err) {
      console.error("Failed to connect wallet:", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Connect Wallet</h2>
          {pendingChain && (
            <div className="flex items-center gap-2">
              <img
                src={pendingChain.icon}
                alt={pendingChain.name}
                className="h-6 w-6"
              />
              <span className="text-sm text-gray-600">{pendingChain.name}</span>
            </div>
          )}
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-700">{error.message}</p>
          </div>
        )}

        <Tab.Group selectedIndex={selectedTab} onChange={handleTabChange}>
          <Tab.List className="flex space-x-1 rounded-lg bg-gray-100 p-1">
            <Tab as={Fragment}>
              {({ selected }) => (
                <button
                  className={`w-full rounded-lg py-2.5 text-sm font-medium leading-5 ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2
                    ${
                      selected
                        ? "bg-white text-gray-900 shadow"
                        : "text-gray-700 hover:bg-white/[0.12] hover:text-gray-900"
                    }`}
                >
                  EVM
                </button>
              )}
            </Tab>
            <Tab as={Fragment}>
              {({ selected }) => (
                <button
                  className={`w-full rounded-lg py-2.5 text-sm font-medium leading-5 ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2
                    ${
                      selected
                        ? "bg-white text-gray-900 shadow"
                        : "text-gray-700 hover:bg-white/[0.12] hover:text-gray-900"
                    }`}
                >
                  Solana
                </button>
              )}
            </Tab>
          </Tab.List>
          <Tab.Panels className="mt-4">
            <Tab.Panel className="space-y-3">
              {MOCK_WALLETS.evm.map((wallet) => (
                <button
                  key={wallet.id}
                  onClick={() => handleWalletSelect(wallet)}
                  disabled={isConnecting}
                  className="flex w-full items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <img
                    src={wallet.icon}
                    alt={wallet.name}
                    className="h-8 w-8"
                  />
                  <span className="font-medium">{wallet.name}</span>
                </button>
              ))}
            </Tab.Panel>
            <Tab.Panel className="space-y-3">
              {MOCK_WALLETS.solana.map((wallet) => (
                <button
                  key={wallet.id}
                  onClick={() => handleWalletSelect(wallet)}
                  disabled={isConnecting}
                  className="flex w-full items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <img
                    src={wallet.icon}
                    alt={wallet.name}
                    className="h-8 w-8"
                  />
                  <span className="font-medium">{wallet.name}</span>
                </button>
              ))}
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </Dialog>
  );
}
