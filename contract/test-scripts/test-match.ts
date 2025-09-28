/**
 * Test script for match requests
 * This demonstrates how to call the requestMatch circuit with test data
 */

import { witnesses, PrivateState } from '../src/witnesses';
import { createHash } from 'crypto';

async function testMatch() {
  console.log('🧪 Testing match request...');
  
  // Create a mock target address (in a real app, this would be a user's actual address)
  const targetAddress = createHash('sha256').update('target_user_123').digest();
  const targetAddressArray = new Uint8Array(targetAddress);
  
  // Create a mock context for the requesting user
  const mockContext = {
    privateState: {
      age: 25,
      location: 'New York',
      bio: 'Looking for someone who loves blockchain!',
      knownUserData: new Map()
    } as PrivateState,
  };
  
  try {
    // Call the witness function
    const [updatedPrivateState, witnessData] = witnesses.getMatchData(mockContext, targetAddressArray);
    
    console.log('✅ Match witness function executed successfully');
    console.log('📊 Match data:');
    console.log(`  - My age: ${witnessData[0]}`);
    console.log(`  - My location hash: ${Array.from(witnessData[1]).map(b => b.toString(16).padStart(2, '0')).join('')}`);
    console.log(`  - Target age: ${witnessData[2]}`);
    console.log(`  - Target location hash: ${Array.from(witnessData[3]).map(b => b.toString(16).padStart(2, '0')).join('')}`);
    
    // Check if the match would succeed based on our contract rules
    const myAge = Number(witnessData[0]);
    const targetAge = Number(witnessData[2]);
    const ageDiff = Math.abs(myAge - targetAge);
    
    const myLocationHash = Array.from(witnessData[1]).map(b => b.toString(16).padStart(2, '0')).join('');
    const targetLocationHash = Array.from(witnessData[3]).map(b => b.toString(16).padStart(2, '0')).join('');
    const sameLocation = myLocationHash === targetLocationHash;
    
    console.log('🔍 Match analysis:');
    console.log(`  - Age difference: ${ageDiff} years (limit: 10)`);
    console.log(`  - Same location: ${sameLocation}`);
    console.log(`  - Would match succeed: ${ageDiff <= 10 && sameLocation ? '✅ Yes' : '❌ No'}`);
    
    if (ageDiff <= 10 && sameLocation) {
      console.log('💕 This match request would be successful!');
    } else {
      console.log('💔 This match request would fail the ZK validation');
      if (ageDiff > 10) console.log('   Reason: Age difference too large');
      if (!sameLocation) console.log('   Reason: Different locations');
    }
    
  } catch (error) {
    console.error('❌ Error testing match:', error);
  }
}

// Run the test if this script is executed directly
if (require.main === module) {
  testMatch();
}

export { testMatch };