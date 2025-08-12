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
  AlertTriangle
} from 'lucide-react';
import { useAndroidDeployment } from '../hooks/useAndroidDeployment';

interface AndroidDeploymentHistoryProps {
  onClose?: () => void;
}

const AndroidDeploymentHistory: React.FC<AndroidDeploymentHistoryProps> = ({ onClose }) => {
  const [deployments, setDeployments] = useState<any[]>([]);
  const [selectedDeployment, setSelectedDeployment] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { getDeployments, loading, error } = useAndroidDeployment();

  useEffect(() => {
    fetchDeployments();
  }, []);

  const fetchDeployments = async () => {
    setIsLoading(true);
    try {
      const deploymentData = await getDeployments();
      setDeployments(deploymentData || []);
    } catch (err) {
      console.error('Failed to fetch deployments:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400 bg-green-900/20';
      case 'failed':
        return 'text-red-400 bg-red-900/20';
      case 'building':
      case 'signing':
      case 'uploading':
        return 'text-blue-400 bg-blue-900/20';
      case 'pending':
        return 'text-yellow-400 bg-yellow-900/20';
      default:
        return 'text-gray-400 bg-gray-900/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-400" />; 
      case 'building':
      case 'signing':
      case 'uploading':
        return <RefreshCcw className="w-4 h-4 text-blue-400 animate-spin" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-400" />;
      default:
        return <Info className="w-4 h-4 text-gray-400" />;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const formatDuration = (startDate: string, endDate: string) => {
    if (!startDate || !endDate) return 'N/A';
    
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const durationMs = end - start;
    
    // Format as minutes and seconds
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    
    return `${minutes}m ${seconds}s`;
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return 'N/A';
    
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-h-[95vh] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-700">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl shadow-lg">
            <Smartphone className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Android Deployment History</h2>
            <p className="text-gray-400">View past deployments and their status</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-xl"
          >
            ✕
          </button>
        )}
      </div>

      <div className="flex h-[80vh]">
        {/* Deployments List */}
        <div className="w-80 bg-gray-900 border-r border-gray-700 p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Deployments</h3>
            <button
              onClick={fetchDeployments}
              disabled={loading}
              className="p-2 text-gray-400 hover:text-white disabled:opacity-50 transition-colors rounded-lg hover:bg-gray-800"
              title="Refresh"
            >
              <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              <RefreshCcw className="w-6 h-6 text-blue-400 animate-spin" />
            </div>
          ) : deployments.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Smartphone className="w-12 h-12 mx-auto mb-3 text-gray-500" />
              <p>No deployments found</p>
              <p className="text-sm mt-2">Deploy your first Android app to see history</p>
            </div>
          ) : (
            <div className="space-y-3">
              {deployments.map((deployment) => (
                <button
                  key={deployment.id}
                  onClick={() => setSelectedDeployment(deployment)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedDeployment?.id === deployment.id
                      ? 'bg-blue-600/20 border border-blue-500'
                      : 'bg-gray-800 border border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium text-white">v{deployment.version_name}</div>
                    <div className={`px-2 py-1 rounded text-xs ${getStatusColor(deployment.status)}`}>
                      {deployment.status.toUpperCase()}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(deployment.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FileText className="w-3 h-3" />
                      <span>{deployment.output_type.toUpperCase()}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Deployment Details */}
        <div className="flex-1 p-6 overflow-y-auto">
          {selectedDeployment ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-white">Deployment Details</h3>
                  <p className="text-gray-400">Version {selectedDeployment.version_name} (Code: {selectedDeployment.version_code})</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm ${getStatusColor(selectedDeployment.status)}`}>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(selectedDeployment.status)}
                    <span>{selectedDeployment.status.toUpperCase()}</span>
                  </div>
                </div>
              </div>
              
              {/* Deployment Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-1">Build Type</div>
                  <div className="text-white font-medium capitalize">{selectedDeployment.build_type}</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-1">Output Type</div>
                  <div className="text-white font-medium uppercase">{selectedDeployment.output_type}</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-1">Track</div>
                  <div className="text-white font-medium capitalize">{selectedDeployment.track || 'Not specified'}</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-1">File Size</div>
                  <div className="text-white font-medium">{formatFileSize(selectedDeployment.file_size)}</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-1">Started</div>
                  <div className="text-white font-medium">{formatDate(selectedDeployment.started_at)}</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-1">Completed</div>
                  <div className="text-white font-medium">
                    {selectedDeployment.completed_at ? formatDate(selectedDeployment.completed_at) : 'In progress'}
                  </div>
                </div>
                <div className="bg-gray-700 rounded-lg p-4 col-span-2">
                  <div className="text-sm text-gray-400 mb-1">Duration</div>
                  <div className="text-white font-medium">
                    {selectedDeployment.completed_at 
                      ? formatDuration(selectedDeployment.started_at, selectedDeployment.completed_at) 
                      : 'In progress'}
                  </div>
                </div>
              </div>
              
              {/* Error Message */}
              {selectedDeployment.error_message && (
                <div className="bg-red-900/20 border border-red-500 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                    <h4 className="font-medium text-red-300">Error</h4>
                  </div>
                  <p className="text-red-300 whitespace-pre-wrap">{selectedDeployment.error_message}</p>
                </div>
              )}
              
              {/* Build Logs */}
              {selectedDeployment.build_logs && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-white">Build Logs</h4>
                    <button className="text-gray-400 hover:text-white transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm max-h-96 overflow-y-auto">
                    <pre className="text-gray-300 whitespace-pre-wrap">{selectedDeployment.build_logs}</pre>
                  </div>
                </div>
              )}
              
              {/* Actions */}
              <div className="flex space-x-4">
                {selectedDeployment.file_path && (
                  <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                    <Download className="w-4 h-4" />
                    <span>Download {selectedDeployment.output_type.toUpperCase()}</span>
                  </button>
                )}
                
                {selectedDeployment.status === 'completed' && selectedDeployment.track && (
                  <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                    <ExternalLink className="w-4 h-4" />
                    <span>View in Play Console</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Smartphone className="w-16 h-16 text-gray-500 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Deployment Selected</h3>
              <p className="text-gray-400 max-w-md">
                Select a deployment from the list to view details, or deploy a new Android app to get started.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AndroidDeploymentHistory;