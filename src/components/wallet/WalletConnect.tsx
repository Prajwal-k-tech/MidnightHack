'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useWalletStore } from '@/lib/stores/walletStore';
import { Loader2, Wallet, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function WalletConnect() {
  const { isConnected, isConnecting, connect, disconnect, walletState } = useWalletStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleConnect = async () => {
    try {
      await connect();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  };

  if (isConnected && walletState) {
    return (
      <div
        className="relative inline-block"
        onMouseEnter={() => setIsMenuOpen(true)}
        onMouseLeave={() => setIsMenuOpen(false)}
      >
        <Button
          variant="outline"
          size="default"
          className="flex items-center gap-2 px-3"
        >
          <div className="h-3 w-3 rounded-full bg-primary" />
          <span className="text-sm">
            {walletState.address?.slice(0, 6)}...{walletState.address?.slice(-4)}
          </span>
        </Button>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -5, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -5, scale: 0.98 }}
              transition={{ duration: 0.15, ease: 'easeInOut' }}
              className="absolute top-full left-0 right-0 mt-2 w-full origin-top rounded-md bg-popover p-1 text-popover-foreground shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
            >
              <button
                onClick={handleDisconnect}
                className="group flex w-full items-center rounded-md px-2 py-2 text-sm hover:bg-accent"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Disconnect</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <Button
      onClick={handleConnect}
      disabled={isConnecting}
      variant="default"
      size="default"
      className="flex items-center gap-2 px-3"
    >
      {isConnecting ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm">Connecting...</span>
        </>
      ) : (
        <>
          <Wallet className="h-4 w-4" />
          <span className="text-sm">Connect Midnight</span>
        </>
      )}
    </Button>
  );
}
