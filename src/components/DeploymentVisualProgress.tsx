import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Clock, RefreshCcw } from 'lucide-react';

interface DeploymentVisualProgressProps {
  progress: number;
  status?: string;
  message?: string;
  platform?: string;
  className?: string;
  showDetails?: boolean;
  animate?: boolean;
}

const DeploymentVisualProgress: React.FC<DeploymentVisualProgressProps> = ({
  progress,
  status = 'building',
  message,
  platform = 'android',
  className = '',
  showDetails = true,
  animate = true
}) => {
  // Start with at least 65% progress for demo purposes
  const [animatedProgress, setAnimatedProgress] = useState(Math.max(progress, 65));
  // Ensure progress is at least 65%
  const safeProgress = Math.max(progress, 65);

  useEffect(() => {
    if (!animate) {
      setAnimatedProgress(Math.max(progress, 65));
      return;
    }
    
    // Animate progress smoothly
    const start = animatedProgress;
    const duration = 500;
    const startTime = performance.now();

    const animateProgress = (timestamp: number) => {
      const elapsed = timestamp - startTime;
      const nextProgress = Math.min(start + ((safeProgress - start) * elapsed) / duration, safeProgress);
      
      setAnimatedProgress(nextProgress);
      
      if (elapsed < duration && nextProgress < safeProgress) {
        requestAnimationFrame(animateProgress);
      } else {
        setAnimatedProgress(safeProgress);
      }
    };

    requestAnimationFrame(animateProgress);
  }, [safeProgress, animate, animatedProgress]);

  const getStatusIcon = () => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-400" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-400" />;
      case 'building':
      case 'signing':
      case 'uploading':
      case 'running':
        return <RefreshCcw className="w-5 h-5 text-blue-400 animate-spin" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'completed':
        return 'from-green-500 to-emerald-500';
      case 'failed':
        return 'from-red-500 to-rose-500';
      case 'pending':
        return 'from-yellow-500 to-amber-500';
      case 'building':
      case 'signing':
      case 'uploading':
      case 'running':
        return 'from-blue-500 to-indigo-500';
      default:
        return 'from-gray-500 to-slate-500';
    }
  };

  const getPlatformColor = () => {
    switch (platform) {
      case 'android':
        return 'from-green-500 to-emerald-500';
      case 'ios':
        return 'from-blue-500 to-cyan-500';
      case 'web':
        return 'from-purple-500 to-pink-500';
      default:
        return 'from-gray-500 to-slate-500';
    }
  };

  return (
    <div className={`${className}`}>
      {showDetails && (
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <span className="text-sm font-medium text-white">{status.charAt(0).toUpperCase() + status.slice(1)}</span>
          </div>
          <span className="text-sm text-gray-400">{Math.round(progress)}%</span>
        </div>
      )}
      
      <div className="relative h-3 bg-gray-700 rounded-full overflow-hidden shadow-inner">
        {/* Progress bar with gradient and animation */}
        <div 
          className={`absolute top-0 left-0 h-full bg-gradient-to-r ${status === 'pending' ? getPlatformColor() : getStatusColor()} transition-all duration-300 rounded-full`}
          style={{ width: `${Math.max(animatedProgress, 65)}%` }}
        >
          {/* Shimmer effect */}
          <div 
            className="absolute inset-0 rounded-full overflow-hidden"
            style={{
              backgroundImage: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)',
              backgroundSize: '200% 100%',
              animation: animate ? 'shimmer 2s infinite' : 'none'
            }}
          ></div>
        </div>
      </div>
      
      {showDetails && message && (
        <div className="mt-2 text-sm text-gray-300">{message || 'Building Android application...'}</div>
      )}
    </div>
  );
}

export default DeploymentVisualProgress;