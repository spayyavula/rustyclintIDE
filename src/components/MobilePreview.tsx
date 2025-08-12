import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  Tablet, 
  Monitor, 
  RotateCcw, 
  Play, 
  Square, 
  RefreshCw, 
  Settings, 
  Wifi, 
  Battery, 
  Signal,
  Volume2,
  Home,
  ArrowLeft,
  MoreHorizontal,
  X
} from 'lucide-react';

interface MobilePreviewProps {
  isVisible: boolean;
  onClose: () => void;
  currentCode: string;
  platform: 'android' | 'ios' | 'flutter';
}

const MobilePreview: React.FC<MobilePreviewProps> = ({ 
  isVisible, 
  onClose, 
  currentCode, 
  platform 
}) => {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [deviceType, setDeviceType] = useState<'phone' | 'tablet'>('phone');
  const [isRunning, setIsRunning] = useState(false);
  const [buildProgress, setBuildProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    if (isRunning) {
      // Simulate build process
      const interval = setInterval(() => {
        setBuildProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setLogs(prev => [...prev, '✅ App built successfully!', '📱 Launching on device...']);
            return 100;
          }
          return prev + 10;
        });
      }, 200);

      setLogs(['🔨 Building Rust code...', '📦 Compiling for mobile...']);
      
      return () => clearInterval(interval);
    }
  }, [isRunning]);

  const handleBuild = () => {
    setIsRunning(true);
    setBuildProgress(0);
    setLogs([]);
  };

  const handleStop = () => {
    setIsRunning(false);
    setBuildProgress(0);
    setLogs([]);
  };

  const getDeviceDimensions = () => {
    if (deviceType === 'tablet') {
      return orientation === 'portrait' 
        ? { width: 320, height: 480 } 
        : { width: 480, height: 320 };
    }
    return orientation === 'portrait' 
      ? { width: 280, height: 500 } 
      : { width: 500, height: 280 };
  };

  const renderAndroidPreview = () => {
    const { width, height } = getDeviceDimensions();
    
    return (
      <div className="relative">
        {/* Android Device Frame */}
        <div 
          className="bg-gray-900 rounded-3xl p-4 shadow-2xl border-4 border-gray-800"
          style={{ width: width + 40, height: height + 80 }}
        >
          {/* Status Bar */}
          <div className="flex items-center justify-between text-white text-xs mb-2 px-2">
            <div className="flex items-center space-x-1">
              <span>9:41</span>
            </div>
            <div className="flex items-center space-x-1">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <Battery className="w-3 h-3" />
            </div>
          </div>

          {/* App Content */}
          <div 
            className="bg-white rounded-2xl overflow-hidden"
            style={{ width, height }}
          >
            {/* App Bar */}
            <div className="bg-orange-600 text-white p-4 flex items-center justify-between">
              <h1 className="text-lg font-semibold">Mobile Rust App</h1>
              <MoreHorizontal className="w-5 h-5" />
            </div>

            {/* App Content */}
            <div className="p-6 flex-1 flex flex-col items-center justify-center bg-gray-50">
              <div className="text-6xl mb-4">🦀</div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Rust + Android</h2>
              <p className="text-gray-600 text-center mb-6">
                High-performance mobile app powered by Rust
              </p>
              
              {/* Interactive Elements */}
              <div className="space-y-4 w-full max-w-xs">
                <button className="w-full bg-orange-600 text-white py-3 rounded-lg font-medium">
                  Call Rust Function
                </button>
                <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium">
                  Process Data
                </button>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600">Rust Output:</p>
                  <p className="text-green-600 font-mono text-sm">
                    "Hello from Rust! Platform: Android"
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Bar */}
            <div className="bg-gray-100 p-3 flex items-center justify-around border-t border-gray-200">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
              <Home className="w-5 h-5 text-gray-600" />
              <Square className="w-4 h-4 text-gray-600" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderIOSPreview = () => {
    const { width, height } = getDeviceDimensions();
    
    return (
      <div className="relative">
        {/* iOS Device Frame */}
        <div 
          className="bg-black rounded-3xl p-2 shadow-2xl"
          style={{ width: width + 20, height: height + 60 }}
        >
          {/* Notch */}
          <div className="bg-black h-6 rounded-t-3xl flex items-center justify-center">
            <div className="w-16 h-1 bg-gray-800 rounded-full"></div>
          </div>

          {/* Screen */}
          <div 
            className="bg-white rounded-2xl overflow-hidden"
            style={{ width, height }}
          >
            {/* Status Bar */}
            <div className="flex items-center justify-between text-black text-xs p-2 bg-white">
              <div className="flex items-center space-x-1">
                <span className="font-medium">9:41</span>
              </div>
              <div className="flex items-center space-x-1">
                <Signal className="w-3 h-3" />
                <Wifi className="w-3 h-3" />
                <Battery className="w-3 h-3" />
              </div>
            </div>

            {/* Navigation Bar */}
            <div className="bg-blue-600 text-white p-4 flex items-center">
              <h1 className="text-lg font-semibold">Mobile Rust App</h1>
            </div>

            {/* App Content */}
            <div className="p-6 flex-1 flex flex-col items-center justify-center bg-gray-50">
              <div className="text-6xl mb-4">🦀</div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Rust + iOS</h2>
              <p className="text-gray-600 text-center mb-6">
                Native iOS performance with Rust backend
              </p>
              
              {/* Interactive Elements */}
              <div className="space-y-4 w-full max-w-xs">
                <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium">
                  Execute Rust Code
                </button>
                <button className="w-full bg-orange-600 text-white py-3 rounded-xl font-medium">
                  Native Bridge Call
                </button>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                  <p className="text-sm text-gray-600">Rust Response:</p>
                  <p className="text-blue-600 font-mono text-sm">
                    "Hello from Rust! Platform: iOS"
                  </p>
                </div>
              </div>
            </div>

            {/* Home Indicator */}
            <div className="flex justify-center pb-2">
              <div className="w-32 h-1 bg-gray-400 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderFlutterPreview = () => {
    const { width, height } = getDeviceDimensions();
    
    return (
      <div className="relative">
        {/* Flutter Device Frame */}
        <div 
          className="bg-gray-900 rounded-3xl p-3 shadow-2xl border-2 border-gray-700"
          style={{ width: width + 30, height: height + 70 }}
        >
          {/* Status Bar */}
          <div className="flex items-center justify-between text-white text-xs mb-2 px-2">
            <div className="flex items-center space-x-1">
              <span>9:41</span>
            </div>
            <div className="flex items-center space-x-1">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <Battery className="w-3 h-3" />
            </div>
          </div>

          {/* App Content */}
          <div 
            className="bg-white rounded-2xl overflow-hidden"
            style={{ width, height }}
          >
            {/* Material App Bar */}
            <div className="bg-cyan-600 text-white p-4 flex items-center shadow-md">
              <h1 className="text-lg font-semibold">Flutter + Rust App</h1>
            </div>

            {/* Flutter Content */}
            <div className="p-6 flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-cyan-50 to-blue-50">
              <div className="text-6xl mb-4">🦀</div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Flutter + Rust</h2>
              <p className="text-gray-600 text-center mb-6">
                Cross-platform with native Rust performance
              </p>
              
              {/* Material Design Elements */}
              <div className="space-y-4 w-full max-w-xs">
                <button className="w-full bg-cyan-600 text-white py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-shadow">
                  Call Rust Bridge
                </button>
                <button className="w-full bg-orange-600 text-white py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-shadow">
                  Process with FFI
                </button>
                <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100">
                  <p className="text-sm text-gray-600 mb-1">Flutter ↔ Rust Bridge:</p>
                  <p className="text-cyan-600 font-mono text-sm">
                    "Cross-platform success! 🎉"
                  </p>
                </div>
              </div>
            </div>

            {/* Floating Action Button */}
            <div className="absolute bottom-4 right-4">
              <div className="w-12 h-12 bg-cyan-600 rounded-full flex items-center justify-center shadow-lg">
                <Play className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPreview = () => {
    switch (platform) {
      case 'android':
        return renderAndroidPreview();
      case 'ios':
        return renderIOSPreview();
      case 'flutter':
        return renderFlutterPreview();
      default:
        return renderAndroidPreview();
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-7xl max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-4">
            <Smartphone className="w-6 h-6 text-blue-400" />
            <div>
              <h2 className="text-xl font-bold text-white">Mobile App Preview</h2>
              <p className="text-gray-400 text-sm">
                {platform.charAt(0).toUpperCase() + platform.slice(1)} • {deviceType} • {orientation}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex h-[80vh]">
          {/* Controls Sidebar */}
          <div className="w-80 bg-gray-900 border-r border-gray-700 p-6 overflow-y-auto">
            <div className="space-y-6">
              {/* Platform Selection */}
              <div>
                <h3 className="text-sm font-medium text-gray-300 mb-3">Platform</h3>
                <div className="grid grid-cols-3 gap-2">
                  {['android', 'ios', 'flutter'].map((p) => (
                    <button
                      key={p}
                      className={`p-2 rounded-lg text-xs font-medium transition-colors ${
                        platform === p
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Device Controls */}
              <div>
                <h3 className="text-sm font-medium text-gray-300 mb-3">Device</h3>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setDeviceType('phone')}
                      className={`flex-1 flex items-center justify-center space-x-2 p-2 rounded-lg text-sm transition-colors ${
                        deviceType === 'phone'
                          ? 'bg-orange-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      <Smartphone className="w-4 h-4" />
                      <span>Phone</span>
                    </button>
                    <button
                      onClick={() => setDeviceType('tablet')}
                      className={`flex-1 flex items-center justify-center space-x-2 p-2 rounded-lg text-sm transition-colors ${
                        deviceType === 'tablet'
                          ? 'bg-orange-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      <Tablet className="w-4 h-4" />
                      <span>Tablet</span>
                    </button>
                  </div>
                  
                  <button
                    onClick={() => setOrientation(orientation === 'portrait' ? 'landscape' : 'portrait')}
                    className="w-full flex items-center justify-center space-x-2 p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm text-gray-300 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Rotate</span>
                  </button>
                </div>
              </div>

              {/* Build Controls */}
              <div>
                <h3 className="text-sm font-medium text-gray-300 mb-3">Build & Run</h3>
                <div className="space-y-3">
                  {!isRunning ? (
                    <button
                      onClick={handleBuild}
                      className="w-full flex items-center justify-center space-x-2 p-3 bg-green-600 hover:bg-green-700 rounded-lg text-white font-medium transition-colors"
                    >
                      <Play className="w-4 h-4" />
                      <span>Build & Run</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleStop}
                      className="w-full flex items-center justify-center space-x-2 p-3 bg-red-600 hover:bg-red-700 rounded-lg text-white font-medium transition-colors"
                    >
                      <Square className="w-4 h-4" />
                      <span>Stop</span>
                    </button>
                  )}
                  
                  <button className="w-full flex items-center justify-center space-x-2 p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm text-gray-300 transition-colors">
                    <RefreshCw className="w-4 h-4" />
                    <span>Hot Reload</span>
                  </button>
                </div>
              </div>

              {/* Build Progress */}
              {isRunning && (
                <div>
                  <h3 className="text-sm font-medium text-gray-300 mb-3">Build Progress</h3>
                  <div className="space-y-2">
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${buildProgress}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-400">{buildProgress}% complete</p>
                  </div>
                </div>
              )}

              {/* Build Logs */}
              <div>
                <h3 className="text-sm font-medium text-gray-300 mb-3">Build Logs</h3>
                <div className="bg-gray-800 rounded-lg p-3 h-32 overflow-y-auto font-mono text-xs">
                  {logs.length === 0 ? (
                    <p className="text-gray-500">No build logs yet...</p>
                  ) : (
                    logs.map((log, index) => (
                      <div key={index} className="text-gray-300 mb-1">
                        {log}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Performance Metrics */}
              <div>
                <h3 className="text-sm font-medium text-gray-300 mb-3">Performance</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Memory:</span>
                    <span className="text-green-400">45.2 MB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">CPU:</span>
                    <span className="text-blue-400">12%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">FPS:</span>
                    <span className="text-green-400">60</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Battery:</span>
                    <span className="text-yellow-400">Low impact</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Preview Area */}
          <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-8">
            <div className="relative">
              {renderPreview()}
              
              {/* Device Label */}
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                <div className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-xs">
                  {platform.charAt(0).toUpperCase() + platform.slice(1)} {deviceType} • {orientation}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobilePreview;