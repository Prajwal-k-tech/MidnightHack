'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { WalletConnect } from '@/components/wallet/WalletConnect';
import { NetworkStatus } from '@/components/network/NetworkStatus';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { ContractInterface } from '@/components/contract/ContractInterface';
import { useWalletStore } from '@/lib/stores/walletStore';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { XCircle } from 'lucide-react';
import BlurInText from '@/components/ui/BlurInText';
import { ScrollingText } from '@/components/ui/ScrollingText';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const { isConnected, hasCompletedOnboarding } = useWalletStore();
  const router = useRouter();

  useEffect(() => {
    if (isConnected && !hasCompletedOnboarding) {
      router.push('/welcome');
    }
  }, [isConnected, hasCompletedOnboarding, router]);

  // If user is connected but hasn't onboarded, this page is effectively blank while redirecting.
  if (isConnected && !hasCompletedOnboarding) {
    return <div className="h-screen w-screen bg-background"></div>; // Or a loading spinner
  }

  return (
    <div className="min-h-screen w-screen flex flex-col items-center font-sans relative bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-900">
      {/* Subtle overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/20 pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.15),transparent_70%)] pointer-events-none"></div>
      
      <header className="w-full max-w-6xl flex-shrink-0 flex justify-between items-center p-6 relative z-10">
        <h1 className="text-4xl font-heading font-bold bg-gradient-to-r from-violet-400 to-purple-300 bg-clip-text text-transparent leading-normal">
          dApp Dating
        </h1>
        <div className="flex items-center space-x-3">
          <NetworkStatus />
          <ThemeToggle />
          <WalletConnect />
        </div>
      </header>

      <main className="w-full max-w-6xl flex-grow flex flex-col justify-center items-center p-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
        >
          <div className="space-y-6">
            {/* Main Hero Section */}
            <div className="space-y-4">
              <BlurInText
                text="No More Catfish."
                className="text-6xl font-heading bg-gradient-to-r from-cyan-300 via-violet-300 to-purple-300 bg-clip-text text-transparent drop-shadow-2xl leading-tight"
              />
              <h2 className="text-2xl font-bold text-violet-200 drop-shadow-lg">
                Privacy-First Dating with Zero-Knowledge Proofs
              </h2>
              <p className="text-lg text-slate-300 drop-shadow-sm leading-relaxed">
                Finally, verify compatibility without revealing your secrets. Prove your age, location, and income range—all while keeping your exact data private.
              </p>
            </div>

            {/* Value Props */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-emerald-300">
                <span className="text-xl">🛡️</span>
                <span className="text-sm font-medium">Your data stays on your device</span>
              </div>
              <div className="flex items-center gap-3 text-blue-300">
                <span className="text-xl">🔍</span>
                <span className="text-sm font-medium">Cryptographically verified compatibility</span>
              </div>
              <div className="flex items-center gap-3 text-purple-300">
                <span className="text-xl">💎</span>
                <span className="text-sm font-medium">Serious connections, verified profiles</span>
              </div>
            </div>

            {/* Call to Action */}
            <div className="pt-4">
              <p className="text-violet-200 text-lg font-medium mb-4">
                Ready to date without compromise?
              </p>
              {!isConnected && (
                <div className="bg-gradient-to-r from-violet-500/20 to-purple-500/20 backdrop-blur-sm border border-violet-400/30 rounded-xl p-4">
                  <p className="text-violet-200 text-sm mb-2">🚀 Connect your Midnight wallet to start</p>
                  <p className="text-slate-400 text-xs">Your journey to verified, private dating begins here</p>
                </div>
              )}
            </div>
            
            <AnimatePresence>
              {!isConnected && (
                <motion.div
                  initial={{ opacity: 0, y: -20, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.98 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <Alert className="mt-6 bg-blue-900/30 border-blue-400/50 text-blue-100">
                    <XCircle className="h-5 w-5 text-blue-300" />
                    <AlertTitle className="font-bold text-blue-200">Connect Your Wallet</AlertTitle>
                    <AlertDescription className="text-blue-300">
                      Please connect your Midnight Lace wallet to begin your privacy-first dating journey.
                    </AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="w-full">
            {/* After onboarding, this could show a dashboard or the main app view */}
            <ContractInterface />
          </div>
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: 'easeInOut' }}
          className="w-full mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10"
        >
          <div className="text-center space-y-3 p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
            <div className="text-4xl mb-3">🎯</div>
            <h3 className="text-xl font-bold text-violet-300">Smart Matching</h3>
            <p className="text-sm text-slate-400">Match based on verified compatibility, not just photos and lies</p>
          </div>
          <div className="text-center space-y-3 p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
            <div className="text-4xl mb-3">🔐</div>
            <h3 className="text-xl font-bold text-violet-300">Zero-Knowledge Proofs</h3>
            <p className="text-sm text-slate-400">Prove you're compatible without revealing sensitive data</p>
          </div>
          <div className="text-center space-y-3 p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
            <div className="text-4xl mb-3">⚡</div>
            <h3 className="text-xl font-bold text-violet-300">Midnight Network</h3>
            <p className="text-sm text-slate-400">Built on cutting-edge privacy blockchain technology</p>
          </div>
        </motion.div>
      </main>

      <footer className="w-full max-w-6xl flex-shrink-0 text-center text-slate-400 p-6 relative z-10 mt-12">
        <ScrollingText>
          &copy; {new Date().getFullYear()} dApp Dating. Privacy-first connections that matter.
        </ScrollingText>
      </footer>
    </div>
  );
}