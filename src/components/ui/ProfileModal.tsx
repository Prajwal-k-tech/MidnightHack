'use client';

import React from 'react';
import { X, Heart, Shield, MapPin, Clock, Sparkles } from 'lucide-react';
import { DemoAccount } from '@/lib/demoAccounts';
import { motion, AnimatePresence } from 'framer-motion';

interface ProfileModalProps {
  profile: DemoAccount | null;
  isOpen: boolean;
  onClose: () => void;
  onSendRequest: (profile: DemoAccount) => void;
  compatibility: number;
}

export default function ProfileModal({ 
  profile, 
  isOpen, 
  onClose, 
  onSendRequest, 
  compatibility 
}: ProfileModalProps) {
  if (!profile) return null;

  const handleSendRequest = () => {
    onSendRequest(profile);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with close button */}
            <div className="relative">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
              
              {/* Profile photo placeholder with gradient */}
              <div className="h-48 bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 flex items-center justify-center relative overflow-hidden">
                <div className="text-6xl">{profile.emoji}</div>
                <div className="absolute inset-0 bg-black/20"></div>
              </div>
            </div>

            {/* Profile content */}
            <div className="p-6">
              {/* Name and basic info */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {profile.name}
                  </h2>
                  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400 mt-1">
                    <span>{profile.age} years</span>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{profile.location}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                  <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                    {profile.membershipTier}
                  </span>
                </div>
              </div>

              {/* Compatibility score */}
              <div className="mb-4 p-3 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span className="font-medium text-green-700 dark:text-green-300">
                      ZK Compatibility Score
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                    {compatibility}%
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">About</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {profile.bio}
                </p>
              </div>

              {/* Interests */}
              <div className="mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((interest, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

              {/* Wallet and last seen */}
              <div className="mb-6 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Shield className="w-4 h-4" />
                    <span className="font-mono">
                      {profile.walletAddress.slice(0, 20)}...
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>{profile.lastSeen}</span>
                  </div>
                </div>
              </div>

              {/* Action button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSendRequest}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Heart className="w-5 h-5" />
                Send Private ZK Request
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}