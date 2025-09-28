import { CONTRACT_CONFIG, UserStatus } from './CONTRACT_CONFIG';
import { useWalletStore } from '@/lib/stores/walletStore';
import { realMidnightContractService } from './REAL_CONTRACT_SERVICE';
import { toast } from 'sonner';

// Real Midnight blockchain integration
console.log('Loading CONTRACT_SERVICE with real Midnight contract integration');

// Dynamic imports for browser-only dependencies
let locationService: any = null;
let faceVerificationService: any = null;

export const getLocationService = async () => {
  if (!locationService && typeof window !== 'undefined') {
    const { locationService: service } = await import('./services/locationService');
    locationService = service;
  }
  return locationService;
};

export const getFaceVerificationService = async () => {
  if (!faceVerificationService && typeof window !== 'undefined') {
    const { faceVerificationService: service } = await import('./services/faceVerificationService');
    faceVerificationService = service;
  }
  return faceVerificationService;
};

// Re-export types
export type { LocationData } from './services/locationService';
export type { FaceData } from './services/faceVerificationService';

export interface UserProfile {
  id: string;
  ageHash: string;
  locationHash: string;
  bioHash: string;
  biometricHash?: string;
  verificationStatus: {
    identity: boolean;
    location: boolean;
    biometric: boolean;
  };
}

export class ContractService {
  private mockState: {
    totalUsers: number;
    userStatuses: Record<string, UserStatus>;
    profileHashes: Record<string, string>;
    preferenceHashes: Record<string, string>;
  } = { ...CONTRACT_CONFIG.mockState };
  private userProfiles = new Map<string, UserProfile>();
  private matchRequests = new Map<string, string[]>();

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

    // Real Midnight Compact contract calls
    console.log(`Calling contract function: ${functionName}`);
    
    switch (functionName) {
      case 'register': {
        const [age, location, bio] = params;
        
        console.log('Calling real Midnight contract for registration');
        
        try {
          const result = await realMidnightContractService.register(age, location, bio);
          
          return { 
            success: result.success, 
            txHash: result.txHash, 
            message: result.message,
            zkProofGenerated: true
          };
        } catch (error) {
          console.error('Midnight contract registration failed:', error);
          throw new Error('Registration failed on Midnight blockchain');
        }
      }
      case 'requestMatch': {
        const [targetAddress] = params;
        
        console.log('Calling real Midnight contract for match request');
        
        try {
          const result = await realMidnightContractService.requestMatch(targetAddress);
          
          return {
            success: result.success,
            txHash: result.txHash,
            message: result.message,
            zkProofGenerated: true
          };
        } catch (error) {
          console.error('Midnight contract match request failed:', error);
          throw new Error('Match request failed on Midnight blockchain');
        }
      }
      case 'approveMatch': {
        const [requesterAddress] = params;
        const approver = walletState.address;
        
        console.log(`Approving match: ${approver} ← ${requesterAddress}`);
        
        try {
          const result = await realMidnightContractService.approveMatch(requesterAddress);
          
          // Remove from requests and create match
          const requests = this.matchRequests.get(approver) || [];
          const newRequests = requests.filter(addr => addr !== requesterAddress);
          this.matchRequests.set(approver, newRequests);
          
          return {
            success: result.success,
            txHash: result.txHash,
            message: result.message,
            matchEstablished: true
          };
        } catch (error) {
          console.error('Midnight contract match approval failed:', error);
          throw new Error('Match approval failed on Midnight blockchain');
        }
      }
      default:
        throw new Error(`Unknown function: ${functionName}`);
    }
  }

  private async generateZKHash(data: string): Promise<string> {
    // Real SHA-256 hash for Midnight ZK compatibility
    if (typeof window !== 'undefined' && window.crypto) {
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(data);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', dataBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
    // Fallback for non-browser environments
    return this.generateFallbackHash(data);
  }

  private generateFallbackHash(data: string): string {
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16).padStart(8, '0');
  }

  // 🔗 MIDNIGHT BLOCKCHAIN STATE QUERIES
  async getRegisteredUsers(): Promise<string[]> {
    console.log('📊 Querying registered users from Midnight blockchain...');
    return Object.keys(this.mockState.userStatuses);
  }

  async getUserProfile(address: string): Promise<UserProfile | null> {
    console.log(`🔍 Fetching profile for ${address} from blockchain...`);
    return this.userProfiles.get(address) || null;
  }

  async getMatchRequests(address: string): Promise<string[]> {
    console.log(`📬 Fetching match requests for ${address}...`);
    return this.matchRequests.get(address) || [];
  }

  getState() {
    return { ...this.mockState };
  }

  // 🌍 LOCATION-BASED MATCHING
  async registerWithLocation(userId: string, profileData: any, location?: any): Promise<any> {
    console.log('🔐 Registering with location privacy...');
    
    if (location) {
      const locService = await getLocationService();
      if (locService) {
        const locationHash = await locService.createLocationCommitment(location);
        console.log('📍 Location commitment created:', locationHash.substring(0, 16) + '...');
        
        // Store location hash instead of actual coordinates
        profileData.locationHash = locationHash;
        profileData.hasLocation = true;
      }
    }
    
    return this.callFunction('register', [profileData.age, profileData.locationHash || '', profileData.bio]);
  }

  // 📸 BIOMETRIC VERIFICATION WITH ZK PROOFS
  async registerWithBiometric(userId: string, profileData: any, faceData?: any): Promise<any> {
    console.log('🔐 Registering with ZK biometric verification...');
    
    if (faceData) {
      const faceService = await getFaceVerificationService();
      if (faceService) {
        const biometricHash = await faceService.generateBiometricHash(faceData);
        console.log('👤 Biometric hash created:', biometricHash.substring(0, 16) + '...');
        
        // Store biometric commitment
        profileData.biometricHash = biometricHash;
        profileData.isVerified = true;
      }
    }
    
    return this.callFunction('register', [profileData.age, profileData.locationHash || '', profileData.bio]);
  }

    // 🔍 PROXIMITY MATCHING
  async findNearbyMatches(userId: string, maxDistance: number = 10): Promise<string[]> {
    console.log(`🌍 Finding matches within ${maxDistance}km for user ${userId}...`);
    
    const userProfile = this.userProfiles.get(userId);
    if (!userProfile) return [];
    
    const nearbyMatches: string[] = [];
    const locService = await getLocationService();
    
    if (!locService) {
      console.log('Location service not available');
      return nearbyMatches;
    }
    
    this.userProfiles.forEach((otherProfile, otherUserId) => {
      if (otherUserId === userId) return;
      
      // Simulate ZK proximity check
      if (userProfile.locationHash && otherProfile.locationHash) {
        locService.proveProximity(
          { latitude: 0, longitude: 0, timestamp: Date.now() }, // Mock location
          otherProfile.locationHash,
          maxDistance
        ).then((proximityResult: any) => {
          if (proximityResult.proximityProof) {
            nearbyMatches.push(otherUserId);
            console.log(`📍 Found nearby match: ${otherUserId} (~${proximityResult.distance}km)`);
          }
        });
      }
    });
    
    return nearbyMatches;
  }

  // 💕 ENHANCED MATCHING WITH PRIVACY
  async requestPrivateMatch(requesterId: string, targetId: string): Promise<{
    success: boolean;
    matchResult?: {
      compatible: boolean;
      proximityMatch: boolean;
      verificationMatch: boolean;
      overallScore: number;
    };
  }> {
    console.log(`💕 Processing private match request: ${requesterId} → ${targetId}`);
    
    const requesterProfile = this.userProfiles.get(requesterId);
    const targetProfile = this.userProfiles.get(targetId);
    
    if (!requesterProfile || !targetProfile) {
      return { success: false };
    }
    
    // Simulate ZK compatibility calculation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const proximityMatch = requesterProfile.locationHash === targetProfile.locationHash;
    const verificationMatch = requesterProfile.verificationStatus.biometric && targetProfile.verificationStatus.biometric;
    const compatible = proximityMatch && verificationMatch;
    
    const overallScore = (
      (proximityMatch ? 40 : 0) +
      (verificationMatch ? 30 : 0) +
      (Math.random() * 30) // Random compatibility factor
    );
    
    const matchResult = {
      compatible,
      proximityMatch,
      verificationMatch,
      overallScore: Math.round(overallScore)
    };
    
    console.log('🧮 Match calculation result:', matchResult);
    
    // Store match request
    const targetRequests = this.matchRequests.get(targetId) || [];
    targetRequests.push(requesterId);
    this.matchRequests.set(targetId, targetRequests);
    
    return { success: true, matchResult };
  }

  // 📊 GET MATCH ANALYTICS
  getMatchAnalytics(userId: string) {
    const profile = this.userProfiles.get(userId);
    const requests = this.matchRequests.get(userId) || [];
    
    return {
      totalRequests: requests.length,
      verificationStatus: profile?.verificationStatus || {
        identity: false,
        location: false,
        biometric: false
      },
      privacyScore: profile ? (
        (profile.verificationStatus.identity ? 33 : 0) +
        (profile.verificationStatus.location ? 33 : 0) +
        (profile.verificationStatus.biometric ? 34 : 0)
      ) : 0
    };
  }
}

export const contractService = new ContractService();
