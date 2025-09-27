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
    <div className="w-full max-w-xl text-center">
      <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', delay: 0.2 }}>
        <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-4" />
      </motion.div>
      <h1 className="text-4xl font-heading text-foreground mb-2">You're all set!</h1>
      <p className="text-lg text-muted-foreground mb-8">Your private, verified profile is now active. Here's how others will see you.</p>

      <div className="p-8 bg-muted/30 rounded-xl border-2 border-dashed text-left space-y-4 mb-8">
        <h3 className="font-bold text-lg text-center text-foreground">Your Public Profile Preview</h3>
        <div className="flex items-center gap-4 p-4 bg-background/50 rounded-lg">
          <User className="w-8 h-8 text-primary" />
          <span className="font-semibold">Age Verified ✓</span>
        </div>
        <div className="flex items-center gap-4 p-4 bg-background/50 rounded-lg">
          <GraduationCap className="w-8 h-8 text-primary" />
          <span className="font-semibold">Education Verified ✓</span>
        </div>
        <div className="flex items-center gap-4 p-4 bg-background/50 rounded-lg">
          <Briefcase className="w-8 h-8 text-primary" />
          <span className="font-semibold">Employment Verified ✓</span>
        </div>
      </div>

      <Button size="lg" onClick={handleFinish}>
        Start Matching
      </Button>
    </div>
  );
};
