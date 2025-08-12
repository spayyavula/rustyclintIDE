import React, { useState, useEffect } from 'react';
import { 
  Terminal, 
  Play, 
  X, 
  Download,
  RefreshCcw,
  Smartphone,
  Shield,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

interface ScriptRunnerProps {
  onClose?: () => void;
}

const ScriptRunner: React.FC<ScriptRunnerProps> = ({ onClose }) => {
  const [selectedScript, setSelectedScript] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const scripts = [
    {
      id: 'generate-keystore',
      name: 'Generate Android Keystore',
      description: 'Creates a new Android signing keystore',
      command: './scripts/generate-android-keystore.sh',
      category: 'setup'
    },
    {
      id: 'setup-signing',
      name: 'Setup Android Signing',
      description: 'Configures Android project for automated signing',
      command: './scripts/setup-android-signing.sh',
      category: 'setup'
    },
    {
      id: 'keystore-helper',
      name: 'Keystore Helper',
      description: 'Interactive helper for keystore configuration',
      command: './scripts/keystore-helper.sh',
      category: 'setup'
    },
    {
      id: 'deploy-android',
      name: 'Deploy Android App',
      description: 'Builds and deploys Android app to Play Store',
      command: './scripts/deploy-android.sh',
      category: 'deployment'
    },
    {
      id: 'android-automation',
      name: 'Android Automation',
      description: 'Automates Android build and deployment',
      command: './scripts/android-automation.sh full',
      category: 'automation'
    },
    {
      id: 'ios-automation',
      name: 'iOS Automation',
      description: 'Automates iOS build and deployment',
      command: './scripts/ios-automation.sh full',
      category: 'automation'
    }
  ];

  const runScript = async () => {
    if (!selectedScript) return;
    
    const script = scripts.find(s => s.id === selectedScript);
    if (!script) return;
    
    setIsRunning(true);
    setOutput([`Running: ${script.command}`, '']);
    setError(null);
    
    // Simulate script execution with realistic output
    try {
      await simulateScriptExecution(script.id);
      setOutput(prev => [...prev, '', '✅ Script execution completed successfully!']);
    } catch (err: any) {
      setError(err.message);
      setOutput(prev => [...prev, '', `❌ Error: ${err.message}`]);
    } finally {
      setIsRunning(false);
    }
  };
  
  const simulateScriptExecution = async (scriptId: string): Promise<void> => {
    // Simulate different script outputs
    const outputs: Record<string, string[]> = {
      'generate-keystore': [
        '🔐 Android Keystore Generation Script',
        '=====================================',
        '',
        '📋 Keystore Configuration',
        '========================',
        'Keystore path [android/keystore/release.keystore]: ',
        'Key alias [release-key]: ',
        'Validity (days) [10000]: ',
        '',
        '🔑 Security Information',
        '======================',
        'Keystore password: ',
        'Key password: ',
        '',
        '👤 Certificate Information',
        '==========================',
        'Your name: Demo User',
        'Organization: rustyclint',
        'Organization unit: Mobile',
        'City: San Francisco',
        'State/Province: California',
        'Country code (2 letters): US',
        '',
        '🔨 Generating keystore...',
        'Generating 2,048 bit RSA key pair and self-signed certificate (validity 10000 days)',
        'for: CN=Demo User, OU=Mobile, O=rustyclint, L=San Francisco, ST=California, C=US',
        '',
        '✅ Keystore generated successfully!',
        '',
        '📝 Creating android/keystore.properties...',
        '',
        '🔍 Keystore Information:',
        '========================',
        'Alias name: release-key',
        'Creation date: Jun 15, 2023',
        'Entry type: PrivateKeyEntry',
        'Certificate chain length: 1',
        'Certificate[1]:',
        'Owner: CN=Demo User, OU=Mobile, O=rustyclint, L=San Francisco, ST=California, C=US',
        'Issuer: CN=Demo User, OU=Mobile, O=rustyclint, L=San Francisco, ST=California, C=US',
        'Serial number: 1234567890',
        'Valid from: Thu Jun 15 12:00:00 PDT 2023 until: Sun Oct 31 11:00:00 PDT 2050',
        'Certificate fingerprints:',
        '	 SHA1: AA:BB:CC:DD:EE:FF:00:11:22:33:44:55:66:77:88:99:AA:BB:CC:DD',
        '	 SHA256: 00:11:22:33:44:55:66:77:88:99:AA:BB:CC:DD:EE:FF:00:11:22:33:44:55:66:77:88:99:AA:BB:CC:DD:EE:FF',
        '',
        '⚠️  IMPORTANT SECURITY NOTES:',
        '=============================',
        '1. 🔐 BACKUP your keystore file securely!',
        '2. 📝 SAVE the passwords in a secure password manager',
        '3. 🚫 NEVER commit keystore.properties to version control',
        '4. ✅ Add keystore files to .gitignore',
        '5. 🔄 Consider using Google Play App Signing',
        '',
        '📁 Files created:',
        '- android/keystore/release.keystore',
        '- android/keystore.properties',
        '',
        '🎯 Next steps:',
        '1. Test signing: cd android && ./gradlew bundleRelease',
        '2. Upload to Google Play Console',
        '3. Set up CI/CD with environment variables',
        '',
        '🔐 For CI/CD, encode your keystore:',
        'base64 -w 0 android/keystore/release.keystore'
      ],
      'setup-signing': [
        '🤖 Android Signing Setup',
        '========================',
        '✅ Found keystore at android/keystore/release.keystore',
        '📋 Backed up build.gradle to build.gradle.backup',
        '',
        '🔒 Updating .gitignore...',
        '✅ Added Android signing entries to .gitignore',
        '',
        '📝 Creating environment variables template...',
        '✅ Created .env.android.template',
        '',
        '🚀 Creating GitHub Actions workflow...',
        '✅ Created GitHub Actions workflow at .github/workflows/android-release.yml',
        '',
        '🏃 Creating Fastlane configuration...',
        '✅ Created Fastlane configuration at android/fastlane/Fastfile',
        '',
        '📦 Creating deployment script...',
        '✅ Created deployment script at scripts/deploy-android.sh',
        '',
        '🎯 Setup Complete!',
        '==================',
        '',
        '📋 What was created:',
        '- Updated .gitignore with Android signing entries',
        '- .env.android.template (environment variables template)',
        '- .github/workflows/android-release.yml (GitHub Actions workflow)',
        '- android/fastlane/Fastfile (Fastlane configuration)',
        '- scripts/deploy-android.sh (deployment script)',
        '',
        '🔑 Next steps:',
        '1. Copy .env.android.template to .env.android and fill in your values',
        '2. Set up GitHub secrets for CI/CD:',
        '   - KEYSTORE_BASE64 (base64 encoded keystore)',
        '   - KEYSTORE_PASSWORD',
        '   - KEY_PASSWORD',
        '   - KEY_ALIAS',
        '   - GOOGLE_PLAY_SERVICE_ACCOUNT (service account JSON)',
        '3. Test local build: scripts/deploy-android.sh',
        '4. Create a release tag to trigger automated deployment',
        '',
        '🔐 Security reminders:',
        '- Never commit .env.android or keystore files',
        '- Use Google Play App Signing for new apps',
        '- Keep secure backups of your keystore'
      ],
      'deploy-android': [
        '🤖 Starting Android AAB deployment...',
        '✅ Found keystore at android/keystore/release.keystore',
        '✅ Loaded environment variables from .env.android',
        '',
        '📦 Building Rust code for Android targets...',
        'info: downloading component \'rust-std\' for \'aarch64-linux-android\'',
        'info: installing component \'rust-std\' for \'aarch64-linux-android\'',
        '   Compiling rustyclint v0.1.0',
        '    Finished release [optimized] target(s) in 45.67s',
        '',
        '📋 Copying native libraries...',
        '',
        '🔨 Building signed AAB...',
        '> Task :app:preBuild UP-TO-DATE',
        '> Task :app:preReleaseBuild UP-TO-DATE',
        '> Task :app:compileReleaseKotlin',
        '> Task :app:javaPreCompileRelease',
        '> Task :app:bundleReleaseResources',
        '> Task :app:bundleRelease',
        'BUILD SUCCESSFUL in 2m 34s',
        '✅ AAB created successfully: app/build/outputs/bundle/release/app-release.aab',
        '📊 AAB size: 38.7 MB',
        '',
        '🚀 Uploading to Google Play Store...',
        '⚠️ Fastlane not found. Install with: gem install fastlane',
        '📱 Manual upload required to Google Play Console',
        '',
        '🎉 Android deployment completed!'
      ],
      'android-automation': [
        '[INFO] Starting full Android deployment automation...',
        '[INFO] Checking prerequisites...',
        '[SUCCESS] Prerequisites check passed',
        '[INFO] Setting up Android NDK...',
        '[SUCCESS] Found NDK version: 25.2.9519653',
        '[INFO] Adding Rust targets for Android...',
        '[INFO] Adding target: aarch64-linux-android',
        '[INFO] Adding target: armv7-linux-androideabi',
        '[INFO] Adding target: i686-linux-android',
        '[INFO] Adding target: x86_64-linux-android',
        '[SUCCESS] All Android targets added',
        '[INFO] Building Rust code for Android architectures...',
        '[INFO] Building for target: aarch64-linux-android',
        '[SUCCESS] Build successful for aarch64-linux-android',
        '[INFO] Building for target: armv7-linux-androideabi',
        '[SUCCESS] Build successful for armv7-linux-androideabi',
        '[INFO] Building for target: i686-linux-android',
        '[SUCCESS] Build successful for i686-linux-android',
        '[INFO] Building for target: x86_64-linux-android',
        '[SUCCESS] Build successful for x86_64-linux-android',
        '[INFO] Copying native libraries to Android project...',
        '[SUCCESS] Native libraries copied',
        '[INFO] Verifying Android keystore...',
        '[SUCCESS] Keystore verification passed',
        '[INFO] Building Android App Bundle (AAB)...',
        '[SUCCESS] AAB build successful',
        '[SUCCESS] AAB created: app/build/outputs/bundle/release/app-release.aab (Size: 38.7 MB)',
        '[INFO] Verifying AAB signature...',
        '[WARNING] bundletool not found. Skipping AAB validation.',
        '[INFO] Checking for Google Play upload configuration...',
        '[WARNING] Google Play upload not configured. Skipping upload.',
        '[INFO] To enable upload:',
        '[INFO] 1. Set up Fastlane configuration',
        '[INFO] 2. Set GOOGLE_PLAY_SERVICE_ACCOUNT environment variable',
        '[INFO] Generating deployment report...',
        '[SUCCESS] Report generated: deployment-report-20250615-123456.txt',
        '[SUCCESS] Android automation completed successfully!',
      ],
      'ios-automation': [
        '[INFO] Starting full iOS deployment automation...',
        '[ERROR] iOS development requires macOS',
        '[ERROR] This script must be run on a macOS system with Xcode installed.',
        '',
        'To deploy to iOS:',
        '1. Use a macOS system with Xcode installed',
        '2. Install the iOS development certificates',
        '3. Run this script on the macOS system',
        '',
        'For more information, see the iOS deployment documentation.'
      ],
      'keystore-helper': [
        '╔══════════════════════════════════════════════════════════════╗',
        '║                Android Keystore Helper                      ║',
        '║              Complete Setup Assistant                       ║',
        '╚══════════════════════════════════════════════════════════════╝',
        '',
        '[STEP] Checking prerequisites...',
        '[SUCCESS] Prerequisites check passed',
        '',
        '🔧 What would you like to do?',
        '',
        '1. 🆕 Generate new keystore',
        '2. ✅ Verify existing keystore',
        '3. ⚙️  Configure Gradle signing',
        '4. 🧪 Test signing configuration',
        '5. 🚀 Generate CI/CD configuration',
        '6. 🔒 Show security recommendations',
        '7. 📖 Show complete setup guide',
        '8. 🚪 Exit',
        '',
        'Enter your choice (1-8): 2',
        '',
        '[STEP] Verifying existing keystore...',
        '[INFO] Keystore found: android/keystore/release.keystore',
        '[INFO] Verifying keystore access...',
        '[SUCCESS] Keystore verification passed!',
        '',
        '[INFO] Keystore details:',
        'Alias name: release-key',
        'Creation date: Jun 15, 2023',
        'Entry type: PrivateKeyEntry',
        'Certificate chain length: 1',
        'Certificate[1]:',
        'Owner: CN=Demo User, OU=Mobile, O=rustyclint, L=San Francisco, ST=California, C=US',
        'Issuer: CN=Demo User, OU=Mobile, O=rustyclint, L=San Francisco, ST=California, C=US',
        'Serial number: 1234567890',
        'Valid from: Thu Jun 15 12:00:00 PDT 2023 until: Sun Oct 31 11:00:00 PDT 2050',
        '',
        '[SUCCESS] Your keystore is properly configured!'
      ]
    };
    
    const scriptOutput = outputs[scriptId] || ['No output available for this script'];
    
    // Simulate script execution with delays
    for (const line of scriptOutput) {
      await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));
      setOutput(prev => [...prev, line]);
      
      // Simulate error for iOS automation
      if (scriptId === 'ios-automation' && line.includes('[ERROR]')) {
        throw new Error('iOS development requires macOS');
      }
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-h-[95vh] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-700">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl shadow-lg">
            <Terminal className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Deployment Scripts</h2>
            <p className="text-gray-400">Run Android deployment automation scripts</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-xl"
          >
            <X className="w-6 h-6" />
          </button>
        )}
      </div>

      <div className="flex h-[80vh]">
        {/* Script Selection */}
        <div className="w-80 bg-gray-900 border-r border-gray-700 p-6 overflow-y-auto">
          <h3 className="text-lg font-semibold text-white mb-4">Available Scripts</h3>
          
          <div className="space-y-6">
            {/* Setup Scripts */}
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-3">Setup & Configuration</h4>
              <div className="space-y-2">
                {scripts.filter(s => s.category === 'setup').map(script => (
                  <button
                    key={script.id}
                    onClick={() => setSelectedScript(script.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedScript === script.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <div className="font-medium">{script.name}</div>
                    <div className="text-xs mt-1 opacity-80">{script.description}</div>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Deployment Scripts */}
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-3">Deployment</h4>
              <div className="space-y-2">
                {scripts.filter(s => s.category === 'deployment').map(script => (
                  <button
                    key={script.id}
                    onClick={() => setSelectedScript(script.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedScript === script.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <div className="font-medium">{script.name}</div>
                    <div className="text-xs mt-1 opacity-80">{script.description}</div>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Automation Scripts */}
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-3">Automation</h4>
              <div className="space-y-2">
                {scripts.filter(s => s.category === 'automation').map(script => (
                  <button
                    key={script.id}
                    onClick={() => setSelectedScript(script.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedScript === script.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <div className="font-medium">{script.name}</div>
                    <div className="text-xs mt-1 opacity-80">{script.description}</div>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Actions */}
            <div className="pt-4 border-t border-gray-700">
              <button
                onClick={runScript}
                disabled={!selectedScript || isRunning}
                className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-colors ${
                  !selectedScript || isRunning
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {isRunning ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Running...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    <span>Run Script</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Output Terminal */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Script Output</h3>
              <div className="flex items-center space-x-2">
                {error ? (
                  <div className="flex items-center space-x-1 text-red-400 text-sm">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Error</span>
                  </div>
                ) : output.length > 0 && !isRunning ? (
                  <div className="flex items-center space-x-1 text-green-400 text-sm">
                    <CheckCircle className="w-4 h-4" />
                    <span>Complete</span>
                  </div>
                ) : null}
                <button
                  onClick={() => setOutput([])}
                  disabled={output.length === 0}
                  className="p-1 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm h-[calc(100vh-16rem)] overflow-y-auto">
              {output.length === 0 ? (
                <div className="text-gray-500 italic">
                  {selectedScript 
                    ? 'Select "Run Script" to execute the selected script' 
                    : 'Select a script from the left panel'}
                </div>
              ) : (
                output.map((line, index) => (
                  <div 
                    key={index} 
                    className={`${
                      line.includes('[ERROR]') ? 'text-red-400' :
                      line.includes('[WARNING]') ? 'text-yellow-400' :
                      line.includes('[SUCCESS]') ? 'text-green-400' :
                      line.includes('[INFO]') ? 'text-blue-400' :
                      line.includes('[STEP]') ? 'text-purple-400' :
                      line.includes('[TIP]') ? 'text-cyan-400' :
                      line.includes('✅') ? 'text-green-400' :
                      line.includes('⚠️') ? 'text-yellow-400' :
                      line.includes('❌') ? 'text-red-400' :
                      line.includes('🔐') || line.includes('🔑') || line.includes('🔒') ? 'text-blue-300' :
                      line.includes('=====') ? 'text-gray-500' :
                      line.startsWith('╔') || line.startsWith('║') || line.startsWith('╚') ? 'text-green-400' :
                      'text-gray-300'
                    }`}
                  >
                    {line || ' '}
                  </div>
                ))
              )}
              {isRunning && (
                <div className="flex items-center space-x-2 text-blue-400 mt-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
              )}
            </div>
          </div>
          
          <div className="p-4 border-t border-gray-700 bg-gray-800">
            <div className="flex space-x-4">
              <button
                onClick={() => setOutput([])}
                disabled={output.length === 0}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-700 disabled:opacity-50 text-white rounded-lg transition-colors"
              >
                <RefreshCcw className="w-4 h-4" />
                <span>Clear Output</span>
              </button>
              
              <button
                disabled={output.length === 0}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-700 disabled:opacity-50 text-white rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Save Output</span>
              </button>
              
              {isRunning && (
                <button
                  onClick={() => setIsRunning(false)}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                  <span>Stop Execution</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScriptRunner;