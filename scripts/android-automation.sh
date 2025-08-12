#!/bin/bash

# Android Deployment Automation Script
# Provides intelligent automation for Android deployment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Progress tracking
TOTAL_STEPS=0
CURRENT_STEP=0

update_progress() {
    CURRENT_STEP=$((CURRENT_STEP + 1))
    local percentage=$((CURRENT_STEP * 100 / TOTAL_STEPS))
    echo "PROGRESS:$percentage"
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    # Check if we're in the right directory
    if [ ! -d "android" ]; then
        log_error "Android directory not found. Run this from your project root."
        exit 1
    fi
    
    # Check for Rust
    if ! command -v cargo &> /dev/null; then
        log_error "Rust/Cargo not found. Please install Rust."
        exit 1
    fi
    
    # Check for Java
    if ! command -v java &> /dev/null; then
        log_error "Java not found. Please install Java JDK."
        exit 1
    fi
    
    # Check for Android SDK
    if [ -z "$ANDROID_HOME" ] && [ -z "$ANDROID_SDK_ROOT" ]; then
        log_warning "ANDROID_HOME or ANDROID_SDK_ROOT not set. Attempting to detect..."
        
        # Common Android SDK locations
        POSSIBLE_PATHS=(
            "$HOME/Android/Sdk"
            "$HOME/Library/Android/sdk"
            "/usr/local/android-sdk"
            "/opt/android-sdk"
        )
        
        for path in "${POSSIBLE_PATHS[@]}"; do
            if [ -d "$path" ]; then
                export ANDROID_HOME="$path"
                export ANDROID_SDK_ROOT="$path"
                log_success "Found Android SDK at: $path"
                break
            fi
        done
        
        if [ -z "$ANDROID_HOME" ]; then
            log_error "Android SDK not found. Please install Android SDK."
            exit 1
        fi
    fi
    
    log_success "Prerequisites check passed"
}

# Setup Android NDK
setup_ndk() {
    log_info "Setting up Android NDK..."
    
    # Check if NDK is already available
    if [ -n "$ANDROID_NDK_ROOT" ] && [ -d "$ANDROID_NDK_ROOT" ]; then
        log_success "NDK already configured at: $ANDROID_NDK_ROOT"
        return
    fi
    
    # Try to find NDK in SDK directory
    if [ -d "$ANDROID_HOME/ndk" ]; then
        # Find the latest NDK version
        NDK_VERSION=$(ls "$ANDROID_HOME/ndk" | sort -V | tail -n 1)
        if [ -n "$NDK_VERSION" ]; then
            export ANDROID_NDK_ROOT="$ANDROID_HOME/ndk/$NDK_VERSION"
            log_success "Found NDK version: $NDK_VERSION"
        fi
    fi
    
    if [ -z "$ANDROID_NDK_ROOT" ]; then
        log_warning "NDK not found. Attempting to install..."
        
        # Install NDK using sdkmanager
        if command -v sdkmanager &> /dev/null; then
            sdkmanager "ndk;25.2.9519653"
            export ANDROID_NDK_ROOT="$ANDROID_HOME/ndk/25.2.9519653"
        else
            log_error "NDK not found and sdkmanager not available. Please install NDK manually."
            exit 1
        fi
    fi
    
    update_progress
}

# Add Rust targets for Android
add_rust_targets() {
    log_info "Adding Rust targets for Android..."
    
    local targets=(
        "aarch64-linux-android"
        "armv7-linux-androideabi"
        "i686-linux-android"
        "x86_64-linux-android"
    )
    
    for target in "${targets[@]}"; do
        log_info "Adding target: $target"
        rustup target add "$target"
    done
    
    log_success "All Android targets added"
    update_progress
}

# Build Rust code for Android
build_rust_android() {
    log_info "Building Rust code for Android architectures..."
    
    # Set up environment for cross-compilation
    export CC_aarch64_linux_android="$ANDROID_NDK_ROOT/toolchains/llvm/prebuilt/linux-x86_64/bin/aarch64-linux-android21-clang"
    export CC_armv7_linux_androideabi="$ANDROID_NDK_ROOT/toolchains/llvm/prebuilt/linux-x86_64/bin/armv7a-linux-androideabi21-clang"
    export CC_i686_linux_android="$ANDROID_NDK_ROOT/toolchains/llvm/prebuilt/linux-x86_64/bin/i686-linux-android21-clang"
    export CC_x86_64_linux_android="$ANDROID_NDK_ROOT/toolchains/llvm/prebuilt/linux-x86_64/bin/x86_64-linux-android21-clang"
    
    # Detect OS for NDK path
    if [[ "$OSTYPE" == "darwin"* ]]; then
        NDK_HOST="darwin-x86_64"
    else
        NDK_HOST="linux-x86_64"
    fi
    
    # Update CC paths for detected OS
    export CC_aarch64_linux_android="$ANDROID_NDK_ROOT/toolchains/llvm/prebuilt/$NDK_HOST/bin/aarch64-linux-android21-clang"
    export CC_armv7_linux_androideabi="$ANDROID_NDK_ROOT/toolchains/llvm/prebuilt/$NDK_HOST/bin/armv7a-linux-androideabi21-clang"
    export CC_i686_linux_android="$ANDROID_NDK_ROOT/toolchains/llvm/prebuilt/$NDK_HOST/bin/i686-linux-android21-clang"
    export CC_x86_64_linux_android="$ANDROID_NDK_ROOT/toolchains/llvm/prebuilt/$NDK_HOST/bin/x86_64-linux-android21-clang"
    
    local targets=(
        "aarch64-linux-android"
        "armv7-linux-androideabi"
        "i686-linux-android"
        "x86_64-linux-android"
    )
    
    for target in "${targets[@]}"; do
        log_info "Building for target: $target"
        cargo build --target "$target" --release
        
        if [ $? -eq 0 ]; then
            log_success "Build successful for $target"
        else
            log_error "Build failed for $target"
            exit 1
        fi
    done
    
    update_progress
}

# Copy native libraries to Android project
copy_native_libraries() {
    log_info "Copying native libraries to Android project..."
    
    # Create jniLibs directories
    mkdir -p android/app/src/main/jniLibs/{arm64-v8a,armeabi-v7a,x86,x86_64}
    
    # Copy libraries
    cp target/aarch64-linux-android/release/librustyclint.so android/app/src/main/jniLibs/arm64-v8a/ 2>/dev/null || log_warning "ARM64 library not found"
    cp target/armv7-linux-androideabi/release/librustyclint.so android/app/src/main/jniLibs/armeabi-v7a/ 2>/dev/null || log_warning "ARMv7 library not found"
    cp target/i686-linux-android/release/librustyclint.so android/app/src/main/jniLibs/x86/ 2>/dev/null || log_warning "x86 library not found"
    cp target/x86_64-linux-android/release/librustyclint.so android/app/src/main/jniLibs/x86_64/ 2>/dev/null || log_warning "x86_64 library not found"
    
    log_success "Native libraries copied"
    update_progress
}

# Verify keystore
verify_keystore() {
    log_info "Verifying Android keystore..."
    
    local keystore_path="android/keystore/release.keystore"
    local properties_path="android/keystore.properties"
    
    if [ ! -f "$keystore_path" ]; then
        log_error "Keystore not found at: $keystore_path"
        log_info "Run ./scripts/generate-android-keystore.sh to create one"
        exit 1
    fi
    
    if [ ! -f "$properties_path" ]; then
        log_error "Keystore properties not found at: $properties_path"
        exit 1
    fi
    
    # Load keystore properties
    source "$properties_path"
    
    # Verify keystore can be accessed
    if keytool -list -keystore "$keystore_path" -storepass "$storePassword" -alias "$keyAlias" &>/dev/null; then
        log_success "Keystore verification passed"
    else
        log_error "Keystore verification failed. Check passwords and alias."
        exit 1
    fi
    
    update_progress
}

# Build Android AAB
build_android_aab() {
    log_info "Building Android App Bundle (AAB)..."
    
    cd android
    
    # Clean previous builds
    ./gradlew clean
    
    # Build signed AAB
    ./gradlew bundleRelease
    
    if [ $? -eq 0 ]; then
        log_success "AAB build successful"
        
        # Check output file
        local aab_path="app/build/outputs/bundle/release/app-release.aab"
        if [ -f "$aab_path" ]; then
            local size=$(du -h "$aab_path" | cut -f1)
            log_success "AAB created: $aab_path (Size: $size)"
        else
            log_error "AAB file not found at expected location"
            exit 1
        fi
    else
        log_error "AAB build failed"
        exit 1
    fi
    
    cd ..
    update_progress
}

# Verify AAB signature
verify_aab_signature() {
    log_info "Verifying AAB signature..."
    
    local aab_path="android/app/build/outputs/bundle/release/app-release.aab"
    
    if command -v bundletool &> /dev/null; then
        bundletool validate --bundle="$aab_path"
        if [ $? -eq 0 ]; then
            log_success "AAB signature verification passed"
        else
            log_error "AAB signature verification failed"
            exit 1
        fi
    else
        log_warning "bundletool not found. Skipping AAB validation."
    fi
    
    update_progress
}

# Upload to Google Play (optional)
upload_to_play_store() {
    log_info "Checking for Google Play upload configuration..."
    
    if [ -f "android/fastlane/Fastfile" ] && [ -n "$GOOGLE_PLAY_SERVICE_ACCOUNT" ]; then
        log_info "Uploading to Google Play Store..."
        
        cd android
        fastlane deploy
        
        if [ $? -eq 0 ]; then
            log_success "Upload to Google Play Store successful"
        else
            log_error "Upload to Google Play Store failed"
            exit 1
        fi
        
        cd ..
    else
        log_warning "Google Play upload not configured. Skipping upload."
        log_info "To enable upload:"
        log_info "1. Set up Fastlane configuration"
        log_info "2. Set GOOGLE_PLAY_SERVICE_ACCOUNT environment variable"
    fi
    
    update_progress
}

# Generate deployment report
generate_report() {
    log_info "Generating deployment report..."
    
    local report_file="deployment-report-$(date +%Y%m%d-%H%M%S).txt"
    
    cat > "$report_file" << EOF
Android Deployment Report
========================
Date: $(date)
Platform: Android
Build Type: Release

Files Generated:
- AAB: android/app/build/outputs/bundle/release/app-release.aab

Native Libraries:
- ARM64: $([ -f "android/app/src/main/jniLibs/arm64-v8a/librustyclint.so" ] && echo "✓" || echo "✗")
- ARMv7: $([ -f "android/app/src/main/jniLibs/armeabi-v7a/librustyclint.so" ] && echo "✓" || echo "✗")
- x86: $([ -f "android/app/src/main/jniLibs/x86/librustyclint.so" ] && echo "✓" || echo "✗")
- x86_64: $([ -f "android/app/src/main/jniLibs/x86_64/librustyclint.so" ] && echo "✓" || echo "✗")

Build Status: SUCCESS
Total Steps: $TOTAL_STEPS
Completed Steps: $CURRENT_STEP

Next Steps:
1. Test the AAB on internal track
2. Upload to Google Play Console
3. Submit for review

EOF

    log_success "Report generated: $report_file"
}

# Main automation function
run_automation() {
    local automation_type="$1"
    
    case "$automation_type" in
        "full")
            TOTAL_STEPS=8
            log_info "Starting full Android deployment automation..."
            check_prerequisites
            setup_ndk
            add_rust_targets
            build_rust_android
            copy_native_libraries
            verify_keystore
            build_android_aab
            verify_aab_signature
            upload_to_play_store
            ;;
        "build")
            TOTAL_STEPS=6
            log_info "Starting Android build automation..."
            check_prerequisites
            setup_ndk
            add_rust_targets
            build_rust_android
            copy_native_libraries
            verify_keystore
            build_android_aab
            ;;
        "rust")
            TOTAL_STEPS=3
            log_info "Starting Rust build automation..."
            check_prerequisites
            setup_ndk
            add_rust_targets
            build_rust_android
            ;;
        *)
            log_error "Unknown automation type: $automation_type"
            log_info "Available types: full, build, rust"
            exit 1
            ;;
    esac
    
    generate_report
    log_success "Android automation completed successfully!"
}

# Script entry point
if [ $# -eq 0 ]; then
    echo "Usage: $0 <automation_type>"
    echo "Types: full, build, rust"
    exit 1
fi

run_automation "$1"