import { type EVMChain, type SolanaChain } from "../../types/chains";

// Mainnet chains
export const mainnetEVMChains: EVMChain[] = [
  {
    id: 1,
    chainId: 1,
    name: "Ethereum",
    type: "evm",
    icon: "https://ethereum.org/static/6b935ac0e6194247347855dc3d328e83/13c43/eth-diamond-black.png",
    testnet: false,
    rpcUrls: {
      default: {
        http: ["https://eth.llamarpc.com"],
      },
      public: {
        http: ["https://eth.llamarpc.com"],
      },
    },
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    blockExplorers: {
      default: {
        name: "Etherscan",
        url: "https://etherscan.io",
        standard: "EIP3091",
      },
    },
  },
];

export const mainnetSolanaChains: SolanaChain[] = [
  {
    id: "mainnet",
    name: "Solana",
    type: "solana",
    icon: "https://solana.com/src/img/branding/solanaLogoMark.svg",
    testnet: false,
    endpoint: "https://api.mainnet-beta.solana.com",
    blockExplorers: {
      default: {
        name: "Solana Explorer",
        url: "https://explorer.solana.com",
        standard: "none",
      },
    },
  },
];

// Testnet chains
export const testnetEVMChains: EVMChain[] = [
  {
    id: 5,
    chainId: 5,
    name: "Goerli",
    type: "evm",
    icon: "https://ethereum.org/static/6b935ac0e6194247347855dc3d328e83/13c43/eth-diamond-black.png",
    testnet: true,
    rpcUrls: {
      default: {
        http: ["https://goerli.infura.io/v3/"],
      },
      public: {
        http: ["https://goerli.infura.io/v3/"],
      },
    },
    nativeCurrency: {
      name: "Goerli Ether",
      symbol: "ETH",
      decimals: 18,
    },
    blockExplorers: {
      default: {
        name: "Etherscan",
        url: "https://goerli.etherscan.io",
        standard: "EIP3091",
      },
    },
  },
];

export const testnetSolanaChains: SolanaChain[] = [
  {
    id: "devnet",
    name: "Solana Devnet",
    type: "solana",
    icon: "https://solana.com/src/img/branding/solanaLogoMark.svg",
    testnet: true,
    endpoint: "https://api.devnet.solana.com",
    blockExplorers: {
      default: {
        name: "Solana Explorer",
        url: "https://explorer.solana.com",
        standard: "none",
      },
    },
  },
];

// Combined exports
export const defaultEVMChains = [...mainnetEVMChains, ...testnetEVMChains];
export const defaultSolanaChains = [
  ...mainnetSolanaChains,
  ...testnetSolanaChains,
];
