import React, { useState, useEffect } from 'react';
import { 
  HelpCircle, 
  CheckCircle, 
  AlertTriangle, 
  Info,
  ExternalLink, 
  Copy, 
  Eye, 
  EyeOff,
  Download,
  Upload,
  Settings,
  Key,
  Shield,
  Zap,
  Terminal,
  FileText, 
  Monitor
} from 'lucide-react';

interface DeploymentAssistantProps {
  currentStep: string;
  platform: string;
  isVisible: boolean;
  onClose: () => void;
  deploymentStatus: 'idle' | 'configuring' | 'building' | 'deploying' | 'success' | 'error';
  currentError?: string;
}

interface HelpContent {
  title: string;
  description: string;
  steps: string[];
  tips: string[];
  troubleshooting: { issue: string; solution: string }[];
  requirements: string[];
  estimatedTime: string;
  automation?: {
    available: boolean;
    description: string;
    action: string;
  };
}

const DeploymentAssistant: React.FC<DeploymentAssistantProps> = ({
  currentStep,
  platform,
  isVisible,
  onClose,
  deploymentStatus,
  currentError
}) => {
  const [activeTab, setActiveTab] = useState<'help' | 'automation' | 'troubleshooting' | 'security'>('help');
  const [showSecrets, setShowSecrets] = useState(false);
  const [automationProgress, setAutomationProgress] = useState(0);

  const getHelpContent = (): HelpContent => {
    const stepKey = `${platform}-${currentStep}`;
    
    const helpDatabase: Record<string, HelpContent> = {
      'android-rust-build': {
        title: 'Building Rust Code for Android',
        description: 'Compiling Rust code for all Android architectures (ARM64, ARM, x86, x86_64)',
        steps: [
          'Install Android NDK and configure environment',
          'Add Android targets to Rust toolchain',
          'Set up cross-compilation environment',
          'Build for each target architecture',
          'Copy libraries to Android project'
        ],
        tips: [
          'Use cargo-ndk for easier cross-compilation',
          'Enable LTO for smaller binary sizes',
          'Use strip to reduce library size',
          'Test on different architectures'
        ],
        troubleshooting: [
          {
            issue: 'NDK not found error',
            solution: 'Set ANDROID_NDK_ROOT environment variable to NDK path'
          },
          {
            issue: 'Linker errors',
            solution: 'Ensure correct target triple and NDK version compatibility'
          },
          {
            issue: 'Large binary size',
            solution: 'Enable LTO and use release profile optimizations'
          }
        ],
        requirements: [
          'Android NDK r25c or later',
          'Rust toolchain with Android targets',
          'Properly configured environment variables'
        ],
        estimatedTime: '3-5 minutes',
        automation: {
          available: true,
          description: 'Automatically install NDK, add targets, and build for all architectures',
          action: 'auto-build-rust'
        }
      },
      'android-gradle-build': {
        title: 'Building Android AAB/APK',
        description: 'Creating signed Android App Bundle or APK for Google Play Store',
        steps: [
          'Configure signing in build.gradle',
          'Set up keystore properties',
          'Run Gradle build task',
          'Verify signed output',
          'Check bundle/APK integrity'
        ],
        tips: [
          'Use AAB format for Play Store (smaller downloads)',
          'Enable R8 code shrinking for smaller size',
          'Test on multiple devices before release',
          'Use build cache to speed up builds'
        ],
        troubleshooting: [
          {
            issue: 'Keystore not found',
            solution: 'Ensure keystore path is correct in keystore.properties'
          },
          {
            issue: 'Signing failed',
            solution: 'Check keystore and key passwords are correct'
          },
          {
            issue: 'Build timeout',
            solution: 'Increase Gradle daemon heap size and enable parallel builds'
          }
        ],
        requirements: [
          'Valid Android signing keystore',
          'Configured keystore.properties',
          'Android SDK and build tools'
        ],
        estimatedTime: '2-4 minutes',
        automation: {
          available: true,
          description: 'Automatically configure signing and build signed AAB',
          action: 'auto-build-android'
        }
      },
      'android-upload-playstore': {
        title: 'Uploading to Google Play Store',
        description: 'Publishing your app to Google Play Console for distribution',
        steps: [
          'Set up Google Play Console API access',
          'Configure service account credentials',
          'Upload AAB to Play Console',
          'Set release track (internal/alpha/beta/production)',
          'Submit for review'
        ],
        tips: [
          'Start with internal testing track',
          'Use staged rollouts for production',
          'Prepare store listing before upload',
          'Test thoroughly on internal track first'
        ],
        troubleshooting: [
          {
            issue: 'API access denied',
            solution: 'Ensure service account has proper permissions in Play Console'
          },
          {
            issue: 'Upload failed',
            solution: 'Check AAB is properly signed and meets Play Store requirements'
          },
          {
            issue: 'Version code conflict',
            solution: 'Increment version code in build.gradle'
          }
        ],
        requirements: [
          'Google Play Console account',
          'Service account with API access',
          'Signed AAB file',
          'App listing configured'
        ],
        estimatedTime: '5-10 minutes',
        automation: {
          available: true,
          description: 'Automatically upload to Play Console using Fastlane',
          action: 'auto-upload-playstore'
        }
      },
      'ios-xcode-build': {
        title: 'Building iOS App with Xcode',
        description: 'Compiling iOS application with proper code signing',
        steps: [
          'Configure iOS project settings',
          'Set up code signing certificates',
          'Build for iOS device',
          'Create archive for distribution',
          'Verify code signing'
        ],
        tips: [
          'Use automatic code signing for easier setup',
          'Ensure provisioning profiles are valid',
          'Test on physical device before archiving',
          'Enable bitcode for App Store distribution'
        ],
        troubleshooting: [
          {
            issue: 'Code signing error',
            solution: 'Check certificate validity and provisioning profile'
          },
          {
            issue: 'Build failed',
            solution: 'Clean build folder and retry with fresh certificates'
          },
          {
            issue: 'Archive invalid',
            solution: 'Ensure all frameworks are properly signed'
          }
        ],
        requirements: [
          'Xcode 15 or later',
          'Valid iOS Developer certificate',
          'Provisioning profile',
          'iOS device for testing'
        ],
        estimatedTime: '5-8 minutes',
        automation: {
          available: true,
          description: 'Automatically build and archive iOS app',
          action: 'auto-build-ios'
        }
      },
      'web-wasm-build': {
        title: 'Building Rust to WebAssembly',
        description: 'Compiling Rust code to WebAssembly for web deployment',
        steps: [
          'Install wasm-pack tool',
          'Configure Cargo.toml for web target',
          'Build WebAssembly module',
          'Generate JavaScript bindings',
          'Optimize WASM binary'
        ],
        tips: [
          'Use wee_alloc for smaller binary size',
          'Enable LTO for better optimization',
          'Use wasm-opt for additional optimization',
          'Test in different browsers'
        ],
        troubleshooting: [
          {
            issue: 'wasm-pack not found',
            solution: 'Install with: cargo install wasm-pack'
          },
          {
            issue: 'Large WASM size',
            solution: 'Enable optimizations and use wasm-opt'
          },
          {
            issue: 'Browser compatibility',
            solution: 'Add WebAssembly polyfills for older browsers'
          }
        ],
        requirements: [
          'wasm-pack tool',
          'Rust toolchain with wasm32 target',
          'Web bundler (Vite/Webpack)'
        ],
        estimatedTime: '1-2 minutes',
        automation: {
          available: true,
          description: 'Automatically build and optimize WebAssembly',
          action: 'auto-build-wasm'
        }
      }
    };

    return helpDatabase[stepKey] || {
      title: 'Deployment Step',
      description: 'General deployment guidance',
      steps: ['Follow the deployment process'],
      tips: ['Check logs for detailed information'],
      troubleshooting: [],
      requirements: [],
      estimatedTime: 'Variable',
      automation: { available: false, description: '', action: '' }
    };
  };

  const handleAutomation = async (action: string) => {
    setAutomationProgress(0);
    
    // Simulate automation progress
    const interval = setInterval(() => {
      setAutomationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 500);

    // Here you would trigger the actual automation
    console.log(`Triggering automation: ${action}`);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const helpContent = getHelpContent();

  if (!isVisible) return null;

  return (
    <div className="fixed right-4 top-20 bottom-4 w-96 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <HelpCircle className="w-5 h-5 text-blue-400" />
          <h3 className="font-semibold text-white">Deployment Assistant</h3>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Status Indicator */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className={`p-1.5 rounded-full flex items-center justify-center ${
              platform === 'android' ? 'bg-green-900/30' : 
              platform === 'ios' ? 'bg-blue-900/30' : 
              'bg-purple-900/30'
            }`}>
              {platform === 'android' && <Smartphone className="w-3 h-3 text-green-400" />}
              {platform === 'ios' && <Smartphone className="w-3 h-3 text-blue-400" />}
              {platform === 'web' && <Monitor className="w-3 h-3 text-purple-400" />}
            </div>
            <span className="text-sm font-medium text-gray-300">{platform.toUpperCase()}</span>
          </div>
          <div className="flex-1">
            <div className={`text-xs px-2 py-1 rounded ${
              deploymentStatus === 'success' ? 'bg-green-900/30 text-green-300' :
              deploymentStatus === 'error' ? 'bg-red-900/30 text-red-300' :
              deploymentStatus === 'building' || deploymentStatus === 'deploying' || deploymentStatus === 'configuring' ? 'bg-blue-900/30 text-blue-300' :
              'bg-gray-900/30 text-gray-300'
            } flex items-center justify-center`}>
              <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                deploymentStatus === 'success' ? 'bg-green-400' :
                deploymentStatus === 'error' ? 'bg-red-400' :
                deploymentStatus === 'building' || deploymentStatus === 'deploying' || deploymentStatus === 'configuring' ? 'bg-blue-400 animate-pulse' :
                'bg-gray-400'
              }`}></div>
              {deploymentStatus.toUpperCase()}
            </div>
          </div>
        </div>
        {currentError && (
          <div className="mt-2 p-3 bg-red-900/20 border border-red-500/30 rounded-lg text-red-300 text-xs">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <span>{currentError}</span>
            </div>
          </div>
        )}
        
        {deploymentStatus === 'deploying' && (
          <div className="mt-2 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg text-blue-300 text-xs">
            <div className="flex items-center justify-between mb-1.5">
              <span>Deployment in progress</span>
              <div className="flex items-center space-x-1">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping"></div>
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
            <div className="w-full bg-blue-900/50 rounded-full h-1">
              <div className="bg-blue-400 h-1 rounded-full animate-pulse" style={{ width: '60%' }}></div>
            </div>
          </div>
        )}
        
        {deploymentStatus === 'configuring' && (
          <div className="mt-2 p-3 bg-purple-900/20 border border-purple-500/30 rounded-lg text-purple-300 text-xs">
            <div className="flex items-center justify-between mb-1.5">
              <span>Configuring deployment environment</span>
              <div className="flex items-center space-x-1">
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping"></div>
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
            <div className="w-full bg-purple-900/50 rounded-full h-1">
              <div className="bg-purple-400 h-1 rounded-full animate-pulse" style={{ width: '30%' }}></div>
            </div>
          </div>
        )}
        
        {deploymentStatus === 'success' && (
          <div className="mt-2 p-3 bg-green-900/20 border border-green-500/30 rounded-lg text-green-300 text-xs">
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
              <span>Deployment completed successfully!</span>
            </div>
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-700">
        {[
          { id: 'help', label: 'Help', icon: Info },
          { id: 'automation', label: 'Auto', icon: Zap },
          { id: 'troubleshooting', label: 'Debug', icon: AlertTriangle },
          { id: 'security', label: 'Security', icon: Shield }
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as any)}
            className={`flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-xs transition-colors ${
              activeTab === id 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-300 hover:text-white hover:bg-gray-700'
            }`}
          >
            <Icon className="w-3 h-3" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'help' && (
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-white mb-2">{helpContent.title}</h4>
              <p className="text-gray-300 text-sm mb-3">{helpContent.description}</p>
              
              <div className="flex items-center space-x-2 text-xs text-gray-400 mb-3">
                <Clock className="w-3 h-3" />
                <span>Est. time: {helpContent.estimatedTime}</span>
              </div>
            </div>

            <div>
              <h5 className="font-medium text-white mb-2">Steps:</h5>
              <ol className="space-y-1">
                {helpContent.steps.map((step, index) => (
                  <li key={index} className="flex items-start space-x-2 text-sm text-gray-300">
                    <span className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div>
              <h5 className="font-medium text-white mb-2">Requirements:</h5>
              <ul className="space-y-1">
                {helpContent.requirements.map((req, index) => (
                  <li key={index} className="flex items-center space-x-2 text-sm text-gray-300">
                    <CheckCircle className="w-3 h-3 text-green-400 flex-shrink-0" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h5 className="font-medium text-white mb-2">Pro Tips:</h5>
              <ul className="space-y-1">
                {helpContent.tips.map((tip, index) => (
                  <li key={index} className="flex items-start space-x-2 text-sm text-gray-300">
                    <Zap className="w-3 h-3 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'automation' && (
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-white mb-2">Automation Available</h4>
              {helpContent.automation?.available ? (
                <div className="space-y-3">
                  <p className="text-gray-300 text-sm">{helpContent.automation.description}</p>
                  
                  {automationProgress > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>Progress</span>
                        <span>{automationProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${automationProgress}%` }}
                        />
                      </div>
                    </div>
                  )}
                  
                  <button
                    onClick={() => handleAutomation(helpContent.automation!.action)}
                    disabled={automationProgress > 0 && automationProgress < 100}
                    className="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    <Zap className="w-4 h-4" />
                    <span>{automationProgress > 0 && automationProgress < 100 ? 'Running...' : 'Run Automation'}</span>
                  </button>
                </div>
              ) : (
                <p className="text-gray-400 text-sm">No automation available for this step.</p>
              )}
            </div>

            <div>
              <h5 className="font-medium text-white mb-2">Quick Actions:</h5>
              <div className="space-y-2">
                <button className="w-full flex items-center space-x-2 py-2 px-3 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm transition-colors">
                  <Download className="w-3 h-3" />
                  <span>Download Build Scripts</span>
                </button>
                <button className="w-full flex items-center space-x-2 py-2 px-3 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm transition-colors">
                  <FileText className="w-3 h-3" />
                  <span>Generate Config Files</span>
                </button>
                <button className="w-full flex items-center space-x-2 py-2 px-3 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm transition-colors">
                  <Terminal className="w-3 h-3" />
                  <span>Open Terminal Commands</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'troubleshooting' && (
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-white mb-2">Common Issues</h4>
              {helpContent.troubleshooting.length > 0 ? (
                <div className="space-y-3">
                  {helpContent.troubleshooting.map((item, index) => (
                    <div key={index} className="bg-gray-700 rounded-lg p-3">
                      <div className="flex items-start space-x-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                        <h6 className="font-medium text-white text-sm">{item.issue}</h6>
                      </div>
                      <p className="text-gray-300 text-sm ml-6">{item.solution}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">No known issues for this step.</p>
              )}
            </div>

            <div>
              <h5 className="font-medium text-white mb-2">Debug Tools:</h5>
              <div className="space-y-2">
                <button className="w-full flex items-center space-x-2 py-2 px-3 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm transition-colors">
                  <Terminal className="w-3 h-3" />
                  <span>View Build Logs</span>
                </button>
                <button className="w-full flex items-center space-x-2 py-2 px-3 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm transition-colors">
                  <Settings className="w-3 h-3" />
                  <span>Check Configuration</span>
                </button>
                <button className="w-full flex items-center space-x-2 py-2 px-3 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm transition-colors">
                  <ExternalLink className="w-3 h-3" />
                  <span>Open Documentation</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-white mb-2">Security Checklist</h4>
              <div className="space-y-2">
                {[
                  'Keystore properly secured',
                  'Environment variables configured',
                  'Secrets not in version control',
                  'Code signing certificates valid',
                  'API keys properly scoped'
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-gray-300 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h5 className="font-medium text-white mb-2">Sensitive Data:</h5>
              <div className="space-y-2">
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-white">Keystore Password</span>
                    <button
                      onClick={() => setShowSecrets(!showSecrets)}
                      className="text-gray-400 hover:text-white"
                    >
                      {showSecrets ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <code className="flex-1 text-xs bg-gray-800 p-2 rounded text-gray-300">
                      {showSecrets ? 'your_keystore_password' : '••••••••••••••••'}
                    </code>
                    <button
                      onClick={() => copyToClipboard('your_keystore_password')}
                      className="text-gray-400 hover:text-white"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h5 className="font-medium text-white mb-2">Security Actions:</h5>
              <div className="space-y-2">
                <button className="w-full flex items-center space-x-2 py-2 px-3 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm transition-colors">
                  <Key className="w-3 h-3" />
                  <span>Rotate Signing Keys</span>
                </button>
                <button className="w-full flex items-center space-x-2 py-2 px-3 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm transition-colors">
                  <Shield className="w-3 h-3" />
                  <span>Audit Permissions</span>
                </button>
                <button className="w-full flex items-center space-x-2 py-2 px-3 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm transition-colors">
                  <Upload className="w-3 h-3" />
                  <span>Backup Keystore</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeploymentAssistant;