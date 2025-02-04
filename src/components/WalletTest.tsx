import { useCallback, useState } from "react";
import { useWalletContext } from "../providers/WalletProvider";
import { useWalletStore } from "../store/useWalletStore";
import { defaultEVMChains, defaultSolanaChains } from "../config/chains";
import "./WalletTest.css";

export const WalletTest = () => {
  const { connect, disconnect } = useWalletContext();
  const { address, isConnected, chainId } = useWalletStore();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = useCallback(
    async (type: "evm" | "solana") => {
      try {
        setError(null);
        setIsLoading(true);
        await connect(type);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to connect wallet",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [connect],
  );

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

  const getNetworkName = (chainId: number | string | null) => {
    if (!chainId) return "Not Connected";

    // Check Solana chains
    const solanaChain = defaultSolanaChains.find(
      (chain) => chain.id === chainId,
    );
    if (solanaChain) {
      return `${solanaChain.name} ${solanaChain.network}`;
    }

    // Check EVM chains
    const evmChain = defaultEVMChains.find(
      (chain) => chain.chainId === chainId,
    );
    if (evmChain) {
      return `${evmChain.name} ${evmChain.network}`;
    }

    return `Chain ID: ${chainId}`;
  };

  return (
    <div className="wallet-test">
      <div className="wallet-status">
        <h2>Wallet Status</h2>
        <p>
          Status:{" "}
          <span className={isConnected ? "connected" : "disconnected"}>
            {isConnected ? "Connected" : "Disconnected"}
          </span>
        </p>
        {address && (
          <p>
            Address: <code>{address}</code>
          </p>
        )}
        {chainId && (
          <p>
            Network: <code>{getNetworkName(chainId)}</code>
          </p>
        )}
        {error && (
          <p className="error">
            Error: <code>{error}</code>
          </p>
        )}
      </div>

      <div className="wallet-actions">
        <h2>Connect Wallet</h2>
        <div className="button-group">
          <button
            onClick={() => handleConnect("evm")}
            disabled={isConnected || isLoading}
            className="connect-btn"
          >
            {isLoading ? "Connecting..." : "Connect EVM"}
          </button>
          <button
            onClick={() => handleConnect("solana")}
            disabled={isConnected || isLoading}
            className="connect-btn"
          >
            {isLoading ? "Connecting..." : "Connect Solana"}
          </button>
          <button
            onClick={handleDisconnect}
            disabled={!isConnected || isLoading}
            className="disconnect-btn"
          >
            {isLoading ? "Disconnecting..." : "Disconnect"}
          </button>
        </div>
      </div>
    </div>
  );
};
