import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, 
  Download, 
  RefreshCw, 
  XCircle, 
  Copy, 
  Search,
  Filter, 
  ArrowDown,
  ArrowUp,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';

interface AndroidBuildLogsProps {
  deploymentId?: number;
  logs?: string;
  isLive?: boolean;
  onClose?: () => void;
}

const AndroidBuildLogs: React.FC<AndroidBuildLogsProps> = ({ 
  deploymentId, 
  logs: initialLogs = '', 
  isLive = false,
  onClose 
}) => {
  const [logs, setLogs] = useState<string[]>(initialLogs ? initialLogs.split('\n') : []);
  const [filteredLogs, setFilteredLogs] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLevel, setFilterLevel] = useState<'all' | 'info' | 'warning' | 'error' | 'success'>('all');
  const [autoScroll, setAutoScroll] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  
  const logsEndRef = useRef<HTMLDivElement>(null);
  const logsContainerRef = useRef<HTMLDivElement>(null);

  // Simulate fetching logs for a specific deployment
  useEffect(() => {
    if (deploymentId && !initialLogs) {
      fetchLogs();
    }
  }, [deploymentId]);

  // Filter logs when search query or filter level changes
  useEffect(() => {
    filterLogs();
  }, [logs, searchQuery, filterLevel]);

  // Auto-scroll to bottom when logs update
  useEffect(() => {
    if (autoScroll && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [filteredLogs, autoScroll]);

  // Simulate live logs if isLive is true
  useEffect(() => {
    if (isLive) {
      const interval = setInterval(() => {
        addLiveLogs();
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [isLive]);

  const fetchLogs = async () => {
    setIsLoading(true);
    
    try { 
      // Simulate API call to fetch logs
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Sample logs for demonstration
      const sampleLogs = [
        '[INFO] Starting Android build process...',
        '[INFO] Checking Android SDK installation...',
        '[INFO] Android SDK found at /home/user/Android/Sdk',
        '[INFO] Checking for Android NDK...',
        '[INFO] Android NDK found at /home/user/Android/Sdk/ndk/25.2.9519653',
        '[INFO] Setting up environment variables...',
        '[INFO] Building for aarch64-linux-android...',
        '[INFO] Compiling Rust code...',
        '   Compiling rustyclint v0.1.0',
        '   Finished release [optimized] target(s) in 45.67s',
        '[SUCCESS] Build successful for aarch64-linux-android',
        '[INFO] Building for armv7-linux-androideabi...',
        '[WARNING] Optimization level may affect binary size',
        '   Compiling rustyclint v0.1.0',
        '   Finished release [optimized] target(s) in 42.31s',
        '[SUCCESS] Build successful for armv7-linux-androideabi',
        '[INFO] Building for x86_64-linux-android...',
        '   Compiling rustyclint v0.1.0',
        '   Finished release [optimized] target(s) in 38.92s',
        '[SUCCESS] Build successful for x86_64-linux-android',
        '[INFO] Copying native libraries to Android project...',
        '[INFO] Creating jniLibs directories...',
        '[INFO] Copying aarch64 libraries...',
        '[INFO] Copying armv7 libraries...',
        '[INFO] Copying x86_64 libraries...',
        '[SUCCESS] Native libraries copied',
        '[INFO] Running Gradle clean...',
        '> Task :app:clean',
        '[INFO] Compiling Java/Kotlin sources...',
        '> Task :app:compileReleaseKotlin',
        '> Task :app:compileReleaseJavaWithJavac',
        '[INFO] Processing resources...',
        '> Task :app:processReleaseResources',
        '[INFO] Building AAB...',
        '> Task :app:bundleRelease',
        '[SUCCESS] AAB built successfully',
        '[INFO] AAB path: android/app/build/outputs/bundle/release/app-release.aab',
        '[INFO] AAB size: 38.7 MB',
        '[INFO] Signing with release keystore...',
        '[INFO] Verifying signature...',
        '[SUCCESS] App signed successfully',
        '[INFO] Preparing for upload to Google Play...',
        '[INFO] Authenticating with Google Play API...',
        '[INFO] Uploading to internal track...',
        '[SUCCESS] Upload successful!',
        '[INFO] App available in Google Play Console',
        '[INFO] Deployment completed successfully!'
      ];
      
      setLogs(sampleLogs);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addLiveLogs = () => {
    // Simulate new logs coming in
    const newLogTypes = [
      '[INFO] Processing task...',
      '[INFO] Optimizing resources...',
      '[INFO] Compiling assets...',
      '[WARNING] Resource optimization could be improved',
      '[ERROR] Failed to process asset: image.png',
      '[SUCCESS] Task completed successfully'
    ];
    
    const randomLog = newLogTypes[Math.floor(Math.random() * newLogTypes.length)];
    setLogs(prev => [...prev, randomLog]);
  };

  const filterLogs = () => {
    let filtered = [...logs];
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(log => 
        log.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply level filter
    if (filterLevel !== 'all') {
      const filterPrefix = `[${filterLevel.toUpperCase()}]`;
      filtered = filtered.filter(log => log.includes(filterPrefix));
    }
    
    setFilteredLogs(filtered);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterLevel(e.target.value as any);
  };

  const handleScroll = () => {
    if (logsContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = logsContainerRef.current;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 10;
      setAutoScroll(isAtBottom);
    }
  };

  const downloadLogs = () => {
    const content = logs.join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `android-build-logs-${deploymentId || 'latest'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyLogs = () => {
    navigator.clipboard.writeText(logs.join('\n'));
  };

  const scrollToBottom = () => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    setAutoScroll(true);
  };

  const scrollToTop = () => {
    logsContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    setAutoScroll(false);
  };

  const getLogColor = (log: string) => {
    if (log.includes('[ERROR]')) return 'text-red-400';
    if (log.includes('[WARNING]')) return 'text-yellow-400';
    if (log.includes('[SUCCESS]')) return 'text-green-400';
    if (log.includes('[INFO]')) return 'text-blue-400';
    return 'text-gray-300';
  };

  const getLogIcon = (log: string) => {
    if (log.includes('[ERROR]')) return <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />;
    if (log.includes('[WARNING]')) return <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0" />;
    if (log.includes('[SUCCESS]')) return <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />;
    if (log.includes('[INFO]')) return <Info className="w-4 h-4 text-blue-400 flex-shrink-0" />;
    return null;
  };

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-h-[95vh] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <Terminal className="w-5 h-5 text-green-400" />
          <h3 className="font-semibold text-white">Android Build Logs</h3>
          {deploymentId && (
            <span className="text-sm text-gray-400">Deployment #{deploymentId}</span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {isLive && (
            <div className="flex items-center space-x-1 px-2 py-1 bg-green-900/30 text-green-400 text-xs rounded-full">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Live</span>
            </div>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <XCircle className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4 p-4 border-b border-gray-700">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search logs..."
            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={filterLevel}
            onChange={handleFilterChange}
            className="bg-gray-700 border border-gray-600 rounded-lg text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Levels</option>
            <option value="info">Info</option>
            <option value="warning">Warnings</option>
            <option value="error">Errors</option>
            <option value="success">Success</option>
          </select>
        </div>
        
        <div className="flex items-center space-x-2">
          <label className="flex items-center space-x-2 text-sm text-gray-300">
            <input
              type="checkbox"
              checked={showLineNumbers}
              onChange={() => setShowLineNumbers(!showLineNumbers)}
              className="rounded border-gray-600 text-blue-600 focus:ring-blue-500"
            />
            <span>Line Numbers</span>
          </label>
        </div>
      </div>

      {/* Logs */}
      <div 
        ref={logsContainerRef}
        className="p-4 h-[60vh] overflow-y-auto font-mono text-sm bg-gray-900"
        onScroll={handleScroll}
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <RefreshCcw className="w-8 h-8 text-blue-400 animate-spin" />
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <Terminal className="w-12 h-12 mb-4" />
            <p>No logs found</p>
            {searchQuery && (
              <p className="mt-2 text-sm">Try adjusting your search query</p>
            )}
          </div>
        ) : (
          filteredLogs.map((log, index) => (
            <div key={index} className="flex items-start mb-1 group">
              {showLineNumbers && (
                <div className="w-12 text-right pr-4 text-gray-500 select-none">
                  {index + 1}
                </div>
              )}
              <div className="flex items-start space-x-2 flex-1">
                {getLogIcon(log)}
                <pre className={`${getLogColor(log)} whitespace-pre-wrap break-all flex-1`}>
                  {log}
                </pre>
              </div>
            </div>
          ))
        )}
        <div ref={logsEndRef} />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between p-4 border-t border-gray-700">
        <div className="flex items-center space-x-2">
          <button
            onClick={downloadLogs}
            className="flex items-center space-x-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" /> 
            <span>Download</span>
          </button>
          
          <button
            onClick={copyLogs}
            className="flex items-center space-x-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            <Copy className="w-4 h-4" />
            <span>Copy</span>
          </button>
          
          <button
            onClick={fetchLogs}
            disabled={isLoading}
            className="flex items-center space-x-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:opacity-50 text-white rounded-lg transition-colors"
          >
            <RefreshCcw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={scrollToTop}
            className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            title="Scroll to Top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
          
          <button
            onClick={scrollToBottom}
            className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            title="Scroll to Bottom"
          >
            <ArrowDown className="w-4 h-4" />
          </button>
          
          <div className="text-sm text-gray-400">
            {filteredLogs.length} of {logs.length} lines
          </div>
        </div>
      </div>
    </div>
  );
};

export default AndroidBuildLogs;