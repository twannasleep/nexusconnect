import { EVMChainConfig, SolanaChainConfig } from '../types/chains';

export const defaultEVMChains: EVMChainConfig[] = [
  {
    id: 1,
    chainId: 1,
    name: 'Ethereum',
    network: 'mainnet',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://ethereum.publicnode.com'],
    blockExplorers: [
      {
        name: 'Etherscan',
        url: 'https://etherscan.io',
      },
    ],
  },
  // Add more chains as needed
];

export const defaultSolanaChains: SolanaChainConfig[] = [
  {
    id: 'solana-mainnet',
    name: 'Solana',
    network: 'mainnet-beta',
    endpoint: 'https://api.mainnet-beta.solana.com',
    nativeCurrency: {
      name: 'SOL',
      symbol: 'SOL',
      decimals: 9,
    },
    rpcUrls: ['https://api.mainnet-beta.solana.com'],
  },
  // Add more Solana networks as needed
]; 