import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  XCircle,
  Clock,
  RefreshCw, 
  ExternalLink,
  Download,
  Smartphone,
  Globe,
  Server,
  ArrowRight
} from 'lucide-react';
import DeploymentVisualProgress from './DeploymentVisualProgress';

interface DeploymentStatusProps {
  deployUrl?: string;
  deployId?: string;
  status?: 'success' | 'error' | 'in_progress' | 'idle';
  platform?: 'web' | 'android' | 'ios';
  onRefresh?: () => void;
}

const DeploymentStatus: React.FC<DeploymentStatusProps> = ({
  deployUrl,
  deployId,
  status = 'idle',
  platform = 'web',
  onRefresh
}) => {
  const [progress, setProgress] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  
  // Simulate progress updates for in-progress deployments
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (status === 'in_progress') {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) return prev;
          return prev + (Math.random() * 5);
        });
        
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    } else if (status === 'success') {
      setProgress(100);
    } else {
      setProgress(0);
    }
    
    return () => clearInterval(interval);
  }, [status]);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const getStatusIcon = () => {
    switch (status) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'error': return <XCircle className="w-5 h-5 text-red-400" />;
      case 'in_progress': return <RefreshCw className="w-5 h-5 text-blue-400 animate-spin" />;
      default: return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };
  
  const getPlatformIcon = () => {
    switch (platform) {
      case 'android': return <Smartphone className="w-5 h-5 text-green-400" />;
      case 'ios': return <Smartphone className="w-5 h-5 text-blue-400" />;
      case 'web': return <Globe className="w-5 h-5 text-purple-400" />;
      default: return <Server className="w-5 h-5 text-gray-400" />;
    }
  };
  
  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {getPlatformIcon()}
          <h3 className="text-lg font-semibold text-white">
            {platform.charAt(0).toUpperCase() + platform.slice(1)} Deployment
          </h3>
        </div>
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <span className={`text-sm font-medium ${
            status === 'success' ? 'text-green-400' :
            status === 'error' ? 'text-red-400' :
            status === 'in_progress' ? 'text-blue-400' :
            'text-gray-400'
          }`}>
            {status === 'success' ? 'Deployed' :
             status === 'error' ? 'Failed' :
             status === 'in_progress' ? 'Deploying' :
             'Not Deployed'}
          </span>
        </div>
      </div>
      
      {status === 'in_progress' && (
        <div className="mb-4">
          <DeploymentVisualProgress
            progress={progress}
            status="running"
            platform={platform}
            animate={true}
          />
          <div className="flex justify-between mt-2 text-sm text-gray-400">
            <span>Time elapsed: {formatTime(timeElapsed)}</span>
            <span>Estimated: 2-3 minutes</span>
          </div>
        </div>
      )}
      
      {status === 'success' && deployUrl && (
        <div className="mb-4">
          <div className="flex items-center space-x-2 bg-green-900/20 border border-green-500/30 rounded-lg p-3">
            <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-green-300 font-medium">Deployment successful!</p>
              <p className="text-sm text-green-200 truncate">{deployUrl}</p>
            </div>
          </div>
        </div>
      )}
      
      {status === 'error' && (
        <div className="mb-4">
          <div className="flex items-start space-x-2 bg-red-900/20 border border-red-500/30 rounded-lg p-3">
            <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-300 font-medium">Deployment failed</p>
              <p className="text-sm text-red-200">There was an error during the deployment process.</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex flex-wrap gap-2">
        {status === 'success' && deployUrl && (
          <a 
            href={deployUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Visit Site</span>
          </a>
        )}
        
        {status === 'success' && platform === 'android' && (
          <button className="flex items-center space-x-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
            <Download className="w-4 h-4" />
            <span>Download APK</span>
          </button>
        )}
        
        {(status === 'idle' || status === 'error') && (
          <button className="flex items-center space-x-2 px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors">
            <ArrowRight className="w-4 h-4" />
            <span>Start Deployment</span>
          </button>
        )}
        
        {onRefresh && (
          <button 
            onClick={onRefresh}
            className="flex items-center space-x-2 px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh Status</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default DeploymentStatus;