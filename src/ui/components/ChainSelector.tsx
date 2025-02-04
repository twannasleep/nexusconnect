import { defaultEVMChains, defaultSolanaChains } from "@/config/chains";
import { Listbox, Transition } from "@headlessui/react";
import { Check, ChevronDown } from "lucide-react";
import { Fragment, useMemo, useState } from "react";
import { useWallet } from "../../core/hooks/useWallet";
import { type SupportedChain } from "../../types/chains";

export interface ChainSelectorProps {
  className?: string;
}

export function ChainSelector({ className = "" }: ChainSelectorProps) {
  const { chain: selectedChain, switchChain, isConnected } = useWallet();
  const [isLoading, setIsLoading] = useState(false);

  // Group chains by type
  const chainGroups = useMemo(
    () => ({
      evm: defaultEVMChains,
      solana: defaultSolanaChains,
    }),
    [],
  );

  const handleChainChange = async (newChain: SupportedChain) => {
    if (!isConnected) return;

    try {
      setIsLoading(true);
      await switchChain(newChain);
    } catch (error) {
      console.error("Failed to switch chain:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`w-full max-w-[240px] ${className}`}>
      <Listbox
        value={selectedChain}
        onChange={handleChainChange}
        disabled={isLoading}
      >
        <div className="relative">
          <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white py-2 pl-3 pr-10 text-left border focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed">
            {selectedChain ? (
              <span className="flex items-center">
                <img
                  src={selectedChain.icon}
                  alt={selectedChain.name}
                  className="h-5 w-5 mr-2"
                />
                <span className="block truncate">{selectedChain.name}</span>
              </span>
            ) : (
              <span className="block truncate text-gray-400">Select Chain</span>
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
            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none">
              {/* EVM Chains */}
              <div className="px-3 py-2 text-xs font-semibold text-gray-500">
                EVM Chains
              </div>
              {chainGroups.evm.map((chain) => (
                <Listbox.Option
                  key={chain.id.toString()}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                      active ? "bg-indigo-100 text-indigo-900" : "text-gray-900"
                    }`
                  }
                  value={chain}
                >
                  {({ selected }) => (
                    <>
                      <div className="flex items-center">
                        <img
                          src={chain.icon}
                          alt={chain.name}
                          className="h-5 w-5 mr-2"
                        />
                        <span
                          className={`block truncate ${selected ? "font-medium" : "font-normal"}`}
                        >
                          {chain.name}
                        </span>
                      </div>
                      {selected && (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-600">
                          <Check className="h-5 w-5" aria-hidden="true" />
                        </span>
                      )}
                    </>
                  )}
                </Listbox.Option>
              ))}

              {/* Solana Chains */}
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 mt-2">
                Solana Chains
              </div>
              {chainGroups.solana.map((chain) => (
                <Listbox.Option
                  key={chain.id.toString()}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                      active ? "bg-indigo-100 text-indigo-900" : "text-gray-900"
                    }`
                  }
                  value={chain}
                >
                  {({ selected }) => (
                    <>
                      <div className="flex items-center">
                        <img
                          src={chain.icon}
                          alt={chain.name}
                          className="h-5 w-5 mr-2"
                        />
                        <span
                          className={`block truncate ${selected ? "font-medium" : "font-normal"}`}
                        >
                          {chain.name}
                        </span>
                      </div>
                      {selected && (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-600">
                          <Check className="h-5 w-5" aria-hidden="true" />
                        </span>
                      )}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}
