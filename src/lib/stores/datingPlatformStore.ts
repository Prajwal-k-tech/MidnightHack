import { create } from 'zustand';
import { MockDatingPlatform, VerificationStatus } from '../contract/DatingPlatformContract';

interface DatingPlatformState {
  // Contract instance
  contract: MockDatingPlatform;
  
  // User state
  currentUserId: number | null;
  userProfile: any | null;
  verificationStatus: VerificationStatus | null;
  
  // Demo state
  isConnected: boolean;
  isVerifying: boolean;
  verificationLogs: string[];
  
  // Actions
  setUserId: (userId: number) => void;
  createProfile: (profileData: any) => Promise<boolean>;
  verifyAge: (minAge: number, maxAge: number) => Promise<void>;
  verifyLocation: (targetLat: number, targetLng: number, maxDistance: number) => Promise<void>;
  verifyIncome: (minIncome: number, maxIncome: number) => Promise<void>;
  createMatch: (otherUserId: number) => Promise<boolean>;
  refreshVerificationStatus: () => Promise<void>;
  addLog: (message: string) => void;
  clearLogs: () => void;
}

export const useDatingPlatform = create<DatingPlatformState>((set, get) => ({
  // Initial state
  contract: new MockDatingPlatform(),
  currentUserId: null,
  userProfile: null,
  verificationStatus: null,
  isConnected: false,
  isVerifying: false,
  verificationLogs: [],

  // Actions
  setUserId: (userId: number) => {
    set({ currentUserId: userId, isConnected: true });
    get().addLog(`🆔 Connected as User ${userId}`);
  },

  createProfile: async (profileData: any) => {
    const { contract, currentUserId, addLog } = get();
    if (!currentUserId) throw new Error('No user ID set');
    
    set({ isVerifying: true });
    addLog(`📋 Creating verified profile...`);
    
    try {
      const profileCommitment = `profile_${currentUserId}_${Date.now()}`;
      const success = await contract.create_verified_profile(currentUserId, profileCommitment);
      
      if (success) {
        set({ userProfile: { ...profileData, profileCommitment } });
        await get().refreshVerificationStatus();
        addLog(`✅ Profile created successfully!`);
      }
      
      return success;
    } catch (error) {
      addLog(`❌ Profile creation failed: ${error}`);
      throw error;
    } finally {
      set({ isVerifying: false });
    }
  },

  verifyAge: async (minAge: number, maxAge: number) => {
    const { contract, currentUserId, addLog } = get();
    if (!currentUserId) throw new Error('No user ID set');
    
    set({ isVerifying: true });
    addLog(`🎂 Starting age verification (${minAge}-${maxAge} years)...`);
    
    try {
      await contract.verify_and_disclose_age_range(currentUserId, minAge, maxAge);
      await get().refreshVerificationStatus();
      addLog(`✅ Age verification completed!`);
    } catch (error) {
      addLog(`❌ Age verification failed: ${error}`);
      throw error;
    } finally {
      set({ isVerifying: false });
    }
  },

  verifyLocation: async (targetLat: number, targetLng: number, maxDistance: number) => {
    const { contract, currentUserId, addLog } = get();
    if (!currentUserId) throw new Error('No user ID set');
    
    set({ isVerifying: true });
    addLog(`📍 Starting location verification (within ${maxDistance} units)...`);
    
    try {
      await contract.verify_and_disclose_location_proximity(currentUserId, targetLat, targetLng, maxDistance);
      await get().refreshVerificationStatus();
      addLog(`✅ Location verification completed!`);
    } catch (error) {
      addLog(`❌ Location verification failed: ${error}`);
      throw error;
    } finally {
      set({ isVerifying: false });
    }
  },

  verifyIncome: async (minIncome: number, maxIncome: number) => {
    const { contract, currentUserId, addLog } = get();
    if (!currentUserId) throw new Error('No user ID set');
    
    set({ isVerifying: true });
    addLog(`💰 Starting income verification ($${minIncome}-$${maxIncome})...`);
    
    try {
      await contract.verify_and_disclose_income_bracket(currentUserId, minIncome, maxIncome);
      await get().refreshVerificationStatus();
      addLog(`✅ Income verification completed!`);
    } catch (error) {
      addLog(`❌ Income verification failed: ${error}`);
      throw error;
    } finally {
      set({ isVerifying: false });
    }
  },

  createMatch: async (otherUserId: number) => {
    const { contract, currentUserId, addLog } = get();
    if (!currentUserId) throw new Error('No user ID set');
    
    set({ isVerifying: true });
    addLog(`💕 Creating verified match with User ${otherUserId}...`);
    
    try {
      const success = await contract.create_verified_match(currentUserId, otherUserId);
      if (success) {
        addLog(`✅ Match created successfully!`);
      } else {
        addLog(`❌ Match failed - verification requirements not met`);
      }
      return success;
    } catch (error) {
      addLog(`❌ Match creation failed: ${error}`);
      throw error;
    } finally {
      set({ isVerifying: false });
    }
  },

  refreshVerificationStatus: async () => {
    const { contract, currentUserId } = get();
    if (!currentUserId) return;
    
    try {
      const [ageVerified, locationVerified, incomeVerified] = await contract.get_verification_status(currentUserId);
      set({
        verificationStatus: {
          ageVerified,
          locationVerified,
          incomeVerified
        }
      });
    } catch (error) {
      console.error('Failed to refresh verification status:', error);
    }
  },

  addLog: (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    set(state => ({
      verificationLogs: [...state.verificationLogs, `[${timestamp}] ${message}`]
    }));
  },

  clearLogs: () => {
    set({ verificationLogs: [] });
  }
}));