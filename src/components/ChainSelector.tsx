import { Listbox, Transition } from "@headlessui/react";
import { Check, ChevronDown } from "lucide-react";
import { Fragment, useCallback, useEffect, useState } from "react";
import { defaultEVMChains, defaultSolanaChains } from "../config/chains";
import { useWalletContext } from "../providers/WalletProvider";
import { useWalletStore } from "../store/useWalletStore";
import {
  EVMChainConfig,
  SolanaChainConfig,
  SupportedChainType,
} from "../types/chains";
import { ConfirmDialog } from "./ConfirmDialog";

type ChainConfig = EVMChainConfig | SolanaChainConfig;

const getChainType = (chain: ChainConfig): SupportedChainType => {
  return typeof chain.id === "number" ? "evm" : "solana";
};

export function ChainSelector() {
  const { switchChain, connect, disconnect } = useWalletContext();
  const { chainId: selectedChainId, isConnected } = useWalletStore();
  const [chains] = useState<ChainConfig[]>([
    ...defaultEVMChains,
    ...defaultSolanaChains,
  ]);
  const [selectedChain, setSelectedChain] = useState<ChainConfig | null>(null);
  const [pendingChain, setPendingChain] = useState<ChainConfig | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const chain = chains.find((chain) => chain.id === selectedChainId) ?? null;
    setSelectedChain(chain);
  }, [selectedChainId, chains]);

  const handleChainChange = async (newChain: ChainConfig) => {
    // If not connected, switch directly
    if (!isConnected) {
      try {
        await switchChain(newChain.id);
        setSelectedChain(newChain);
      } catch (error) {
        console.error("Failed to switch chain:", error);
      }
      return;
    }

    // Check if we're switching between different chain types
    const currentChainType = selectedChain ? getChainType(selectedChain) : null;
    const newChainType = getChainType(newChain);
    const isChainTypeSwitch =
      currentChainType !== null && currentChainType !== newChainType;

    if (isChainTypeSwitch) {
      setPendingChain(newChain);
      setShowConfirm(true);
    } else {
      try {
        await switchChain(newChain.id);
        setSelectedChain(newChain);
      } catch (error) {
        console.error("Failed to switch chain:", error);
      }
    }
  };

  const handleConfirmSwitch = useCallback(async () => {
    if (!pendingChain) return;

    try {
      setIsLoading(true);
      const newChainType = getChainType(pendingChain);

      // First disconnect from the current chain
      await disconnect();

      // Use the first available wallet for the chain type
      const defaultWalletId = newChainType === "evm" ? "injected" : "phantom";

      // Connect to the new chain type
      await connect(newChainType, defaultWalletId);

      // Switch to the specific chain
      await switchChain(pendingChain.id);
      setSelectedChain(pendingChain);
    } catch (error) {
      console.error("Failed to switch chain:", error);
    } finally {
      setIsLoading(false);
      setPendingChain(null);
    }
  }, [pendingChain, connect, disconnect, switchChain]);

  const handleCancelSwitch = () => {
    setPendingChain(null);
  };

  return (
    <>
      <div className="w-full max-w-[240px]">
        <Listbox
          value={selectedChain}
          onChange={handleChainChange}
          disabled={isLoading}
        >
          <div className="relative">
            <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-gray-700 py-2 pl-3 pr-10 text-left border border-gray-600 focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/75 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed">
              {selectedChain ? (
                <span className="flex items-center">
                  <span className="block truncate text-white">
                    {selectedChain.name}
                  </span>
                  <span className="ml-2 text-sm text-gray-400">
                    {selectedChain.network}
                  </span>
                </span>
              ) : (
                <span className="block truncate text-gray-400">
                  Select Chain
                </span>
              )}
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronDown
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-gray-700 py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none">
                {chains.map((chain) => (
                  <Listbox.Option
                    key={chain.id.toString()}
                    className={({ active }) =>
                      `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                        active
                          ? "bg-indigo-500/20 text-indigo-300"
                          : "text-gray-100"
                      }`
                    }
                    value={chain}
                  >
                    {({ selected }) => (
                      <>
                        <div className="flex items-center">
                          <span
                            className={`block truncate ${selected ? "font-medium" : "font-normal"}`}
                          >
                            {chain.name}
                          </span>
                          <span className="ml-2 text-sm text-gray-400">
                            {chain.network}
                          </span>
                        </div>
                        {selected ? (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-400">
                            <Check className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>
      </div>

      <ConfirmDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        title="Switch Chain Type"
        description={`You are about to switch from ${selectedChain?.name} to ${pendingChain?.name}. This will require disconnecting your current wallet and connecting a new one. Do you want to continue?`}
        onConfirm={handleConfirmSwitch}
        onCancel={handleCancelSwitch}
      />
    </>
  );
}
