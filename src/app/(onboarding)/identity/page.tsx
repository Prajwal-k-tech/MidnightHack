'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Camera, FileCheck, Loader2, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function IdentityPage() {
  const router = useRouter();
  const [selfieState, setSelfieState] = useState('idle');
  const [idState, setIdState] = useState('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSelfieClick = () => {
    if (selfieState !== 'idle') return;
    setSelfieState('capturing');
    setTimeout(() => { setSelfieState('captured'); }, 1500);
  };

  const handleIdClick = () => {
    if (idState !== 'idle') return;
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setIdState('uploading');
      setTimeout(() => { setIdState('uploaded'); }, 1500);
    }
  };

  const bothVerified = selfieState === 'captured' && idState === 'uploaded';

  return (
    <div className="w-full max-w-2xl text-center">
      <h1 className="text-4xl font-heading text-foreground mb-2">Proof of Personhood</h1>
      <p className="text-lg text-muted-foreground mb-8">First, let's verify your identity to prevent catfishing.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Selfie Button */}
        <button onClick={handleSelfieClick} disabled={selfieState !== 'idle'} className={cn("p-8 bg-muted/30 rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition-all duration-300", selfieState === 'idle' && "hover:border-primary hover:bg-primary/10", selfieState === 'captured' && "border-green-500 border-solid bg-green-500/10")}>
          {selfieState === 'capturing' ? <Loader2 className="w-16 h-16 text-primary animate-spin" /> : selfieState === 'captured' ? <CheckCircle className="w-16 h-16 text-green-500" /> : <Camera className="w-16 h-16 text-muted-foreground" />}
          <h3 className="font-semibold text-foreground mt-4">Take Selfie</h3>
          <p className="text-sm text-muted-foreground">For biometric analysis</p>
        </button>
        {/* ID Button */}
        <button onClick={handleIdClick} disabled={idState !== 'idle'} className={cn("p-8 bg-muted/30 rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition-all duration-300", idState === 'idle' && "hover:border-primary hover:bg-primary/10", idState === 'uploaded' && "border-green-500 border-solid bg-green-500/10")}>
          {idState === 'uploading' ? <Loader2 className="w-16 h-16 text-primary animate-spin" /> : idState === 'uploaded' ? <CheckCircle className="w-16 h-16 text-green-500" /> : <FileCheck className="w-11 h-11 text-muted-foreground" />}
          <h3 className="font-semibold text-foreground mt-4">Upload ID</h3>
          <p className="text-sm text-muted-foreground">For age verification</p>
        </button>
        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/png, image/jpeg, application/pdf" />
      </div>
      <p className="text-xs text-muted-foreground mt-4 max-w-md mx-auto">Your exact age and ID photo are never stored or shared.</p>
      <div className="mt-12 flex justify-between w-full">
        <Button variant="ghost" onClick={() => router.back()}>Back</Button>
        <Button onClick={() => router.push('/professional')} disabled={!bothVerified}>Next</Button>
      </div>
    </div>
  );
};
