// Demo accounts for hackathon presentation
// 🎯 FAKE ACCOUNTS WITH MIDNIGHT WALLET ADDRESSES FOR DEMO

export interface DemoAccount {
  id: string;
  walletAddress: string;
  displayName: string;
  age: number;
  location: string;
  bio: string;
  compatibilityScore: number;
  verificationLevel: 'basic' | 'enhanced' | 'premium';
  profileImage: string;
  interests: string[];
  lastSeen: string;
}

// 🌟 FAKE MIDNIGHT WALLET ADDRESSES (for demo only)
export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    id: "demo_alice_001",
    walletAddress: "addr1qx5a2j8g9h3k4l6m7n8p9q0r2s3t4u5v6w7x8y9z0a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z",
    displayName: "Alice Chen",
    age: 26,
    location: "San Francisco, CA",
    bio: "Tech enthusiast who loves rock climbing and craft coffee. Always up for deep conversations about privacy rights and blockchain tech! 🧗‍♀️☕",
    compatibilityScore: 94,
    verificationLevel: "premium",
    profileImage: "🧗‍♀️",
    interests: ["Rock Climbing", "Coffee", "Blockchain", "Privacy Tech"],
    lastSeen: "2 hours ago"
  },
  {
    id: "demo_bob_002", 
    walletAddress: "addr1qy8k5n2m9w4x7z0a3b6c9d2e5f8g1h4i7j0k3l6m9n2o5p8q1r4s7t0u3v6w9x2y5z8a1b4c7d0e3f6g9h2i5j8k1l4m7n0o3p",
    displayName: "Bob Rodriguez",
    age: 29,
    location: "San Francisco, CA", 
    bio: "Photographer by day, chef by night. Love capturing moments and creating culinary adventures. Looking for someone who appreciates art and good food! 📸🍳",
    compatibilityScore: 87,
    verificationLevel: "enhanced",
    profileImage: "📸",
    interests: ["Photography", "Cooking", "Art", "Travel"],
    lastSeen: "1 day ago"
  },
  {
    id: "demo_carol_003",
    walletAddress: "addr1qz9l6o3p0s7v4y1b8e5h2k9n6q3t0w7z4a1d8g5j2m9p6s3v0y7b4e1h8k5n2q9t6w3z0a7d4g1j8m5p2s9v6y3b0e7h4k",
    displayName: "Carol Kim",
    age: 24,
    location: "San Francisco, CA",
    bio: "Marine biologist who's passionate about ocean conservation. Love diving, hiking, and sustainable living. Seeking someone who cares about our planet! 🌊🐠",
    compatibilityScore: 91,
    verificationLevel: "premium", 
    profileImage: "🌊",
    interests: ["Marine Biology", "Diving", "Conservation", "Hiking"],
    lastSeen: "4 hours ago"
  },
  {
    id: "demo_david_004",
    walletAddress: "addr1q0m7p4s1v8y5b2e9h6k3n0q7t4w1z8c5f2i9l6o3r0u7x4a1d8g5j2m9p6s3v0y7b4e1h8k5n2q9t6w3z0a7d4g1j8m5p2s",
    displayName: "David Park",
    age: 31,
    location: "San Francisco, CA",
    bio: "Software architect with a passion for sustainable tech and urban gardening. Weekend warrior on mountain bikes. Love building things that matter! 🚴‍♂️🌱",
    compatibilityScore: 85,
    verificationLevel: "enhanced",
    profileImage: "🚴‍♂️",
    interests: ["Software", "Cycling", "Gardening", "Sustainability"],
    lastSeen: "6 hours ago"
  },
  {
    id: "demo_emma_005",
    walletAddress: "addr1q1n8q5t2w9z6c3f0i7l4o1r8u5x2a9d6g3j0m7p4s1v8y5b2e9h6k3n0q7t4w1z8c5f2i9l6o3r0u7x4a1d8g5j2m9p6s3v",
    displayName: "Emma Thompson", 
    age: 27,
    location: "San Francisco, CA",
    bio: "UX designer who believes in human-centered technology. Love reading sci-fi, practicing yoga, and exploring hidden gems in the city. Authenticity over everything! 🧘‍♀️📚",
    compatibilityScore: 89,
    verificationLevel: "premium",
    profileImage: "🧘‍♀️", 
    interests: ["UX Design", "Yoga", "Reading", "City Exploration"],
    lastSeen: "30 minutes ago"
  },
  {
    id: "demo_frank_006",
    walletAddress: "addr1q2o9r6u3x0a7d4g1j8m5p2s9v6y3b0e7h4k1l8o5r2u9x6a3d0g7j4m1p8s5v2y9b6e3h0k7l4o1r8u5x2a9d6g3j0m7p4s1v",
    displayName: "Frank Wilson",
    age: 33,
    location: "San Francisco, CA", 
    bio: "Renewable energy engineer working on solar solutions. Love jazz music, craft beer, and weekend camping trips. Looking for meaningful conversations! 🎺🏕️",
    compatibilityScore: 82,
    verificationLevel: "enhanced",
    profileImage: "🎺",
    interests: ["Renewable Energy", "Jazz", "Camping", "Beer"],
    lastSeen: "3 hours ago"
  }
];

// 🎯 UTILITY FUNCTIONS FOR DEMO

export const getCompatibleMatches = (userAge: number = 28, userLocation: string = "San Francisco, CA") => {
  return DEMO_ACCOUNTS.filter(account => {
    // Age compatibility (within 10 years as per our ZK circuit)
    const ageDiff = Math.abs(account.age - userAge);
    const ageCompatible = ageDiff <= 10;
    
    // Location compatibility (same city for demo)
    const locationCompatible = account.location === userLocation;
    
    return ageCompatible && locationCompatible;
  }).sort((a, b) => b.compatibilityScore - a.compatibilityScore);
};

export const getAccountByAddress = (walletAddress: string): DemoAccount | undefined => {
  return DEMO_ACCOUNTS.find(account => account.walletAddress === walletAddress);
};

export const generateMatchRequest = (targetAddress: string) => {
  const account = getAccountByAddress(targetAddress);
  return {
    id: `match_${Date.now()}`,
    targetAddress,
    targetName: account?.displayName || 'Unknown User',
    compatibilityScore: account?.compatibilityScore || 0,
    status: 'pending',
    timestamp: new Date().toISOString(),
    zkProofGenerated: true
  };
};

// 🌟 DEMO STATS
export const DEMO_STATS = {
  totalUsers: DEMO_ACCOUNTS.length + 1, // +1 for current user
  avgCompatibilityScore: Math.round(
    DEMO_ACCOUNTS.reduce((sum, acc) => sum + acc.compatibilityScore, 0) / DEMO_ACCOUNTS.length
  ),
  verificationLevels: {
    premium: DEMO_ACCOUNTS.filter(acc => acc.verificationLevel === 'premium').length,
    enhanced: DEMO_ACCOUNTS.filter(acc => acc.verificationLevel === 'enhanced').length,
    basic: DEMO_ACCOUNTS.filter(acc => acc.verificationLevel === 'basic').length
  }
};

console.log('🎯 Demo accounts loaded for hackathon presentation!');