import React, { useState, useCallback } from 'react';
import {
  X,
  Play,
  Square,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCcw,
  Shield,
  Package,
  TrendingUp,
  Globe,
  Cpu,
  HardDrive,
  Wifi,
  Smartphone,
  Tablet,
  Monitor,
  Settings,
  Loader2,
  Zap,
  AlertCircle,
} from 'lucide-react';

interface DeploymentStep {
  id: string;
  name: string;
  type: 'build' | 'test' | 'deploy' | 'verify';
  progress: number;
  status: 'pending' | 'running' | 'completed' | 'failed';
  message?: string;
  output?: string;
}

export interface DeploymentConfig {
  platform: string;
  buildType: string;
  webTarget?: string;
  desktopTarget?: string;
  androidTarget?: string;
  outputPath?: string;
  target?: string;
}

interface DeploymentModalProps {
  isVisible: boolean;
  onClose: () => void;
  initialPlatform?: 'ios' | 'android' | 'flutter' | 'desktop' | 'web';
}

const DeploymentModal: React.FC<DeploymentModalProps> = ({ 
  isVisible, 
  onClose, 
  initialPlatform = 'ios' 
}) => {
  const [isDeploying, setIsDeploying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<DeploymentStep[]>([]);
  const [deploymentConfig, setDeploymentConfig] = useState<DeploymentConfig | null>(null);
  const [config, setConfig] = useState<DeploymentConfig>({
    platform: initialPlatform,
    buildType: 'release',
    webTarget: 'spa',
    desktopTarget: 'all',
    androidTarget: 'aab'
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [showPreDeployCheck, setShowPreDeployCheck] = useState(false);
  const [realTimeMetrics, setRealTimeMetrics] = useState({
    buildSpeed: 0,
    memoryUsage: 0, 
    cpuUsage: 0,
    networkSpeed: 0
  });
  const [deploymentError, setDeploymentError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'logs' | 'config' | 'help'>('overview');

  // Simulate real-time metrics during deployment
  React.useEffect(() => {
    if (isDeploying) {
      const interval = setInterval(() => {
        setRealTimeMetrics({
          buildSpeed: 50 + Math.random() * 100, // MB/s
          memoryUsage: 30 + Math.random() * 40, // %
          cpuUsage: 20 + Math.random() * 60, // %
          networkSpeed: 10 + Math.random() * 50 // Mbps
        });
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [isDeploying]);

  const startDeployment = useCallback((config: DeploymentConfig) => {
    setIsDeploying(true);
    setCurrentStep(0);
    setDeploymentConfig(config);
    
    // Initialize deployment steps
    const initialSteps: DeploymentStep[] = [
      { id: '1', name: 'Preparing build', type: 'build', progress: 0, status: 'pending' },
      { id: '2', name: 'Building application', type: 'build', progress: 0, status: 'pending' },
      { id: '3', name: 'Running tests', type: 'test', progress: 0, status: 'pending' },
      { id: '4', name: 'Deploying', type: 'deploy', progress: 0, status: 'pending' },
      { id: '5', name: 'Verifying deployment', type: 'verify', progress: 0, status: 'pending' }
    ];
    
    setSteps(initialSteps);
    
    // Start the deployment process simulation
    runDeploymentStep(0, initialSteps);
  }, []);

  const runDeploymentStep = useCallback((stepIndex: number, currentSteps: DeploymentStep[]) => {
    if (stepIndex >= currentSteps.length) {
      setIsDeploying(false);
      return;
    }
    
    setCurrentStep(stepIndex);
    
    // Update step status to running
    setSteps(prev => prev.map((step, idx) => 
      idx === stepIndex ? { ...step, status: 'running' } : step
    ));
    
    // Simulate step execution with progress updates
    const stepDuration = 3000 + Math.random() * 4000; // 3-7 seconds per step
    const startTime = Date.now();
    
    // Update progress periodically
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(Math.floor((elapsed / stepDuration) * 100), 95);
      
      setSteps(prev => prev.map((step, idx) => 
        idx === stepIndex ? { ...step, progress } : step
      ));
    }, 100);
    
    // Complete the step after duration
    setTimeout(() => {
      clearInterval(progressInterval);
      
      // Randomly fail a step (for demonstration)
      const shouldFail = stepIndex === 3 && Math.random() < 0.1;
      
      if (shouldFail) {
        setSteps(prev => prev.map((step, idx) => 
          idx === stepIndex ? { ...step, status: 'failed', progress: 100 } : step
        ));
        setIsDeploying(false);
        setDeploymentError(`Failed to execute step: ${currentSteps[stepIndex].name}`);
      } else {
        // Mark step as completed
        setSteps(prev => prev.map((step, idx) => 
          idx === stepIndex ? { ...step, status: 'completed', progress: 100 } : step
        ));
        
        // Move to next step
        runDeploymentStep(stepIndex + 1, currentSteps);
      }
    }, stepDuration);
  }, []);

  const stopDeployment = useCallback(() => {
    setIsDeploying(false);
    setCurrentStep(0);
    setSteps([]);
    setDeploymentConfig(null);
  }, []);

  const handleStartDeployment = () => {
    setIsConfiguring(true);
    setDeploymentError(null);

    // Show configuration animation with progress indicators
    const configSteps = ['Checking environment', 'Validating keystore', 'Preparing build tools', 'Setting up deployment'];
    let stepIndex = 0;
    
    const interval = setInterval(() => {
      if (stepIndex < configSteps.length) {
        setRealTimeMetrics(prev => ({
          ...prev,
          buildSpeed: 50 + Math.random() * 30,
          memoryUsage: 20 + Math.random() * 20,
          cpuUsage: 15 + Math.random() * 25
        }));
        stepIndex++;
      } else {
        clearInterval(interval);
        setIsConfiguring(false);
        setShowPreDeployCheck(true);
      }
    }, 500);
  };

  const handleConfirmDeployment = () => {
    try {
      setShowPreDeployCheck(false);
      startDeployment(config);
    } catch (error) {
      setDeploymentError(error instanceof Error ? error.message : 'An unknown error occurred');
      console.error('Deployment error:', error);
    }
  };

  // Calculate progress based on completed steps
  const getStepProgress = useCallback((stepIndex: number): number => {
    if (stepIndex >= steps.length) return 0;
    
    const completedSteps = steps.filter((_, index) => index < stepIndex && steps[index].status === 'completed').length;
    const currentStepProgress = steps[stepIndex]?.progress || 0;
    
    // Calculate progress as completed steps + partial progress on current step
    const stepValue = 100 / steps.length;
    let progress = completedSteps * stepValue;
    
    // Add partial progress from current step
    if (currentStep < steps.length && currentStep >= completedSteps) {
      progress += currentStepProgress * stepValue;
    }
    
    // Ensure minimum 65% for demo purposes
    return Math.max(progress, 65);
  }, [steps, currentStep]);

  // Calculate overall progress with weighted steps
  const getOverallProgress = useCallback((): number => {
    if (steps.length === 0) return 0;
    
    // For demo purposes, ensure we never go below 65%
    const minProgress = 65;

    // Weight steps by their complexity/duration
    const weights = steps.map(step => {
      switch (step.type) {
        case 'build': return 3;
        case 'test': return 2;
        case 'deploy': return 4;
        case 'verify': return 1;
        default: return 1;
      }
    });

    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    let totalProgress = 0;

    // Add progress for completed steps
    for (let i = 0; i < currentStep && i < steps.length; i++) {
      totalProgress += weights[i];
    }

    // Add partial progress for current step
    const currentStepProgress = getStepProgress(currentStep);
    if (currentStep < steps.length && currentStepProgress > 0) {
      totalProgress += (currentStepProgress / 100) * weights[currentStep];
    }

    // Calculate the actual progress and ensure it's at least 65%
    const calculatedProgress = (totalProgress / totalWeight) * 100;
    return Math.max(calculatedProgress, minProgress);
  }, [steps, currentStep, getStepProgress]);

  const getStepIcon = (step: DeploymentStep) => {
    switch (step.status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-400 animate-pulse" />;
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-400" />;
      case 'running':
        return <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStepStatusColor = (step: DeploymentStep, index: number) => {
    if (index === currentStep && isDeploying) {
      return 'border-blue-500 bg-gradient-to-r from-blue-600/10 to-purple-600/10 shadow-lg';
    }
    switch (step.status) {
      case 'completed':
        return 'border-green-500 bg-gradient-to-r from-green-600/10 to-emerald-600/10';
      case 'failed':
        return 'border-red-500 bg-gradient-to-r from-red-600/10 to-pink-600/10';
      default:
        return 'border-gray-600 bg-gray-700/50';
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'ios':
        return <Smartphone className="w-5 h-5 text-blue-400" />;
      case 'android':
        return <Smartphone className="w-5 h-5 text-green-400" />;
      case 'flutter':
        return <Tablet className="w-5 h-5 text-cyan-400" />;
      case 'desktop':
        return <Monitor className="w-5 h-5 text-purple-400" />;
      case 'web':
        return <Monitor className="w-5 h-5 text-green-400" />;
      default:
        return <Smartphone className="w-5 h-5 text-gray-400" />;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'ios':
        return 'from-blue-500 to-cyan-500';
      case 'android':
        return 'from-green-500 to-emerald-500';
      case 'flutter':
        return 'from-cyan-500 to-blue-500';
      case 'desktop':
        return 'from-purple-500 to-pink-500';
      case 'web':
        return 'from-green-500 to-teal-500';
      default:
        return 'from-gray-500 to-slate-500';
    }
  };

  const getEstimatedTime = (platform: string) => {
    switch (platform) {
      case 'ios':
        return '8-12 minutes';
      case 'android':
        return '5-8 minutes';
      case 'web':
        return '2-4 minutes';
      case 'desktop':
        return '6-10 minutes';
      default:
        return '5-8 minutes';
    }
  };

  const getDeploymentGuide = (platform: string) => {
    switch (platform) {
      case 'ios':
        return {
          title: 'iOS Deployment Guide',
          requirements: [
            'Xcode 15+ installed',
            'iOS Developer Account',
            'Valid code signing certificate',
            'Provisioning profile configured',
            'App Store Connect access'
          ],
          steps: [
            'Build Rust code for iOS targets (device + simulator)',
            'Create universal binary with lipo',
            'Build iOS app with Xcode',
            'Create archive for distribution',
            'Export IPA with proper entitlements',
            'Upload to App Store Connect',
            'Submit for App Store review'
          ]
        };
      case 'android':
        return {
          title: 'Android Deployment Guide',
          requirements: [
            'Android Studio installed',
            'Android SDK 34+ configured',
            'NDK for native code compilation',
            'Google Play Developer Account',
            'Signing keystore configured',
            'Google Play Console access',
            'Fastlane configured (optional)'
          ],
          steps: [
            'Build Rust code for all Android architectures (ARM64, ARM, x86, x86_64)',
            'Copy native libraries to Android project',
            'Build APK or AAB with Gradle',
            'Sign with release keystore using SHA-256',
            'Align APK (if using APK format)',
            'Upload to Google Play Console',
            'Submit for Play Store review and rollout'
          ]
        };
      case 'flutter':
        return {
          title: 'Flutter Deployment Guide',
          requirements: [
            'Flutter SDK installed',
            'flutter_rust_bridge configured',
            'Platform-specific requirements (iOS/Android)',
            'Dart dependencies updated'
          ],
          steps: [
            'Generate Rust-Flutter bridge code',
            'Install Flutter dependencies',
            'Build for iOS platform',
            'Build for Android platform',
            'Deploy to iOS App Store',
            'Deploy to Google Play Store'
          ]
        };
      case 'web':
        return {
          title: 'Web Deployment Guide',
          requirements: [
            'wasm-pack installed',
            'Node.js and npm/yarn',
            'Web bundler (Vite/Webpack)',
            'Deployment target (Vercel/Netlify/AWS)',
            'CDN configuration'
          ],
          steps: [
            'Compile Rust to WebAssembly',
            'Install web dependencies',
            'Build web application (SPA/PWA/SSR)',
            'Optimize WebAssembly binaries',
            'Deploy to production hosting',
            'Configure CDN and caching policies'
          ]
        };
      default:
        return {
          title: 'Desktop Deployment Guide', 
          requirements: [
            'Rust toolchain installed',
            'Tauri CLI or Electron',
            'Platform-specific build tools',
            'Code signing certificates',
            'Distribution channels configured'
          ],
          steps: [
            'Build Rust application',
            'Build desktop UI framework',
            'Bundle with Tauri/Electron',
            'Code sign binaries for security',
            'Create platform-specific installers',
            'Upload to release channels (GitHub/Steam/etc.)'
          ]
        };
    }
  };

  if (!isVisible) return null;

  const guide = getDeploymentGuide(config.platform);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-6xl max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-4">
            <div className={`p-3 bg-gradient-to-br ${getPlatformColor(config.platform)} rounded-xl shadow-lg`}>
              {getPlatformIcon(config.platform)}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Deploy to {config.platform.toUpperCase()}</h2>
              <p className="text-gray-400">Build and deploy your application to production</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-xl"
            aria-label="Close deployment modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Real-time Metrics Bar (only during deployment) */}
        {isDeploying && (
          <div className="bg-gray-900 border-b border-gray-700 px-6 py-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-blue-400" />
                  <span className="text-gray-300">Build: {realTimeMetrics.buildSpeed.toFixed(1)} MB/s</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Cpu className="w-4 h-4 text-green-400" />
                  <span className="text-gray-300">CPU: {realTimeMetrics.cpuUsage.toFixed(0)}%</span>
                </div>
                <div className="flex items-center space-x-2">
                  <HardDrive className="w-4 h-4 text-purple-400" />
                  <span className="text-gray-300">Memory: {realTimeMetrics.memoryUsage.toFixed(0)}%</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Wifi className="w-4 h-4 text-orange-400" />
                  <span className="text-gray-300">Network: {realTimeMetrics.networkSpeed.toFixed(1)} Mbps</span>
                </div>
              </div>
              <div className="text-gray-400">
                Step {currentStep + 1} of {steps.length} • {getOverallProgress().toFixed(0)}% Complete
              </div>
            </div>
          </div>
        )}

        <div className="flex h-[80vh]">
          {/* Configuration Panel */}
          <div className="w-80 bg-gray-900 border-r border-gray-700 p-6 overflow-y-auto">
            <h3 className="text-lg font-semibold text-white mb-4">Deployment Configuration</h3>
            
            {/* Platform Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">Platform</label>
              <div className="grid grid-cols-2 gap-2 mb-3">
                {['ios', 'android', 'flutter'].map(platform => (
                  <button
                    key={platform}
                    onClick={() => setConfig(prev => ({ ...prev, platform: platform as any }))}
                    className={`flex items-center space-x-2 p-3 rounded-lg border transition-all transform hover:scale-105 ${
                      config.platform === platform
                        ? `border-blue-500 bg-gradient-to-r ${getPlatformColor(platform)}/20 text-white shadow-lg`
                        : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500'
                    }`}
                    aria-pressed={config.platform === platform}
                  >
                    {getPlatformIcon(platform)}
                    <span className="text-sm font-medium">{platform.toUpperCase()}</span>
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {['web', 'desktop'].map(platform => (
                  <button
                    key={platform}
                    onClick={() => setConfig(prev => ({ ...prev, platform: platform as any }))}
                    className={`flex items-center space-x-2 p-3 rounded-lg border transition-all transform hover:scale-105 ${
                      config.platform === platform
                        ? `border-blue-500 bg-gradient-to-r ${getPlatformColor(platform)}/20 text-white shadow-lg`
                        : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500'
                    }`}
                    aria-pressed={config.platform === platform}
                  >
                    {getPlatformIcon(platform)}
                    <span className="text-sm font-medium">{platform.toUpperCase()}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Platform Info */}
            <div className="mb-6 p-4 bg-gray-800 rounded-lg border border-gray-600">
              <div className="flex items-center space-x-2 mb-2">
                {getPlatformIcon(config.platform)}
                <span className="font-medium text-white">{config.platform.toUpperCase()} Deployment</span>
              </div>
              <div className="text-sm text-gray-400 space-y-1">
                <div>Estimated time: {getEstimatedTime(config.platform)}</div>
                <div>Build type: {config.buildType}</div>
                {config.platform === 'android' && <div>Target: {config.androidTarget?.toUpperCase()}</div>}
                {config.platform === 'web' && <div>Target: {config.webTarget?.toUpperCase()}</div>}
                {config.platform === 'desktop' && <div>Target: {config.desktopTarget}</div>}
              </div>
            </div>

            {/* Platform-specific Options */}
            {config.platform === 'android' && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">Android Target</label>
                <div className="flex space-x-2">
                  {[
                    { key: 'aab', label: 'AAB (Recommended)', desc: 'App Bundle for Play Store' },
                    { key: 'apk', label: 'APK', desc: 'Direct installation' }
                  ].map(target => (
                    <button
                      key={target.key}
                      onClick={() => setConfig(prev => ({ ...prev, androidTarget: target.key as any }))}
                      className={`flex-1 p-3 rounded-lg border text-left transition-all transform hover:scale-105 ${
                        config.androidTarget === target.key
                          ? 'border-green-500 bg-green-600/20 text-green-300'
                          : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500'
                      }`}
                      aria-pressed={config.androidTarget === target.key}
                    >
                      <div className="font-medium text-sm">{target.label}</div>
                      <div className="text-xs opacity-75">{target.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {config.platform === 'web' && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">Web Target</label>
                <div className="space-y-2">
                  {[
                    { key: 'spa', label: 'SPA', desc: 'Single Page Application' },
                    { key: 'pwa', label: 'PWA', desc: 'Progressive Web App' },
                    { key: 'ssr', label: 'SSR', desc: 'Server-Side Rendered' }
                  ].map(target => (
                    <button
                      key={target.key}
                      onClick={() => setConfig(prev => ({ ...prev, webTarget: target.key as any }))}
                      className={`w-full p-3 rounded-lg border text-left transition-all transform hover:scale-105 ${
                        config.webTarget === target.key
                          ? 'border-green-500 bg-green-600/20 text-green-300'
                          : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500'
                      }`}
                      aria-pressed={config.webTarget === target.key}
                    >
                      <div className="font-medium text-sm">{target.label}</div>
                      <div className="text-xs opacity-75">{target.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {config.platform === 'desktop' && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">Desktop Target</label>
                <div className="space-y-2">
                  {[
                    { key: 'all', label: 'All Platforms', desc: 'Windows, macOS, Linux' },
                    { key: 'windows', label: 'Windows', desc: 'Windows 10/11' },
                    { key: 'macos', label: 'macOS', desc: 'macOS 10.15+' },
                    { key: 'linux', label: 'Linux', desc: 'Ubuntu, Debian, etc.' }
                  ].map(target => (
                    <button
                      key={target.key}
                      onClick={() => setConfig(prev => ({ ...prev, desktopTarget: target.key as any }))}
                      className={`w-full p-3 rounded-lg border text-left transition-all transform hover:scale-105 ${
                        config.desktopTarget === target.key
                          ? 'border-purple-500 bg-purple-600/20 text-purple-300'
                          : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500'
                      }`}
                      aria-pressed={config.desktopTarget === target.key}
                    >
                      <div className="font-medium text-sm">{target.label}</div>
                      <div className="text-xs opacity-75">{target.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Build Type */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">Build Type</label>
              <div className="flex space-x-2">
                {['debug', 'release'].map(type => (
                  <button
                    key={type}
                    onClick={() => setConfig(prev => ({ ...prev, buildType: type as any }))}
                    className={`flex-1 p-2 rounded-lg text-sm font-medium transition-all transform hover:scale-105 ${
                      config.buildType === type
                        ? 'bg-orange-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                    aria-pressed={config.buildType === type}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Advanced Settings */}
            <div className="mb-6">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                aria-expanded={showAdvanced}
              >
                <Settings className="w-4 h-4" />
                <span>{showAdvanced ? 'Hide Advanced Options' : 'Show Advanced Options'}</span>
              </button>
              
              {showAdvanced && (
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Target</label>
                    <input
                      type="text"
                      value={config.target || ''}
                      onChange={(e) => setConfig(prev => ({ ...prev, target: e.target.value }))}
                      placeholder="e.g., aarch64-apple-ios"
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Output Path</label>
                    <input
                      type="text"
                      value={config.outputPath || ''}
                      onChange={(e) => setConfig(prev => ({ ...prev, outputPath: e.target.value }))}
                      placeholder="e.g., build/"
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Requirements */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-300 mb-3">Requirements</h4>
              <div className="space-y-2">
                {guide.requirements.map((req, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300">{req}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {!isDeploying && !isConfiguring && !showPreDeployCheck ? (
                <div className="space-y-3">
                  <button
                    onClick={handleStartDeployment}
                    className={`w-full flex items-center justify-center space-x-2 py-3 px-4 bg-gradient-to-r ${getPlatformColor(config.platform)} hover:shadow-xl text-white rounded-lg font-medium transition-all transform hover:scale-105 shadow-lg`}
                  >
                    <Play className="w-4 h-4" />
                    <span>Start Deployment</span>
                  </button>
                  
                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-gray-800 p-2 rounded text-center">
                      <div className="text-white font-medium">{getEstimatedTime(config.platform)}</div>
                      <div className="text-gray-400">Est. Time</div>
                    </div>
                    <div className="bg-gray-800 p-2 rounded text-center">
                      <div className="text-white font-medium">{guide.steps.length}</div>
                      <div className="text-gray-400">Steps</div>
                    </div>
                  </div>
                </div>
              ) : isConfiguring ? (
                <div className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-blue-600 text-white rounded-lg font-medium">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Preparing Deployment...</span>
                </div>
              ) : showPreDeployCheck ? (
                <div className="space-y-3">
                  <div className="bg-gradient-to-r from-orange-900/20 to-red-900/20 border border-orange-500/30 rounded-lg p-4 shadow-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertCircle className="w-5 h-5 text-orange-400" />
                      <span className="font-medium text-orange-300">Ready to Deploy</span>
                    </div>
                    <p className="text-sm text-orange-200 mb-3">
                      {config.platform === 'android' 
                        ? `Building ${config.androidTarget?.toUpperCase()} for Google Play Store. This will create a production-ready build.`
                        : `Building for ${config.platform.toUpperCase()} production. This process may take several minutes.`
                      }
                    </p>
                    <div className="flex space-x-2">
                      <button
                        onClick={handleConfirmDeployment}
                        className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 bg-gradient-to-r ${getPlatformColor(config.platform)} hover:shadow-lg text-white rounded-lg text-sm font-medium transition-all transform hover:scale-105`}
                      >
                        <Zap className="w-4 h-4" /> 
                        <span>Deploy Now</span>
                      </button>
                      <button
                        onClick={() => setShowPreDeployCheck(false)}
                        className="flex-1 py-2 px-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={stopDeployment}
                  className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 hover:shadow-xl text-white rounded-lg font-medium transition-all transform hover:scale-105"
                >
                  <Square className="w-4 h-4" /> 
                  <span>Stop Deployment</span>
                </button>
              )}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col">
            {/* Deployment Steps */}
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-white mb-2">{guide.title}</h3>
                <p className="text-gray-400">Follow these steps to deploy your application</p>
              </div>

              {/* Progress Overview */}
              {isDeploying && (
                <div className="mb-6 p-4 bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-blue-300 font-medium">Deployment Progress</span>
                    <span className="text-blue-300">{getOverallProgress().toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${getOverallProgress()}%` }}
                    />
                  </div>
                  <div className="text-sm text-gray-400">
                    Step {currentStep + 1} of {steps.length}: {steps[currentStep]?.name || 'Preparing...'}
                  </div>
                </div>
              )}

              {/* Error Display */}
              {deploymentError && (
                <div className="mb-6 p-4 bg-gradient-to-r from-red-900/20 to-pink-900/20 border border-red-500/30 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertCircle className="w-5 h-5 text-red-400" />
                    <span className="font-medium text-red-300">Deployment Error</span>
                  </div>
                  <p className="text-sm text-red-200">{deploymentError}</p>
                </div>
              )}

              {/* Deployment Steps List */}
              <div className="space-y-4">
                {(isDeploying ? steps : guide.steps.map((step, index) => ({
                  id: `step-${index}`,
                  name: step,
                  status: 'pending' as const,
                  progress: 0,
                  type: 'build' as const
                }))).map((step, index) => (
                  <div
                    key={step.id || index}
                    className={`p-4 rounded-lg border transition-all duration-300 ${getStepStatusColor(step, index)}`}
                  >
                    <div className="flex items-center space-x-3">
                      {getStepIcon(step)}
                      <div className="flex-1">
                        <div className="font-medium text-white">{step.name}</div>
                        {'output' in step && step.output && (
                          <div className="text-sm text-gray-400 mt-1 font-mono bg-gray-800 p-2 rounded">
                            {step.output}
                          </div>
                        )}
                      </div>
                      {isDeploying && index === currentStep && (
                        <div className="text-sm text-blue-400">
                          {getStepProgress(index).toFixed(0)}%
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeploymentModal;