import React, { useState, useEffect } from 'react';
import { 
  Rocket, 
  X, 
  RefreshCcw, 
  CheckCircle, 
  XCircle, 
  Clock,
  ExternalLink,
  ArrowRight,
  Smartphone,
  Globe,
  Server,
  Copy
} from 'lucide-react';
import DeploymentStatus from './DeploymentStatus';

interface DeploymentStatusPanelProps {
  isVisible: boolean;
  onClose: () => void;
  deployUrl?: string;
  deployId?: string;
}

const DeploymentStatusPanel: React.FC<DeploymentStatusPanelProps> = ({
  isVisible,
  onClose,
  deployUrl,
  deployId
}) => {
  const [deploymentStatus, setDeploymentStatus] = useState<'success' | 'error' | 'in_progress' | 'idle'>(
    deployUrl ? 'success' : 'idle'
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(new Date());
  const [copySuccess, setCopySuccess] = useState(false);
  
  useEffect(() => {
    if (deployUrl) {
      setDeploymentStatus('success');
      setLastUpdated(new Date());
    }
  }, [deployUrl]);
  
  const refreshStatus = async () => {
    setIsRefreshing(true);
    
    try {
      // In a real app, you would fetch the deployment status from your API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, we'll just set it to success if we have a deployUrl
      if (deployUrl) {
        setDeploymentStatus('success');
      }
      
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error refreshing deployment status:', error);
    } finally {
      setIsRefreshing(false);
    }
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };
  
  if (!isVisible) return null;
  
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl shadow-lg">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Deployment Status</h2>
              <p className="text-gray-400">Monitor your application deployments</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="space-y-6">
            {/* Last Updated */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-400">
                {lastUpdated ? (
                  <>Last updated: {lastUpdated.toLocaleTimeString()}</>
                ) : (
                  <>Status not checked yet</>
                )}
              </div>
              <button
                onClick={refreshStatus}
                disabled={isRefreshing || deploymentStatus === 'in_progress'}
                className="flex items-center space-x-2 px-3 py-1 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white rounded-lg text-sm transition-colors"
              >
                <RefreshCcw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>
            
            {/* Web Deployment Status */}
            <div className="bg-gray-700 rounded-lg border border-gray-600 p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Globe className="w-5 h-5 text-purple-400" />
                  <h3 className="text-lg font-semibold text-white">Web Deployment</h3>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-sm font-medium text-green-400">Deployed</span>
                </div>
              </div>
              
              {deployUrl && (
                <div className="mb-4">
                  <div className="flex items-center space-x-2 bg-green-900/20 border border-green-500/30 rounded-lg p-3">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-green-300 font-medium">Deployment successful!</p>
                      <div className="flex items-center mt-1">
                        <p className="text-sm text-green-200 truncate mr-2">{deployUrl}</p>
                        <button 
                          onClick={() => copyToClipboard(deployUrl)}
                          className="p-1 hover:bg-gray-600 rounded text-gray-300 hover:text-white transition-colors"
                          title="Copy URL"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        {copySuccess && (
                          <span className="text-xs text-green-300 ml-1">Copied!</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex flex-wrap gap-2">
                {deployUrl && (
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
                
                <button 
                  onClick={refreshStatus}
                  className="flex items-center space-x-2 px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  <RefreshCcw className="w-4 h-4" />
                  <span>Refresh Status</span>
                </button>
              </div>
            </div>
            
            {/* Deployment Details */}
            <div className="bg-gray-700 rounded-lg border border-gray-600 p-5">
              <h3 className="text-lg font-semibold text-white mb-3">Deployment Details</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300">Status:</span>
                  <span className="text-green-400 font-medium">Live</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Platform:</span>
                  <span className="text-white">Netlify</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Deployment URL:</span>
                  <a 
                    href={deployUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    {deployUrl ? new URL(deployUrl).hostname : 'N/A'}
                  </a>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Deployed at:</span>
                  <span className="text-white">{lastUpdated?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Branch:</span>
                  <span className="text-white">main</span>
                </div>
              </div>
            </div>
            
            {/* Help Text */}
            <div className="text-sm text-gray-400 mt-4">
              <p>Your site is now live at <a href={deployUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">{deployUrl}</a>. You can continue to make changes and redeploy as needed.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeploymentStatusPanel;