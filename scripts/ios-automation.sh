#!/bin/bash

# iOS Deployment Automation Script
# Provides intelligent automation for iOS deployment

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
    log_info "Checking iOS prerequisites..."
    
    # Check if we're on macOS
    if [[ "$OSTYPE" != "darwin"* ]]; then
        log_error "iOS development requires macOS"
        exit 1
    fi
    
    # Check for Xcode
    if ! command -v xcodebuild &> /dev/null; then
        log_error "Xcode not found. Please install Xcode from the App Store."
        exit 1
    fi
    
    # Check Xcode version
    local xcode_version=$(xcodebuild -version | head -n 1 | awk '{print $2}')
    log_info "Xcode version: $xcode_version"
    
    # Check for iOS project
    if [ ! -d "ios" ]; then
        log_error "iOS directory not found. Run this from your project root."
        exit 1
    fi
    
    # Check for Rust
    if ! command -v cargo &> /dev/null; then
        log_error "Rust/Cargo not found. Please install Rust."
        exit 1
    fi
    
    log_success "Prerequisites check passed"
    update_progress
}

# Add iOS targets
add_ios_targets() {
    log_info "Adding Rust targets for iOS..."
    
    local targets=(
        "aarch64-apple-ios"
        "x86_64-apple-ios"
        "aarch64-apple-ios-sim"
    )
    
    for target in "${targets[@]}"; do
        log_info "Adding target: $target"
        rustup target add "$target"
    done
    
    log_success "All iOS targets added"
    update_progress
}

# Build Rust for iOS
build_rust_ios() {
    log_info "Building Rust code for iOS..."
    
    # Build for device (ARM64)
    log_info "Building for iOS device (ARM64)..."
    cargo build --target aarch64-apple-ios --release
    
    # Build for simulator (x86_64)
    log_info "Building for iOS simulator (x86_64)..."
    cargo build --target x86_64-apple-ios --release
    
    # Build for simulator (ARM64 - Apple Silicon Macs)
    log_info "Building for iOS simulator (ARM64)..."
    cargo build --target aarch64-apple-ios-sim --release || log_warning "ARM64 simulator target not available"
    
    log_success "Rust build for iOS completed"
    update_progress
}

# Create universal binary
create_universal_binary() {
    log_info "Creating universal binary..."
    
    local device_lib="target/aarch64-apple-ios/release/librustyclint.a"
    local sim_x86_lib="target/x86_64-apple-ios/release/librustyclint.a"
    local sim_arm_lib="target/aarch64-apple-ios-sim/release/librustyclint.a"
    local universal_lib="ios/librustyclint-universal.a"
    
    # Create universal binary for simulator
    if [ -f "$sim_arm_lib" ]; then
        lipo -create "$sim_x86_lib" "$sim_arm_lib" -output "ios/librustyclint-sim.a"
        log_success "Universal simulator binary created"
    else
        cp "$sim_x86_lib" "ios/librustyclint-sim.a"
        log_warning "Using x86_64 only for simulator"
    fi
    
    # Copy device binary
    cp "$device_lib" "ios/librustyclint-device.a"
    
    log_success "iOS libraries prepared"
    update_progress
}

# Check code signing
check_code_signing() {
    log_info "Checking code signing configuration..."
    
    # Check for development team
    local team_id=$(security find-identity -v -p codesigning | grep "iPhone Developer" | head -n 1 | awk '{print $2}' | tr -d '()')
    
    if [ -z "$team_id" ]; then
        log_warning "No iPhone Developer certificate found"
        log_info "Please ensure you have a valid iOS Developer certificate installed"
    else
        log_success "Found iPhone Developer certificate: $team_id"
    fi
    
    # Check provisioning profiles
    local profiles_dir="$HOME/Library/MobileDevice/Provisioning Profiles"
    if [ -d "$profiles_dir" ]; then
        local profile_count=$(ls "$profiles_dir"/*.mobileprovision 2>/dev/null | wc -l)
        log_info "Found $profile_count provisioning profiles"
    else
        log_warning "No provisioning profiles found"
    fi
    
    update_progress
}

# Build iOS app
build_ios_app() {
    log_info "Building iOS app with Xcode..."
    
    cd ios
    
    # Find the Xcode project or workspace
    local project_file=""
    if [ -f "*.xcworkspace" ]; then
        project_file=$(ls *.xcworkspace | head -n 1)
        local build_cmd="xcodebuild -workspace $project_file"
    elif [ -f "*.xcodeproj" ]; then
        project_file=$(ls *.xcodeproj | head -n 1)
        local build_cmd="xcodebuild -project $project_file"
    else
        log_error "No Xcode project or workspace found"
        exit 1
    fi
    
    log_info "Using project: $project_file"
    
    # Build for device
    log_info "Building for iOS device..."
    $build_cmd -scheme App -configuration Release -destination "generic/platform=iOS" build
    
    if [ $? -eq 0 ]; then
        log_success "iOS build successful"
    else
        log_error "iOS build failed"
        exit 1
    fi
    
    cd ..
    update_progress
}

# Create archive
create_archive() {
    log_info "Creating iOS archive..."
    
    cd ios
    
    # Find the Xcode project or workspace
    if [ -f "*.xcworkspace" ]; then
        project_file=$(ls *.xcworkspace | head -n 1)
        local archive_cmd="xcodebuild -workspace $project_file"
    else
        project_file=$(ls *.xcodeproj | head -n 1)
        local archive_cmd="xcodebuild -project $project_file"
    fi
    
    # Create archive
    local archive_path="../build/App.xcarchive"
    mkdir -p ../build
    
    $archive_cmd -scheme App -configuration Release -destination "generic/platform=iOS" archive -archivePath "$archive_path"
    
    if [ $? -eq 0 ]; then
        log_success "Archive created: $archive_path"
    else
        log_error "Archive creation failed"
        exit 1
    fi
    
    cd ..
    update_progress
}

# Export IPA
export_ipa() {
    log_info "Exporting IPA..."
    
    local archive_path="build/App.xcarchive"
    local export_path="build/"
    local export_options="ios/ExportOptions.plist"
    
    # Create ExportOptions.plist if it doesn't exist
    if [ ! -f "$export_options" ]; then
        log_info "Creating ExportOptions.plist..."
        cat > "$export_options" << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>method</key>
    <string>app-store</string>
    <key>uploadBitcode</key>
    <true/>
    <key>uploadSymbols</key>
    <true/>
    <key>compileBitcode</key>
    <true/>
</dict>
</plist>
EOF
    fi
    
    # Export archive to IPA
    xcodebuild -exportArchive -archivePath "$archive_path" -exportPath "$export_path" -exportOptionsPlist "$export_options"
    
    if [ $? -eq 0 ]; then
        local ipa_file=$(find build -name "*.ipa" | head -n 1)
        if [ -n "$ipa_file" ]; then
            local size=$(du -h "$ipa_file" | cut -f1)
            log_success "IPA exported: $ipa_file (Size: $size)"
        else
            log_error "IPA file not found after export"
            exit 1
        fi
    else
        log_error "IPA export failed"
        exit 1
    fi
    
    update_progress
}

# Upload to App Store
upload_to_app_store() {
    log_info "Checking for App Store upload configuration..."
    
    local ipa_file=$(find build -name "*.ipa" | head -n 1)
    
    if [ -z "$ipa_file" ]; then
        log_error "No IPA file found for upload"
        exit 1
    fi
    
    # Check for App Store Connect API key
    if [ -n "$APP_STORE_API_KEY" ] && [ -n "$APP_STORE_ISSUER_ID" ]; then
        log_info "Uploading to App Store Connect..."
        
        xcrun altool --upload-app --type ios --file "$ipa_file" \
            --apiKey "$APP_STORE_API_KEY" \
            --apiIssuer "$APP_STORE_ISSUER_ID"
        
        if [ $? -eq 0 ]; then
            log_success "Upload to App Store Connect successful"
        else
            log_error "Upload to App Store Connect failed"
            exit 1
        fi
    else
        log_warning "App Store Connect API not configured. Skipping upload."
        log_info "To enable upload:"
        log_info "1. Set APP_STORE_API_KEY environment variable"
        log_info "2. Set APP_STORE_ISSUER_ID environment variable"
    fi
    
    update_progress
}

# Generate deployment report
generate_report() {
    log_info "Generating deployment report..."
    
    local report_file="ios-deployment-report-$(date +%Y%m%d-%H%M%S).txt"
    local ipa_file=$(find build -name "*.ipa" | head -n 1)
    
    cat > "$report_file" << EOF
iOS Deployment Report
====================
Date: $(date)
Platform: iOS
Build Type: Release

Files Generated:
- Archive: $([ -d "build/App.xcarchive" ] && echo "build/App.xcarchive ✓" || echo "Not found ✗")
- IPA: $([ -n "$ipa_file" ] && echo "$ipa_file ✓" || echo "Not found ✗")

Rust Libraries:
- Device (ARM64): $([ -f "ios/librustyclint-device.a" ] && echo "✓" || echo "✗")
- Simulator: $([ -f "ios/librustyclint-sim.a" ] && echo "✓" || echo "✗")

Build Status: SUCCESS
Total Steps: $TOTAL_STEPS
Completed Steps: $CURRENT_STEP

Next Steps:
1. Test the IPA on TestFlight
2. Submit for App Store review
3. Monitor review status

EOF

    log_success "Report generated: $report_file"
}

# Main automation function
run_automation() {
    local automation_type="$1"
    
    case "$automation_type" in
        "full")
            TOTAL_STEPS=8
            log_info "Starting full iOS deployment automation..."
            check_prerequisites
            add_ios_targets
            build_rust_ios
            create_universal_binary
            check_code_signing
            build_ios_app
            create_archive
            export_ipa
            upload_to_app_store
            ;;
        "build")
            TOTAL_STEPS=6
            log_info "Starting iOS build automation..."
            check_prerequisites
            add_ios_targets
            build_rust_ios
            create_universal_binary
            check_code_signing
            build_ios_app
            ;;
        "rust")
            TOTAL_STEPS=3
            log_info "Starting Rust build automation..."
            check_prerequisites
            add_ios_targets
            build_rust_ios
            create_universal_binary
            ;;
        *)
            log_error "Unknown automation type: $automation_type"
            log_info "Available types: full, build, rust"
            exit 1
            ;;
    esac
    
    generate_report
    log_success "iOS automation completed successfully!"
}

# Script entry point
if [ $# -eq 0 ]; then
    echo "Usage: $0 <automation_type>"
    echo "Types: full, build, rust"
    exit 1
fi

run_automation "$1"