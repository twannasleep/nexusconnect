# Multi-Chain Wallet SDK

A flexible and extensible SDK for managing multi-chain wallet connections, supporting both EVM chains and Solana.

## Features

- 🔗 Multi-chain support (EVM + Solana)
- 💾 Persistent wallet state
- 🔄 Automatic chain switching
- 🔒 Type-safe configurations
- 🎨 Extensible architecture
- 🔌 Easy integration

## Architecture

### Core Components

#### 1. Wallet Provider (`src/providers/WalletProvider.tsx`)

- Central provider that manages wallet connections
- Handles both EVM and Solana wallet connections
- Provides unified interface for wallet operations
- Uses Context API for state distribution

#### 2. State Management (`src/store/useWalletStore.ts`)

- Uses Zustand for state management
- Persists wallet state across sessions
- Manages:
  - Connected address
  - Current chain ID
  - Connection status
  - Supported chains

#### 3. Chain Configuration (`src/types/chains.ts`, `src/config/chains.ts`)

- Type-safe chain configurations
- Extensible chain interfaces
- Pre-configured chains for EVM and Solana
- Easy addition of new chains

### Type System

```typescript
// Base chain configuration
interface ChainConfig {
  id: number | string;
  name: string;
  network: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: string[];
  blockExplorers?: Array<{
    name: string;
    url: string;
  }>;
}

// Chain-specific configurations
interface EVMChainConfig extends ChainConfig {
  chainId: number;
}

interface SolanaChainConfig extends ChainConfig {
  endpoint: string;
}
```

## Usage

### 1. Wrap your app with providers

```tsx
function App() {
  return (
    <WagmiConfig config={wagmiConfig}>
      <ConnectionProvider endpoint="https://api.mainnet-beta.solana.com">
        <SolanaWalletProvider wallets={[]}>
          <WalletProvider>
            <YourApp />
          </WalletProvider>
        </SolanaWalletProvider>
      </ConnectionProvider>
    </WagmiConfig>
  );
}
```

### 2. Use the wallet context in components

```tsx
function WalletConnect() {
  const { connect, disconnect } = useWalletContext();
  const { address, isConnected } = useWalletStore();

  return (
    <button onClick={() => connect("evm")}>
      {isConnected ? "Disconnect" : "Connect Wallet"}
    </button>
  );
}
```

### 3. Add new chains

```typescript
const newChain: EVMChainConfig = {
  id: 137,
  chainId: 137,
  name: "Polygon",
  network: "mainnet",
  // ... other configuration
};

useWalletStore.getState().addChain(newChain);
```

## Development Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint

# Format code
npm run format
```

## Project Structure

```
src/
├── providers/          # React context providers
├── store/             # Zustand state management
├── types/             # TypeScript type definitions
├── config/            # Chain configurations
└── utils/             # Utility functions
```

## Code Quality Tools

- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Husky for git hooks
- lint-staged for staged files linting

## Dependencies

Core:

- `wagmi`: EVM wallet connections
- `@solana/wallet-adapter-react`: Solana wallet connections
- `zustand`: State management
- `viem`: EVM interactions
- `typescript`: Type safety

Dev Tools:

- `eslint`: Code linting
- `prettier`: Code formatting
- `husky`: Git hooks
- `lint-staged`: Staged files linting

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

MIT
