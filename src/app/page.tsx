'use client';

import { WalletConnect } from '@/components/wallet/WalletConnect';
import { NetworkStatus } from '@/components/network/NetworkStatus';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { ContractInterface } from '@/components/contract/ContractInterface';
import { useWalletStore } from '@/lib/stores/walletStore';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { XCircle } from 'lucide-react';
import BlurInText from '@/components/ui/BlurInText';
import { motion, AnimatePresence } from 'framer-motion';



export default function Home() {
  const { isConnected } = useWalletStore();

  return (
    <div className="h-screen w-screen flex flex-col items-center font-sans overflow-hidden relative">
      <header className="w-full max-w-6xl flex-shrink-0 flex justify-between items-center p-6">
        <h1 className="text-4xl font-heading font-bold text-gradient-animation bg-gradient-to-r from-[#5768d2] via-[#ca9ae4] to-[#ff9df0]">
          dApp Dating
        </h1>
        <div className="flex items-center space-x-3">
          <NetworkStatus />
          <ThemeToggle />
          <WalletConnect />
        </div>
      </header>

      <main className="w-full max-w-6xl flex-grow flex flex-col justify-center items-center p-6">
                <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
        >
          <div className="space-y-4">
                        <BlurInText
              text="Privacy-First Dating."
              className="text-5xl font-heading text-[#014c8f] dark:text-[#ab86e3] leading-tight"
            />
            <p className="text-lg text-muted-foreground">
              Welcome to the future of online dating, powered by Midnight. Your data, your control.
            </p>
                    <AnimatePresence>
          {!isConnected && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <Alert variant="destructive" className="mt-6">
                <XCircle className="h-5 w-5" />
                <AlertTitle className="font-bold">Connect Your Wallet</AlertTitle>
                <AlertDescription>
                  Please connect your Midnight Lace wallet to begin.
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>
          </div>

          <div className="w-full">
            <ContractInterface />
          </div>
        </motion.div>
      </main>

      <footer className="w-full max-w-6xl flex-shrink-0 text-center text-muted-foreground p-6">
        &copy; {new Date().getFullYear()} dApp Dating. All rights reserved.
      </footer>
    </div>
  );
}