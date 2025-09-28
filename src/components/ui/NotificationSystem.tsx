'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Shield, User, Clock, CheckCircle, AlertCircle } from 'lucide-react';

export interface Notification {
  id: string;
  type: 'match_request' | 'match_approved' | 'match_rejected' | 'system' | 'success' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  from?: string;
  read?: boolean;
}

interface NotificationSystemProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onDismiss: (id: string) => void;
  onApproveMatch?: (notificationId: string) => void;
  onRejectMatch?: (notificationId: string) => void;
}

const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'match_request':
      return <Heart className="w-5 h-5 text-pink-500" />;
    case 'match_approved':
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    case 'match_rejected':
      return <X className="w-5 h-5 text-red-500" />;
    case 'system':
      return <Shield className="w-5 h-5 text-purple-500" />;
    case 'success':
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    case 'error':
      return <AlertCircle className="w-5 h-5 text-red-500" />;
    default:
      return <User className="w-5 h-5 text-gray-500" />;
  }
};

const getNotificationColor = (type: Notification['type']) => {
  switch (type) {
    case 'match_request':
      return 'border-pink-200 bg-pink-50 dark:border-pink-800 dark:bg-pink-900/20';
    case 'match_approved':
      return 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20';
    case 'match_rejected':
      return 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20';
    case 'system':
      return 'border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-900/20';
    case 'success':
      return 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20';
    case 'error':
      return 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20';
    default:
      return 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800';
  }
};

export default function NotificationSystem({
  notifications,
  onMarkAsRead,
  onDismiss,
  onApproveMatch,
  onRejectMatch
}: NotificationSystemProps) {
  const [visibleNotifications, setVisibleNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    setVisibleNotifications(notifications.slice(0, 5)); // Show max 5 notifications
  }, [notifications]);

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return timestamp.toLocaleDateString();
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 w-80">
      <AnimatePresence>
        {visibleNotifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            transition={{ type: "spring", duration: 0.5 }}
            className={`relative p-4 rounded-xl border shadow-lg backdrop-blur-sm ${getNotificationColor(notification.type)}`}
          >
            {/* Close button */}
            <button
              onClick={() => onDismiss(notification.id)}
              className="absolute top-2 right-2 p-1 hover:bg-black/10 rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Notification content */}
            <div className="flex items-start gap-3 pr-6">
              <div className="flex-shrink-0 mt-1">
                {getNotificationIcon(notification.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                    {notification.title}
                  </h4>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                  )}
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                  {notification.message}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>{formatTimestamp(notification.timestamp)}</span>
                  </div>
                  
                  {notification.from && (
                    <span className="text-xs text-gray-500">
                      from {notification.from}
                    </span>
                  )}
                </div>

                {/* Action buttons for match requests */}
                {notification.type === 'match_request' && onApproveMatch && onRejectMatch && (
                  <div className="flex gap-2 mt-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onApproveMatch(notification.id)}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white text-xs py-2 px-3 rounded-lg transition-colors"
                    >
                      Approve
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onRejectMatch(notification.id)}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white text-xs py-2 px-3 rounded-lg transition-colors"
                    >
                      Reject
                    </motion.button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}