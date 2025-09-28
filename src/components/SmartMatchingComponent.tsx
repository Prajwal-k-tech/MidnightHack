'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { contractService } from '@/lib/CONTRACT_SERVICE';
import { motion } from 'framer-motion';
import { 
  Heart, 
  MapPin, 
  Shield, 
  Users, 
  Zap, 
  Eye, 
  Lock,
  Loader2,
  CheckCircle,
  AlertCircle,
  Camera
} from 'lucide-react';
import { toast } from 'sonner';

interface MatchResult {
  compatible: boolean;
  proximityMatch: boolean;
  verificationMatch: boolean;
  overallScore: number;
}

export default function SmartMatchingComponent() {
  const [targetAddress, setTargetAddress] = useState('');
  const [isMatching, setIsMatching] = useState(false);
  const [nearbyUsers, setNearbyUsers] = useState<string[]>([]);
  const [matchResults, setMatchResults] = useState<Record<string, MatchResult>>({});
  const [currentUser] = useState(`user_${Date.now()}`);
  const [analytics, setAnalytics] = useState({
    totalRequests: 0,
    verificationStatus: {
      identity: false,
      location: false,
      biometric: false
    },
    privacyScore: 0
  });

  // Load analytics on mount
  useEffect(() => {
    const analytics = contractService.getMatchAnalytics(currentUser);
    setAnalytics(analytics);
  }, [currentUser]);

  // 🔍 FIND NEARBY MATCHES
  const findNearbyMatches = async () => {
    setIsMatching(true);
    try {
      console.log('🔍 Searching for nearby matches...');
      const matches = await contractService.findNearbyMatches(currentUser, 50);
      setNearbyUsers(matches);
      
      if (matches.length > 0) {
        toast.success(`📍 Found ${matches.length} nearby potential matches!`);
      } else {
        toast.info('🤷‍♂️ No nearby matches found. Try expanding your search radius!');
      }
    } catch (error: any) {
      toast.error(`Search failed: ${error.message}`);
    } finally {
      setIsMatching(false);
    }
  };

  // 💕 REQUEST MATCH WITH SPECIFIC USER
  const requestMatch = async (targetId: string) => {
    setIsMatching(true);
    try {
      console.log(`💕 Requesting match with ${targetId}...`);
      
      const result = await contractService.requestPrivateMatch(currentUser, targetId);
      
      if (result.success && result.matchResult) {
        setMatchResults(prev => ({
          ...prev,
          [targetId]: result.matchResult!
        }));
        
        const { matchResult } = result;
        
        if (matchResult.compatible) {
          toast.success(`💕 Match found! Compatibility: ${matchResult.overallScore}%`);
        } else {
          toast.info('💔 No match this time - but your privacy was preserved!');
        }
      }
    } catch (error: any) {
      toast.error(`Match request failed: ${error.message}`);
    } finally {
      setIsMatching(false);
    }
  };

  // 🎯 REQUEST MATCH BY ADDRESS
  const handleDirectMatch = async () => {
    if (!targetAddress.trim()) {
      toast.error('Please enter a wallet address');
      return;
    }
    
    await requestMatch(targetAddress);
  };

  return (
    <div className="space-y-6 p-6">
      
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          🔐 Smart ZK Matching
        </h1>
        <p className="text-gray-600">
          Privacy-preserving compatibility matching with zero-knowledge proofs
        </p>
      </div>

      {/* Privacy Analytics Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Your Privacy Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{analytics.totalRequests}</div>
              <div className="text-sm text-gray-600">Match Requests</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{analytics.privacyScore}%</div>
              <div className="text-sm text-gray-600">Privacy Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {Object.values(analytics.verificationStatus).filter(Boolean).length}
              </div>
              <div className="text-sm text-gray-600">Verifications</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">100%</div>
              <div className="text-sm text-gray-600">Privacy Protected</div>
            </div>
          </div>
          
          {/* Verification Status */}
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">Verification Status:</h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(analytics.verificationStatus).map(([key, verified]) => (
                <Badge 
                  key={key} 
                  variant={verified ? "default" : "outline"}
                  className="flex items-center gap-1"
                >
                  {verified ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                  {key === 'identity' && '🆔 Identity'}
                  {key === 'location' && '📍 Location'}
                  {key === 'biometric' && '📸 Biometric'}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Direct Match Request */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5" />
            Request Private Match
          </CardTitle>
          <CardDescription>
            Enter a wallet address to check compatibility privately
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter wallet address (0x...)"
              value={targetAddress}
              onChange={(e) => setTargetAddress(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={handleDirectMatch}
              disabled={isMatching || !targetAddress.trim()}
            >
              {isMatching ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Heart className="w-4 h-4" />
              )}
            </Button>
          </div>
          
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-start gap-2">
              <Lock className="w-4 h-4 text-blue-600 mt-0.5" />
              <div className="text-sm">
                <strong className="text-blue-900">Zero-Knowledge Matching:</strong>
                <p className="text-blue-700">
                  The matching process reveals only compatibility results, never your personal data.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Proximity-Based Matching */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Find Nearby Matches
          </CardTitle>
          <CardDescription>
            Discover compatible users in your area (location privacy preserved)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={findNearbyMatches}
            disabled={isMatching}
            className="w-full"
          >
            {isMatching ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Searching nearby...
              </>
            ) : (
              <>
                <MapPin className="w-4 h-4 mr-2" />
                Find Nearby Matches
              </>
            )}
          </Button>

          {nearbyUsers.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold">Potential Matches Found:</h4>
              {nearbyUsers.map((userId) => (
                <motion.div
                  key={userId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-600" />
                    <span className="font-mono text-sm">{userId}</span>
                    {matchResults[userId] && (
                      <Badge 
                        variant={matchResults[userId].compatible ? "default" : "outline"}
                      >
                        {matchResults[userId].compatible ? '💕 Match' : '💔 No Match'}
                      </Badge>
                    )}
                  </div>
                  <Button
                    size="sm"
                    onClick={() => requestMatch(userId)}
                    disabled={isMatching}
                    variant={matchResults[userId]?.compatible ? "default" : "outline"}
                  >
                    {matchResults[userId] ? 'Checked' : 'Check Match'}
                  </Button>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Match Results */}
      {Object.keys(matchResults).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Match Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(matchResults).map(([userId, result]) => (
                <motion.div
                  key={userId}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`p-4 rounded-lg border-2 ${
                    result.compatible 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-sm">{userId}</span>
                    <Badge 
                      variant={result.compatible ? "default" : "outline"}
                      className="text-lg px-3 py-1"
                    >
                      {result.overallScore}% Compatible
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="text-center">
                      <div className={`font-semibold ${result.proximityMatch ? 'text-green-600' : 'text-gray-500'}`}>
                        {result.proximityMatch ? '✅' : '❌'}
                      </div>
                      <div className="text-xs">Location</div>
                    </div>
                    <div className="text-center">
                      <div className={`font-semibold ${result.verificationMatch ? 'text-green-600' : 'text-gray-500'}`}>
                        {result.verificationMatch ? '✅' : '❌'}
                      </div>
                      <div className="text-xs">Verified</div>
                    </div>
                    <div className="text-center">
                      <div className={`font-semibold ${result.compatible ? 'text-green-600' : 'text-gray-500'}`}>
                        {result.compatible ? '💕' : '💔'}
                      </div>
                      <div className="text-xs">Match</div>
                    </div>
                  </div>
                  
                  <div className="mt-2 text-xs text-gray-600">
                    <Eye className="w-3 h-3 inline mr-1" />
                    Privacy preserved: No personal data revealed
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Innovation Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            Advanced Features
          </CardTitle>
          <CardDescription>
            Cutting-edge zero-knowledge features for enhanced matching
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-purple-50 rounded-lg">
              <h4 className="font-semibold text-purple-900 mb-1">📸 Biometric Verification</h4>
              <p className="text-sm text-purple-700">
                Verify profile authenticity with privacy-preserving biometric proofs
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-1">📍 Location Privacy</h4>
              <p className="text-sm text-blue-700">
                Prove proximity without revealing exact coordinates
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-1">🔐 ZK Compatibility</h4>
              <p className="text-sm text-green-700">
                Multi-factor compatibility scoring with zero data leakage
              </p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <h4 className="font-semibold text-orange-900 mb-1">⚡ Real-time Matching</h4>
              <p className="text-sm text-orange-700">
                Instant privacy-preserving compatibility calculations
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}