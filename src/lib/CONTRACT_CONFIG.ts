export const CONTRACT_CONFIG = {
  name: "PrivateDatingPlatform",
  address: "private_dating_platform_address_placeholder", // Replace with deployed contract address
  functions: {
    create_profile: {
      name: "create_profile",
      params: ["user_id", "profile_commitment"],
      returns: "void",
      description: "Creates a new user profile with a commitment and identity proof."
    },
    update_preferences: {
      name: "update_preferences",
      params: ["user_id", "preference_commitment"],
      returns: "void",
      description: "Updates user preferences with a commitment and compatibility proof."
    },
    suspend_user: {
      name: "suspend_user",
      params: ["user_id"],
      returns: "void",
      description: "Suspends a user account."
    }
  },
  mockState: {
    totalUsers: 0,
    userStatuses: {}, // Map<Uint<32>, UserStatus>
    profileHashes: {}, // Map<Uint<32>, Bytes<32>>
    preferenceHashes: {} // Map<Uint<32>, Bytes<32>>
  }
};

export enum UserStatus {
  Active,
  Suspended,
  Banned
}
