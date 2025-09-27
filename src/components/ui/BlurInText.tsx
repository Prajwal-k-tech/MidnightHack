'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface BlurInTextProps {
  text: string;
  className?: string;
}

const BlurInText = ({ text, className }: BlurInTextProps) => {
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.035, delayChildren: 0.04 * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      filter: 'blur(0px)',
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      filter: 'blur(10px)',
    },
  };

  return (
    <motion.h2
      variants={container}
      initial="hidden"
      animate="visible"
      className={cn('font-bold', className)}
    >
      {text.split('').map((char, index) => (
        <motion.span
          key={index}
          variants={child}
          style={{ display: 'inline-block', whiteSpace: 'pre' }}
        >
          {char}
        </motion.span>
      ))}
    </motion.h2>
  );
};

export default BlurInText;
