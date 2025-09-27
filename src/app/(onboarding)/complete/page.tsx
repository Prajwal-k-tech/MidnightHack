'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useWalletStore } from '@/lib/stores/walletStore';
import { CheckCircle, User, GraduationCap, Briefcase } from 'lucide-react';

export default function CompletePage() {
  const router = useRouter();
  const { setHasCompletedOnboarding } = useWalletStore();

  const handleFinish = () => {
    setHasCompletedOnboarding(true);
    router.push('/');
  };

  return (
    <div className="flex flex-col items-center justify-center text-center w-full max-w-xl">
      <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', delay: 0.2 }}>
        <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-4" />
      </motion.div>
      
      <h1 className="text-4xl font-heading text-foreground mb-2">You're all set!</h1>
      
      <p className="text-lg text-muted-foreground mb-8">Your private, verified profile is now active. Here's how others will see you.</p>

      <div className="w-full max-w-sm p-6 bg-muted/30 rounded-xl border-2 border-dashed text-left space-y-3 mb-8">
        <h3 className="font-bold text-lg text-center text-foreground pb-2">Your Public Profile Preview</h3>
        <div className="flex items-center gap-4 p-3 bg-background/50 rounded-lg">
          <User className="w-6 h-6 text-primary" />
          <span className="font-semibold">Age Verified ✓</span>
        </div>
        <div className="flex items-center gap-4 p-3 bg-background/50 rounded-lg">
          <GraduationCap className="w-6 h-6 text-primary" />
          <span className="font-semibold">Education Verified ✓</span>
        </div>
        <div className="flex items-center gap-4 p-3 bg-background/50 rounded-lg">
          <Briefcase className="w-6 h-6 text-primary" />
          <span className="font-semibold">Employment Verified ✓</span>
        </div>
      </div>

      <Button size="lg" onClick={handleFinish}>
        Start Matching
      </Button>
    </div>
  );
};