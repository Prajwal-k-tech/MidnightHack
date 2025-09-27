'use client';

import React from 'react';

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  // In a real app, a progress bar could be calculated based on the current route.
  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col items-center justify-center">
      {/* Placeholder for a progress bar */}
      <div className="w-full max-w-2xl px-6 py-4">
        {/* <ProgressBar currentStep={...} totalSteps={...} /> */}
      </div>
      <div className="flex-grow w-full flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}
