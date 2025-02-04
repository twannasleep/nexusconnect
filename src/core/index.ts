// Core hooks and providers
export * from "./hooks/useWallet";
export * from "./providers/WalletProvider";

// State management
export * from "./store/useWalletStore";
export * from "./store/useWalletDialogStore";

// Types
export * from "../types/chains";
export * from "../types/customization";

// Core functionality
export * from "./NexusConnect";
export * from "./utils";

// Adapters
export * from "./adapters/BaseWalletAdapter";
export * from "./adapters/EVMWalletAdapter";
export * from "./adapters/SolanaWalletAdapter";

// Default UI
export * as DefaultUI from "../ui/components";
