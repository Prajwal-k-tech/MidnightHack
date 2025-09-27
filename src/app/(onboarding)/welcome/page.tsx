'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export default function WelcomePage() {
  const router = useRouter();

  return (
    <div className="text-center flex flex-col items-center">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-5xl font-heading text-foreground mb-4"
      >
        Welcome to the future of dating.
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="max-w-xl text-lg text-muted-foreground mb-8"
      >
        Let's create your secure, private profile. The next few steps will verify your identity using Zero-Knowledge proofs, ensuring you are who you say you are—without sharing your private data with anyone. Not even us.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Button size="lg" onClick={() => router.push('/identity')}>
          Create My Verified Profile
        </Button>
      </motion.div>
    </div>
  );
};
