import { useCallback, useState } from "react";
import { useWalletContext } from "../providers/WalletProvider";
import { useWalletStore } from "../store/useWalletStore";
import { defaultEVMChains, defaultSolanaChains } from "../config/chains";
import { WalletDialog } from "./WalletDialog";
import { ChainSelector } from "./ChainSelector";

export const WalletTest = () => {
  const { disconnect } = useWalletContext();
  const { address, isConnected, chainId } = useWalletStore();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDisconnect = useCallback(async () => {
    try {
      setError(null);
      setIsLoading(true);
      await disconnect();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to disconnect wallet",
      );
    } finally {
      setIsLoading(false);
    }
  }, [disconnect]);

  const getNetworkName = useCallback(
    (chainId: number | string | null): string => {
      if (!chainId) return "Not Connected";

      // Check Solana chains
      const solanaChain = defaultSolanaChains.find(
        (chain) => chain.id === chainId,
      );
      if (solanaChain) {
        return `${solanaChain.name} (Solana)`;
      }

      // Check EVM chains
      const evmChain = defaultEVMChains.find((chain) => chain.id === chainId);
      if (evmChain) {
        return `${evmChain.name} (Chain ID: ${chainId})`;
      }

      return `Chain ID: ${chainId}`;
    },
    [],
  );

  const buttonClassName =
    "px-6 py-3 rounded-lg text-white font-semibold min-w-[140px] transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="max-w-[600px] mx-auto my-8 p-8 rounded-xl bg-gray-900 text-white">
      <div className="mb-8 p-4 rounded-lg bg-gray-800">
        <h2 className="text-xl font-semibold mb-4">Wallet Status</h2>
        <p className="mb-2">
          Status:{" "}
          <span
            className={`font-semibold ${
              isConnected ? "text-green-400" : "text-red-400"
            }`}
          >
            {isConnected ? "Connected" : "Disconnected"}
          </span>
        </p>
        {address && (
          <p className="mb-2">
            Address:{" "}
            <code className="bg-gray-700 px-2 py-1 rounded text-sm break-all">
              {address}
            </code>
          </p>
        )}
        {chainId && (
          <div className="flex flex-col gap-2">
            <p className="mb-2">
              Network:{" "}
              <code className="bg-gray-700 px-2 py-1 rounded text-sm">
                {getNetworkName(chainId)}
              </code>
            </p>
          </div>
        )}
        <div className="mt-2">
          <ChainSelector />
        </div>
        {error && (
          <p
            className="mt-4 p-3 rounded bg-red-500/10 text-red-400"
            role="alert"
          >
            Error:{" "}
            <code className="bg-red-500/20 px-2 py-1 rounded">{error}</code>
          </p>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Wallet Connection</h2>
        <div className="flex gap-4 flex-wrap">
          {!isConnected ? (
            <button
              onClick={() => setDialogOpen(true)}
              disabled={isLoading}
              aria-label={isLoading ? "Connecting wallet..." : "Connect wallet"}
              className={`${buttonClassName} bg-indigo-500 hover:bg-indigo-600`}
            >
              {isLoading ? "Connecting..." : "Connect Wallet"}
            </button>
          ) : (
            <button
              onClick={handleDisconnect}
              disabled={isLoading}
              aria-label={
                isLoading ? "Disconnecting wallet..." : "Disconnect wallet"
              }
              className={`${buttonClassName} bg-red-500 hover:bg-red-600`}
            >
              {isLoading ? "Disconnecting..." : "Disconnect"}
            </button>
          )}
        </div>
      </div>

      <WalletDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setError(null);
        }}
      />
    </div>
  );
};
