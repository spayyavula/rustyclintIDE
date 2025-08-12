#!/bin/bash

# Test Android Build Script
# This script tests the Android build environment by building a simple Rust library for Android

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

# Load environment variables
if [ -f ".env.android" ]; then
    log_info "Loading Android environment variables..."
    source .env.android
else
    log_warning "No .env.android file found. Environment variables may not be set correctly."
fi

# Verify environment
verify_environment() {
    log_info "Verifying Android development environment..."
    
    # Check Android NDK
    if [ -z "$ANDROID_NDK_ROOT" ]; then
        log_error "ANDROID_NDK_ROOT is not set. Please run setup-android-env.sh first."
        exit 1
    fi
    
    if [ ! -d "$ANDROID_NDK_ROOT" ]; then
        log_error "Android NDK not found at $ANDROID_NDK_ROOT"
        exit 1
    fi
    
    log_success "Android NDK found at $ANDROID_NDK_ROOT"
    
    # Check Rust targets
    if ! rustup target list | grep -q "aarch64-linux-android"; then
        log_error "Rust Android targets not installed. Please run setup-android-env.sh first."
        exit 1
    fi
    
    log_success "Rust Android targets installed"
}

# Build test project
build_test_project() {
    log_info "Building test project for Android..."
    
    # Create test directory if it doesn't exist
    if [ ! -d "android-test" ]; then
        log_info "Creating test project..."
        mkdir -p android-test/src
        
        cat > android-test/Cargo.toml << EOF
[package]
name = "android-test"
version = "0.1.0"
edition = "2021"

[lib]
name = "android_test"
crate-type = ["staticlib", "cdylib"]

[dependencies]
jni = "0.19.0"
EOF
        
        cat > android-test/src/lib.rs << EOF
use jni::JNIEnv;
use jni::objects::{JClass, JString};
use jni::sys::jstring;

#[no_mangle]
pub extern "C" fn Java_com_example_androidtest_MainActivity_stringFromRust(
    env: JNIEnv,
    _: JClass,
    input: JString,
) -> jstring {
    // Convert Java string to Rust string
    let input: String = env.get_string(input).expect("Couldn't get Java string!").into();
    
    // Create output string
    let output = format!("Hello from Rust! You said: {}", input);
    
    // Convert Rust string back to Java string
    env.new_string(output)
        .expect("Couldn't create Java string!")
        .into_inner()
}
EOF
    fi
    
    # Build for all Android targets
    cd android-test
    
    log_info "Building for aarch64-linux-android..."
    cargo build --target aarch64-linux-android --release
    
    log_info "Building for armv7-linux-androideabi..."
    cargo build --target armv7-linux-androideabi --release
    
    log_info "Building for i686-linux-android..."
    cargo build --target i686-linux-android --release
    
    log_info "Building for x86_64-linux-android..."
    cargo build --target x86_64-linux-android --release
    
    cd ..
    
    log_success "Test project built successfully for all Android targets"
}

# Verify build output
verify_build_output() {
    log_info "Verifying build output..."
    
    # Check if libraries were created
    local targets=(
        "aarch64-linux-android"
        "armv7-linux-androideabi"
        "i686-linux-android"
        "x86_64-linux-android"
    )
    
    for target in "${targets[@]}"; do
        local lib_path="android-test/target/$target/release/libandroid_test.so"
        if [ -f "$lib_path" ]; then
            log_success "Library built for $target: $lib_path"
            log_info "File size: $(du -h "$lib_path" | cut -f1)"
        else
            log_error "Library not found for $target: $lib_path"
            exit 1
        fi
    done
    
    log_success "All libraries built successfully"
}

# Main function
main() {
    log_info "Starting Android build test..."
    
    # Verify environment
    verify_environment
    
    # Build test project
    build_test_project
    
    # Verify build output
    verify_build_output
    
    log_success "Android build test completed successfully!"
    log_info "Your environment is correctly set up for Android development with Rust."
}

# Run main function
main