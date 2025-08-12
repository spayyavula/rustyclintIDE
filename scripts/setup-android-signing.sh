#!/bin/bash

# Android Signing Setup Script
# Configures Android project for automated signing

set -e

echo "🤖 Android Signing Setup"
echo "========================"

# Check if we're in the right directory
if [ ! -d "android" ]; then
    echo "❌ Error: android directory not found. Run this from your project root."
    exit 1
fi

# Check if keystore exists
KEYSTORE_PATH="android/keystore/release.keystore"
if [ ! -f "$KEYSTORE_PATH" ]; then
    echo "❌ Error: Keystore not found at $KEYSTORE_PATH"
    echo "Run ./scripts/generate-android-keystore.sh first"
    exit 1
fi

echo "✅ Found keystore at $KEYSTORE_PATH"

# Backup original build.gradle
BUILD_GRADLE="android/app/build.gradle"
if [ -f "$BUILD_GRADLE" ]; then
    cp "$BUILD_GRADLE" "$BUILD_GRADLE.backup"
    echo "📋 Backed up build.gradle to build.gradle.backup"
fi

# Update .gitignore
GITIGNORE=".gitignore"
echo ""
echo "🔒 Updating .gitignore..."

if ! grep -q "# Android signing" "$GITIGNORE" 2>/dev/null; then
    cat >> "$GITIGNORE" << EOF

# Android signing
android/keystore.properties
android/keystore/
*.keystore
*.jks
EOF
    echo "✅ Added Android signing entries to .gitignore"
else
    echo "✅ .gitignore already contains Android signing entries"
fi

# Create environment variables template
ENV_TEMPLATE=".env.android.template"
echo ""
echo "📝 Creating environment variables template..."

cat > "$ENV_TEMPLATE" << EOF
# Android Signing Environment Variables
# Copy to .env.android and fill in your values
# DO NOT commit .env.android to version control

KEYSTORE_PASSWORD=your_keystore_password_here
KEY_PASSWORD=your_key_password_here
KEY_ALIAS=release-key
KEYSTORE_PATH=android/keystore/release.keystore

# For CI/CD - Base64 encoded keystore
KEYSTORE_BASE64=your_base64_encoded_keystore_here

# Google Play Console Service Account (JSON)
GOOGLE_PLAY_SERVICE_ACCOUNT=your_service_account_json_here
EOF

echo "✅ Created $ENV_TEMPLATE"

# Create GitHub Actions workflow
WORKFLOWS_DIR=".github/workflows"
mkdir -p "$WORKFLOWS_DIR"

WORKFLOW_FILE="$WORKFLOWS_DIR/android-release.yml"
echo ""
echo "🚀 Creating GitHub Actions workflow..."

cat > "$WORKFLOW_FILE" << EOF
name: Android Release

on:
  push:
    tags:
      - 'v*'
  workflow_dispatch:

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        
      - name: Setup JDK 17
        uses: actions/setup-java@v4
        with:
          java-version: '17'
          distribution: 'temurin'
          
      - name: Setup Rust
        uses: actions-rs/toolchain@v1
        with:
          toolchain: stable
          target: aarch64-linux-android
          
      - name: Add Android targets
        run: |
          rustup target add aarch64-linux-android
          rustup target add armv7-linux-androideabi
          rustup target add i686-linux-android
          rustup target add x86_64-linux-android
          
      - name: Setup Android NDK
        uses: nttld/setup-ndk@v1
        with:
          ndk-version: r25c
          
      - name: Create keystore directory
        run: mkdir -p android/keystore
        
      - name: Decode keystore
        run: |
          echo "\${{ secrets.KEYSTORE_BASE64 }}" | base64 -d > android/keystore/release.keystore
          
      - name: Build Rust for Android
        run: |
          export ANDROID_NDK_ROOT=\$ANDROID_NDK_LATEST_HOME
          cargo build --target aarch64-linux-android --release
          cargo build --target armv7-linux-androideabi --release
          cargo build --target i686-linux-android --release
          cargo build --target x86_64-linux-android --release
          
      - name: Copy native libraries
        run: |
          mkdir -p android/app/src/main/jniLibs/{arm64-v8a,armeabi-v7a,x86,x86_64}
          cp target/aarch64-linux-android/release/librustyclint.so android/app/src/main/jniLibs/arm64-v8a/
          cp target/armv7-linux-androideabi/release/librustyclint.so android/app/src/main/jniLibs/armeabi-v7a/
          cp target/i686-linux-android/release/librustyclint.so android/app/src/main/jniLibs/x86/
          cp target/x86_64-linux-android/release/librustyclint.so android/app/src/main/jniLibs/x86_64/
          
      - name: Build signed AAB
        run: |
          cd android
          ./gradlew bundleRelease
        env:
          KEYSTORE_PASSWORD: \${{ secrets.KEYSTORE_PASSWORD }}
          KEY_PASSWORD: \${{ secrets.KEY_PASSWORD }}
          KEY_ALIAS: \${{ secrets.KEY_ALIAS }}
          
      - name: Upload to Google Play
        uses: r0adkll/upload-google-play@v1
        with:
          serviceAccountJsonPlainText: \${{ secrets.GOOGLE_PLAY_SERVICE_ACCOUNT }}
          packageName: com.rustyclint.app
          releaseFiles: android/app/build/outputs/bundle/release/app-release.aab
          track: internal
          status: completed
          
      - name: Upload AAB artifact
        uses: actions/upload-artifact@v4
        with:
          name: app-release-aab
          path: android/app/build/outputs/bundle/release/app-release.aab
EOF

echo "✅ Created GitHub Actions workflow at $WORKFLOW_FILE"

# Create Fastlane configuration
FASTLANE_DIR="android/fastlane"
mkdir -p "$FASTLANE_DIR"

FASTFILE="$FASTLANE_DIR/Fastfile"
echo ""
echo "🏃 Creating Fastlane configuration..."

cat > "$FASTFILE" << EOF
default_platform(:android)

platform :android do
  desc "Deploy to Google Play Store"
  lane :deploy do
    gradle(
      task: "bundle",
      build_type: "Release",
      project_dir: "android/"
    )
    
    upload_to_play_store(
      track: 'internal',
      aab: 'android/app/build/outputs/bundle/release/app-release.aab',
      json_key_data: ENV['GOOGLE_PLAY_SERVICE_ACCOUNT']
    )
  end
  
  desc "Build signed AAB"
  lane :build do
    gradle(
      task: "bundle",
      build_type: "Release",
      project_dir: "android/"
    )
  end
end
EOF

echo "✅ Created Fastlane configuration at $FASTFILE"

# Create deployment script
DEPLOY_SCRIPT="scripts/deploy-android.sh"
mkdir -p "scripts"

echo ""
echo "📦 Creating deployment script..."

cat > "$DEPLOY_SCRIPT" << EOF
#!/bin/bash

# Android Deployment Script
set -e

echo "🤖 Starting Android AAB deployment..."

# Check if keystore exists
if [ ! -f "android/keystore/release.keystore" ]; then
    echo "❌ Error: Keystore not found. Run generate-android-keystore.sh first"
    exit 1
fi

# Load environment variables if .env.android exists
if [ -f ".env.android" ]; then
    export \$(cat .env.android | xargs)
    echo "✅ Loaded environment variables from .env.android"
fi

# Build Rust code for Android
echo "📦 Building Rust code for Android targets..."
rustup target add aarch64-linux-android armv7-linux-androideabi i686-linux-android x86_64-linux-android

cargo build --target aarch64-linux-android --release
cargo build --target armv7-linux-androideabi --release  
cargo build --target i686-linux-android --release
cargo build --target x86_64-linux-android --release

# Copy native libraries
echo "📋 Copying native libraries..."
mkdir -p android/app/src/main/jniLibs/{arm64-v8a,armeabi-v7a,x86,x86_64}

cp target/aarch64-linux-android/release/librustyclint.so android/app/src/main/jniLibs/arm64-v8a/
cp target/armv7-linux-androideabi/release/librustyclint.so android/app/src/main/jniLibs/armeabi-v7a/
cp target/i686-linux-android/release/librustyclint.so android/app/src/main/jniLibs/x86/
cp target/x86_64-linux-android/release/librustyclint.so android/app/src/main/jniLibs/x86_64/

# Build signed AAB
echo "🔨 Building signed AAB..."
cd android
./gradlew bundleRelease

# Check if AAB was created
AAB_PATH="app/build/outputs/bundle/release/app-release.aab"
if [ -f "\$AAB_PATH" ]; then
    echo "✅ AAB created successfully: \$AAB_PATH"
    echo "📊 AAB size: \$(du -h "\$AAB_PATH" | cut -f1)"
else
    echo "❌ Error: AAB not found at \$AAB_PATH"
    exit 1
fi

# Optional: Upload to Play Store using Fastlane
if command -v fastlane &> /dev/null; then
    echo "🚀 Uploading to Google Play Store..."
    fastlane deploy
else
    echo "⚠️  Fastlane not found. Install with: gem install fastlane"
    echo "📱 Manual upload required to Google Play Console"
fi

echo "🎉 Android deployment completed!"
EOF

chmod +x "$DEPLOY_SCRIPT"
echo "✅ Created deployment script at $DEPLOY_SCRIPT"

echo ""
echo "🎯 Setup Complete!"
echo "=================="
echo ""
echo "📋 What was created:"
echo "- Updated .gitignore with Android signing entries"
echo "- $ENV_TEMPLATE (environment variables template)"
echo "- $WORKFLOW_FILE (GitHub Actions workflow)"
echo "- $FASTFILE (Fastlane configuration)"
echo "- $DEPLOY_SCRIPT (deployment script)"
echo ""
echo "🔑 Next steps:"
echo "1. Copy $ENV_TEMPLATE to .env.android and fill in your values"
echo "2. Set up GitHub secrets for CI/CD:"
echo "   - KEYSTORE_BASE64 (base64 encoded keystore)"
echo "   - KEYSTORE_PASSWORD"
echo "   - KEY_PASSWORD" 
echo "   - KEY_ALIAS"
echo "   - GOOGLE_PLAY_SERVICE_ACCOUNT (service account JSON)"
echo "3. Test local build: $DEPLOY_SCRIPT"
echo "4. Create a release tag to trigger automated deployment"
echo ""
echo "🔐 Security reminders:"
echo "- Never commit .env.android or keystore files"
echo "- Use Google Play App Signing for new apps"
echo "- Keep secure backups of your keystore"