'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { useDatingPlatform } from '@/lib/stores/datingPlatformStore';
import { Shield, CheckCircle, Clock, AlertCircle, Heart, Zap } from 'lucide-react';

export default function DemoPage() {
  const {
    currentUserId,
    verificationStatus,
    isConnected,
    isVerifying,
    verificationLogs,
    setUserId,
    createProfile,
    verifyAge,
    verifyLocation,
    verifyIncome,
    createMatch,
    clearLogs
  } = useDatingPlatform();

  const [demoUserId, setDemoUserId] = useState('1');
  const [ageRange, setAgeRange] = useState({ min: '18', max: '35' });
  const [locationParams, setLocationParams] = useState({ lat: '40.7128', lng: '-74.0060', distance: '5' });
  const [incomeRange, setIncomeRange] = useState({ min: '50000', max: '100000' });
  const [matchUserId, setMatchUserId] = useState('2');

  const handleConnect = async () => {
    const userId = parseInt(demoUserId);
    setUserId(userId);
    
    // Auto-create profile for demo
    await createProfile({
      name: `Demo User ${userId}`,
      bio: 'Privacy-first dating platform demo user',
      preferences: {}
    });
  };

  const handleVerifyAge = async () => {
    await verifyAge(parseInt(ageRange.min), parseInt(ageRange.max));
  };

  const handleVerifyLocation = async () => {
    await verifyLocation(
      parseFloat(locationParams.lat),
      parseFloat(locationParams.lng),
      parseFloat(locationParams.distance)
    );
  };

  const handleVerifyIncome = async () => {
    await verifyIncome(parseInt(incomeRange.min), parseInt(incomeRange.max));
  };

  const handleCreateMatch = async () => {
    await createMatch(parseInt(matchUserId));
  };

  const getVerificationIcon = (verified: boolean | undefined) => {
    if (verified === undefined) return <Clock className="w-4 h-4 text-gray-400" />;
    return verified ? 
      <CheckCircle className="w-4 h-4 text-green-500" /> : 
      <AlertCircle className="w-4 h-4 text-red-500" />;
  };

  const getVerificationBadge = (verified: boolean | undefined, label: string) => {
    if (verified === undefined) return <Badge variant="secondary">{label}: Pending</Badge>;
    return (
      <Badge variant={verified ? "default" : "destructive"}>
        {label}: {verified ? 'Verified' : 'Failed'}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Shield className="w-8 h-8 text-purple-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Midnight Dating Platform
            </h1>
            <Zap className="w-8 h-8 text-pink-600" />
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Privacy-First Dating with Zero-Knowledge Proofs
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <span>🔐 Your data stays private</span>
            <span>•</span>
            <span>🛡️ ZK proofs verify without revealing</span>
            <span>•</span>
            <span>💕 Compatible matches only</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Controls */}
          <div className="space-y-6">
            {/* Connection Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Demo Connection
                </CardTitle>
                <CardDescription>
                  Connect as a demo user to test ZK verification
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!isConnected ? (
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="userId">Demo User ID</Label>
                      <Input
                        id="userId"
                        value={demoUserId}
                        onChange={(e) => setDemoUserId(e.target.value)}
                        placeholder="Enter user ID (1-10)"
                      />
                    </div>
                    <Button onClick={handleConnect} className="w-full">
                      Connect & Create Profile
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span>Connected as User {currentUserId}</span>
                    </div>
                    <div className="flex gap-2">
                      {verificationStatus && (
                        <>
                          {getVerificationBadge(verificationStatus.ageVerified, 'Age')}
                          {getVerificationBadge(verificationStatus.locationVerified, 'Location')}
                          {getVerificationBadge(verificationStatus.incomeVerified, 'Income')}
                        </>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Verification Controls */}
            {isConnected && (
              <>
                {/* Age Verification */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {getVerificationIcon(verificationStatus?.ageVerified)}
                      Age Verification
                    </CardTitle>
                    <CardDescription>
                      Prove your age is within range without revealing exact age
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="minAge">Min Age</Label>
                        <Input
                          id="minAge"
                          value={ageRange.min}
                          onChange={(e) => setAgeRange(prev => ({ ...prev, min: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="maxAge">Max Age</Label>
                        <Input
                          id="maxAge"
                          value={ageRange.max}
                          onChange={(e) => setAgeRange(prev => ({ ...prev, max: e.target.value }))}
                        />
                      </div>
                    </div>
                    <Button 
                      onClick={handleVerifyAge} 
                      disabled={isVerifying}
                      className="w-full"
                    >
                      {isVerifying ? <Spinner className="w-4 h-4 mr-2" /> : null}
                      Verify Age Range
                    </Button>
                  </CardContent>
                </Card>

                {/* Location Verification */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {getVerificationIcon(verificationStatus?.locationVerified)}
                      Location Verification
                    </CardTitle>
                    <CardDescription>
                      Prove proximity without revealing exact location
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="lat">Latitude</Label>
                        <Input
                          id="lat"
                          value={locationParams.lat}
                          onChange={(e) => setLocationParams(prev => ({ ...prev, lat: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="lng">Longitude</Label>
                        <Input
                          id="lng"
                          value={locationParams.lng}
                          onChange={(e) => setLocationParams(prev => ({ ...prev, lng: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="distance">Max Distance</Label>
                      <Input
                        id="distance"
                        value={locationParams.distance}
                        onChange={(e) => setLocationParams(prev => ({ ...prev, distance: e.target.value }))}
                        placeholder="Distance units"
                      />
                    </div>
                    <Button 
                      onClick={handleVerifyLocation} 
                      disabled={isVerifying}
                      className="w-full"
                    >
                      {isVerifying ? <Spinner className="w-4 h-4 mr-2" /> : null}
                      Verify Location Proximity
                    </Button>
                  </CardContent>
                </Card>

                {/* Income Verification */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {getVerificationIcon(verificationStatus?.incomeVerified)}
                      Income Verification
                    </CardTitle>
                    <CardDescription>
                      Prove income bracket without revealing exact amount
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="minIncome">Min Income ($)</Label>
                        <Input
                          id="minIncome"
                          value={incomeRange.min}
                          onChange={(e) => setIncomeRange(prev => ({ ...prev, min: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="maxIncome">Max Income ($)</Label>
                        <Input
                          id="maxIncome"
                          value={incomeRange.max}
                          onChange={(e) => setIncomeRange(prev => ({ ...prev, max: e.target.value }))}
                        />
                      </div>
                    </div>
                    <Button 
                      onClick={handleVerifyIncome} 
                      disabled={isVerifying}
                      className="w-full"
                    >
                      {isVerifying ? <Spinner className="w-4 h-4 mr-2" /> : null}
                      Verify Income Bracket
                    </Button>
                  </CardContent>
                </Card>

                {/* Matching */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="w-5 h-5 text-pink-500" />
                      Create Verified Match
                    </CardTitle>
                    <CardDescription>
                      Create a match based on verified attributes
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="matchUserId">Match with User ID</Label>
                      <Input
                        id="matchUserId"
                        value={matchUserId}
                        onChange={(e) => setMatchUserId(e.target.value)}
                        placeholder="Enter other user ID"
                      />
                    </div>
                    <Button 
                      onClick={handleCreateMatch} 
                      disabled={isVerifying}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      {isVerifying ? <Spinner className="w-4 h-4 mr-2" /> : null}
                      Create Verified Match
                    </Button>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          {/* Right Column - Live Demo Output */}
          <div className="space-y-6">
            {/* Live Verification Logs */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Live ZK Verification
                  </CardTitle>
                  <CardDescription>
                    Watch zero-knowledge proofs in action
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={clearLogs}>
                  Clear Logs
                </Button>
              </CardHeader>
              <CardContent>
                <div className="h-96 overflow-y-auto bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                  {verificationLogs.length === 0 ? (
                    <div className="text-gray-500 text-center py-8">
                      Connect and start verifying to see live ZK proof generation...
                    </div>
                  ) : (
                    verificationLogs.map((log, index) => (
                      <div key={index} className="mb-1 break-words">
                        {log}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Privacy Explanation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-500" />
                  Privacy Guarantees
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">Age Privacy</h4>
                      <p className="text-sm text-gray-600">Only verification result goes on-chain, not your actual age</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">Location Privacy</h4>
                      <p className="text-sm text-gray-600">Proves proximity without revealing exact coordinates</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">Income Privacy</h4>
                      <p className="text-sm text-gray-600">Proves bracket membership without exposing salary</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">Identity Privacy</h4>
                      <p className="text-sm text-gray-600">Sybil resistance without storing government IDs</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Technology Stack */}
            <Card>
              <CardHeader>
                <CardTitle>Technology Stack</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-medium mb-2">Blockchain</h4>
                    <ul className="space-y-1 text-gray-600">
                      <li>• Midnight Network</li>
                      <li>• Cardano Partner Chain</li>
                      <li>• zk-SNARKs</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Smart Contracts</h4>
                    <ul className="space-y-1 text-gray-600">
                      <li>• Compact Language</li>
                      <li>• TypeScript-based</li>
                      <li>• 7 ZK Circuits</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Frontend</h4>
                    <ul className="space-y-1 text-gray-600">
                      <li>• Next.js 14</li>
                      <li>• Tailwind CSS</li>
                      <li>• Zustand State</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Privacy</h4>
                    <ul className="space-y-1 text-gray-600">
                      <li>• Zero-Knowledge Proofs</li>
                      <li>• Selective Disclosure</li>
                      <li>• Private Witnesses</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}