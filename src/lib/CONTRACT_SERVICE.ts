import { CONTRACT_CONFIG, UserStatus } from './CONTRACT_CONFIG';
import { useWalletStore } from '@/lib/stores/walletStore';
import { toast } from 'sonner';

export class ContractService {
  private mockState = { ...CONTRACT_CONFIG.mockState };

  constructor() {
    // Initialize mock state from localStorage if available
    if (typeof window !== 'undefined') {
      const storedState = localStorage.getItem('privateDatingPlatformState');
      if (storedState) {
        this.mockState = JSON.parse(storedState);
      }
    }
  }

  private saveState() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('privateDatingPlatformState', JSON.stringify(this.mockState));
    }
  }

  async callFunction(functionName: string, params: any[] = []): Promise<any> {
    const { walletState } = useWalletStore.getState();

    if (!walletState?.address) {
      throw new Error('Wallet not connected');
    }

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock function logic
    switch (functionName) {
      case 'create_profile': {
        const [userId, profileCommitment] = params;
        if (this.mockState.userStatuses[userId]) {
          throw new Error('User ID already exists');
        }
        this.mockState.userStatuses[userId] = UserStatus.Active;
        this.mockState.profileHashes[userId] = profileCommitment;
        this.mockState.totalUsers++;
        this.saveState();
        return { success: true, message: `Profile for user ${userId} created.` };
      }
      case 'update_preferences': {
        const [userId, preferenceCommitment] = params;
        if (!this.mockState.userStatuses[userId] || this.mockState.userStatuses[userId] !== UserStatus.Active) {
          throw new Error('User does not exist or is not active');
        }
        this.mockState.preferenceHashes[userId] = preferenceCommitment;
        this.saveState();
        return { success: true, message: `Preferences for user ${userId} updated.` };
      }
      case 'suspend_user': {
        const [userId] = params;
        if (!this.mockState.userStatuses[userId] || this.mockState.userStatuses[userId] !== UserStatus.Active) {
          throw new Error('User does not exist or is not active');
        }
        this.mockState.userStatuses[userId] = UserStatus.Suspended;
        this.saveState();
        return { success: true, message: `User ${userId} suspended.` };
      }
      default:
        throw new Error(`Unknown function: ${functionName}`);
    }
  }

  getState() {
    return { ...this.mockState };
  }
}

export const contractService = new ContractService();
