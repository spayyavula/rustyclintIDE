import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  Play, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Terminal, 
  Download, 
  Upload,
  RefreshCcw,
  Shield,
  Settings,
  Zap,
  ArrowRight,
  AlertTriangle,
  Info,
  BarChart,
  Calendar,
  FileText,
  ExternalLink
} from 'lucide-react';
import ViewBuildLogsButton from './ViewBuildLogsButton';
import { useAndroidDeployment } from '../hooks/useAndroidDeployment';

interface AndroidDeploymentDashboardProps {
  onClose?: () => void;
  onRefreshFileTree?: () => void;
}

const AndroidDeploymentDashboard: React.FC<AndroidDeploymentDashboardProps> = ({ onClose, onRefreshFileTree }) => {
  const [deployments, setDeployments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'recent' | 'stats' | 'settings'>('recent');
  const { getDeployments } = useAndroidDeployment();

  useEffect(() => {
    fetchDeployments();
  }, []);

  const fetchDeployments = async () => {
    setIsLoading(true);
    try {
      // Use the hook or simulate data for demo
      // const deploymentData = await getDeployments();
      
      // Simulated data for demonstration
      const deploymentData = [
        {
          id: 1,
          version_name: '1.0.0',
          version_code: 1,
          build_type: 'release',
          output_type: 'aab',
          status: 'completed',
          track: 'internal',
          file_size: 38700000,
          started_at: new Date(Date.now() - 86400000).toISOString(),
          completed_at: new Date(Date.now() - 86390000).toISOString(),
          created_at: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: 2,
          version_name: '1.0.1',
          version_code: 2,
          build_type: 'release',
          output_type: 'aab',
          status: 'failed',
          track: 'internal',
          error_message: 'Keystore password incorrect',
          started_at: new Date(Date.now() - 43200000).toISOString(),
          completed_at: new Date(Date.now() - 43195000).toISOString(),
          created_at: new Date(Date.now() - 43200000).toISOString()
        },
        {
          id: 3,
          version_name: '1.0.2',
          version_code: 3,
          build_type: 'release',
          output_type: 'aab',
          status: 'completed',
          track: 'alpha',
          file_size: 38900000,
          started_at: new Date(Date.now() - 3600000).toISOString(),
          completed_at: new Date(Date.now() - 3590000).toISOString(),
          created_at: new Date(Date.now() - 3600000).toISOString()
        }
      ];
      
      setDeployments(deploymentData);
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

  const formatTimeAgo = (dateString: string) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    
    if (diffDay > 0) return `${diffDay}d ago`;
    if (diffHour > 0) return `${diffHour}h ago`;
    if (diffMin > 0) return `${diffMin}m ago`;
    return `${diffSec}s ago`;
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

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-h-[95vh] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-700">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl shadow-lg">
            <Smartphone className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Android Deployment Dashboard</h2>
            <p className="text-gray-400">Monitor and manage your Android app deployments</p>
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

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-700">
        {[
          { id: 'recent', label: 'Recent Deployments', icon: Clock },
          { id: 'stats', label: 'Statistics', icon: BarChart },
          { id: 'settings', label: 'Settings', icon: Settings }
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as any)}
            className={`flex-1 flex items-center justify-center space-x-2 px-6 py-4 transition-colors ${
              activeTab === id 
                ? 'bg-green-600 text-white border-b-2 border-green-400' 
                : 'text-gray-300 hover:text-white hover:bg-gray-700'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-6 overflow-y-auto max-h-[70vh]">
        {activeTab === 'recent' && (
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="flex space-x-4 mb-6">
              <button className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors">
                <Play className="w-5 h-5" />
                <span>New Deployment</span>
              </button>
              
              <button 
                onClick={fetchDeployments}
                className="flex items-center justify-center space-x-2 py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                <RefreshCcw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div> 
            
            {/* Recent Deployments */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Recent Deployments</h3>
              
              {isLoading ? (
                <div className="flex items-center justify-center h-40">
                  <RefreshCcw className="w-8 h-8 text-blue-400 animate-spin" />
                </div>
              ) : deployments.length === 0 ? (
                <div className="text-center py-12 bg-gray-700 rounded-lg">
                  <Smartphone className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <h4 className="text-xl font-semibold text-white mb-2">No Deployments Yet</h4>
                  <p className="text-gray-400 mb-6">Start your first Android deployment to see history here</p>
                  <button className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                    Start First Deployment
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {deployments.map((deployment) => (
                    <div key={deployment.id} className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="text-xl font-semibold text-white">v{deployment.version_name}</h4>
                            <div className={`px-2 py-1 rounded text-xs ${getStatusColor(deployment.status)}`}>
                              <div className="flex items-center space-x-1">
                                {getStatusIcon(deployment.status)}
                                <span>{deployment.status.toUpperCase()}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{formatTimeAgo(deployment.created_at)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <FileText className="w-4 h-4" />
                              <span>{deployment.output_type.toUpperCase()}</span>
                            </div>
                            {deployment.track && (
                              <div className="flex items-center space-x-1">
                                <Upload className="w-4 h-4" />
                                <span>{deployment.track}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-right">
                          {deployment.file_size && (
                            <div className="text-lg font-bold text-white mb-1">{formatFileSize(deployment.file_size)}</div>
                          )}
                          {deployment.started_at && deployment.completed_at && (
                            <div className="text-sm text-gray-400">
                              Duration: {formatDuration(deployment.started_at, deployment.completed_at)}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {deployment.error_message && (
                        <div className="bg-red-900/20 border border-red-500 rounded-lg p-3 mb-4">
                          <div className="flex items-center space-x-2 mb-1">
                            <AlertTriangle className="w-4 h-4 text-red-400" />
                            <span className="font-medium text-red-300">Error</span>
                          </div>
                          <p className="text-red-300 text-sm">{deployment.error_message}</p>
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-3">
                        <ViewBuildLogsButton 
                          deploymentId={deployment.id}
                          variant="outline"
                          size="sm"
                        />
                        
                        {deployment.status === 'completed' && (
                          <button className="flex items-center space-x-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors">
                            <Download className="w-4 h-4" />
                            <span>Download {deployment.output_type.toUpperCase()}</span>
                          </button>
                        )}
                        
                        {deployment.status === 'completed' && deployment.track && (
                          <button className="flex items-center space-x-2 px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm transition-colors">
                            <ExternalLink className="w-4 h-4" />
                            <span>View in Play Console</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white mb-4">Deployment Statistics</h3>
            
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-700 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-3 bg-blue-900/30 rounded-lg">
                    <Smartphone className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{deployments.length}</div>
                    <div className="text-sm text-gray-400">Total Deployments</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-700 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-3 bg-green-900/30 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">
                      {deployments.filter(d => d.status === 'completed').length}
                    </div>
                    <div className="text-sm text-gray-400">Successful Deployments</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-700 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-3 bg-red-900/30 rounded-lg">
                    <XCircle className="w-6 h-6 text-red-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">
                      {deployments.filter(d => d.status === 'failed').length}
                    </div>
                    <div className="text-sm text-gray-400">Failed Deployments</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Success Rate Chart */}
            <div className="bg-gray-700 rounded-lg p-6">
              <h4 className="font-semibold text-white mb-4">Success Rate</h4>
              
              <div className="h-8 bg-gray-800 rounded-full overflow-hidden mb-2">
                {deployments.length > 0 && (
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 to-green-600"
                    style={{ 
                      width: `${(deployments.filter(d => d.status === 'completed').length / deployments.length) * 100}%` 
                    }}
                  />
                )}
              </div>
              
              <div className="flex justify-between text-sm text-gray-400">
                <span>
                  {deployments.length > 0 
                    ? `${Math.round((deployments.filter(d => d.status === 'completed').length / deployments.length) * 100)}%` 
                    : '0%'}
                </span>
                <span>Target: 95%</span>
              </div>
            </div>
            
            {/* Build Time Analysis */}
            <div className="bg-gray-700 rounded-lg p-6">
              <h4 className="font-semibold text-white mb-4">Build Time Analysis</h4>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">Average Build Time</span>
                    <span className="text-white font-medium">
                      {deployments.length > 0 
                        ? '10m 23s' // This would be calculated from actual data
                        : 'N/A'}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600" style={{ width: '65%' }} />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">Fastest Build</span>
                    <span className="text-white font-medium">
                      {deployments.length > 0 
                        ? '8m 12s' // This would be calculated from actual data
                        : 'N/A'}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-green-600" style={{ width: '45%' }} />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">Slowest Build</span>
                    <span className="text-white font-medium">
                      {deployments.length > 0 
                        ? '15m 47s' // This would be calculated from actual data
                        : 'N/A'}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-600" style={{ width: '85%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white mb-4">Deployment Settings</h3>
            
            {/* Default Configuration */}
            <div className="bg-gray-700 rounded-lg p-6">
              <h4 className="font-semibold text-white mb-4">Default Configuration</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Build Type
                  </label>
                  <select
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="debug">Debug</option>
                    <option value="release" selected>Release</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Output Type
                  </label>
                  <select
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="apk">APK</option>
                    <option value="aab" selected>Android App Bundle (AAB)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Default Track
                  </label>
                  <select
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="internal" selected>Internal Testing</option>
                    <option value="alpha">Alpha</option>
                    <option value="beta">Beta</option>
                    <option value="production">Production</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Keystore Path
                  </label>
                  <input
                    type="text"
                    value="android/keystore/release.keystore"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>
              
              <div className="mt-4 space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={true}
                    className="rounded border-gray-600 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-gray-300">Enable code minification</span>
                </label>
                
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={true}
                    className="rounded border-gray-600 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-gray-300">Enable R8 optimizer</span>
                </label>
                
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={true}
                    className="rounded border-gray-600 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-gray-300">Enable ProGuard</span>
                </label>
              </div>
              
              <div className="mt-6">
                <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                  Save Default Configuration
                </button>
              </div>
            </div>
            
            {/* Google Play Console Integration */}
            <div className="bg-gray-700 rounded-lg p-6">
              <h4 className="font-semibold text-white mb-4">Google Play Console Integration</h4>
              
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="font-medium text-white">Service Account</div>
                  <div className="text-sm text-gray-400">Required for automated uploads</div>
                </div>
                <div className="px-3 py-1 rounded-full text-xs bg-red-900/20 text-red-400">
                  Not Configured
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Service Account JSON
                </label>
                <textarea
                  rows={3}
                  placeholder="Paste your Google Play service account JSON here"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                ></textarea>
              </div>
              
              <div className="flex space-x-4">
                <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                  Save Service Account
                </button>
                <button className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors">
                  Test Connection
                </button>
              </div>
            </div>
            
            {/* Security Settings */}
            <div className="bg-gray-700 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Shield className="w-5 h-5 text-blue-400" />
                <h4 className="font-semibold text-white">Security Settings</h4>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-white">Keystore Verification</div>
                    <div className="text-sm text-gray-400">Verify keystore before each build</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={true} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-white">Secure Environment Variables</div>
                    <div className="text-sm text-gray-400">Use secure storage for credentials</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={true} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-white">Auto-backup Keystore</div>
                    <div className="text-sm text-gray-400">Create encrypted backups</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={false} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AndroidDeploymentDashboard;