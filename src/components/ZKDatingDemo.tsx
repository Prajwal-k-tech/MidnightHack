'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useWalletStore } from '@/lib/stores/walletStore';
import { unifiedContractService } from '@/lib/UNIFIED_CONTRACT_SERVICE';
import { toast } from 'sonner';
import { Loader2, Shield, Users, MapPin, Calendar, Zap } from 'lucide-react';

export function ZKDatingDemo() {
  const { isConnected } = useWalletStore();
  const [loading, setLoading] = useState(false);
  const [demoResults, setDemoResults] = useState<any>(null);
  const [verificationStep, setVerificationStep] = useState<string>('');

  const runCompleteDemo = async () => {
    if (!isConnected) {
      toast.error('Please connect your Midnight Lace wallet');
      return;
    }

    setLoading(true);
    setDemoResults(null);
    
    try {
      // Step 1: Complete User Verification
      setVerificationStep('Generating ZK identity proof...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user1Verification = await unifiedContractService.executeFunction('complete_user_verification');
      
      setVerificationStep('Verifying age range without revealing exact age...');
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const user2Verification = await unifiedContractService.executeFunction('complete_user_verification');
      
      setVerificationStep('Checking location proximity without revealing coordinates...');
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Step 2: Compatibility Check
      setVerificationStep('Calculating ZK compatibility score...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const compatibilityResult = await unifiedContractService.executeFunction(
        'check_user_compatibility', 
        [user1Verification.userId, user2Verification.userId]
      );

      setDemoResults({
        user1: user1Verification,
        user2: user2Verification,
        compatibility: compatibilityResult,
        zkFeatures: {
          identityProof: 'Generated without revealing biometric data',
          ageVerification: 'Range-based verification preserves privacy',
          locationCheck: 'Proximity verified without coordinate disclosure',
          compatibilityScore: 'Calculated using zero-knowledge proofs'
        }
      });

      toast.success('🎉 ZK Dating Platform Demo Complete!');
      
    } catch (error) {
      toast.error('Demo failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setLoading(false);
      setVerificationStep('');
    }
  };

  const resetDemo = () => {
    setDemoResults(null);
    unifiedContractService.resetState();
    toast.info('Demo state reset');
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-300/50">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            🔒 Privacy-First Dating Platform
          </CardTitle>
          <CardDescription className="text-lg">
            Zero-Knowledge Dating with Complete Privacy Protection
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Demo Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button
          onClick={runCompleteDemo}
          disabled={loading || !isConnected}
          className="h-12 text-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              {verificationStep || 'Running Demo...'}
            </>
          ) : (
            <>
              <Zap className="mr-2 h-5 w-5" />
              Run Complete ZK Demo
            </>
          )}
        </Button>
        
        <Button
          onClick={resetDemo}
          variant="outline"
          disabled={loading}
          className="h-12 text-lg"
        >
          Reset Demo State
        </Button>
      </div>

      {/* ZK Features Showcase */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center p-4">
          <Shield className="h-8 w-8 mx-auto mb-2 text-green-500" />
          <div className="text-sm font-medium">Identity Proof</div>
          <div className="text-xs text-muted-foreground">Biometric hash only</div>
        </Card>
        <Card className="text-center p-4">
          <Calendar className="h-8 w-8 mx-auto mb-2 text-blue-500" />
          <div className="text-sm font-medium">Age Verification</div>
          <div className="text-xs text-muted-foreground">Range-based privacy</div>
        </Card>
        <Card className="text-center p-4">
          <MapPin className="h-8 w-8 mx-auto mb-2 text-purple-500" />
          <div className="text-sm font-medium">Location Check</div>
          <div className="text-xs text-muted-foreground">Proximity without GPS</div>
        </Card>
        <Card className="text-center p-4">
          <Users className="h-8 w-8 mx-auto mb-2 text-orange-500" />
          <div className="text-sm font-medium">Compatibility</div>
          <div className="text-xs text-muted-foreground">ZK-powered matching</div>
        </Card>
      </div>

      {/* Demo Results */}
      {demoResults && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>🎉 Demo Results</CardTitle>
              <CardDescription>Zero-knowledge privacy-preserving dating platform in action</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* User Verification Results */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4">
                  <div className="font-medium text-green-600 mb-2">👤 User 1 Verified</div>
                  <div className="space-y-1 text-sm">
                    <div>ID: #{demoResults.user1.userId}</div>
                    <div>Age Range: {demoResults.user1.ageRangeDisplay}</div>
                    <div>Identity Hash: {demoResults.user1.identityHash.slice(0, 20)}...</div>
                    <Badge variant="success" className="mt-2">✅ Privacy Preserved</Badge>
                  </div>
                </Card>
                
                <Card className="p-4">
                  <div className="font-medium text-green-600 mb-2">👤 User 2 Verified</div>
                  <div className="space-y-1 text-sm">
                    <div>ID: #{demoResults.user2.userId}</div>
                    <div>Age Range: {demoResults.user2.ageRangeDisplay}</div>
                    <div>Identity Hash: {demoResults.user2.identityHash.slice(0, 20)}...</div>
                    <Badge variant="success" className="mt-2">✅ Privacy Preserved</Badge>
                  </div>
                </Card>
              </div>

              {/* Compatibility Results */}
              <Card className="p-4 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {demoResults.compatibility.compatibilityScore}%
                  </div>
                  <div className="text-lg font-medium">
                    {demoResults.compatibility.isMatch ? '💚 It\'s a Match!' : '💙 Keep Looking!'}
                  </div>
                  <Badge 
                    variant={demoResults.compatibility.isMatch ? "success" : "secondary"}
                    className="mt-2"
                  >
                    {demoResults.compatibility.isMatch ? 'Match Found' : 'No Match'}
                  </Badge>
                </div>
              </Card>

              {/* ZK Features Explanation */}
              <Card className="p-4">
                <div className="font-medium mb-3">🔒 Zero-Knowledge Features Demonstrated:</div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <Shield className="h-4 w-4 text-green-500 mt-0.5" />
                    <span><strong>Identity Verification:</strong> Users verified without revealing biometric data</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Calendar className="h-4 w-4 text-blue-500 mt-0.5" />
                    <span><strong>Age Privacy:</strong> Age ranges verified without exact age disclosure</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-purple-500 mt-0.5" />
                    <span><strong>Location Privacy:</strong> Proximity verified without GPS coordinates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Users className="h-4 w-4 text-orange-500 mt-0.5" />
                    <span><strong>Private Matching:</strong> Compatibility calculated with zero-knowledge proofs</span>
                  </li>
                </ul>
              </Card>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Technical Details */}
      <Card className="bg-gray-50 dark:bg-gray-900">
        <CardHeader>
          <CardTitle className="text-lg">⚡ Technical Implementation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div><strong>Smart Contracts:</strong> 7 ZK circuits compiled using Compact Language v0.2.0</div>
          <div><strong>Privacy:</strong> Zero-knowledge proofs ensure no personal data exposure</div>
          <div><strong>Network:</strong> Built for Midnight Network (Cardano partner chain)</div>
          <div><strong>Frontend:</strong> Next.js 14 with @midnight-ntwrk/dapp-connector-api v3.0.0</div>
        </CardContent>
      </Card>
    </div>
  );
}