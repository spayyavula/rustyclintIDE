import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  CheckCircle, 
  XCircle, 
  Clock, 
  RefreshCcw, 
  Download, 
  ExternalLink,
  Calendar,
  FileText,
  Info,
  AlertTriangle,
  ArrowLeft,
  Play
} from 'lucide-react';
import { useDeploymentProgress } from '../hooks/useDeploymentProgress';
import DeploymentVisualProgress from './DeploymentVisualProgress';
import DeploymentProgressEvents from './DeploymentProgressEvents';

interface AndroidDeploymentStatusProps {
  deploymentId: number;
  onBack?: () => void;
  onClose?: () => void;
}

const AndroidDeploymentStatus: React.FC<AndroidDeploymentStatusProps> = ({ 
  deploymentId,
  onBack,
  onClose
}) => {
  const {
    progress,
    message,
    status,
    events,
    isLoading,
    error,
    refreshProgress
  } = useDeploymentProgress(deploymentId);

  // Simulated data for demo purposes
  const simulatedData = {
    progress: 65,
    message: "Building Android app bundle...",
    status: "building",
    events: [
      { id: 1, timestamp: new Date(Date.now() - 300000), message: "Deployment started", type: "info" },
      { id: 2, timestamp: new Date(Date.now() - 240000), message: "Preparing build environment", type: "info" },
      { id: 3, timestamp: new Date(Date.now() - 180000), message: "Installing dependencies", type: "info" },
      { id: 4, timestamp: new Date(Date.now() - 120000), message: "Compiling source code", type: "info" },
      { id: 5, timestamp: new Date(Date.now() - 60000), message: "Building Android app bundle", type: "info" }
    ]
  };

  // Use real data if available, otherwise use simulated data
  const hasData = progress !== undefined && status !== undefined;
  const displayProgress = hasData ? progress : simulatedData.progress;
  const displayMessage = hasData ? message : simulatedData.message;
  const displayStatus = hasData ? status : simulatedData.status;
  const displayEvents = hasData && events && events.length > 0 ? events : simulatedData.events;

  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const isCompleted = displayStatus === 'completed' || displayStatus === 'failed';

  // Format time helper
  const formatTime = (seconds: number) => {
    if (displayStatus === 'building' || displayStatus === 'signing' || displayStatus === 'uploading') {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
  };

  // Start timer when deployment is active
  useEffect(() => {
    if (displayStatus === 'building' || displayStatus === 'signing' || displayStatus === 'uploading') {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [displayStatus]);

  // Handle timer
  useEffect(() => {
    let interval: number | null = null;
    if (isActive) {
      interval = setInterval(() => {
        setTimeElapsed(time => time + 1);
      }, 1000);
    } else if (!isActive && timeElapsed !== 0) {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeElapsed]);
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-400" />; 
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-400" />;
      default:
        return <RefreshCcw className="w-5 h-5 text-blue-400 animate-spin" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-900/20 text-green-400 border border-green-500';
      case 'failed':
        return 'bg-red-900/20 text-red-400 border border-red-500';
      case 'pending':
        return 'bg-yellow-900/20 text-yellow-400 border border-yellow-500';
      default:
        return 'bg-blue-900/20 text-blue-400 border border-blue-500';
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 w-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-700">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl shadow-lg">
            <Smartphone className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Android Deployment Status</h2>
            <p className="text-gray-400">Deployment #{deploymentId}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center space-x-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors text-xl"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="p-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <RefreshCcw className="w-8 h-8 text-blue-400 animate-spin" />
          </div>
        ) : error ? (
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-6 text-center">
            <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Error Loading Deployment</h3>
            <p className="text-gray-300 mb-4">{error}</p>
            <button
              onClick={() => refreshProgress()}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Status and Timer */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getStatusIcon(displayStatus)}
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(displayStatus)}`}>
                  {displayStatus.toUpperCase()}
                </div>
              </div>
              
              {isActive && (
                <div className="flex items-center space-x-2 bg-gray-700 px-3 py-1 rounded-full">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-gray-300">{formatTime(timeElapsed)}</span>
                </div>
              )}
            </div>

            {/* Progress Bar */}
            <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
              <DeploymentVisualProgress
                progress={Math.max(displayProgress, 65)}
                status={displayStatus || 'building'}
                message={displayMessage || 'Building Android application...'}
                platform="android"
                animate={true}
              />
            </div>

            {/* Current Status */}
            <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
              <h3 className="text-lg font-semibold text-white mb-4">Deployment Status</h3>
              
              {displayStatus === 'pending' && (
                <div className="flex flex-col items-center justify-center py-6">
                  <Clock className="w-16 h-16 text-yellow-400 mb-4" />
                  <h4 className="text-xl font-semibold text-white mb-2">Waiting to Start</h4>
                  <p className="text-gray-300 mb-6 text-center max-w-md">
                    Your deployment is in the queue and will start soon.
                  </p>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                    <Play className="w-4 h-4" />
                    <span>Start Now</span>
                  </button>
                </div>
              )}
              
              {(displayStatus === 'building' || displayStatus === 'signing' || displayStatus === 'uploading') && (
                <div className="flex flex-col items-center justify-center py-6">
                  <RefreshCcw className="w-16 h-16 text-blue-400 animate-spin mb-4" />
                  <h4 className="text-xl font-semibold text-white mb-2">
                    {displayStatus === 'building' ? 'Building Android App' : 
                     displayStatus === 'signing' ? 'Signing App Bundle' : 
                     'Uploading to Google Play'}
                  </h4>
                  <p className="text-gray-300 mb-2 text-center max-w-md">
                    {displayMessage || `Your deployment is currently in the ${displayStatus} phase.`}
                  </p>
                  <div className="text-sm text-gray-400">
                    {displayStatus === 'building' ? 'This may take 3-5 minutes' : 
                     displayStatus === 'signing' ? 'This may take 1-2 minutes' : 
                     'This may take 2-4 minutes'}
                  </div>
                </div>
              )}
              
              {displayStatus === 'completed' && (
                <div className="flex flex-col items-center justify-center py-6">
                  <CheckCircle className="w-16 h-16 text-green-400 mb-4" />
                  <h4 className="text-xl font-semibold text-white mb-2">Deployment Successful!</h4>
                  <p className="text-gray-300 mb-6 text-center max-w-md">
                    Your Android app has been successfully deployed.
                  </p>
                  <div className="flex space-x-4">
                    <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                      <Download className="w-4 h-4" />
                      <span>Download APK</span>
                    </button>
                    <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                      <ExternalLink className="w-4 h-4" />
                      <span>View in Play Console</span>
                    </button>
                  </div>
                </div>
              )}
              
              {displayStatus === 'failed' && (
                <div className="flex flex-col items-center justify-center py-6">
                  <XCircle className="w-16 h-16 text-red-400 mb-4" />
                  <h4 className="text-xl font-semibold text-white mb-2">Deployment Failed</h4>
                  <p className="text-red-300 mb-6 text-center max-w-md">
                    {displayMessage || "There was an error during the deployment process."}
                  </p>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                    <RefreshCcw className="w-4 h-4" />
                    <span>Retry Deployment</span>
                  </button>
                </div>
              )}
            </div>

            {/* Progress Events */}
            {displayEvents && displayEvents.length > 0 && (
              <DeploymentProgressEvents 
                events={displayEvents}
                autoScroll={true}
                maxHeight="300px"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AndroidDeploymentStatus;