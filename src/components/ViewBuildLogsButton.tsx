import React, { useState } from 'react';
import { Terminal } from 'lucide-react';
import AndroidBuildLogs from './AndroidBuildLogs';

interface ViewBuildLogsButtonProps {
  deploymentId?: number;
  logs?: string;
  isLive?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const ViewBuildLogsButton: React.FC<ViewBuildLogsButtonProps> = ({
  deploymentId,
  logs,
  isLive = false,
  variant = 'primary',
  size = 'md',
  className = '',
}) => {
  const [showLogs, setShowLogs] = useState(false);

  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-green-600 hover:bg-green-700 text-white';
      case 'secondary':
        return 'bg-blue-600 hover:bg-blue-700 text-white';
      case 'outline':
        return 'border border-gray-600 hover:border-green-500 text-gray-300 hover:text-white bg-transparent hover:bg-green-600/10';
      default:
        return 'bg-green-600 hover:bg-green-700 text-white';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1 text-sm';
      case 'md':
        return 'px-4 py-2';
      case 'lg':
        return 'px-6 py-3 text-lg';
      default:
        return 'px-4 py-2';
    }
  };

  return (
    <>
      <button
        onClick={() => setShowLogs(true)}
        className={`
          flex items-center justify-center space-x-2 
          ${getVariantClasses()} 
          ${getSizeClasses()}
          rounded-lg font-medium transition-colors
          ${className}
        `}
      >
        <Terminal className="w-4 h-4" />
        <span>View Build Logs</span>
        {isLive && (
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        )}
      </button>

      {showLogs && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-6xl">
            <AndroidBuildLogs
              deploymentId={deploymentId}
              logs={logs}
              isLive={isLive}
              onClose={() => setShowLogs(false)}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ViewBuildLogsButton;