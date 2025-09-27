'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, Briefcase, GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ProfessionalPage() {
  const router = useRouter();
  const [educationState, setEducationState] = useState('idle');
  const [incomeState, setIncomeState] = useState('idle');

  const handleEducationVerify = () => {
    if (educationState !== 'idle') return;
    setEducationState('verifying');
    setTimeout(() => { setEducationState('verified'); }, 1500);
  };

  const handleIncomeVerify = () => {
    if (incomeState !== 'idle') return;
    setIncomeState('verifying');
    setTimeout(() => { setIncomeState('verified'); }, 2000);
  };

  const bothVerified = educationState === 'verified' && incomeState === 'verified';

  return (
    <div className="w-full max-w-xl text-center">
      <h1 className="text-4xl font-heading text-foreground mb-2">Professional Verification</h1>
      <p className="text-lg text-muted-foreground mb-8">Next, let's verify your professional background.</p>
      <div className="space-y-4 mb-8">
        {/* Education Button */}
        <button onClick={handleEducationVerify} disabled={educationState !== 'idle'} className={cn("w-full p-6 bg-muted/30 rounded-xl border-2 border-dashed flex items-center justify-between transition-all duration-300", educationState === 'idle' && "hover:border-primary hover:bg-primary/10", educationState === 'verified' && "border-green-500 border-solid bg-green-500/10")}>
          <div className="flex items-center">
            <GraduationCap className="w-8 h-8 text-muted-foreground mr-4" />
            <div>
              <h3 className="font-semibold text-foreground text-left">Verify Education</h3>
              <p className="text-sm text-muted-foreground text-left">Connect LinkedIn to verify your degree.</p>
            </div>
          </div>
          {educationState === 'verifying' ? <Loader2 className="w-6 h-6 text-primary animate-spin" /> : educationState === 'verified' ? <CheckCircle className="w-6 h-6 text-green-500" /> : null}
        </button>
        {/* Income Button */}
        <button onClick={handleIncomeVerify} disabled={incomeState !== 'idle'} className={cn("w-full p-6 bg-muted/30 rounded-xl border-2 border-dashed flex items-center justify-between transition-all duration-300", incomeState === 'idle' && "hover:border-primary hover:bg-primary/10", incomeState === 'verified' && "border-green-500 border-solid bg-green-500/10")}>
          <div className="flex items-center">
            <Briefcase className="w-8 h-8 text-muted-foreground mr-4" />
            <div>
              <h3 className="font-semibold text-foreground text-left">Verify Employment & Income</h3>
              <p className="text-sm text-muted-foreground text-left">Connect your bank via a secure service.</p>
            </div>
          </div>
          {incomeState === 'verifying' ? <Loader2 className="w-6 h-6 text-primary animate-spin" /> : incomeState === 'verified' ? <CheckCircle className="w-6 h-6 text-green-500" /> : null}
        </button>
      </div>
      <p className="text-xs text-muted-foreground mt-4 max-w-md mx-auto">Your specific university, employer, and salary are never stored or shared.</p>
      <div className="mt-12 flex justify-between w-full">
        <Button variant="ghost" onClick={() => router.back()}>Back</Button>
        <Button onClick={() => router.push('/preferences')} disabled={!bothVerified}>Next</Button>
      </div>
    </div>
  );
};
