'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Loader2, CheckCircle } from 'lucide-react';
import { midnightContractService } from '@/lib/services/midnightContractService';
import { useWalletStore } from '@/lib/stores/walletStore';
import { toast } from 'sonner';

export default function WelcomePage() {
  const router = useRouter();
  const { setHasCompletedOnboarding } = useWalletStore();
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    age: '',
    location: '',
    bio: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRegister = async () => {
    if (!formData.age || !formData.location || !formData.bio) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsRegistering(true);
    try {
      // Initialize the contract service
      await midnightContractService.initialize();
      
      // Register user with zero-knowledge proofs
      const result = await midnightContractService.registerUser({
        age: parseInt(formData.age),
        location: formData.location,
        bio: formData.bio
      });

      if (result.success) {
        setHasCompletedOnboarding(true);
        toast.success('Profile created with zero-knowledge privacy!');
        router.push('/');
      }
    } catch (error) {
      console.error('Registration failed:', error);
      toast.error('Registration failed. Please try again.');
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="text-center flex flex-col items-center max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-8"
      >
        <Shield className="w-16 h-16 mx-auto mb-4 text-blue-500" />
        <h1 className="text-5xl font-heading text-foreground mb-4">
          Create Your Private Profile
        </h1>
        <p className="max-w-xl text-lg text-muted-foreground">
          Your data will be protected using zero-knowledge proofs. 
          We'll verify compatibility without revealing your personal information.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="w-full"
      >
        <Card>
          <CardHeader>
            <CardTitle>Private Information</CardTitle>
            <CardDescription>
              This data stays private and is only used for ZK compatibility matching
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                min="18"
                max="100"
                value={formData.age}
                onChange={(e) => handleInputChange('age', e.target.value)}
                placeholder="Enter your age"
                disabled={isRegistering}
              />
            </div>
            
            <div>
              <Label htmlFor="location">Location (City)</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="e.g., New York, San Francisco"
                disabled={isRegistering}
              />
            </div>
            
            <div>
              <Label htmlFor="bio">Brief Bio</Label>
              <Input
                id="bio"
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                placeholder="Tell us about yourself..."
                disabled={isRegistering}
              />
            </div>

            <div className="pt-4">
              <Button 
                size="lg" 
                onClick={handleRegister}
                disabled={isRegistering}
                className="w-full"
              >
                {isRegistering ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Private Profile...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Create Profile with ZK Privacy
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-6 text-sm text-muted-foreground max-w-md"
      >
        <p>🔒 Your exact age, location, and bio are never revealed</p>
        <p>🔍 Only compatibility matches are computed privately</p>
        <p>🛡️ Powered by Midnight Network zero-knowledge proofs</p>
      </motion.div>
    </div>
  );
};
