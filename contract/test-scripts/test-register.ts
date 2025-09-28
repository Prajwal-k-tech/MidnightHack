/**
 * Test script for user registration
 * This demonstrates how to call the register circuit with test data
 */

import { witnesses, PrivateState } from '../src/witnesses';

async function testRegister() {
  console.log('🧪 Testing user registration...');
  
  // Create a mock context for testing
  const mockContext = {
    privateState: {
      age: 28,
      location: 'San Francisco',
      bio: 'Love hiking and zero-knowledge proofs!',
      knownUserData: new Map()
    } as PrivateState,
    // Other context properties would be filled by the Midnight runtime
  };
  
  try {
    // Call the witness function
    const [newPrivateState, witnessData] = witnesses.getMyPrivateProfileForRegistration(mockContext);
    
    console.log('✅ Witness function executed successfully');
    console.log('📊 Witness data:');
    console.log(`  - Age: ${witnessData[0]}`);
    console.log(`  - Location hash: ${Array.from(witnessData[1]).map(b => b.toString(16).padStart(2, '0')).join('')}`);
    console.log(`  - Bio hash: ${Array.from(witnessData[2]).slice(0, 32).map(b => b.toString(16).padStart(2, '0')).join('')}...`);
    console.log('  - Private state updated:', newPrivateState);
    
    // In a real implementation, this data would be passed to the register circuit
    console.log('💡 Next step: Pass this data to the register circuit for on-chain commitment');
    
  } catch (error) {
    console.error('❌ Error testing registration:', error);
  }
}

// Run the test if this script is executed directly
if (require.main === module) {
  testRegister();
}

export { testRegister };