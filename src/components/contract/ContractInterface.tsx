'use client'

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useWalletStore } from '@/lib/stores/walletStore';
import { contractService } from '@/lib/CONTRACT_SERVICE';
import { CONTRACT_CONFIG, UserStatus } from '@/lib/CONTRACT_CONFIG';
import { toast } from 'sonner';
import { Loader2, UserPlus, Settings, UserX } from 'lucide-react';

export function ContractInterface() {
  const { isConnected, walletState } = useWalletStore();
  const [contractState, setContractState] = useState(contractService.getState());
  const [loading, setLoading] = useState(false);
  const [userIdInput, setUserIdInput] = useState('');
  const [profileCommitmentInput, setProfileCommitmentInput] = useState('');
  const [preferenceCommitmentInput, setPreferenceCommitmentInput] = useState('');

  const executeFunction = async (functionName: string, params: any[]) => {
    if (!isConnected) {
      toast.error('Please connect your Midnight Lace wallet');
      return;
    }
    setLoading(true);
    try {
      const result = await contractService.callFunction(functionName, params);
      if (result.success) {
        toast.success(result.message || `${functionName} executed successfully!`);
        setContractState(contractService.getState());
        // Clear inputs after successful execution
        setUserIdInput('');
        setProfileCommitmentInput('');
        setPreferenceCommitmentInput('');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Contract execution failed');
    } finally {
      setLoading(false);
    }
  };

  const getUserStatusBadge = (status: UserStatus) => {
    switch (status) {
      case UserStatus.Active:
        return <Badge variant="success">Active</Badge>;
      case UserStatus.Suspended:
        return <Badge variant="warning">Suspended</Badge>;
      case UserStatus.Banned:
        return <Badge variant="destructive">Banned</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-gradient-to-br from-midnight-blue to-midnight-black text-midnight-white shadow-lg rounded-xl">
      <CardHeader className="border-b border-midnight-white/20 pb-4">
        <CardTitle className="text-3xl font-bold text-center text-midnight-white">
          {CONTRACT_CONFIG.name}
        </CardTitle>
        <CardDescription className="text-center text-midnight-white/80 mt-2">
          Privacy-First Dating Platform powered by Midnight
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col items-center justify-center bg-midnight-black/30 p-4 rounded-lg border border-midnight-white/10">
            <span className="text-sm text-midnight-white/70">Total Users</span>
            <Badge variant="default" className="mt-2 text-lg px-4 py-2 bg-midnight-blue/70 text-midnight-white">
              {contractState.totalUsers}
            </Badge>
          </div>
          <div className="flex flex-col items-center justify-center bg-midnight-black/30 p-4 rounded-lg border border-midnight-white/10">
            <span className="text-sm text-midnight-white/70">Connected Wallet</span>
            <Badge variant={isConnected ? "success" : "destructive"} className="mt-2 text-lg px-4 py-2">
              {isConnected ? "Connected" : "Disconnected"}
            </Badge>
          </div>
        </div>

        {isConnected && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-midnight-white border-b border-midnight-white/20 pb-2">
              User Management
            </h3>
            <div className="space-y-3">
              <div>
                <label htmlFor="userId" className="text-sm font-medium mb-1 block text-midnight-white/80">User ID (Uint32)</label>
                <input
                  id="userId"
                  type="number"
                  value={userIdInput}
                  onChange={(e) => setUserIdInput(e.target.value)}
                  placeholder="e.g., 123"
                  className="w-full p-3 border rounded-md bg-midnight-black/50 text-midnight-white placeholder:text-midnight-white/50 focus:ring-2 focus:ring-midnight-blue focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="profileCommitment" className="text-sm font-medium mb-1 block text-midnight-white/80">Profile Commitment (Bytes32)</label>
                <input
                  id="profileCommitment"
                  type="text"
                  value={profileCommitmentInput}
                  onChange={(e) => setProfileCommitmentInput(e.target.value)}
                  placeholder="e.g., 0xabcdef123..."
                  className="w-full p-3 border rounded-md bg-midnight-black/50 text-midnight-white placeholder:text-midnight-white/50 focus:ring-2 focus:ring-midnight-blue focus:border-transparent"
                />
              </div>
              <Button
                onClick={() => executeFunction('create_profile', [parseInt(userIdInput), profileCommitmentInput])}
                disabled={loading || !userIdInput || !profileCommitmentInput}
                className="w-full bg-midnight-blue hover:bg-midnight-blue/80 text-midnight-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center"
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
                Create Profile
              </Button>
            </div>

            <div className="space-y-3">
              <div>
                <label htmlFor="preferenceCommitment" className="text-sm font-medium mb-1 block text-midnight-white/80">Preference Commitment (Bytes32)</label>
                <input
                  id="preferenceCommitment"
                  type="text"
                  value={preferenceCommitmentInput}
                  onChange={(e) => setPreferenceCommitmentInput(e.target.value)}
                  placeholder="e.g., 0x123abcdef..."
                  className="w-full p-3 border rounded-md bg-midnight-black/50 text-midnight-white placeholder:text-midnight-white/50 focus:ring-2 focus:ring-midnight-blue focus:border-transparent"
                />
              </div>
              <Button
                onClick={() => executeFunction('update_preferences', [parseInt(userIdInput), preferenceCommitmentInput])}
                disabled={loading || !userIdInput || !preferenceCommitmentInput}
                className="w-full bg-midnight-blue hover:bg-midnight-blue/80 text-midnight-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center"
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Settings className="mr-2 h-4 w-4" />}
                Update Preferences
              </Button>
            </div>

            <Button
              onClick={() => executeFunction('suspend_user', [parseInt(userIdInput)])}
              disabled={loading || !userIdInput}
              variant="destructive"
              className="w-full bg-red-600 hover:bg-red-700 text-midnight-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center"
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserX className="mr-2 h-4 w-4" />}
              Suspend User
            </Button>

            <h3 className="text-xl font-semibold text-midnight-white border-b border-midnight-white/20 pb-2 mt-6">
              User Statuses
            </h3>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
              {Object.keys(contractState.userStatuses).length === 0 ? (
                <p className="text-midnight-white/70 text-center">No users registered yet.</p>
              ) : (
                Object.entries(contractState.userStatuses).map(([userId, status]) => (
                  <div key={userId} className="flex justify-between items-center bg-midnight-black/30 p-3 rounded-lg border border-midnight-white/10">
                    <span className="text-midnight-white/90">User ID: {userId}</span>
                    {getUserStatusBadge(status as UserStatus)}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
