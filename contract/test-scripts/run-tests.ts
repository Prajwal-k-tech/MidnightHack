/**
 * Main test runner for the Private Dating Platform contract
 * This script runs all tests and demonstrates the complete flow
 */

import { testRegister } from './test-register';
import { testMatch } from './test-match';

async function runAllTests() {
  console.log('🚀 Running Private Dating Platform Contract Tests');
  console.log('=' .repeat(60));
  
  try {
    // Test 1: User Registration
    console.log('\\n1️⃣ Testing User Registration');
    console.log('-'.repeat(30));
    await testRegister();
    
    // Test 2: Match Request
    console.log('\\n2️⃣ Testing Match Request');
    console.log('-'.repeat(30));
    await testMatch();
    
    // Test Summary
    console.log('\\n' + '='.repeat(60));
    console.log('✅ All tests completed successfully!');
    console.log('\\n🎯 Key Features Demonstrated:');
    console.log('  • Private profile registration with data commitments');
    console.log('  • Zero-knowledge match validation (age + location)');
    console.log('  • Proper data hashing and privacy preservation');
    console.log('\\n🔥 Ready for deployment and frontend integration!');
    
  } catch (error) {
    console.error('\\n❌ Test suite failed:', error);
    process.exit(1);
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  runAllTests();
}

export { runAllTests };