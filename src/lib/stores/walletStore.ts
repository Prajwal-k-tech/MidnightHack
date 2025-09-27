'use client';

import { create } from 'zustand';

// Define interfaces for our state
interface WalletState {
  address: string | null;
  publicKey: string | null;
  chainId: string;
  balances: any[];
  isConnected: boolean;
  isLocked: boolean;
}

interface WalletStoreState {
  // Wallet Connection State
  isConnected: boolean;
  isConnecting: boolean;
  walletState: WalletState | null;
  error: string | null;

  // Onboarding State
  hasCompletedOnboarding: boolean;
  rules: any[];
  verificationState: { [key: string]: string };

  // Actions
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  clearError: () => void;
  setHasCompletedOnboarding: (status: boolean) => void;
  addRule: (rule: any) => void;
  removeRule: (ruleId: number) => void;
  setVerificationStatus: (key: string, status: string) => void;
}

export const useWalletStore = create<WalletStoreState>((set) => ({
  // Initial state
  isConnected: false,
  isConnecting: false,
  walletState: null,
  error: null,
  hasCompletedOnboarding: false,
  rules: [],
  verificationState: { selfie: 'idle', id: 'idle', education: 'idle', income: 'idle' },

  // --- ACTIONS ---

  connect: async () => {
    set({ isConnecting: true, error: null });
    try {
      if (typeof window === 'undefined' || !window.midnight?.mnLace) {
        throw new Error('Midnight Lace wallet not found. Please install the extension.');
      }
      const api = window.midnight.mnLace;
      const isEnabled = await api.isEnabled();
      if (!isEnabled) {
        await api.enable();
      }
      // In a real app, you would get this data from the API
      const walletState: WalletState = {
        address: 'midnight1q...5678',
        publicKey: null,
        chainId: 'midnight-testnet',
        balances: [],
        isConnected: true,
        isLocked: false,
      };
      set({ isConnected: true, isConnecting: false, walletState, error: null });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to connect wallet';
      set({ isConnecting: false, error: errorMessage });
      throw error;
    }
  },

  disconnect: async () => {
    // In a real app, you might need to call a disconnect method from the wallet API
    set({ isConnected: false, walletState: null, error: null });
  },

  clearError: () => {
    set({ error: null });
  },

  setHasCompletedOnboarding: (status: boolean) => {
    set({ hasCompletedOnboarding: status });
  },

  addRule: (rule: any) => {
    set((state) => ({ rules: [...state.rules, rule] }));
  },

  removeRule: (ruleId: number) => {
    set((state) => ({ rules: state.rules.filter((r) => r.id !== ruleId) }));
  },

  setVerificationStatus: (key: string, status: string) => {
    set((state) => ({
      verificationState: { ...state.verificationState, [key]: status },
    }));
  },
}));

declare global {
  interface Window {
    midnight?: {
      mnLace?: any; // Use a more specific type from the wallet connector API if available
    };
  }
}
