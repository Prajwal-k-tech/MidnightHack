'use client';

import { Button } from '@/components/ui/button';
import { useWalletStore } from '@/lib/stores/walletStore';
import { Loader2, Wallet, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function WalletConnect() {
  const { isConnected, isConnecting, connect, disconnect, walletState } = useWalletStore();

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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="default"
className="flex items-center gap-2 px-3"
          >
            <div className="h-3 w-3 rounded-full bg-primary" />
            <span className="text-sm font-gapsans">
              {walletState.address?.slice(0, 6)}...{walletState.address?.slice(-4)}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleDisconnect} className="cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Disconnect</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button
      onClick={handleConnect}
      disabled={isConnecting}
      variant="default"
      size="default"
      className="flex items-center gap-2 px-3 btn-glow"
    >
      {isConnecting ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm font-gapsans">Connecting...</span>
        </>
      ) : (
        <>
          <Wallet className="h-4 w-4" />
          <span className="text-sm font-gapsans">Connect Midnight</span>
        </>
      )}
    </Button>
  );
}
