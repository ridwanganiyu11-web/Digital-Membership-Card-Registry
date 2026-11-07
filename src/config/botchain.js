import { createAppKit } from '@reown/appkit/react';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { defineChain } from 'viem';

// Define Botchain Testnet (Chain ID 968)
export const botchainTestnet = defineChain({
  id: 968,
  name: 'Botchain Testnet',
  nativeCurrency: {
    name: 'Botchain Token',
    symbol: 'BOT',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [import.meta.env.VITE_BOTCHAIN_RPC_URL || 'https://rpc.bohr.life'],
    },
    public: {
      http: [import.meta.env.VITE_BOTCHAIN_RPC_URL || 'https://rpc.bohr.life'],
    },
  },
  blockExplorers: {
    default: {
      name: 'BohrScan',
      url: import.meta.env.VITE_BOTCHAIN_EXPLORER_URL || 'https://scan.bohr.life/',
    },
  },
  testnet: true,
});

// Reown Project ID (from .env or default fallback for development)
export const projectId = import.meta.env.VITE_REOWN_PROJECT_ID || '12ef448e8e788ad728eaecbb9e7fafe3';

// AppKit Metadata
export const metadata = {
  name: 'MemberChain',
  description: 'Your Membership. Your Identity. On-Chain.',
  url: typeof window !== 'undefined' ? window.location.origin : 'https://memberchain.app',
  icons: ['https://avatars.githubusercontent.com/u/179229932'],
};

// Networks to support
export const networks = [botchainTestnet];

// Wagmi Adapter Configuration
export const wagmiAdapter = new WagmiAdapter({
  projectId,
  networks,
});

// Initialize Reown AppKit
createAppKit({
  adapters: [wagmiAdapter],
  networks: [botchainTestnet],
  defaultNetwork: botchainTestnet,
  projectId,
  metadata,
  features: {
    analytics: true,
  },
  themeMode: 'dark',
  themeVariables: {
    '--w3m-accent': '#0284c7',
    '--w3m-border-radius-master': '12px',
  },
});

