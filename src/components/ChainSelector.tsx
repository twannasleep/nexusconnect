import { Listbox, Transition } from "@headlessui/react";
import { Check, ChevronDown } from "lucide-react";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { defaultEVMChains, defaultSolanaChains } from "../config/chains";
import { useWalletContext } from "../providers/WalletProvider";
import { useWalletStore } from "../store/useWalletStore";
import { useWalletDialogStore } from "../store/useWalletDialogStore";
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

const getChainDisplayInfo = (chain: ChainConfig) => {
  const type = getChainType(chain);
  return {
    name: chain.name,
    subtitle: type === "evm" ? `Chain ID: ${chain.id}` : "Solana",
  };
};

export function ChainSelector() {
  const { switchChain, disconnect } = useWalletContext();
  const { chainId: selectedChainId, isConnected } = useWalletStore();
  const [selectedChain, setSelectedChain] = useState<ChainConfig | null>(null);
  const {
    setIsOpen: setShowWalletDialog,
    setPendingChain,
    pendingChain,
  } = useWalletDialogStore();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Group chains by type
  const chainGroups = useMemo(() => {
    return {
      evm: defaultEVMChains,
      solana: defaultSolanaChains,
    };
  }, []);

  useEffect(() => {
    const chain =
      [...defaultEVMChains, ...defaultSolanaChains].find(
        (chain) => chain.id === selectedChainId,
      ) ?? null;
    setSelectedChain(chain);
  }, [selectedChainId]);

  const handleChainChange = async (newChain: ChainConfig) => {
    // If not connected, open wallet dialog with the selected chain type
    if (!isConnected) {
      setPendingChain(newChain);
      setShowWalletDialog(true);
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
      await disconnect();
      setShowConfirm(false);
      setShowWalletDialog(true);
    } catch (error) {
      console.error("Failed to switch chain:", error);
      setPendingChain(null);
    } finally {
      setIsLoading(false);
    }
  }, [pendingChain, disconnect, setShowWalletDialog, setPendingChain]);

  const handleCancelSwitch = () => {
    setShowConfirm(false);
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
                    {getChainDisplayInfo(selectedChain).subtitle}
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
                {/* EVM Chains */}
                <div className="px-3 py-2 text-xs font-semibold text-gray-400 border-b border-gray-600">
                  EVM Chains
                </div>
                {chainGroups.evm.map((chain) => {
                  const displayInfo = getChainDisplayInfo(chain);
                  return (
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
                              className={`block truncate ${
                                selected ? "font-medium" : "font-normal"
                              }`}
                            >
                              {displayInfo.name}
                            </span>
                            <span className="ml-2 text-sm text-gray-400">
                              {displayInfo.subtitle}
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
                  );
                })}

                {/* Solana Chains */}
                <div className="px-3 py-2 text-xs font-semibold text-gray-400 border-b border-gray-600 mt-2">
                  Solana Chains
                </div>
                {chainGroups.solana.map((chain) => {
                  const displayInfo = getChainDisplayInfo(chain);
                  return (
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
                              className={`block truncate ${
                                selected ? "font-medium" : "font-normal"
                              }`}
                            >
                              {displayInfo.name}
                            </span>
                            <span className="ml-2 text-sm text-gray-400">
                              {displayInfo.subtitle}
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
                  );
                })}
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
        onConfirm={() => handleConfirmSwitch()}
        onCancel={handleCancelSwitch}
      />
    </>
  );
}
