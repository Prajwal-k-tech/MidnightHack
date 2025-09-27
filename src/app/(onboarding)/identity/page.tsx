'use client';

import React, { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Camera, FileCheck, Loader2, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useWalletStore } from '@/lib/stores/walletStore';

export default function IdentityPage() {
  const router = useRouter();
  const { verificationState, setVerificationStatus } = useWalletStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSelfieClick = () => {
    if (verificationState?.selfie !== 'idle') return;
    setVerificationStatus('selfie', 'capturing');
    setTimeout(() => { setVerificationStatus('selfie', 'captured'); }, 1500);
  };

  const handleIdClick = () => {
    if (verificationState?.id !== 'idle') return;
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setVerificationStatus('id', 'uploading');
      setTimeout(() => { setVerificationStatus('id', 'uploaded'); }, 1500);
    }
  };

  const bothVerified = verificationState?.selfie === 'captured' && verificationState?.id === 'uploaded';

  return (
    <div className="w-full max-w-2xl text-center">
      <h1 className="text-4xl font-heading text-foreground mb-2">Proof of Personhood</h1>
      <p className="text-lg text-muted-foreground mb-8">First, let's verify your identity to prevent catfishing.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <button onClick={handleSelfieClick} disabled={verificationState?.selfie !== 'idle'} className={cn("p-8 bg-muted/30 rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition-all duration-300", verificationState?.selfie === 'idle' && "hover:border-primary hover:bg-primary/10", verificationState?.selfie === 'captured' && "border-green-500 border-solid bg-green-500/10")}>
          {verificationState?.selfie === 'capturing' ? (
            <Loader2 className="w-16 h-16 text-primary animate-spin" />
          ) : verificationState?.selfie === 'captured' ? (
            <CheckCircle className="w-16 h-16 text-green-500" />
          ) : (
            <Camera className="w-16 h-16 text-muted-foreground" />
          )}
          <h3 className="font-semibold text-foreground mt-4">Take Selfie</h3>
          <p className="text-sm text-muted-foreground">For biometric analysis</p>
        </button>
        <button onClick={handleIdClick} disabled={verificationState?.id !== 'idle'} className={cn("p-8 bg-muted/30 rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition-all duration-300", verificationState?.id === 'idle' && "hover:border-primary hover:bg-primary/10", verificationState?.id === 'uploaded' && "border-green-500 border-solid bg-green-500/10")}>
          {verificationState?.id === 'uploading' ? (
            <Loader2 className="w-16 h-16 text-primary animate-spin" />
          ) : verificationState?.id === 'uploaded' ? (
            <CheckCircle className="w-16 h-16 text-green-500" />
          ) : (
            <FileCheck className="w-11 h-11 text-muted-foreground" />
          )}
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
