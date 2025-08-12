#!/bin/bash

# Android App Deployment Script
# Comprehensive script for building and deploying Android apps to Google Play Store

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
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

log_step() {
    echo -e "${CYAN}[STEP]${NC} $1"
}

# Default configuration
BUILD_TYPE="release"
OUTPUT_TYPE="aab"
TRACK="internal"
ENABLE_MINIFY=true
ENABLE_R8=true
ENABLE_PROGUARD=true
SKIP_UPLOAD=false
VERBOSE=false

# Parse command line arguments
parse_args() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            --build-type)
                BUILD_TYPE="$2"
                shift 2
                ;;
            --output-type)
                OUTPUT_TYPE="$2"
                shift 2
                ;;
            --track)
                TRACK="$2"
                shift 2
                ;;
            --no-minify)
                ENABLE_MINIFY=false
                shift
                ;;
            --no-r8)
                ENABLE_R8=false
                shift
                ;;
            --no-proguard)
                ENABLE_PROGUARD=false
                shift
                ;;
            --skip-upload)
                SKIP_UPLOAD=true
                shift
                ;;
            --verbose)
                VERBOSE=true
                shift
                ;;
            --help)
                show_help
                exit 0
                ;;
            *)
                log_error "Unknown option: $1"
                show_help
                exit 1
                ;;
        esac
    done
}

# Show help
show_help() {
    echo "Android App Deployment Script"
    echo "Usage: $0 [options]"
    echo ""
    echo "Options:"
    echo "  --build-type <type>   Build type (debug or release, default: release)"
    echo "  --output-type <type>  Output type (apk or aab, default: aab)"
    echo "  --track <track>       Release track (internal, alpha, beta, production, default: internal)"
    echo "  --no-minify           Disable code minification"
    echo "  --no-r8               Disable R8 optimizer"
    echo "  --no-proguard         Disable ProGuard"
    echo "  --skip-upload         Skip uploading to Google Play"
    echo "  --verbose             Enable verbose output"
    echo "  --help                Show this help message"
    echo ""
    echo "Example:"
    echo "  $0 --build-type release --output-type aab --track internal"
}

# Check prerequisites
check_prerequisites() {
    log_step "Checking prerequisites..."
    
    # Check if we're in the right directory
    if [ ! -d "android" ]; then
        log_error "Android directory not found. Run this from your project root."
        exit 1
    fi
    
    # Check for Java
    if ! command -v java &> /dev/null; then
        log_error "Java not found. Please install Java JDK."
        exit 1
    fi
    
    # Check for Gradle
    if [ ! -f "android/gradlew" ]; then
        log_error "Gradle wrapper not found at android/gradlew"
        exit 1
    fi
    
    # Check for Rust
    if ! command -v cargo &> /dev/null; then
        log_error "Rust/Cargo not found. Please install Rust."
        exit 1
    fi
    
    # Check for Android NDK
    if [ -z "$ANDROID_NDK_ROOT" ] && [ -z "$ANDROID_NDK_HOME" ]; then
        log_warning "ANDROID_NDK_ROOT or ANDROID_NDK_HOME not set."
        log_info "Attempting to find NDK in standard locations..."
        
        # Try to find NDK in standard locations
        if [ -d "$ANDROID_HOME/ndk" ]; then
            # Find the latest NDK version
            NDK_VERSION=$(ls "$ANDROID_HOME/ndk" | sort -V | tail -n 1)
            if [ -n "$NDK_VERSION" ]; then
                export ANDROID_NDK_ROOT="$ANDROID_HOME/ndk/$NDK_VERSION"
                export ANDROID_NDK_HOME="$ANDROID_HOME/ndk/$NDK_VERSION"
                log_success "Found NDK at $ANDROID_NDK_ROOT"
            else
                log_error "NDK not found in $ANDROID_HOME/ndk"
                exit 1
            fi
        else
            log_error "NDK not found. Please install Android NDK."
            exit 1
        fi
    fi
    
    # Check for keystore
    if [ ! -f "android/keystore/release.keystore" ] && [ "$BUILD_TYPE" = "release" ]; then
        log_error "Keystore not found at android/keystore/release.keystore"
        log_info "Run ./scripts/generate-android-keystore.sh to create one"
        exit 1
    fi
    
    # Check for keystore.properties
    if [ ! -f "android/keystore.properties" ] && [ "$BUILD_TYPE" = "release" ]; then
        log_error "Keystore properties not found at android/keystore.properties"
        log_info "Run ./scripts/generate-android-keystore.sh to create one"
        exit 1
    fi
    
    log_success "Prerequisites check passed"
}

# Add Android targets to Rust
add_android_targets() {
    log_step "Adding Android targets to Rust..."
    
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
}

# Build Rust code for Android
build_rust_android() {
    log_step "Building Rust code for Android architectures..."
    
    local targets=(
        "aarch64-linux-android"
        "armv7-linux-androideabi"
        "i686-linux-android"
        "x86_64-linux-android"
    )
    
    for target in "${targets[@]}"; do
        log_info "Building for target: $target"
        cargo build --target "$target" --"$BUILD_TYPE"
        
        if [ $? -eq 0 ]; then
            log_success "Build successful for $target"
        else
            log_error "Build failed for $target"
            exit 1
        fi
    done
    
    log_success "Rust code built successfully for all architectures"
}

# Copy native libraries to Android project
copy_native_libraries() {
    log_step "Copying native libraries to Android project..."
    
    # Create jniLibs directories
    mkdir -p android/app/src/main/jniLibs/{arm64-v8a,armeabi-v7a,x86,x86_64}
    
    # Copy libraries
    cp target/aarch64-linux-android/$BUILD_TYPE/librustyclint.so android/app/src/main/jniLibs/arm64-v8a/ 2>/dev/null || log_warning "ARM64 library not found"
    cp target/armv7-linux-androideabi/$BUILD_TYPE/librustyclint.so android/app/src/main/jniLibs/armeabi-v7a/ 2>/dev/null || log_warning "ARMv7 library not found"
    cp target/i686-linux-android/$BUILD_TYPE/librustyclint.so android/app/src/main/jniLibs/x86/ 2>/dev/null || log_warning "x86 library not found"
    cp target/x86_64-linux-android/$BUILD_TYPE/librustyclint.so android/app/src/main/jniLibs/x86_64/ 2>/dev/null || log_warning "x86_64 library not found"
    
    log_success "Native libraries copied"
}

# Build Android app
build_android_app() {
    log_step "Building Android app..."
    
    cd android
    
    # Clean project
    log_info "Cleaning project..."
    ./gradlew clean
    
    # Build app
    log_info "Building $OUTPUT_TYPE in $BUILD_TYPE mode..."
    
    if [ "$OUTPUT_TYPE" = "aab" ]; then
        ./gradlew bundle"${BUILD_TYPE^}"
        
        # Check if AAB was created
        local aab_path="app/build/outputs/bundle/$BUILD_TYPE/app-$BUILD_TYPE.aab"
        if [ -f "$aab_path" ]; then
            local size=$(du -h "$aab_path" | cut -f1)
            log_success "AAB created: $aab_path (Size: $size)"
        else
            log_error "AAB file not found at expected location"
            exit 1
        fi
    else
        ./gradlew assemble"${BUILD_TYPE^}"
        
        # Check if APK was created
        local apk_path="app/build/outputs/apk/$BUILD_TYPE/app-$BUILD_TYPE.apk"
        if [ -f "$apk_path" ]; then
            local size=$(du -h "$apk_path" | cut -f1)
            log_success "APK created: $apk_path (Size: $size)"
        else
            log_error "APK file not found at expected location"
            exit 1
        fi
    fi
    
    cd ..
}

# Upload to Google Play Store
upload_to_play_store() {
    if [ "$SKIP_UPLOAD" = true ]; then
        log_info "Skipping upload to Google Play Store"
        return
    fi
    
    log_step "Uploading to Google Play Store..."
    
    # Check if Fastlane is installed
    if ! command -v fastlane &> /dev/null; then
        log_warning "Fastlane not found. Skipping upload."
        log_info "To install Fastlane: gem install fastlane"
        return
    fi
    
    # Check if Google Play service account is configured
    if [ -z "$GOOGLE_PLAY_SERVICE_ACCOUNT" ] && [ ! -f "android/fastlane/google-play-service-account.json" ]; then
        log_warning "Google Play service account not configured. Skipping upload."
        log_info "Set GOOGLE_PLAY_SERVICE_ACCOUNT environment variable or create android/fastlane/google-play-service-account.json"
        return
    fi
    
    cd android
    
    # Create Fastlane configuration if it doesn't exist
    if [ ! -d "fastlane" ]; then
        mkdir -p fastlane
        
        cat > fastlane/Fastfile << EOF
default_platform(:android)

platform :android do
  desc "Deploy to Google Play Store"
  lane :deploy do
    upload_to_play_store(
      track: '$TRACK',
      $([ "$OUTPUT_TYPE" = "aab" ] && echo "aab: 'app/build/outputs/bundle/$BUILD_TYPE/app-$BUILD_TYPE.aab'" || echo "apk: 'app/build/outputs/apk/$BUILD_TYPE/app-$BUILD_TYPE.apk'"),
      $([ -n "$GOOGLE_PLAY_SERVICE_ACCOUNT" ] && echo "json_key_data: ENV['GOOGLE_PLAY_SERVICE_ACCOUNT']" || echo "json_key_file: 'fastlane/google-play-service-account.json'")
    )
  end
end
EOF
        
        cat > fastlane/Appfile << EOF
json_key_file(ENV["GOOGLE_PLAY_JSON_KEY_FILE"] || "fastlane/google-play-service-account.json")
package_name("com.rustyclint.helloworld")
EOF
    fi
    
    # Run Fastlane
    log_info "Uploading to $TRACK track..."
    fastlane deploy
    
    if [ $? -eq 0 ]; then
        log_success "Upload to Google Play Store successful"
    else
        log_error "Upload to Google Play Store failed"
        exit 1
    fi
    
    cd ..
}

# Generate deployment report
generate_report() {
    log_step "Generating deployment report..."
    
    local report_file="android-deployment-report-$(date +%Y%m%d-%H%M%S).txt"
    local output_file=""
    
    if [ "$OUTPUT_TYPE" = "aab" ]; then
        output_file="android/app/build/outputs/bundle/$BUILD_TYPE/app-$BUILD_TYPE.aab"
    else
        output_file="android/app/build/outputs/apk/$BUILD_TYPE/app-$BUILD_TYPE.apk"
    fi
    
    cat > "$report_file" << EOF
Android Deployment Report
========================
Date: $(date)
Build Type: ${BUILD_TYPE^}
Output Type: ${OUTPUT_TYPE^}
Track: ${TRACK^}

Build Configuration:
- Minification: $([ "$ENABLE_MINIFY" = true ] && echo "Enabled" || echo "Disabled")
- R8 Optimizer: $([ "$ENABLE_R8" = true ] && echo "Enabled" || echo "Disabled")
- ProGuard: $([ "$ENABLE_PROGUARD" = true ] && echo "Enabled" || echo "Disabled")

Output File:
- Path: $output_file
- Size: $([ -f "$output_file" ] && du -h "$output_file" | cut -f1 || echo "File not found")

Native Libraries:
- ARM64: $([ -f "android/app/src/main/jniLibs/arm64-v8a/librustyclint.so" ] && echo "✓" || echo "✗")
- ARMv7: $([ -f "android/app/src/main/jniLibs/armeabi-v7a/librustyclint.so" ] && echo "✓" || echo "✗")
- x86: $([ -f "android/app/src/main/jniLibs/x86/librustyclint.so" ] && echo "✓" || echo "✗")
- x86_64: $([ -f "android/app/src/main/jniLibs/x86_64/librustyclint.so" ] && echo "✓" || echo "✗")

Upload Status:
$([ "$SKIP_UPLOAD" = true ] && echo "- Upload skipped" || echo "- Uploaded to ${TRACK^} track")

Next Steps:
1. Check Google Play Console for processing status
2. Test the app on internal track
3. Promote to production when ready

EOF

    log_success "Report generated: $report_file"
}

# Main function
main() {
    # Parse command line arguments
    parse_args "$@"
    
    log_info "Starting Android app deployment..."
    log_info "Configuration:"
    log_info "- Build Type: $BUILD_TYPE"
    log_info "- Output Type: $OUTPUT_TYPE"
    log_info "- Track: $TRACK"
    log_info "- Minification: $([ "$ENABLE_MINIFY" = true ] && echo "Enabled" || echo "Disabled")"
    
    # Check prerequisites
    check_prerequisites
    
    # Add Android targets to Rust
    add_android_targets
    
    # Build Rust code for Android
    build_rust_android
    
    # Copy native libraries to Android project
    copy_native_libraries
    
    # Build Android app
    build_android_app
    
    # Upload to Google Play Store
    upload_to_play_store
    
    # Generate deployment report
    generate_report
    
    log_success "Android app deployment completed successfully!"
}

# Run main function with all arguments
main "$@"