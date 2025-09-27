'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface ScrollingTextProps {
  children: React.ReactNode;
  className?: string;
  duration?: number;
}

export const ScrollingText = ({ children, className, duration = 20 }: ScrollingTextProps) => {
  return (
    <div className="w-full overflow-hidden whitespace-nowrap">
      <div
        className="inline-block animate-scroll-loop"
        style={{ animationDuration: `${duration}s` }}
      >
        <span className={cn("inline-block px-4", className)}>{children}</span>
        <span className={cn("inline-block px-4", className)} aria-hidden="true">{children}</span>
        <span className={cn("inline-block px-4", className)} aria-hidden="true">{children}</span>
        <span className={cn("inline-block px-4", className)} aria-hidden="true">{children}</span>
      </div>
    </div>
  );
};
