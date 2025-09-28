# Private Dating Platform - Smart Contract

## Overview

This is the core smart contract for the Private Dating Platform, built on the Midnight blockchain using the Compact smart contract language. The contract implements privacy-preserving dating functionality using zero-knowledge proofs.

## Key Features

### 🔐 Privacy-First Design
- **Data Commitments**: User profiles are stored as cryptographic hashes, not raw data
- **Zero-Knowledge Matching**: Compatibility checks happen without revealing personal information
- **Local Proof Generation**: All ZK proofs are generated client-side for maximum privacy

### 💕 Core Functionality
- **Profile Registration**: Users create profiles with age, location, and bio commitments
- **Private Matching**: ZK circuits verify compatibility (same location, age within 10 years) without revealing data
- **Match Approval**: Users can approve valid match requests to enable private data sharing

## Contract Architecture

### Data Structures
```compact
struct UserProfile {
  ageHash: Bytes<32>,      // SHA256 hash of user's age
  locationHash: Bytes<32>, // SHA256 hash of user's location
  bioHash: Bytes<32>       // SHA256 hash of user's bio
}
```

### Core Circuits
1. `register()`: Creates a user profile by storing data commitments on-chain
2. `requestMatch(target: Address)`: Privately validates match criteria and creates a request
3. `approveMatch(requester: Address)`: Approves a match request and enables data sharing

### Witness Functions
- `getMyPrivateProfileForRegistration()`: Provides user's private data for registration
- `getMatchData(target: Address)`: Provides both users' data for match validation

## Development Setup

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- Midnight SDK with Compact compiler

### Quick Start
```bash
# Install dependencies
npm install

# Set up development environment
npm run setup

# Compile the contract
npm run compile

# Start local Midnight testnet
npm run start

# Run tests
npm run test
```

### CLI Commands

#### Environment Management
```bash
npm run start     # Start local Midnight development environment
npm run stop      # Stop the development environment
npm run status    # Check environment status
npm run logs      # View environment logs
```

#### Contract Operations
```bash
npm run compile   # Compile the Compact contract
npm run deploy    # Deploy contract to local testnet
```

#### Testing & Demo
```bash
npm run register --age 25 --location "New York" --bio "Love ZK!"
npm run match --target <address>
npm run approve --requester <address>
```

## Architecture Patterns

### 1. Commit-Reveal Scheme
The contract uses a commit-reveal pattern where:
- **Commit Phase**: Users store cryptographic commitments (hashes) of their data
- **Reveal Phase**: During matching, users provide the actual data via witnesses
- **Verification**: Circuits verify the revealed data matches the stored commitments

### 2. Zero-Knowledge Validation
Match requests use ZK circuits to:
- Privately check if users meet compatibility criteria
- Generate proofs without revealing the underlying data
- Only allow valid matches to proceed

### 3. Decentralized State Management
- User profiles are stored in a public `Map<Address, UserProfile>`
- Match requests are managed in a separate `Map<Address, Vector<8, Address>>`
- No central authority can access private user data

## Security Considerations

### 🛡️ Privacy Guarantees
- **Data Minimization**: Only necessary hashes are stored on-chain
- **Proof Verification**: All private data is validated cryptographically
- **Local Processing**: Sensitive operations happen client-side

### ⚠️ Known Limitations (PoC)
- Witness functions use simulated data for target users
- Match approval doesn't implement full private data exchange
- Limited to 8 pending requests per user (Vector<8, Address>)

## Production Considerations

For a production deployment, consider:

1. **Enhanced Privacy**: Implement more sophisticated private data sharing mechanisms
2. **Scalability**: Optimize data structures for larger user bases
3. **Identity Management**: Integrate with decentralized identity solutions
4. **Economic Incentives**: Add token mechanisms for spam prevention
5. **Cross-Chain Integration**: Enable interoperability with other privacy-focused chains

## Testing

The contract includes comprehensive test scripts:

```bash
# Run all tests
npm run test

# Individual test components
ts-node test-scripts/test-register.ts
ts-node test-scripts/test-match.ts
```

Tests demonstrate:
- Profile registration with proper data hashing
- Match validation logic with realistic scenarios
- Privacy preservation throughout the process

## Integration with Frontend

The compiled contract generates TypeScript types and interfaces for easy frontend integration:

```typescript
import { Contract, witnesses } from './build/PrivateDatingPlatform';

// Initialize contract with witnesses
const contract = new Contract(witnesses);

// Use the contract in your dApp
await contract.circuits.register();
```

## Contributing

This contract is part of the Midnight Hackathon submission. For improvements:

1. Focus on privacy-preserving features
2. Maintain zero-knowledge principles
3. Ensure compatibility with Midnight ecosystem
4. Write comprehensive tests for new functionality

## License

Apache 2.0 - See LICENSE file for details.