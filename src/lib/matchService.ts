import { DemoAccount, DEMO_ACCOUNTS, getCompatibleMatches } from './demoAccounts';
import { Notification } from '@/components/ui/NotificationSystem';

export interface PendingMatch {
  id: string;
  fromUser: string;
  fromWallet: string;
  toUser: string;
  toWallet: string;
  timestamp: Date;
  status: 'pending' | 'approved' | 'rejected';
  zkProofHash?: string;
}

export interface ApprovedMatch {
  id: string;
  user1: string;
  user1Wallet: string;
  user2: string;
  user2Wallet: string;
  matchedAt: Date;
  compatibility: number;
  zkProofHash: string;
}

class MatchService {
  private pendingMatches: PendingMatch[] = [];
  private approvedMatches: ApprovedMatch[] = [];
  private notifications: Notification[] = [];

  constructor() {
    this.initializeDemoData();
  }

  private initializeDemoData() {
    // Add some demo pending matches for demonstration
    const demoMatches: PendingMatch[] = [
      {
        id: 'match_1',
        fromUser: 'Alice Chen',
        fromWallet: 'addr1qx5a2j8g9h3k4l6m7n8p9q0r2s3t4u5v6w7x8y9z0a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z',
        toUser: 'Current User',
        toWallet: 'midnig-5678',
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        status: 'pending'
      },
      {
        id: 'match_2',
        fromUser: 'Emma Thompson',
        fromWallet: 'addr1q1n8q5t2w9z6c3f0j7m4p1s8v5y2b9e6h3k0n7q4t1w8z5c2f9j6m3p0s7v4y1b8e5h2k9n6q3t0w7z4c1f8j5m2p9s6v3y0b7e4h1k8n5q2t9w6z3c0f7j4m1p8s5v2y9b6e3h0k7n4q1t8w5z2c9f6j3m0p7s4v1y8b5e2h9k6n3q0t7w4z1c8f5j2m9p6s3v0y7b4e1h8k5n2q9t6w3z0c7f4j1m8p5s2v9y6b3e0h7k4n1q8t5w2z9c6f3j0m7p4s1v8y5b2e9h6k3n0q7t4w1z8c5f2j9m6p3s0v7y4b1e8h5k2n9q6t3w0z7c4f1j8m5p2s9v6y3b0e7h4k1n8q5t2w9z6c3f0j7m4p1s8v5y2b9e6h3k0n7q4t1w8z5c2f9j6m3p0s7v4y1b8e5h2k9n6q3t0w7z4c1f8j5m2p',
        toUser: 'Current User',
        toWallet: 'midnig-5678',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        status: 'pending'
      }
    ];

    this.pendingMatches = demoMatches;
    
    // Create notifications for pending matches
    this.notifications = demoMatches.map(match => ({
      id: `notif_${match.id}`,
      type: 'match_request' as const,
      title: 'New Match Request',
      message: `${match.fromUser} sent you a private match request with ZK proof verification`,
      timestamp: match.timestamp,
      from: match.fromUser,
      read: false
    }));

    console.log('🎯 Match service initialized with demo data!');
  }

  async sendMatchRequest(fromWallet: string, toWallet: string): Promise<string> {
    // Generate ZK proof hash (simulate)
    const zkProofHash = await this.generateZKProof(fromWallet, toWallet);
    
    // Find user profiles
    const fromProfile = DEMO_ACCOUNTS.find(acc => acc.walletAddress === fromWallet);
    const toProfile = DEMO_ACCOUNTS.find(acc => acc.walletAddress === toWallet);
    
    const matchId = `match_${Date.now()}`;
    const pendingMatch: PendingMatch = {
      id: matchId,
      fromUser: fromProfile?.displayName || 'Unknown User',
      fromWallet,
      toUser: toProfile?.displayName || 'Target User',
      toWallet,
      timestamp: new Date(),
      status: 'pending',
      zkProofHash
    };

    this.pendingMatches.push(pendingMatch);
    
    // Create notification
    const notification: Notification = {
      id: `notif_${matchId}`,
      type: 'match_request',
      title: 'Match Request Sent',
      message: `Your private match request has been sent with ZK proof: ${zkProofHash.slice(0, 16)}...`,
      timestamp: new Date(),
      read: false
    };
    
    this.notifications.push(notification);
    
    console.log('🌙 MIDNIGHT HACKATHON - Match request sent!', { matchId, zkProofHash });
    return matchId;
  }

  async approveMatch(matchId: string): Promise<ApprovedMatch> {
    const pendingMatch = this.pendingMatches.find(m => m.id === matchId);
    if (!pendingMatch) {
      throw new Error('Match not found');
    }

    // Calculate compatibility
    const compatibility = Math.floor(Math.random() * 20) + 80; // 80-100%
    
    const approvedMatch: ApprovedMatch = {
      id: matchId,
      user1: pendingMatch.fromUser,
      user1Wallet: pendingMatch.fromWallet,
      user2: pendingMatch.toUser,
      user2Wallet: pendingMatch.toWallet,
      matchedAt: new Date(),
      compatibility,
      zkProofHash: pendingMatch.zkProofHash || await this.generateZKProof(pendingMatch.fromWallet, pendingMatch.toWallet)
    };

    // Update pending match status
    pendingMatch.status = 'approved';
    this.approvedMatches.push(approvedMatch);
    
    // Create success notification
    const notification: Notification = {
      id: `notif_approved_${matchId}`,
      type: 'match_approved',
      title: 'Match Approved!',
      message: `You and ${pendingMatch.fromUser} are now connected! ${compatibility}% compatibility verified through ZK proofs.`,
      timestamp: new Date(),
      read: false
    };
    
    this.notifications.push(notification);
    
    console.log('🌙 MIDNIGHT HACKATHON - Match approved!', approvedMatch);
    return approvedMatch;
  }

  async rejectMatch(matchId: string): Promise<void> {
    const pendingMatch = this.pendingMatches.find(m => m.id === matchId);
    if (!pendingMatch) {
      throw new Error('Match not found');
    }

    pendingMatch.status = 'rejected';
    
    // Create notification
    const notification: Notification = {
      id: `notif_rejected_${matchId}`,
      type: 'match_rejected',
      title: 'Match Declined',
      message: `Match request declined. Your privacy remains protected with zero-knowledge proofs.`,
      timestamp: new Date(),
      read: false
    };
    
    this.notifications.push(notification);
    
    console.log('🌙 MIDNIGHT HACKATHON - Match rejected:', matchId);
  }

  private async generateZKProof(wallet1: string, wallet2: string): Promise<string> {
    // Simulate ZK proof generation with realistic hash
    const data = `${wallet1}${wallet2}${Date.now()}`;
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Getters
  getPendingMatches(): PendingMatch[] {
    return this.pendingMatches.filter(m => m.status === 'pending');
  }

  getApprovedMatches(): ApprovedMatch[] {
    return this.approvedMatches;
  }

  getNotifications(): Notification[] {
    return this.notifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  markNotificationAsRead(notificationId: string): void {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
    }
  }

  dismissNotification(notificationId: string): void {
    this.notifications = this.notifications.filter(n => n.id !== notificationId);
  }
}

// Export singleton instance
export const matchService = new MatchService();