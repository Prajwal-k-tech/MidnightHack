// Witness implementations for PrivateDatingPlatform contract
// Based on KYC hackathon WINNER pattern - REAL MIDNIGHT ZK INTEGRATION! 🏆
// These functions provide private data to the ZK circuits without revealing secrets

import { createHash } from 'crypto';

// Define the private state type for our dating platform
export interface PrivateState {
  age?: number;
  location?: string;
  bio?: string;
  // Store other users' data that we've received through approved matches
  knownUserData?: Map<string, { age: number; location: string; bio: string }>;
}

// Helper function to convert string to Bytes<32> format using SHA256
function stringToBytes32(str: string): Uint8Array {
  const hash = createHash('sha256').update(str).digest();
  return new Uint8Array(hash);
}

// Helper function to convert string to Bytes<256> format
function stringToBytes256(str: string): Uint8Array {
  const encoder = new TextEncoder();
  const encoded = encoder.encode(str);
  const result = new Uint8Array(256);
  result.set(encoded.slice(0, 256)); // Truncate if too long
  return result;
}

// Witness implementation for getMyPrivateProfileForRegistration
export function getMyPrivateProfileForRegistration(
  context: any // WitnessContext will be properly typed after contract compilation
): [PrivateState, [bigint, Uint8Array, Uint8Array]] {
  const privateState = context.privateState as PrivateState || {};
  
  // For demo purposes, use default values if not set
  const age = privateState.age || 25;
  const location = privateState.location || 'New York';
  const bio = privateState.bio || 'Looking for my ZK soulmate!';
  
  // Update private state with the user's data
  const newPrivateState: PrivateState = {
    ...privateState,
    age,
    location,
    bio,
    knownUserData: privateState.knownUserData || new Map()
  };
  
  // Return the data in the format expected by the contract
  return [
    newPrivateState,
    [
      BigInt(age),                          // Uint<8>
      stringToBytes32(location),            // Bytes<32>
      stringToBytes256(bio)                 // Bytes<256>
    ]
  ];
}

// Witness implementation for getMatchData
export function getMatchData(
  context: any, // WitnessContext will be properly typed after contract compilation
  target: Uint8Array // Address type
): [PrivateState, [bigint, Uint8Array, bigint, Uint8Array]] {
  const privateState = context.privateState as PrivateState || {};
  
  // Get the current user's data
  const myAge = privateState.age || 25;
  const myLocation = privateState.location || 'New York';
  
  // For the PoC, we'll simulate getting the target user's data
  const targetAddress = Array.from(target).map(b => b.toString(16).padStart(2, '0')).join('');
  let targetAge = 28; // Default values for demo
  let targetLocation = 'New York';
  
  // Check if we have this user's data from a previous approved match
  if (privateState.knownUserData?.has(targetAddress)) {
    const userData = privateState.knownUserData.get(targetAddress)!;
    targetAge = userData.age;
    targetLocation = userData.location;
  } else {
    // For demo purposes, simulate some realistic data based on address
    const addressNum = parseInt(targetAddress.slice(-4), 16) % 100;
    targetAge = 20 + (addressNum % 40); // Age between 20-60
    
    // Simulate different locations
    const locations = ['New York', 'San Francisco', 'London', 'Tokyo', 'Berlin'];
    targetLocation = locations[addressNum % locations.length];
  }
  
  return [
    privateState, // No state change needed for this witness
    [
      BigInt(myAge),                        // My age: Uint<8>
      stringToBytes32(myLocation),          // My location: Bytes<32>
      BigInt(targetAge),                    // Target age: Uint<8>
      stringToBytes32(targetLocation)       // Target location: Bytes<32>
    ]
  ];
}

// Export witnesses object in the format expected by the Midnight runtime
export const witnesses = {
  getMyPrivateProfileForRegistration,
  getMatchData
};
