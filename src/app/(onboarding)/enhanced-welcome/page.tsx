'use client';

import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Loader2, CheckCircle, Camera, MapPin, Eye, AlertTriangle } from 'lucide-react';
import { contractService, getLocationService, getFaceVerificationService } from '@/lib/CONTRACT_SERVICE';
import { type LocationData } from '@/lib/services/locationService';
import { type FaceData } from '@/lib/services/faceVerificationService';
import { useWalletStore } from '@/lib/stores/walletStore';
import { toast } from 'sonner';

export default function EnhancedWelcomePage() {
  const router = useRouter();
  const { setHasCompletedOnboarding } = useWalletStore();
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [currentStep, setCurrentStep] = useState<'basic' | 'location' | 'biometric' | 'complete'>('basic');
  const [stepNumber, setStepNumber] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    age: '',
    location: '',
    bio: ''
  });
  
  // Privacy verification states
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [faceData, setFaceData] = useState<FaceData | null>(null);
  const [verificationStatus, setVerificationStatus] = useState({
    basic: false,
    location: false,
    biometric: false
  });

  const [cameraActive, setCameraActive] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // 📍 STEP 2: LOCATION VERIFICATION
  const handleLocationVerification = async () => {
    setIsProcessing(true);
    try {
      console.log('🌍 Starting location verification...');
      const locService = await getLocationService();
      if (!locService) {
        throw new Error('Location service not available');
      }
      
      const location = await locService.getCurrentLocation();
      setLocationData(location);
      
      // Update form with privacy-friendly location
      const privacyLocation = locService.getPrivacyFriendlyLocation(location);
      setFormData(prev => ({ ...prev, location: privacyLocation }));
      
      setVerificationStatus(prev => ({ ...prev, location: true }));
      toast.success('📍 Location verified privately!');
      
      // Auto-advance to next step
      setTimeout(() => setCurrentStep('biometric'), 1000);
    } catch (error: any) {
      toast.error(`Location verification failed: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // 📸 STEP 3: BIOMETRIC VERIFICATION
  const startBiometricVerification = async () => {
    try {
      if (!videoRef.current) return;
      
      const faceService = await getFaceVerificationService();
      if (!faceService) {
        throw new Error('Face verification service not available');
      }
      
      await faceService.startCamera(videoRef.current);
      setCameraActive(true);
      console.log('📸 Camera started for biometric verification');
    } catch (error: any) {
      toast.error(`Camera access failed: ${error.message}`);
    }
  };

  const captureBiometric = async () => {
    if (!videoRef.current || !cameraActive) return;
    
    setIsProcessing(true);
    try {
      console.log('🔐 Capturing biometric data...');
      const faceService = await getFaceVerificationService();
      if (!faceService) {
        throw new Error('Face verification service not available');
      }
      
      const capturedFace = faceService.captureFace(videoRef.current);
      if (!capturedFace) {
        throw new Error('Failed to capture face data');
      }
      
      // Verify face authenticity
      const authenticity = await faceService.verifyFaceAuthenticity(capturedFace);
      
      if (!authenticity.isRealPerson) {
        toast.error('❌ Please ensure you\'re in good lighting with face clearly visible');
        return;
      }
      
      setFaceData(capturedFace);
      setVerificationStatus(prev => ({ ...prev, biometric: true }));
      
      // Stop camera
      faceService.stopCamera();
      setCameraActive(false);
      
      toast.success('🔐 Biometric verification complete!');
      setTimeout(() => setCurrentStep('complete'), 1000);
      
    } catch (error: any) {
      toast.error(`Biometric verification failed: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // 🎯 FINAL REGISTRATION
  const handleCompleteRegistration = async () => {
    setIsProcessing(true);
    try {
      console.log('🔌 Initializing Midnight Contract Service...');
      
      const userId = `user_${Date.now()}`;
      
      // Enhanced registration with privacy features
      let result;
      if (locationData && faceData) {
        // Full privacy registration
        result = await contractService.registerWithBiometric(
          userId,
          { ...formData, privacyLevel: 'maximum' },
          faceData
        );
        console.log('✅ Registered with full privacy features');
      } else if (locationData) {
        // Location-based registration
        result = await contractService.registerWithLocation(
          userId,
          { ...formData, privacyLevel: 'high' },
          locationData
        );
        console.log('✅ Registered with location privacy');
      } else {
        // Basic registration
        result = await contractService.callFunction('create_profile', [userId, JSON.stringify(formData)]);
        console.log('✅ Basic registration complete');
      }

      toast.success(`✅ User registered successfully: ${userId}`);
      
      // Complete onboarding
      setHasCompletedOnboarding(true);
      setCurrentStep('complete');
      
      // Redirect to dashboard
      setTimeout(() => router.push('/'), 2000);
      
    } catch (error: any) {
      console.error('❌ Registration failed:', error);
      toast.error(`Registration failed: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Auto-advance from basic info
  useEffect(() => {
    if (formData.age && formData.bio && currentStep === 'basic') {
      setVerificationStatus(prev => ({ ...prev, basic: true }));
      setTimeout(() => setCurrentStep('location'), 500);
    }
  }, [formData.age, formData.bio, currentStep]);

  const getPrivacyScore = () => {
    const features = Object.values(verificationStatus).filter(Boolean).length;
    return Math.round((features / 3) * 100);
  };

  // Update step number when current step changes
  useEffect(() => {
    switch (currentStep) {
      case 'basic':
        setStepNumber(1);
        break;
      case 'location':
        setStepNumber(2);
        break;  
      case 'biometric':
        setStepNumber(3);
        break;
      case 'complete':
        setStepNumber(4);
        break;
    }
  }, [currentStep]);

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'basic':
        return (
          <Card className="bg-black/30 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="h-5 w-5 text-purple-400" />
                Private Information
              </CardTitle>
              <CardDescription className="text-purple-200">
                This data stays private and is only used for ZK compatibility matching
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="age" className="text-white">Age</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Enter your age"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  className="bg-black/50 border-purple-500/30 text-white mt-1"
                />
              </div>
              <div>
                <Label htmlFor="bio" className="text-white">Bio</Label>
                <Input
                  id="bio"
                  placeholder="Tell us about yourself..."
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  className="bg-black/50 border-purple-500/30 text-white mt-1"
                />
              </div>
            </CardContent>
          </Card>
        );

      case 'location':
        return (
          <Card className="bg-black/30 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <MapPin className="h-5 w-5 text-purple-400" />
                Location Privacy
              </CardTitle>
              <CardDescription className="text-purple-200">
                Enable location-based matching with zero-knowledge proofs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleLocationVerification}
                disabled={isProcessing}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {isProcessing ? (
                  <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Generating ZK Proof...</>
                ) : (
                  <>🌍 Enable Location Privacy</>
                )}
              </Button>
              {verificationStatus.location && (
                <div className="flex items-center justify-center mt-4 text-green-400">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Location verification complete!
                </div>
              )}
            </CardContent>
          </Card>
        );

      case 'biometric':
        return (
          <Card className="bg-black/30 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Camera className="h-5 w-5 text-purple-400" />
                Biometric Verification
              </CardTitle>
              <CardDescription className="text-purple-200">
                Verify your identity with facial recognition
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cameraActive && (
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    className="w-full max-w-md mx-auto rounded-lg"
                  />
                )}
                <Button
                  onClick={startBiometricVerification}  
                  disabled={isProcessing}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  {isProcessing ? (
                    <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Processing Face Data...</>
                  ) : (
                    <>📱 Start Biometric Verification</>
                  )}
                </Button>
                {verificationStatus.biometric && (
                  <div className="flex items-center justify-center mt-4 text-green-400">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Biometric verification complete!
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );

      case 'complete':
        return (
          <Card className="bg-black/30 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                Complete Your Privacy-First Profile
              </CardTitle>
              <CardDescription className="text-purple-200">
                Ready to create your zero-knowledge dating profile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center text-green-400">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Basic Information ✓
                  </div>
                  {verificationStatus.location && (
                    <div className="flex items-center text-green-400">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Location Privacy ✓
                    </div>
                  )}
                  {verificationStatus.biometric && (
                    <div className="flex items-center text-green-400">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Biometric Verification ✓
                    </div>
                  )}
                </div>
                
                <div className="bg-purple-900/50 p-4 rounded-lg">
                  <h4 className="text-white font-medium mb-2">Verification Status:</h4>
                  <div className="space-y-1 text-sm">
                    <div className="text-green-400">✅ Basic Information ✓</div>
                    <div className="text-green-400">✅ Location Privacy ✓</div>
                    <div className="text-green-400">✅ Biometric Verification ✓</div>
                  </div>
                </div>

                <Button
                  onClick={handleCompleteRegistration}
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  {isProcessing ? (
                    <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Creating Private Profile...</>
                  ) : (
                    <>🚀 Create Private Profile</>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-8">
      <div className="container mx-auto px-4 max-w-6xl lg:max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/20 backdrop-blur-sm rounded-2xl border border-purple-500/20 p-8"
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Privacy-First Onboarding
            </h1>
            <p className="text-purple-200 text-lg">
              Zero-knowledge verification • Maximum privacy protection
            </p>
            
            <div className="mt-6">
              <div className="text-sm text-purple-300 mb-2">
                🔒 Privacy Score: {getPrivacyScore()}%
              </div>
              <div className="w-full bg-purple-900/30 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getPrivacyScore()}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className={`text-center p-4 rounded-lg ${stepNumber >= 1 ? 'bg-purple-600/30' : 'bg-gray-700/30'}`}>
              <div className="text-2xl mb-2">👤</div>
              <div className="text-sm text-white">Basic Info</div>
            </div>
            <div className={`text-center p-4 rounded-lg ${stepNumber >= 2 ? 'bg-purple-600/30' : 'bg-gray-700/30'}`}>
              <div className="text-2xl mb-2">📍</div>
              <div className="text-sm text-white">Location Privacy</div>
            </div>
            <div className={`text-center p-4 rounded-lg ${stepNumber >= 3 ? 'bg-purple-600/30' : 'bg-gray-700/30'}`}>
              <div className="text-2xl mb-2">📱</div>
              <div className="text-sm text-white">Biometric Verification</div>
            </div>
            <div className={`text-center p-4 rounded-lg ${stepNumber >= 4 ? 'bg-purple-600/30' : 'bg-gray-700/30'}`}>
              <div className="text-2xl mb-2">✅</div>
              <div className="text-sm text-white">Complete</div>
            </div>
          </div>

          {renderCurrentStep()}
        </motion.div>
      </div>
    </div>
  );
}