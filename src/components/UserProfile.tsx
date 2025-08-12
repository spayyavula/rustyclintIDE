import React, { useState, useEffect } from 'react';
import { User, Crown, Calendar, CreditCard, LogOut, Settings } from 'lucide-react';
import { useSubscription } from '../hooks/useSubscription';
import SubscriptionStatus from './SubscriptionStatus';

interface UserProfileProps {
  user: any;
  onClose: () => void;
  onLogout: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onClose, onLogout }) => {
  const { subscription, loading } = useSubscription();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-400 bg-green-900/20';
      case 'past_due':
        return 'text-yellow-400 bg-yellow-900/20';
      case 'canceled':
        return 'text-red-400 bg-red-900/20';
      default:
        return 'text-gray-400 bg-gray-900/20';
    }
  };

  const formatDate = (timestamp: number | null) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg max-w-md w-full p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">User Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          {/* User Info */}
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{user.email}</h3>
              <p className="text-gray-400">Rust Developer</p>
            </div>
          </div>

          {/* Subscription Info */}
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Crown className="w-5 h-5 text-yellow-400" />
              <h4 className="font-semibold text-white">Subscription</h4>
            </div>
            
            <SubscriptionStatus />
            
            {!loading && subscription && subscription.subscription_status && (
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Status:</span>
                  <span className={`px-2 py-1 rounded text-xs ${getStatusColor(subscription.subscription_status)}`}>
                    {subscription.subscription_status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                
                {subscription.current_period_end && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Next billing:</span>
                    <span className="text-white">{formatDate(subscription.current_period_end)}</span>
                  </div>
                )}
                
                {subscription.cancel_at_period_end && (
                  <div className="text-yellow-400 text-sm">
                    Subscription will cancel at period end
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Payment Method */}
          {subscription && subscription.payment_method_brand && (
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <CreditCard className="w-5 h-5 text-blue-400" />
                <h4 className="font-semibold text-white">Payment Method</h4>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Card:</span>
                <span className="text-white">
                  {subscription.payment_method_brand.toUpperCase()} •••• {subscription.payment_method_last4}
                </span>
              </div>
            </div>
          )}

          {/* Account Details */}
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Calendar className="w-5 h-5 text-green-400" />
              <h4 className="font-semibold text-white">Account Details</h4>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Member since:</span>
                <span className="text-white">
                  {new Date(user.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Last sign in:</span>
                <span className="text-white">
                  {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'Never'}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button className="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors">
              <Settings className="w-4 h-4" />
              <span>Account Settings</span>
            </button>
            
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;