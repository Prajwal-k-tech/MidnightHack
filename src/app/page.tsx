'use client';

import { WalletConnect } from '@/components/wallet/WalletConnect';
import { NetworkStatus } from '@/components/network/NetworkStatus';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { ContractInterface } from '@/components/contract/ContractInterface';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useWalletStore } from '@/lib/stores/walletStore';
import { Alert, AlertTitle, AlertDescription, XCircle } from '@/components/ui/alert';

export default function Home() {
  const { isConnected } = useWalletStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-midnight-black to-gray-900 text-midnight-white flex flex-col items-center justify-center p-4">
      <header className="w-full max-w-4xl flex justify-between items-center py-4 px-6 bg-midnight-black/50 rounded-xl shadow-lg mb-8">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-midnight-blue to-midnight-white">
          dApp Dating
        </h1>
        <div className="flex items-center space-x-4">
          <NetworkStatus />
          <ThemeToggle />
          <WalletConnect />
        </div>
      </header>

      <main className="w-full max-w-4xl space-y-8">
        {!isConnected && (
          <Alert variant="warning" className="bg-yellow-900/30 border-yellow-500 text-yellow-200">
            <XCircle className="h-4 w-4 text-yellow-400" />
            <AlertTitle>Wallet Disconnected</AlertTitle>
            <AlertDescription>
              Please connect your Midnight Lace wallet to interact with the PrivateDatingPlatform contract.
            </AlertDescription>
          </Alert>
        )}

        <Card className="bg-midnight-black/70 border border-midnight-white/10 shadow-xl rounded-xl">
          <CardHeader className="border-b border-midnight-white/20 pb-4">
            <CardTitle className="text-2xl font-bold text-midnight-white">
              Platform Overview
            </CardTitle>
            <CardDescription className="text-midnight-white/80">
              Welcome to the privacy-first dating platform. Connect your wallet to manage your profile and preferences.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <ContractInterface />
          </CardContent>
        </Card>
      </main>

      <footer className="w-full max-w-4xl text-center text-midnight-white/50 mt-12 py-4 border-t border-midnight-white/10">
        &copy; {new Date().getFullYear()} dApp Dating. All rights reserved.
      </footer>
    </div>
  );
}
