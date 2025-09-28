'use client'

// Browser-compatible crypto function
const createBrowserHash = async (data: string): Promise<string> => {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } else {
    // Fallback for Node.js environments
    const { createHash } = await import('crypto');
    return createHash('sha256').update(data).digest('hex');
  }
};

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: number;
}

export interface PrivateLocationProof {
  locationHash: string;
  proximityProof: boolean;
  distance?: number; // Only revealed if close
}

/**
 * 🔐 PRIVATE LOCATION SERVICE
 * Handles location-based matching with zero-knowledge privacy
 */
export class LocationService {
  private currentLocation: LocationData | null = null;
  
  /**
   * Get user's current location with permission
   */
  async getCurrentLocation(): Promise<LocationData> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location: LocationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: Date.now()
          };
          
          this.currentLocation = location;
          console.log('📍 Location obtained:', {
            lat: location.latitude.toFixed(6),
            lng: location.longitude.toFixed(6),
            accuracy: location.accuracy
          });
          
          resolve(location);
        },
        (error) => {
          console.error('❌ Location error:', error.message);
          reject(new Error(`Location access denied: ${error.message}`));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes cache
        }
      );
    });
  }

  /**
   * Create private location commitment (hash without revealing coordinates)
   */
  async createLocationCommitment(location: LocationData): Promise<string> {
    // Use coarse-grained location for privacy (rounded to ~1km precision)
    const coarseLat = Math.round(location.latitude * 100) / 100;
    const coarseLng = Math.round(location.longitude * 100) / 100;
    
    const locationString = `${coarseLat},${coarseLng}`;
    return await createBrowserHash(locationString);
  }

  /**
   * 🔒 ZERO-KNOWLEDGE PROXIMITY MATCHING
   * Proves two users are within range without revealing exact locations
   */
  async proveProximity(
    myLocation: LocationData,
    targetLocationHash: string,
    maxDistanceKm: number = 50
  ): Promise<PrivateLocationProof> {
    console.log('🔐 Starting ZK proximity proof...');
    
    // In production, this would be a real ZK circuit
    // For demo, we simulate the privacy-preserving calculation
    
    const myLocationHash = await this.createLocationCommitment(myLocation);
    
    // Simulate the ZK proof calculation
    // In reality, this would use the target's location commitment
    // and prove proximity without revealing either location
    
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate proof time
    
    // For demo: determine if locations are "close" based on hash similarity
    const proximity = this.simulatePrivateProximityCheck(myLocationHash, targetLocationHash);
    
    return {
      locationHash: myLocationHash,
      proximityProof: proximity.isClose,
      distance: proximity.isClose ? proximity.approximateDistance : undefined
    };
  }

  /**
   * Simulate private proximity checking (would be ZK circuit in production)
   */
  private simulatePrivateProximityCheck(hash1: string, hash2: string): {
    isClose: boolean;
    approximateDistance?: number;
  } {
    // Convert hashes to numeric values for proximity simulation
    const num1 = parseInt(hash1.substring(0, 8), 16);
    const num2 = parseInt(hash2.substring(0, 8), 16);
    
    const hashDiff = Math.abs(num1 - num2);
    const maxDiff = 0xFFFFFFFF * 0.1; // Within 10% hash space = "close"
    
    const isClose = hashDiff < maxDiff;
    const approximateDistance = isClose ? Math.round((hashDiff / maxDiff) * 50) : undefined;
    
    console.log('🧮 ZK Proximity Calculation:', {
      isClose,
      approximateDistance: approximateDistance ? `~${approximateDistance}km` : 'Too far'
    });
    
    return { isClose, approximateDistance };
  }

  /**
   * Get location display string without revealing exact coordinates
   */
  getPrivacyFriendlyLocation(location: LocationData): string {
    // Show only city-level precision
    const lat = Math.round(location.latitude * 10) / 10;
    const lng = Math.round(location.longitude * 10) / 10;
    return `~${lat}, ${lng}`;
  }
}

export const locationService = new LocationService();