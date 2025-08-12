import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, X, Minimize2 } from 'lucide-react';
import { TERMINAL_CONSTANTS, formatCommandOutput, isTerminalPrompt } from '../utils/stringUtils';
import { optimizeMemory } from '../utils/memoryOptimizer';

interface TerminalProps {
  isVisible: boolean;
  onToggle: () => void;
}

const Terminal: React.FC<TerminalProps> = ({ isVisible, onToggle }) => {
  const [history, setHistory] = useState<string[]>([
    TERMINAL_CONSTANTS.WELCOME,
    TERMINAL_CONSTANTS.HELP
  ]);
  const [currentCommand, setCurrentCommand] = useState('');
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  // Clean up memory when terminal is closed
  useEffect(() => {
    if (!isVisible) {
      optimizeMemory();
    }
  }, [isVisible]);

  const executeCommand = (command: string) => {
    const cmd = command.trim();
    let output = '';

    switch (cmd) {
      case 'help':
        output = `Available commands:
  clear         - Clear terminal
  memory        - Show memory usage
  gc            - Force garbage collection
  
  cargo build    - Build the project
  cargo run      - Run the project
  cargo test     - Run tests
  
  # iOS Deployment Commands
  ios build      - Build for iOS device and simulator
  ios archive    - Create iOS archive for distribution
  ios export     - Export IPA file
  ios upload     - Upload to App Store Connect
  ios deploy     - Full iOS deployment pipeline
  
  # Android Deployment Commands
  android build  - Build Android APK/AAB
  android sign   - Sign APK with release keystore
  android upload - Upload to Google Play Console
  android deploy - Full Android deployment pipeline
  
  # Flutter Deployment Commands
  flutter ios    - Build and deploy Flutter iOS app
  flutter android - Build and deploy Flutter Android app
  flutter deploy - Deploy to both platforms
  
 rustyclint scan - Run security analysis
 rustyclint fix  - Auto-fix vulnerabilities
 rustyclint bench - Performance benchmark
 rustyclint audit - Security audit
 rustyclint audit - Security audit
  github sync    - Sync with GitHub repositories
  supabase status - Check database connection
  zapier test    - Test automation workflows
  cargo clean    - Clean build artifacts
  ls            - List files
  clear         - Clear terminal
  help          - Show this help`;
      case 'cargo build':
        output = `   Compiling rustyclint v0.1.0
    Finished dev [unoptimized + debuginfo] target(s) in 2.34s`;
        break;
      case 'cargo run':
        output = `   Compiling rustyclint v0.1.0
    Finished dev [unoptimized + debuginfo] target(s) in 1.23s
     Running \`target/debug/rustyclint\`
Hello, rustyclint!
rustyclint Initialized
Security Engine: Active
Performance Mode: Optimized`;
        break;
      case 'memory':
        const formatMemory = () => {
          if (typeof performance !== 'undefined' && 'memory' in performance) {
            const memory = (performance as any).memory;
            return `Total JS Heap: ${Math.round(memory.totalJSHeapSize / 1024 / 1024)} MB
Used JS Heap: ${Math.round(memory.usedJSHeapSize / 1024 / 1024)} MB
JS Heap Limit: ${Math.round(memory.jsHeapSizeLimit / 1024 / 1024)} MB`;
          }
          return 'Memory information not available in this browser';
        };
        output = formatMemory();
        break;
      case 'gc':
        output = 'Attempting to clean up memory...';
        setTimeout(() => optimizeMemory(), 100);
        break;
      case 'ios build':
        output = `🍎 Building for iOS...

📦 Building Rust code for iOS targets:
   Compiling for aarch64-apple-ios (device)
   Compiling for x86_64-apple-ios (simulator)
   Creating universal binary with lipo

🔨 Building iOS app with Xcode:
   xcodebuild -project ios/App.xcodeproj -scheme App -configuration Release
   
✅ iOS build completed successfully!
   Device binary: target/aarch64-apple-ios/release/libapp.a
   Simulator binary: target/x86_64-apple-ios/release/libapp.a
   Universal binary: libapp-universal.a
   iOS app: build/Release-iphoneos/App.app`;
        break;
      case 'ios archive':
        output = `📦 Creating iOS archive...

🔨 Running xcodebuild archive:
   xcodebuild -project ios/App.xcodeproj -scheme App -configuration Release -destination "generic/platform=iOS" archive -archivePath build/App.xcarchive

✅ Archive created successfully!
   Archive path: build/App.xcarchive
   
📋 Archive contents:
   - App.app (iOS application)
   - dSYMs (debug symbols)
   - Info.plist (metadata)`;
        break;
      case 'ios export':
        output = `📤 Exporting IPA file...

🔨 Running xcodebuild exportArchive:
   xcodebuild -exportArchive -archivePath build/App.xcarchive -exportPath build/ -exportOptionsPlist ios/ExportOptions.plist

✅ IPA exported successfully!
   IPA file: build/App.ipa
   Size: 45.2 MB
   
📋 Export details:
   - Distribution method: App Store
   - Code signing: Automatic
   - Bitcode: Enabled
   - Symbols: Included`;
        break;
      case 'ios upload':
        output = `☁️  Uploading to App Store Connect...

🔑 Authenticating with App Store Connect API:
   Using API key: ${process.env.APP_STORE_API_KEY || 'XXXXXXXXXX'}
   Issuer ID: ${process.env.APP_STORE_ISSUER_ID || 'XXXXXXXXXX'}

📤 Uploading IPA:
   xcrun altool --upload-app --type ios --file build/App.ipa
   
✅ Upload completed successfully!
   Build number: 1.0.0 (42)
   Status: Processing
   
📋 Next steps:
   1. Wait for processing to complete (5-15 minutes)
   2. Add build to App Store Connect
   3. Submit for App Store review`;
        break;
      case 'ios deploy':
        output = `🚀 Starting full iOS deployment pipeline...

Step 1/5: Building Rust code for iOS
✅ aarch64-apple-ios target built
✅ x86_64-apple-ios target built
✅ Universal binary created

Step 2/5: Building iOS app with Xcode
✅ Xcode build completed

Step 3/5: Creating archive
✅ Archive created: build/App.xcarchive

Step 4/5: Exporting IPA
✅ IPA exported: build/App.ipa (45.2 MB)

Step 5/5: Uploading to App Store Connect
✅ Upload completed successfully!

🎉 iOS deployment completed!
   Build: 1.0.0 (42)
   Status: Processing on App Store Connect
   ETA for review: 24-48 hours`;
        break;
      case 'android build':
        output = `🤖 Building for Android...

📦 Building Rust code for Android targets:
   Compiling for aarch64-linux-android
   Compiling for armv7-linux-androideabi
   Compiling for i686-linux-android
   Compiling for x86_64-linux-android

🔨 Building Android APK with Gradle:
   ./gradlew assembleRelease
   
✅ Android build completed successfully!
   APK: android/app/build/outputs/apk/release/app-release.apk
   Size: 38.7 MB
   Min SDK: 21 (Android 5.0)
   Target SDK: 34 (Android 14)`;
        break;
      case 'android sign':
        output = `🔐 Signing Android APK...

🔑 Using release keystore:
   Keystore: android/app/release.keystore
   Alias: release-key
   
🔨 Signing APK:
   jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 -keystore android/app/release.keystore android/app/build/outputs/apk/release/app-release-unsigned.apk release-key
   
📦 Aligning APK:
   zipalign -v 4 app-release-unsigned.apk app-release.apk
   
✅ APK signed and aligned successfully!
   Signed APK: android/app/build/outputs/apk/release/app-release.apk
   Size: 38.7 MB
   Signature: SHA-256`;
        break;
      case 'android upload':
        output = `☁️  Uploading to Google Play Console...

🔑 Authenticating with Google Play API:
   Service account: play-console-api@project.iam.gserviceaccount.com
   
📤 Uploading APK:
   fastlane supply --apk android/app/build/outputs/apk/release/app-release.apk
   
✅ Upload completed successfully!
   Version code: 42
   Version name: 1.0.0
   Track: internal
   
📋 Next steps:
   1. Test on internal track
   2. Promote to production
   3. Submit for Google Play review`;
        break;
      case 'android deploy':
        output = `🚀 Starting full Android deployment pipeline...

Step 1/4: Building Rust code for Android
✅ All Android targets built successfully

Step 2/4: Building APK with Gradle
✅ APK built: app-release-unsigned.apk (38.7 MB)

Step 3/4: Signing and aligning APK
✅ APK signed and aligned: app-release.apk

Step 4/4: Uploading to Google Play Console
✅ Upload completed successfully!

🎉 Android deployment completed!
   Version: 1.0.0 (42)
   Track: internal
   Status: Available for testing`;
        break;
      case 'flutter ios':
        output = `🎯 Building Flutter iOS app...

🌉 Generating Rust-Flutter bridge:
   flutter_rust_bridge_codegen --rust-input src/api.rs --dart-output lib/bridge_generated.dart
   
📦 Building Flutter iOS:
   flutter build ios --release
   
🔨 Building with Xcode:
   xcodebuild -workspace ios/Runner.xcworkspace -scheme Runner -configuration Release -destination generic/platform=iOS archive
   
✅ Flutter iOS build completed!
   Archive: build/ios/archive/Runner.xcarchive
   IPA: build/ios/ipa/Runner.ipa
   Size: 52.3 MB`;
        break;
      case 'flutter android':
        output = `🎯 Building Flutter Android app...

🌉 Generating Rust-Flutter bridge:
   flutter_rust_bridge_codegen --rust-input src/api.rs --dart-output lib/bridge_generated.dart
   
📦 Building Flutter Android:
   flutter build apk --release
   
✅ Flutter Android build completed!
   APK: build/app/outputs/flutter-apk/app-release.apk
   Size: 41.2 MB
   Architecture: arm64-v8a, armeabi-v7a, x86_64`;
        break;
      case 'flutter deploy':
        output = `🚀 Starting Flutter multi-platform deployment...

Step 1/6: Generating Rust-Flutter bridge
✅ Bridge code generated successfully

Step 2/6: Building Flutter iOS
✅ iOS build completed (52.3 MB)

Step 3/6: Building Flutter Android  
✅ Android build completed (41.2 MB)

Step 4/6: Deploying to iOS App Store
✅ iOS deployment completed

Step 5/6: Deploying to Google Play
✅ Android deployment completed

Step 6/6: Finalizing deployment
✅ All platforms deployed successfully!

🎉 Flutter deployment completed!
   iOS: Available on App Store Connect
   Android: Available on Google Play Console`;
        break;
      case 'rustyclint scan':
        output = `🔍 Security Analysis Starting...
📊 Analyzing 47,392 lines of code
🛡️  Checking OWASP Top 10 vulnerabilities
⚡ Performance: 10.2M lines/second

Results:
✅ 0 Critical vulnerabilities
⚠️  2 Medium-risk issues found
🔧 3 Performance optimizations suggested

Analysis completed in 0.08 seconds`;
        break;
      case 'rustyclint fix':
        output = `🔧 Auto-fixing vulnerabilities...

Fixed Issues:
✅ SQL injection vulnerability in auth.rs:42
✅ XSS prevention in template.rs:156
✅ Buffer overflow protection in parser.rs:89

Performance Improvements:
⚡ Optimized memory allocation (-23% usage)
⚡ Parallel processing enabled (+340% speed)

All fixes applied successfully!`;
        break;
      case 'rustyclint bench':
        output = `🚀 Performance Benchmark

Analysis Speed:
├─ Lines per second: 10,247,832
├─ Memory usage: 45.2 MB
├─ CPU utilization: 12%
└─ Response time: <50ms

Security Checks:
├─ Vulnerability detection: 99.97% accuracy
├─ False positive rate: 0.03%
├─ Coverage: OWASP Top 10 + Custom rules
└─ Compliance: SOC 2, GDPR, HIPAA ready

Platform Performance:
├─ Native (Windows/macOS/Linux): 100%
├─ WebAssembly (Browser): 95%
└─ Cloud (Auto-scaling): 99.99% uptime`;
        break;
      case 'rustyclint audit':
        output = `🛡️  Security Audit Report

Encryption Status:
✅ AES-256 encryption active
✅ TLS 1.3 for data in transit
✅ Zero-trust architecture verified

Compliance Check:
✅ SOC 2 Type II compliant
✅ GDPR data protection verified
✅ HIPAA security controls active
✅ PCI DSS requirements met

Vulnerability Scan:
✅ 0 Critical issues
✅ 0 High-risk vulnerabilities
⚠️  2 Medium-risk items (non-blocking)

Security Score: 98/100 (Excellent)`;
        break;
      case 'github sync':
        output = `🔄 Syncing with GitHub...

Connected Repositories:
✅ rustyclint/main (3 commits ahead)
✅ company/security-tools (webhook active)
✅ team/web-app (PR checks enabled)

Recent Activity:
📝 2 new commits scanned
🔍 1 pull request analyzed
⚠️  3 vulnerabilities found
✅ 2 vulnerabilities auto-fixed

Webhook Status: Active
API Rate Limit: 4,847/5,000 remaining

Sync completed successfully!`;
        break;
      case 'supabase status':
        output = `📊 Supabase Database Status

Connection: ✅ Connected
Latency: 23ms (excellent)
Region: us-east-1

Tables:
├─ scan_results: 8,420 rows (1.2 GB)
├─ vulnerabilities: 3,240 rows (456 MB)
├─ user_projects: 1,890 rows (89 MB)
├─ analytics: 12,340 rows (2.1 GB)
└─ compliance_reports: 567 rows (234 MB)

Real-time Subscriptions: 4 active
Row Level Security: ✅ Enabled
Backup Status: ✅ Daily backups active

Database health: Excellent`;
        break;
      case 'zapier test':
        output = `⚡ Testing Zapier Automations...

Active Workflows:
✅ Vulnerability Alert → Slack (23 runs, 100% success)
✅ Scan Complete → Jira (45 runs, 98% success)
⏸️  Compliance Check → Email (paused)
✅ New Repository → Teams (8 runs, 100% success)

Test Results:
🔔 Slack notification: ✅ Delivered
🎯 Jira ticket creation: ✅ Success
📧 Email alert: ✅ Sent
👥 Teams message: ✅ Posted

Webhook Endpoints:
├─ Primary: https://hooks.zapier.com/hooks/catch/... ✅
├─ Backup: https://hooks.zapier.com/hooks/catch/... ✅
└─ Test: https://hooks.zapier.com/hooks/catch/... ✅

All automations working correctly!`;
        break;
      case 'cargo test':
        output = `   Compiling rustyclint v0.1.0
    Finished test [unoptimized + debuginfo] target(s) in 1.45s
     Running unittests src/lib.rs

running 8 tests
test tests::test_security_scanner ... ok
test tests::test_vulnerability_detection ... ok
test tests::test_performance_analysis ... ok
test tests::test_encryption_validation ... ok
test tests::test_compliance_check ... ok
test tests::test_memory_safety ... ok
test tests::test_parallel_processing ... ok
test tests::test_zero_trust_auth ... ok

test result: ok. 8 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.08s`;
        break;
      case 'cargo clean':
        output = 'Cleaning target directory...';
        break;
      case 'clear':
        setHistory([TERMINAL_CONSTANTS.WELCOME]);
        setCurrentCommand('');
        return;
      case 'python main.py':
        output = `🐍 Python AI/ML Research Environment
==================================================
✅ PyTorch version: 2.1.0+cu118
✅ CUDA available: True
✅ GPU device: NVIDIA RTX 4090
📊 Loading datasets...
🧠 Initializing neural network...
🚀 Training started...
Epoch 1/100: Loss = 0.8234, Accuracy = 0.6543
Epoch 10/100: Loss = 0.3421, Accuracy = 0.8765
Epoch 50/100: Loss = 0.1234, Accuracy = 0.9456
Epoch 100/100: Loss = 0.0567, Accuracy = 0.9823
✅ Training complete! Model saved to models/neural_net.pth`;
        break;
      case 'python computer_vision.py':
        output = `🔍 Computer Vision Pipeline
========================================
📦 Loading YOLO model...
✅ YOLOv5s model loaded successfully
🎥 Initializing camera feed...
📸 Processing frame 1: 3 objects detected
   - Person (confidence: 0.89)
   - Car (confidence: 0.76)
   - Traffic light (confidence: 0.92)
🎯 Real-time detection active
📊 FPS: 30.2, Memory: 2.1GB`;
        break;
      case 'python nlp_transformer.py':
        output = `🤖 Advanced NLP with Transformers
==================================================
📥 Loading BERT model...
✅ bert-base-uncased loaded successfully
🔄 Processing text samples...
📊 Sentiment Analysis Results:
   - "I love this!" → Positive (0.94)
   - "This is terrible" → Negative (0.87)
🏷️ Named Entity Recognition:
   - "Apple Inc." → ORG (0.99)
   - "New York" → LOC (0.95)
✅ NLP pipeline ready!`;
        break;
      case 'python data_science.py':
        output = `📊 Data Science & Analytics Pipeline
==================================================
📈 Dataset loaded: 10,000 rows, 15 columns
🔍 Exploratory Data Analysis:
   - Missing values: 2.3%
   - Outliers detected: 156 samples
   - Correlation analysis complete
🤖 Training ML models:
   - Random Forest: 94.2% accuracy
   - Gradient Boosting: 95.7% accuracy
   - Logistic Regression: 89.3% accuracy
📊 Visualizations generated
✅ Analysis complete!`;
        break;
      case 'pip install -r requirements.txt':
        output = `Collecting torch>=2.0.0
  Downloading torch-2.1.0+cu118-cp311-cp311-linux_x86_64.whl (2.0 GB)
Collecting torchvision>=0.15.0
  Downloading torchvision-0.16.0+cu118-cp311-cp311-linux_x86_64.whl (6.9 MB)
Collecting tensorflow>=2.13.0
  Downloading tensorflow-2.13.0-cp311-cp311-linux_x86_64.whl (524.1 MB)
Collecting transformers>=4.30.0
  Downloading transformers-4.33.2-py3-none-any.whl (7.6 MB)
Collecting opencv-python>=4.8.0
  Downloading opencv_python-4.8.1.78-cp37-abi3-linux_x86_64.whl (61.0 MB)
Installing collected packages: torch, torchvision, tensorflow, transformers, opencv-python...
Successfully installed torch-2.1.0+cu118 torchvision-0.16.0+cu118 tensorflow-2.13.0 transformers-4.33.2 opencv-python-4.8.1.78`;
        break;
      case 'jupyter lab':
        output = `[I 2024-01-15 10:30:45.123 ServerApp] jupyterlab | extension was successfully linked.
[I 2024-01-15 10:30:45.456 ServerApp] Writing Jupyter server cookie secret to /home/user/.local/share/jupyter/runtime/jupyter_cookie_secret
[I 2024-01-15 10:30:45.789 ServerApp] Serving at http://localhost:8888/lab?token=abc123def456
[I 2024-01-15 10:30:45.890 ServerApp] Use Control-C to stop this server and shut down all kernels
[I 2024-01-15 10:30:46.123 ServerApp] 
    To access the server, open this file in a browser:
        file:///home/user/.local/share/jupyter/runtime/jpserver-12345-open.html
    Or copy and paste one of these URLs:
        http://localhost:8888/lab?token=abc123def456
        http://127.0.0.1:8888/lab?token=abc123def456`;
        break;
      case 'python -c "import torch; print(f\'CUDA available: {torch.cuda.is_available()}\')"':
        output = 'CUDA available: True';
        break;
      case 'ls':
        output = `Cargo.toml  Cargo.lock  README.md  src/  security/  tests/  benchmarks/  target/  rustyclint.toml  
ios/  android/  flutter/  
integrations/  github-config.yml  supabase-schema.sql  zapier-workflows.json  
build/  dist/  
main.py  requirements.txt  security_scanner.py  performance_analyzer.py  compliance_checker.py  setup.py

iOS Deployment Files:
ios/App.xcodeproj  ios/ExportOptions.plist  ios/Info.plist

Android Deployment Files:
android/app/build.gradle  android/app/release.keystore  android/gradle.properties

Flutter Deployment Files:
flutter/pubspec.yaml  flutter/lib/main.dart  flutter/lib/bridge_generated.dart`;
        break;
      default:
        if (cmd) {
          output = `Command not found: ${cmd}. Type "help" for available commands.`;
        }
    }

    try {
      // Use utility function for safe command formatting
      const newEntries = formatCommandOutput(command, output);
      
      // Limit history to prevent memory issues (keep last 500 lines)
      const updatedHistory = [...history, ...newEntries].slice(-500);
      setHistory(updatedHistory);
    } catch (error) {
      console.error('Error updating terminal history:', error);
      // Fallback to simpler approach if formatting fails
      setHistory(prev => {
        const updatedHistory = [...prev, `$ ${command}`, output || ''].slice(-500);
        return updatedHistory;
      });
    }
    
    setCurrentCommand('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeCommand(currentCommand);
    }
  };

  if (!isVisible) return null;

  return (
    <div 
      className="bg-gray-900 border-t border-gray-700 flex flex-col h-64 overflow-hidden"
      role="region"
      aria-label="Terminal Window"
    >
      <div className="flex items-center justify-between bg-gray-800 px-4 py-2 border-b border-gray-700">
        <div className="flex items-center">
          <TerminalIcon className="w-4 h-4 mr-2 text-gray-400" aria-hidden="true" />
          <span className="text-sm font-medium text-gray-200" id="terminal-title">Terminal</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={onToggle}
            className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-gray-200"
            aria-label="Minimize Terminal"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div
        ref={terminalRef}
        className="flex-1 p-4 overflow-y-auto font-mono text-sm text-gray-100 whitespace-pre-wrap break-words" 
        aria-labelledby="terminal-title" 
        role="log"
      >
        {history.map((line, index) => (
          <div key={index} className={`${isTerminalPrompt(line) ? 'text-green-400' : 'text-gray-300'} mb-1`}>
            {line}
          </div>
        ))}
        <div className="flex items-center text-green-400">
          <span aria-hidden="true">{TERMINAL_CONSTANTS.PROMPT}</span>
          <input
            type="text"
            value={currentCommand}
            onChange={(e) => setCurrentCommand(e.target.value)}
            onKeyDown={handleKeyDown}
            autoComplete="off"
            className="flex-1 bg-transparent outline-none text-gray-100 ml-1 w-full"
            placeholder="Enter command... (type 'help' for available commands)"
            aria-label="Terminal command input"
            autoFocus
          />
        </div>
      </div>
    </div>
  );
};

export default Terminal;