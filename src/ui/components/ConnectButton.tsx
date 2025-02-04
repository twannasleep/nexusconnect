import { type ReactNode, useState } from "react";
import { useWallet } from "../../core/hooks/useWallet";
import { useWalletDialogStore } from "../../core/store/useWalletDialogStore";

export interface ConnectButtonProps {
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
}

export function ConnectButton({
  children,
  className = "",
  disabled = false,
}: ConnectButtonProps) {
  const { isConnected, disconnect } = useWallet();
  const { openDialog } = useWalletDialogStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (disabled || isLoading) return;

    setIsLoading(true);
    try {
      if (isConnected) {
        await disconnect();
      } else {
        openDialog();
      }
    } catch (error) {
      console.error("Wallet action failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || isLoading}
      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
        isConnected
          ? "bg-red-500 hover:bg-red-600 text-white"
          : "bg-blue-500 hover:bg-blue-600 text-white"
      } disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children || (isConnected ? "Disconnect" : "Connect Wallet")}
    </button>
  );
}
