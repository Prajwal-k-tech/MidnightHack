'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Heart, Users, MessageCircle, Shield, Zap, Target } from 'lucide-react';
import { midnightContractService, UserProfile, MatchRequest, MatchResult } from '@/lib/services/midnightContractService';
import { toast } from 'sonner';

export function MainDashboard() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [pendingRequests, setPendingRequests] = useState<MatchRequest[]>([]);
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [targetUserId, setTargetUserId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // In a real app, we'd get the current user's ID from wallet/auth
      // For demo, we'll use a mock user ID
      const mockUserId = 'user_' + Date.now();
      
      const userProfile = await midnightContractService.getUserProfile(mockUserId);
      const requests = await midnightContractService.getPendingRequests(mockUserId);
      const userMatches = await midnightContractService.getUserMatches(mockUserId);
      
      setProfile(userProfile);
      setPendingRequests(requests);
      setMatches(userMatches);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    }
  };

  const handleRequestMatch = async () => {
    if (!targetUserId.trim()) {
      toast.error('Please enter a user ID');
      return;
    }

    setIsLoading(true);
    try {
      const mockUserId = profile?.userId || 'current_user';
      await midnightContractService.requestMatch(mockUserId, targetUserId);
      setTargetUserId('');
      await loadDashboardData(); // Refresh data
    } catch (error) {
      console.error('Match request failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveMatch = async (requesterUserId: string) => {
    setIsLoading(true);
    try {
      const mockUserId = profile?.userId || 'current_user';
      await midnightContractService.approveMatch(requesterUserId, mockUserId);
      await loadDashboardData(); // Refresh data
    } catch (error) {
      console.error('Match approval failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-purple-300 bg-clip-text text-transparent">
          Your Private Dating Dashboard
        </h1>
        <p className="text-slate-400">
          All matching happens with zero-knowledge privacy
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
          <CardContent className="p-6 text-center">
            <Heart className="w-8 h-8 mx-auto mb-2 text-red-400" />
            <div className="text-2xl font-bold text-white">{matches.length}</div>
            <div className="text-sm text-slate-400">Total Matches</div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
          <CardContent className="p-6 text-center">
            <Users className="w-8 h-8 mx-auto mb-2 text-blue-400" />
            <div className="text-2xl font-bold text-white">{pendingRequests.length}</div>
            <div className="text-sm text-slate-400">Pending Requests</div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
          <CardContent className="p-6 text-center">
            <Shield className="w-8 h-8 mx-auto mb-2 text-green-400" />
            <div className="text-2xl font-bold text-white">100%</div>
            <div className="text-sm text-slate-400">Privacy Protected</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Request Match */}
        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
          <CardHeader>
            <CardTitle className="text-violet-300 flex items-center gap-2">
              <Target className="w-5 h-5" />
              Request Private Match
            </CardTitle>
            <CardDescription className="text-slate-400">
              Send a private match request using zero-knowledge proofs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Input
                placeholder="Enter user ID to match with"
                value={targetUserId}
                onChange={(e) => setTargetUserId(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-slate-400"
              />
            </div>
            <Button 
              onClick={handleRequestMatch}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Zap className="w-4 h-4 mr-2" />
              Send Private Match Request
            </Button>
          </CardContent>
        </Card>

        {/* Pending Requests */}
        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
          <CardHeader>
            <CardTitle className="text-violet-300 flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Pending Requests
            </CardTitle>
            <CardDescription className="text-slate-400">
              Match requests waiting for your approval
            </CardDescription>
          </CardHeader>
          <CardContent>
            {pendingRequests.length === 0 ? (
              <p className="text-slate-400 text-center py-4">No pending requests</p>
            ) : (
              <div className="space-y-3">
                {pendingRequests.map((request, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div>
                      <div className="text-white font-medium">User {request.requester}</div>
                      <div className="text-xs text-slate-400">Wants to match privately</div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleApproveMatch(request.requester)}
                      disabled={isLoading}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Approve
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Matches */}
      <Card className="bg-white/5 backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-violet-300 flex items-center gap-2">
            <Heart className="w-5 h-5" />
            Your Private Matches
          </CardTitle>
          <CardDescription className="text-slate-400">
            All matches computed with zero-knowledge privacy
          </CardDescription>
        </CardHeader>
        <CardContent>
          {matches.length === 0 ? (
            <p className="text-slate-400 text-center py-8">No matches yet. Send some requests!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {matches.map((match, index) => (
                <div key={index} className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-white font-medium">
                      Match with User {match.user1 === profile?.userId ? match.user2 : match.user1}
                    </div>
                    <Badge variant={match.isMatch ? "default" : "secondary"}>
                      {match.compatibilityScore}% Compatible
                    </Badge>
                  </div>
                  <div className="text-sm text-slate-400 mb-2">
                    {match.isMatch ? '💚 It\'s a match!' : '💙 Keep looking'}
                  </div>
                  <div className="text-xs text-slate-500">
                    {match.timestamp.toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Privacy Information */}
      <Card className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-300/20">
        <CardHeader>
          <CardTitle className="text-violet-300 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Zero-Knowledge Privacy Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-emerald-300">
                <Shield className="w-4 h-4" />
                <span>Your personal data never leaves your device</span>
              </div>
              <div className="flex items-center gap-2 text-blue-300">
                <Zap className="w-4 h-4" />
                <span>Compatibility computed with ZK proofs</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-purple-300">
                <Target className="w-4 h-4" />
                <span>Only compatible users can connect</span>
              </div>
              <div className="flex items-center gap-2 text-violet-300">
                <Heart className="w-4 h-4" />
                <span>Private matching without revealing secrets</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}