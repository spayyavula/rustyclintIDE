import React from 'react';
import { CheckCircle } from 'lucide-react';

interface SubscriptionStatusProps {
  className?: string;
}

const SubscriptionStatus: React.FC<SubscriptionStatusProps> = ({ className = '' }) => (
  <div className={`flex items-center space-x-2 ${className}`}>
    <CheckCircle className="w-4 h-4 text-green-400" />
    <span className="text-sm font-medium text-green-400">
      Free Forever
    </span>
  </div>
);

export default SubscriptionStatus;