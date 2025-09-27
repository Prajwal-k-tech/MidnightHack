'use client';

import { useWalletStore } from '@/lib/stores/walletStore';
import { Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function NetworkStatus() {
  const { isConnected } = useWalletStore();

  const baseClasses = "flex items-center gap-2 px-3 cursor-default border border-input bg-transparent transition-colors hover:bg-black/5 dark:hover:bg-white/5";

  if (!isConnected) {
    return (
      <Button
        size="default"
        className={baseClasses}
        aria-label="Wallet is offline"
      >
        <WifiOff className="h-4 w-4 text-destructive dark:text-red-400" />
        <span className="text-sm font-medium text-destructive dark:text-red-400">Offline</span>
      </Button>
    );
  }

  return (
    <Button
      size="default"
      className={baseClasses}
      aria-label="Wallet is connected to Midnight"
    >
      <Wifi className="h-4 w-4 text-primary" />
      <span className="text-sm font-medium text-primary">Midnight</span>
    </Button>
  );
}
