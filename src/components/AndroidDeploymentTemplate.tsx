import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  Play, 
  CheckCircle, 
  XCircle, 
  Terminal, 
  Download, 
  Upload,
  RefreshCcw,
  Shield,
  Settings,
  Zap,
  ArrowRight,
  AlertTriangle,
  Info
} from 'lucide-react';
import DeploymentProgressBar from './DeploymentProgressBar';

interface AndroidDeploymentTemplateProps {
  onClose?: () => void;
}

const AndroidDeploymentTemplate: React.FC<AndroidDeploymentTemplateProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentComplete, setDeploymentComplete] = useState(false);
  const [deploymentError, setDeploymentError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'logs' | 'config' | 'help'>('overview');
  const [logs, setLogs] = useState<string[]>([]);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  
  // Deployment configuration
  const [config, setConfig] = useState({
    buildType: 'release',
    outputType: 'aab', // aab or apk
    minify: true,
    track: 'internal', // internal, alpha, beta, production
    enableOptimizations: true
  });

  // Define deployment steps
  const deploymentSteps = [
    { id: 'setup', name: 'Setup Environment', status: 'pending', progress: 0 },
    { id: 'keystore', name: 'Verify Keystore', status: 'pending', progress: 0 },
    { id: 'build-rust', name: 'Build Rust Libraries', status: 'pending', progress: 0 },
    { id: 'copy-libs', name: 'Copy Native Libraries', status: 'pending', progress: 0 },
    { id: 'gradle-build', name: 'Build Android App', status: 'pending', progress: 0 },
    { id: 'sign', name: 'Sign App Bundle', status: 'pending', progress: 0 },
    { id: 'upload', name: 'Upload to Play Store', status: 'pending', progress: 0 }
  ];
  
  const [steps, setSteps] = useState(deploymentSteps);

  // Simulate deployment process
  const startDeployment = () => {
    setIsDeploying(true);
    setDeploymentError(null);
    setDeploymentComplete(false);
    setLogs([]);
    setSteps(deploymentSteps.map(step => ({ ...step, status: 'pending', progress: 0 })));
    setCurrentStep(0);
    
    // Start the deployment process
    runDeploymentStep(0);
  };
  
  const runDeploymentStep = (stepIndex: number) => {
    if (stepIndex >= deploymentSteps.length) {
      setIsDeploying(false);
      setDeploymentComplete(true);
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
    
    // Add initial log entry
    addLog(`Starting step: ${deploymentSteps[stepIndex].name}`);
    
    // Add step-specific logs
    addStepLogs(stepIndex);
    
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
        setDeploymentError(`Failed to execute step: ${deploymentSteps[stepIndex].name}`);
        addLog(`ERROR: ${deploymentSteps[stepIndex].name} failed. See logs for details.`);
      } else {
        // Mark step as completed
        setSteps(prev => prev.map((step, idx) => 
          idx === stepIndex ? { ...step, status: 'completed', progress: 100 } : step
        ));
        
        addLog(`Completed step: ${deploymentSteps[stepIndex].name}`);
        
        // Move to next step
        runDeploymentStep(stepIndex + 1);
      }
    }, stepDuration);
  };
  
  const addLog = (message: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };
  
  const addStepLogs = (stepIndex: number) => {
    switch (stepIndex) {
      case 0: // Setup Environment
        setTimeout(() => addLog('Checking Android SDK installation...'), 500);
        setTimeout(() => addLog('Android SDK found at /home/user/Android/Sdk'), 1000);
        setTimeout(() => addLog('Checking for Android NDK...'), 1500);
        setTimeout(() => addLog('Android NDK found at /home/user/Android/Sdk/ndk/25.2.9519653'), 2000);
        setTimeout(() => addLog('Setting up environment variables...'), 2500);
        break;
      case 1: // Verify Keystore
        setTimeout(() => addLog('Checking for keystore file...'), 500);
        setTimeout(() => addLog('Keystore found at android/keystore/release.keystore'), 1000);
        setTimeout(() => addLog('Verifying keystore access...'), 1500);
        setTimeout(() => addLog('Keystore verification successful'), 2000);
        break;
      case 2: // Build Rust Libraries
        setTimeout(() => addLog('Adding Android targets to Rust toolchain...'), 500);
        setTimeout(() => addLog('Building for aarch64-linux-android...'), 1000);
        setTimeout(() => addLog('Building for armv7-linux-androideabi...'), 2000);
        setTimeout(() => addLog('Building for x86_64-linux-android...'), 3000);
        setTimeout(() => addLog('Rust libraries built successfully'), 4000);
        break;
      case 3: // Copy Native Libraries
        setTimeout(() => addLog('Creating jniLibs directories...'), 500);
        setTimeout(() => addLog('Copying aarch64 libraries...'), 1000);
        setTimeout(() => addLog('Copying armv7 libraries...'), 1500);
        setTimeout(() => addLog('Copying x86_64 libraries...'), 2000);
        break;
      case 4: // Gradle Build
        setTimeout(() => addLog('Running Gradle clean...'), 500);
        setTimeout(() => addLog('Compiling Java/Kotlin sources...'), 1000);
        setTimeout(() => addLog('Processing resources...'), 2000);
        setTimeout(() => addLog(`Building ${config.outputType.toUpperCase()}...`), 3000);
        setTimeout(() => addLog(`${config.outputType.toUpperCase()} built successfully`), 4000);
        break;
      case 5: // Sign App
        setTimeout(() => addLog('Signing with release keystore...'), 500);
        setTimeout(() => addLog('Verifying signature...'), 2000);
        setTimeout(() => addLog('App signed successfully'), 3000);
        break;
      case 6: // Upload
        setTimeout(() => addLog('Preparing for upload to Google Play...'), 500);
        setTimeout(() => addLog('Authenticating with Google Play API...'), 1000);
        setTimeout(() => addLog(`Uploading to ${config.track} track...`), 2000);
        setTimeout(() => addLog('Upload successful!'), 4000);
        setTimeout(() => addLog('App available in Google Play Console'), 5000);
        break;
    }
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
            <h2 className="text-2xl font-bold text-white">Android Deployment</h2>
            <p className="text-gray-400">Deploy your app to Google Play Store</p>
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
          { id: 'overview', label: 'Overview', icon: Smartphone },
          { id: 'logs', label: 'Logs', icon: Terminal },
          { id: 'config', label: 'Configuration', icon: Settings },
          { id: 'help', label: 'Help', icon: Info }
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
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Deployment Status */}
            <div className="bg-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Deployment Status</h3>
              
              <DeploymentProgressBar 
                steps={steps}
                currentStep={currentStep}
                platform="android"
              />
              
              {deploymentError && (
                <div className="mt-4 p-4 bg-red-900/20 border border-red-500 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                    <h4 className="font-medium text-red-300">Deployment Error</h4>
                  </div>
                  <p className="text-red-300">{deploymentError}</p>
                </div>
              )}
              
              {deploymentComplete && (
                <div className="mt-4 p-4 bg-green-900/20 border border-green-500 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <h4 className="font-medium text-green-300">Deployment Complete</h4>
                  </div>
                  <p className="text-green-300">Your app has been successfully deployed to Google Play Store!</p>
                  <p className="text-green-300 mt-2">It is now available on the {config.track} track.</p>
                </div>
              )}
            </div>
            
            {/* Actions */}
            <div className="flex space-x-4">
              {!isDeploying ? (
                <button
                  onClick={startDeployment}
                  className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-medium transition-colors"
                >
                  <Play className="w-5 h-5" />
                  <span>Start Deployment</span>
                </button>
              ) : (
                <button
                  onClick={() => setIsDeploying(false)}
                  className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg font-medium transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                  <span>Stop Deployment</span>
                </button>
              )}
              
              <button className="flex items-center justify-center space-x-2 py-3 px-4 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors">
                <Download className="w-5 h-5" />
                <span>Download AAB</span>
              </button>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-white">
                  {config.outputType === 'aab' ? 'AAB' : 'APK'}
                </div>
                <div className="text-sm text-gray-400">Output Format</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-white capitalize">
                  {config.track}
                </div>
                <div className="text-sm text-gray-400">Release Track</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-white capitalize">
                  {config.buildType}
                </div>
                <div className="text-sm text-gray-400">Build Type</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Deployment Logs</h3>
            
            <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm h-96 overflow-y-auto">
              {logs.length === 0 ? (
                <div className="text-gray-500 italic">No logs yet. Start deployment to see logs.</div>
              ) : (
                logs.map((log, index) => (
                  <div 
                    key={index} 
                    className={`mb-1 ${
                      log.includes('ERROR') ? 'text-red-400' :
                      log.includes('WARNING') ? 'text-yellow-400' :
                      log.includes('successful') || log.includes('Completed') ? 'text-green-400' :
                      'text-gray-300'
                    }`}
                  >
                    {log}
                  </div>
                ))
              )}
            </div>
            
            <div className="flex space-x-4">
              <button className="flex items-center space-x-2 py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
                <Download className="w-4 h-4" />
                <span>Download Logs</span>
              </button>
              <button 
                onClick={() => setLogs([])}
                className="flex items-center space-x-2 py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                <RefreshCcw className="w-4 h-4" />
                <span>Clear Logs</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'config' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white mb-4">Deployment Configuration</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Build Type
                </label>
                <select
                  value={config.buildType}
                  onChange={(e) => setConfig(prev => ({ ...prev, buildType: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="debug">Debug</option>
                  <option value="release">Release</option>
                </select>
                <p className="mt-1 text-sm text-gray-400">
                  Release builds are optimized and minified.
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Output Type
                </label>
                <select
                  value={config.outputType}
                  onChange={(e) => setConfig(prev => ({ ...prev, outputType: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="aab">Android App Bundle (AAB)</option>
                  <option value="apk">APK</option>
                </select>
                <p className="mt-1 text-sm text-gray-400">
                  AAB is recommended for Play Store.
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Release Track
                </label>
                <select
                  value={config.track}
                  onChange={(e) => setConfig(prev => ({ ...prev, track: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="internal">Internal Testing</option>
                  <option value="alpha">Alpha</option>
                  <option value="beta">Beta</option>
                  <option value="production">Production</option>
                </select>
                <p className="mt-1 text-sm text-gray-400">
                  Start with internal testing for new apps.
                </p>
              </div>
              
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-300 mb-2">
                  <input
                    type="checkbox"
                    checked={config.minify}
                    onChange={(e) => setConfig(prev => ({ ...prev, minify: e.target.checked }))}
                    className="rounded border-gray-600 text-green-600 focus:ring-green-500"
                  />
                  <span>Enable Minification</span>
                </label>
                <p className="mt-1 text-sm text-gray-400">
                  Reduces app size by removing unused code.
                </p>
              </div>
            </div>
            
            <div>
              <button
                onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                className="flex items-center space-x-2 text-sm text-gray-300 hover:text-white transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span>{showAdvancedOptions ? 'Hide Advanced Options' : 'Show Advanced Options'}</span>
              </button>
              
              {showAdvancedOptions && (
                <div className="mt-4 p-4 bg-gray-700 rounded-lg">
                  <h4 className="font-medium text-white mb-3">Advanced Options</h4>
                  
                  <div className="space-y-4">
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-300">
                      <input
                        type="checkbox"
                        checked={config.enableOptimizations}
                        onChange={(e) => setConfig(prev => ({ ...prev, enableOptimizations: e.target.checked }))}
                        className="rounded border-gray-600 text-green-600 focus:ring-green-500"
                      />
                      <span>Enable Advanced Optimizations</span>
                    </label>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Custom Keystore Path
                      </label>
                      <input
                        type="text"
                        placeholder="android/keystore/release.keystore"
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-end">
              <button className="flex items-center space-x-2 py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                <CheckCircle className="w-4 h-4" />
                <span>Save Configuration</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'help' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white mb-4">Deployment Help</h3>
            
            <div className="bg-gray-700 rounded-lg p-6">
              <h4 className="font-medium text-white mb-3">Android Deployment Process</h4>
              <p className="text-gray-300 mb-4">
                This template guides you through the complete process of deploying your Android app to the Google Play Store.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <h5 className="font-medium text-white">Setup Environment</h5>
                    <p className="text-gray-300 text-sm">
                      Configures Android SDK, NDK, and Rust toolchain for cross-compilation.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <h5 className="font-medium text-white">Verify Keystore</h5>
                    <p className="text-gray-300 text-sm">
                      Checks that your Android signing keystore is properly configured.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <h5 className="font-medium text-white">Build Rust Libraries</h5>
                    <p className="text-gray-300 text-sm">
                      Compiles Rust code for all Android architectures (ARM64, ARMv7, x86, x86_64).
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">
                    4
                  </div>
                  <div>
                    <h5 className="font-medium text-white">Copy Native Libraries</h5>
                    <p className="text-gray-300 text-sm">
                      Copies compiled Rust libraries to the Android project structure.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">
                    5
                  </div>
                  <div>
                    <h5 className="font-medium text-white">Build Android App</h5>
                    <p className="text-gray-300 text-sm">
                      Builds the Android app using Gradle, creating an AAB or APK.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">
                    6
                  </div>
                  <div>
                    <h5 className="font-medium text-white">Sign App Bundle</h5>
                    <p className="text-gray-300 text-sm">
                      Signs the app with your release keystore for Play Store distribution.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">
                    7
                  </div>
                  <div>
                    <h5 className="font-medium text-white">Upload to Play Store</h5>
                    <p className="text-gray-300 text-sm">
                      Uploads the signed app to Google Play Console for distribution.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-900/20 border border-blue-500 rounded-lg p-6">
              <div className="flex items-center space-x-2 mb-3">
                <Shield className="w-5 h-5 text-blue-400" />
                <h4 className="font-medium text-white">Keystore Security</h4>
              </div>
              <p className="text-gray-300 mb-3">
                Your Android signing keystore is critical for app updates. If you lose it, you cannot update your app on the Play Store.
              </p>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Keep multiple secure backups of your keystore file</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Store passwords in a secure password manager</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Use Google Play App Signing for new apps</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Never commit keystore files to version control</span>
                </li>
              </ul>
            </div>
            
            <div className="flex justify-center">
              <button className="flex items-center space-x-2 py-3 px-6 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                <Download className="w-5 h-5" />
                <span>Download Complete Guide</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AndroidDeploymentTemplate;