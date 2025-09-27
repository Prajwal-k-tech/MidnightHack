'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useWalletStore } from '@/lib/stores/walletStore';
import { contractService } from '@/lib/CONTRACT_SERVICE';
import { CONTRACT_CONFIG, UserStatus } from '@/lib/CONTRACT_CONFIG';
import { toast } from 'sonner';
import { Loader2, UserPlus, Settings, UserX } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function ContractInterface() {
  const { isConnected } = useWalletStore();
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
        return <Badge variant="default">Active</Badge>;
      case UserStatus.Suspended:
        return <Badge variant="secondary">Suspended</Badge>;
      case UserStatus.Banned:
        return <Badge variant="destructive">Banned</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (!isConnected) {
    return (
    <div className="text-center p-8 rounded-xl border-2 border-dashed bg-[#ca9ae4]/10 border-[#ca9ae4]/50 dark:bg-[#5768d2]/10 dark:border-[#5768d2]/50">
      <p className="font-medium text-[#014c8f] dark:text-[#ca9ae4]">Connect your wallet to manage the contract.</p>
    </div>    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col items-center justify-center bg-muted/30 p-4 rounded-lg border">
          <span className="text-xs text-muted-foreground">Total Users</span>
          <Badge variant="default" className="mt-1 text-lg px-3 py-1">
            {contractState.totalUsers}
          </Badge>
        </div>
        <div className="flex flex-col items-center justify-center bg-muted/30 p-4 rounded-lg border">
          <span className="text-xs text-muted-foreground">Wallet</span>
          <Badge variant={isConnected ? 'default' : 'destructive'} className="mt-1 text-lg px-3 py-1">
            {isConnected ? "Connected" : "Disconnected"}
          </Badge>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <Label htmlFor="userId" className="text-xs">User ID</Label>
          <Input id="userId" type="number" value={userIdInput} onChange={(e) => setUserIdInput(e.target.value)} placeholder="e.g., 123" className="mt-1 h-8" />
        </div>
        <div>
          <Label htmlFor="profileCommitment" className="text-xs">Profile Commitment</Label>
          <Input id="profileCommitment" type="text" value={profileCommitmentInput} onChange={(e) => setProfileCommitmentInput(e.target.value)} placeholder="e.g., 0xabcdef..." className="mt-1 h-8" />
        </div>
        <Button onClick={() => executeFunction('create_profile', [parseInt(userIdInput), profileCommitmentInput])} className="w-full h-9 text-sm">
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
          Create Profile
        </Button>
      </div>

      <div className="space-y-3">
        <div>
          <Label htmlFor="preferenceCommitment" className="text-xs">Preference Commitment</Label>
          <Input id="preferenceCommitment" type="text" value={preferenceCommitmentInput} onChange={(e) => setPreferenceCommitmentInput(e.target.value)} placeholder="e.g., 0x123abc..." className="mt-1 h-8" />
        </div>
        <Button onClick={() => executeFunction('update_preferences', [parseInt(userIdInput), preferenceCommitmentInput])} disabled={loading || !userIdInput || !preferenceCommitmentInput} className="w-full h-9 text-sm">
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Settings className="mr-2 h-4 w-4" />}
          Update Preferences
        </Button>
      </div>

      <div className="max-h-32 overflow-y-auto space-y-2 pr-2 no-scrollbar">
        <h3 className="text-sm font-semibold text-foreground border-b pb-2">User Statuses</h3>
        {Object.keys(contractState.userStatuses).length === 0 ? (
          <p className="text-muted-foreground text-xs text-center py-4">No users registered.</p>
        ) : (
          Object.entries(contractState.userStatuses).map(([userId, status]) => (
            <div key={userId} className="flex justify-between items-center bg-muted/30 p-2 rounded-md border">
              <span className="text-foreground text-xs">User ID: {userId}</span>
              {getUserStatusBadge(status as UserStatus)}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
