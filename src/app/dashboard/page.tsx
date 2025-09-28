'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Heart, Users, Shield, Send, Clock, CheckCircle, MessageCircle, Star, Eye } from 'lucide-react';
import { DEMO_ACCOUNTS, getCompatibleMatches, generateMatchRequest, DEMO_STATS, type DemoAccount } from '@/lib/demoAccounts';
import { contractService } from '@/lib/CONTRACT_SERVICE';
import { matchService } from '@/lib/matchService';
import ProfileModal from '@/components/ui/ProfileModal';
import NotificationSystem, { Notification } from '@/components/ui/NotificationSystem';
import { toast } from 'sonner';

export default function DashboardPage() {
  const [compatibleMatches, setCompatibleMatches] = useState<DemoAccount[]>([]);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [matchRequestTarget, setMatchRequestTarget] = useState('');
  const [isRequestingMatch, setIsRequestingMatch] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<DemoAccount | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [stats, setStats] = useState({
    totalMatches: 0,
    pendingRequests: 0,
    privacyProtected: 100
  });

  useEffect(() => {
    // Load compatible matches on component mount
    const matches = getCompatibleMatches(28, "San Francisco, CA");
    setCompatibleMatches(matches);
    
    // Load notifications and pending matches
    const currentNotifications = matchService.getNotifications();
    const currentPendingMatches = matchService.getPendingMatches();
    setNotifications(currentNotifications);
    
    // Update stats
    setStats({
      totalMatches: matches.length,
      pendingRequests: currentPendingMatches.length,
      privacyProtected: 100
    });
  }, []);

  const handleSendMatchRequest = async (targetAddress: string, targetName: string) => {
    setIsRequestingMatch(true);
    try {
      console.log(`🌙 MIDNIGHT HACKATHON - Sending ZK match request to ${targetName}! 🏆`);
      
      // Show the real CONTRACT_SERVICE integration
      const result = await contractService.callFunction('requestMatch', [targetAddress]);
      await matchService.sendMatchRequest('midnig-5678', targetAddress);
      
      if (result.success) {
        const matchRequest = generateMatchRequest(targetAddress);
        setPendingRequests(prev => [...prev, matchRequest]);
        setStats(prev => ({ ...prev, pendingRequests: prev.pendingRequests + 1 }));
        setNotifications(matchService.getNotifications());
        
        toast.success(`💕 ZK match request sent to ${targetName}!`);
        console.log('✅ Transaction hash:', result.txHash);
        console.log('🔐 ZK proof generated:', result.zkProofGenerated);
      }
    } catch (error: any) {
      toast.error(`Failed to send match request: ${error.message}`);
    } finally {
      setIsRequestingMatch(false);
    }
  };

  const handleViewProfile = (profile: DemoAccount) => {
    setSelectedProfile(profile);
    setIsProfileModalOpen(true);
  };

  const handleApproveMatch = async (notificationId: string) => {
    try {
      const matchId = notificationId.replace('notif_', '');
      await matchService.approveMatch(matchId);
      setNotifications(matchService.getNotifications());
      
      const pendingMatches = matchService.getPendingMatches();
      setStats(prev => ({ ...prev, pendingRequests: pendingMatches.length }));
      toast.success('Match approved! 🎉');
    } catch (error) {
      console.error('Failed to approve match:', error);
      toast.error('Failed to approve match');
    }
  };

  const handleRejectMatch = async (notificationId: string) => {
    try {
      const matchId = notificationId.replace('notif_', '');
      await matchService.rejectMatch(matchId);
      setNotifications(matchService.getNotifications());
      
      const pendingMatches = matchService.getPendingMatches();
      setStats(prev => ({ ...prev, pendingRequests: pendingMatches.length }));
      toast.success('Match declined');
    } catch (error) {
      console.error('Failed to reject match:', error);
      toast.error('Failed to reject match');
    }
  };

  const handleMarkAsRead = (notificationId: string) => {
    matchService.markNotificationAsRead(notificationId);
    setNotifications(matchService.getNotifications());
  };

  const handleDismissNotification = (notificationId: string) => {
    matchService.dismissNotification(notificationId);
    setNotifications(matchService.getNotifications());
  };

  const handleManualMatchRequest = async () => {
    if (!matchRequestTarget.trim()) {
      toast.error('Please enter a wallet address');
      return;
    }

    setIsRequestingMatch(true);
    try {
      console.log(`🌙 MIDNIGHT HACKATHON - Manual ZK match request to ${matchRequestTarget}! 🏆`);
      
      const result = await contractService.callFunction('requestMatch', [matchRequestTarget]);
      await matchService.sendMatchRequest('midnig-5678', matchRequestTarget);
      
      if (result.success) {
        const matchRequest = {
          id: `match_${Date.now()}`,
          targetAddress: matchRequestTarget,
          targetName: 'Unknown User',
          compatibilityScore: 0,
          status: 'pending',
          timestamp: new Date().toISOString(),
          zkProofGenerated: true
        };
        
        setPendingRequests(prev => [...prev, matchRequest]);
        setStats(prev => ({ ...prev, pendingRequests: prev.pendingRequests + 1 }));
        setNotifications(matchService.getNotifications());
        setMatchRequestTarget('');
        
        toast.success(`💕 ZK match request sent!`);
        console.log('✅ Transaction hash:', result.txHash);
        console.log('🔐 ZK proof generated:', result.zkProofGenerated);
      }
    } catch (error: any) {
      toast.error(`Failed to send match request: ${error.message}`);
    } finally {
      setIsRequestingMatch(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-purple-500/20">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Your Private Dating Dashboard</h1>
              <p className="text-purple-200 mt-1">All matching happens with zero-knowledge privacy</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-purple-300">🌙 Midnight Network</div>
                <div className="text-xs text-green-400">● Connected</div>
              </div>
              <Badge variant="outline" className="bg-purple-600/20 text-purple-200 border-purple-500/30">
                midnig-5678
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-black/20 backdrop-blur-sm border-purple-500/20">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Heart className="h-8 w-8 text-pink-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stats.totalMatches}</div>
                <div className="text-purple-200 text-sm">Total Matches</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-black/20 backdrop-blur-sm border-purple-500/20">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Users className="h-8 w-8 text-blue-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stats.pendingRequests}</div>
                <div className="text-purple-200 text-sm">Pending Requests</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-black/20 backdrop-blur-sm border-purple-500/20">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Shield className="h-8 w-8 text-green-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stats.privacyProtected}%</div>
                <div className="text-purple-200 text-sm">Privacy Protected</div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Compatible Matches */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-black/20 backdrop-blur-sm border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Heart className="h-5 w-5 text-pink-400" />
                  Compatible Matches
                </CardTitle>
                <CardDescription className="text-purple-200">
                  Matches that meet your requirements with ZK compatibility proofs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {compatibleMatches.map((match, index) => (
                    <motion.div
                      key={match.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-black/30 rounded-lg p-4 border border-purple-500/20"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="text-4xl">{match.profileImage}</div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-white font-semibold">{match.displayName}</h3>
                              <Badge variant="outline" className="text-xs">
                                {match.age} years
                              </Badge>
                              <Badge 
                                variant={match.verificationLevel === 'premium' ? 'default' : 'secondary'}
                                className="text-xs"
                              >
                                {match.verificationLevel}
                              </Badge>
                            </div>
                            <p className="text-purple-200 text-sm mb-2">{match.location}</p>
                            <p className="text-gray-300 text-sm mb-3 line-clamp-2">{match.bio}</p>
                            <div className="flex flex-wrap gap-1 mb-3">
                              {match.interests.map((interest) => (
                                <Badge key={interest} variant="outline" className="text-xs">
                                  {interest}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex items-center gap-4 text-xs text-purple-300">
                              <span>🔗 {match.walletAddress.substring(0, 20)}...</span>
                              <span>• Last seen {match.lastSeen}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 mb-2">
                            <Star className="h-4 w-4 text-yellow-400" />
                            <span className="text-white font-semibold">{match.compatibilityScore}%</span>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Button
                              onClick={() => handleViewProfile(match)}
                              variant="outline"
                              className="border-purple-500/30 text-purple-200 hover:bg-purple-600/20"
                              size="sm"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View Profile
                            </Button>
                            <Button
                              onClick={() => handleSendMatchRequest(match.walletAddress, match.displayName)}
                              disabled={isRequestingMatch}
                              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                              size="sm"
                            >
                              <Send className="h-4 w-4 mr-1" />
                              Send ZK Request
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Manual Match Request */}
            <Card className="bg-black/20 backdrop-blur-sm border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Send className="h-5 w-5 text-purple-400" />
                  Request Private Match
                </CardTitle>
                <CardDescription className="text-purple-200">
                  Send a private match request using zero-knowledge proofs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Input
                    placeholder="Enter wallet address to match with"
                    value={matchRequestTarget}
                    onChange={(e) => setMatchRequestTarget(e.target.value)}
                    className="bg-black/50 border-purple-500/30 text-white"
                  />
                </div>
                <Button 
                  onClick={handleManualMatchRequest}
                  disabled={isRequestingMatch}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  {isRequestingMatch ? (
                    <>Generating ZK Proof...</>
                  ) : (
                    <>Send Private Match Request</>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Pending Requests */}
            <Card className="bg-black/20 backdrop-blur-sm border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-400" />
                  Pending Requests
                </CardTitle>
                <CardDescription className="text-purple-200">
                  Match requests waiting for approval
                </CardDescription>
              </CardHeader>
              <CardContent>
                {pendingRequests.length === 0 ? (
                  <p className="text-purple-300 text-sm text-center py-4">No pending requests</p>
                ) : (
                  <div className="space-y-3">
                    {pendingRequests.map((request) => (
                      <div key={request.id} className="bg-black/30 rounded-lg p-3 border border-purple-500/20">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white font-medium">{request.targetName}</span>
                          <Badge variant="secondary" className="text-xs">Pending</Badge>
                        </div>
                        <div className="text-xs text-purple-300">
                          🔗 {request.targetAddress.substring(0, 16)}...
                        </div>
                        <div className="text-xs text-green-400 mt-1">
                          ✅ ZK Proof Generated
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Privacy Stats */}
            <Card className="bg-black/20 backdrop-blur-sm border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-400" />
                  Your Private Matches
                </CardTitle>
                <CardDescription className="text-purple-200">
                  All matches computed with zero-knowledge privacy
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <p className="text-purple-300 text-sm">No matches yet. Send some requests!</p>
                  <div className="mt-4 text-xs text-purple-400">
                    🔒 When matches are approved, private data is exchanged securely
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      <ProfileModal
        profile={selectedProfile}
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onSendRequest={async (profile) => {
          await handleSendMatchRequest(profile.walletAddress, profile.displayName);
        }}
        compatibility={selectedProfile ? 
          compatibleMatches.findIndex(m => m.id === selectedProfile.id) >= 0 ? 
            [94, 91, 89, 87, 85, 82][compatibleMatches.findIndex(m => m.id === selectedProfile.id)] || 85 
            : 85 
          : 85}
      />

      {/* Notification System */}
      <NotificationSystem
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
        onDismiss={handleDismissNotification}
        onApproveMatch={handleApproveMatch}
        onRejectMatch={handleRejectMatch}
      />
    </div>
  );
}