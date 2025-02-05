import { type ReactNode } from "react";
import { type SupportedChain } from "./chains";

export interface CustomUIComponents {
  ConnectButton?: React.ComponentType<ConnectButtonProps>;
  WalletDialog?: React.ComponentType<WalletDialogProps>;
  ChainSelector?: React.ComponentType<ChainSelectorProps>;
}

export interface ConnectButtonProps {
  onClick?: () => void;
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
}

export interface WalletDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pendingChain?: SupportedChain | null;
}

export interface ChainSelectorProps {
  chains: SupportedChain[];
  selectedChain?: SupportedChain;
  onChainSelect: (chain: SupportedChain) => void;
  className?: string;
}

export interface SDKConfig {
  customComponents?: CustomUIComponents;
  theme?: {
    colors?: {
      primary?: string;
      secondary?: string;
      background?: string;
      text?: string;
    };
    borderRadius?: string;
  };
}
