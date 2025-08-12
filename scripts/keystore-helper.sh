#!/bin/bash

# Android Keystore Helper Script
# Interactive helper for keystore configuration

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
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
    echo -e "${PURPLE}[STEP]${NC} $1"
}

log_tip() {
    echo -e "${CYAN}[TIP]${NC} $1"
}

# Display banner
show_banner() {
    echo -e "${GREEN}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                Android Keystore Helper                      ║"
    echo "║              Complete Setup Assistant                       ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

# Check prerequisites
check_prerequisites() {
    log_step "Checking prerequisites..."
    
    # Check if keytool is available
    if ! command -v keytool &> /dev/null; then
        log_error "keytool not found. Please install Java JDK."
        echo "Install Java JDK:"
        echo "  macOS: brew install openjdk"
        echo "  Ubuntu: sudo apt install openjdk-11-jdk"
        echo "  Windows: Download from Oracle or use OpenJDK"
        exit 1
    fi
    
    # Check if we're in the right directory
    if [ ! -d "android" ]; then
        log_error "Android directory not found."
        echo "Please run this script from your project root directory."
        exit 1
    fi
    
    log_success "Prerequisites check passed"
}

# Interactive keystore generation
interactive_keystore_generation() {
    log_step "Interactive Keystore Generation"
    echo ""
    
    # Create keystore directory
    KEYSTORE_DIR="android/keystore"
    mkdir -p "$KEYSTORE_DIR"
    
    # Default values
    DEFAULT_ALIAS="release-key"
    DEFAULT_KEYSTORE="$KEYSTORE_DIR/release.keystore"
    DEFAULT_VALIDITY="10000"  # ~27 years
    
    echo -e "${CYAN}📋 Keystore Configuration${NC}"
    echo "=========================="
    
    # Get keystore path
    echo ""
    read -p "Keystore filename [release.keystore]: " KEYSTORE_NAME
    KEYSTORE_NAME=${KEYSTORE_NAME:-release.keystore}
    KEYSTORE_PATH="$KEYSTORE_DIR/$KEYSTORE_NAME"
    
    # Get key alias
    read -p "Key alias [$DEFAULT_ALIAS]: " KEY_ALIAS
    KEY_ALIAS=${KEY_ALIAS:-$DEFAULT_ALIAS}
    
    # Get validity period
    read -p "Validity (days) [$DEFAULT_VALIDITY]: " VALIDITY
    VALIDITY=${VALIDITY:-$DEFAULT_VALIDITY}
    
    echo ""
    echo -e "${CYAN}🔑 Security Information${NC}"
    echo "======================="
    
    # Get passwords with confirmation
    while true; do
        read -s -p "Keystore password (min 6 chars): " KEYSTORE_PASSWORD
        echo ""
        read -s -p "Confirm keystore password: " KEYSTORE_PASSWORD_CONFIRM
        echo ""
        
        if [ "$KEYSTORE_PASSWORD" = "$KEYSTORE_PASSWORD_CONFIRM" ] && [ ${#KEYSTORE_PASSWORD} -ge 6 ]; then
            break
        else
            log_error "Passwords don't match or are too short. Please try again."
        fi
    done
    
    while true; do
        read -s -p "Key password (min 6 chars): " KEY_PASSWORD
        echo ""
        read -s -p "Confirm key password: " KEY_PASSWORD_CONFIRM
        echo ""
        
        if [ "$KEY_PASSWORD" = "$KEY_PASSWORD_CONFIRM" ] && [ ${#KEY_PASSWORD} -ge 6 ]; then
            break
        else
            log_error "Passwords don't match or are too short. Please try again."
        fi
    done
    
    echo ""
    echo -e "${CYAN}👤 Certificate Information${NC}"
    echo "=========================="
    
    read -p "Your name: " CERT_NAME
    read -p "Organization: " CERT_ORG
    read -p "Organization unit (optional): " CERT_OU
    read -p "City: " CERT_CITY
    read -p "State/Province: " CERT_STATE
    read -p "Country code (2 letters, e.g., US): " CERT_COUNTRY
    
    # Validate country code
    if [ ${#CERT_COUNTRY} -ne 2 ]; then
        log_warning "Country code should be 2 letters. Using 'US' as default."
        CERT_COUNTRY="US"
    fi
    
    echo ""
    log_info "Generating keystore with the following information:"
    echo "  Keystore: $KEYSTORE_PATH"
    echo "  Alias: $KEY_ALIAS"
    echo "  Validity: $VALIDITY days (~$((VALIDITY/365)) years)"
    echo "  Name: $CERT_NAME"
    echo "  Organization: $CERT_ORG"
    echo "  Country: $CERT_COUNTRY"
    echo ""
    
    read -p "Proceed with keystore generation? (y/N): " CONFIRM
    if [[ ! "$CONFIRM" =~ ^[Yy]$ ]]; then
        log_info "Keystore generation cancelled."
        exit 0
    fi
    
    echo ""
    log_info "🔨 Generating keystore..."
    
    # Generate the keystore
    keytool -genkey -v \
        -keystore "$KEYSTORE_PATH" \
        -alias "$KEY_ALIAS" \
        -keyalg RSA \
        -keysize 2048 \
        -validity "$VALIDITY" \
        -storepass "$KEYSTORE_PASSWORD" \
        -keypass "$KEY_PASSWORD" \
        -dname "CN=$CERT_NAME, OU=$CERT_OU, O=$CERT_ORG, L=$CERT_CITY, ST=$CERT_STATE, C=$CERT_COUNTRY"
    
    if [ $? -eq 0 ]; then
        log_success "Keystore generated successfully!"
    else
        log_error "Keystore generation failed!"
        exit 1
    fi
    
    # Create keystore.properties file
    PROPERTIES_FILE="android/keystore.properties"
    log_info "📝 Creating $PROPERTIES_FILE..."
    
    cat > "$PROPERTIES_FILE" << EOF
storePassword=$KEYSTORE_PASSWORD
keyPassword=$KEY_PASSWORD
keyAlias=$KEY_ALIAS
storeFile=keystore/$KEYSTORE_NAME
EOF
    
    log_success "Properties file created: $PROPERTIES_FILE"
}

# Verify existing keystore
verify_keystore() {
    log_step "Verifying existing keystore..."
    
    local keystore_path="android/keystore/release.keystore"
    local properties_path="android/keystore.properties"
    
    if [ ! -f "$keystore_path" ]; then
        log_error "Keystore not found at: $keystore_path"
        return 1
    fi
    
    if [ ! -f "$properties_path" ]; then
        log_error "Properties file not found at: $properties_path"
        return 1
    fi
    
    # Load properties
    source "$properties_path"
    
    log_info "Keystore found: $keystore_path"
    log_info "Verifying keystore access..."
    
    # Test keystore access
    if keytool -list -keystore "$keystore_path" -storepass "$storePassword" -alias "$keyAlias" &>/dev/null; then
        log_success "Keystore verification passed!"
        
        # Show keystore details
        echo ""
        log_info "Keystore details:"
        keytool -list -v -keystore "$keystore_path" -storepass "$storePassword" -alias "$keyAlias" | head -20
        
        return 0
    else
        log_error "Keystore verification failed!"
        log_error "Check passwords and alias in keystore.properties"
        return 1
    fi
}

# Configure Gradle signing
configure_gradle_signing() {
    log_step "Configuring Gradle signing..."
    
    local build_gradle="android/app/build.gradle"
    
    if [ ! -f "$build_gradle" ]; then
        log_error "build.gradle not found at: $build_gradle"
        return 1
    fi
    
    # Check if signing is already configured
    if grep -q "signingConfigs" "$build_gradle"; then
        log_warning "Signing configuration already exists in build.gradle"
        read -p "Overwrite existing configuration? (y/N): " OVERWRITE
        if [[ ! "$OVERWRITE" =~ ^[Yy]$ ]]; then
            log_info "Skipping Gradle configuration."
            return 0
        fi
    fi
    
    # Backup original file
    cp "$build_gradle" "$build_gradle.backup"
    log_info "Backed up build.gradle to build.gradle.backup"
    
    # Add signing configuration
    log_info "Adding signing configuration to build.gradle..."
    
    # This is a simplified approach - in practice, you'd want to parse and modify the existing file
    log_warning "Please manually add the following to your build.gradle:"
    echo ""
    echo -e "${CYAN}// Load keystore properties"
    echo "def keystorePropertiesFile = rootProject.file(\"keystore.properties\")"
    echo "def keystoreProperties = new Properties()"
    echo "if (keystorePropertiesFile.exists()) {"
    echo "    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))"
    echo "}"
    echo ""
    echo "android {"
    echo "    signingConfigs {"
    echo "        release {"
    echo "            keyAlias keystoreProperties['keyAlias']"
    echo "            keyPassword keystoreProperties['keyPassword']"
    echo "            storeFile file(keystoreProperties['storeFile'])"
    echo "            storePassword keystoreProperties['storePassword']"
    echo "        }"
    echo "    }"
    echo "    "
    echo "    buildTypes {"
    echo "        release {"
    echo "            signingConfig signingConfigs.release"
    echo "            minifyEnabled true"
    echo "            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'"
    echo "        }"
    echo "    }"
    echo -e "}${NC}"
    echo ""
}

# Update .gitignore
update_gitignore() {
    log_step "Updating .gitignore..."
    
    local gitignore=".gitignore"
    
    if ! grep -q "# Android signing" "$gitignore" 2>/dev/null; then
        cat >> "$gitignore" << EOF

# Android signing
android/keystore.properties
android/keystore/
*.keystore
*.jks
EOF
        log_success "Added Android signing entries to .gitignore"
    else
        log_info ".gitignore already contains Android signing entries"
    fi
}

# Test signing
test_signing() {
    log_step "Testing Android signing..."
    
    log_info "Building signed AAB to test configuration..."
    
    cd android
    
    # Clean and build
    if ./gradlew clean bundleRelease; then
        log_success "Build successful!"
        
        # Check if AAB was created
        local aab_path="app/build/outputs/bundle/release/app-release.aab"
        if [ -f "$aab_path" ]; then
            local size=$(du -h "$aab_path" | cut -f1)
            log_success "Signed AAB created: $aab_path (Size: $size)"
            
            # Verify signature if bundletool is available
            if command -v bundletool &> /dev/null; then
                log_info "Verifying AAB signature..."
                if bundletool validate --bundle="$aab_path"; then
                    log_success "AAB signature verification passed!"
                else
                    log_warning "AAB signature verification failed"
                fi
            else
                log_info "bundletool not found. Install it to verify AAB signature."
            fi
        else
            log_error "AAB not found at expected location: $aab_path"
        fi
    else
        log_error "Build failed! Check the error messages above."
        cd ..
        return 1
    fi
    
    cd ..
}

# Generate CI/CD configuration
generate_cicd_config() {
    log_step "Generating CI/CD configuration..."
    
    # Create GitHub Actions workflow
    local workflows_dir=".github/workflows"
    mkdir -p "$workflows_dir"
    
    local workflow_file="$workflows_dir/android-release.yml"
    
    log_info "Creating GitHub Actions workflow: $workflow_file"
    
    cat > "$workflow_file" << 'EOF'
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
          echo "${{ secrets.KEYSTORE_BASE64 }}" | base64 -d > android/keystore/release.keystore
          
      - name: Build Rust for Android
        run: |
          export ANDROID_NDK_ROOT=$ANDROID_NDK_LATEST_HOME
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
          KEYSTORE_PASSWORD: ${{ secrets.KEYSTORE_PASSWORD }}
          KEY_PASSWORD: ${{ secrets.KEY_PASSWORD }}
          KEY_ALIAS: ${{ secrets.KEY_ALIAS }}
          
      - name: Upload AAB artifact
        uses: actions/upload-artifact@v4
        with:
          name: app-release-aab
          path: android/app/build/outputs/bundle/release/app-release.aab
EOF
    
    log_success "GitHub Actions workflow created!"
    
    # Create environment template
    local env_template=".env.android.template"
    log_info "Creating environment template: $env_template"
    
    cat > "$env_template" << EOF
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
    
    log_success "Environment template created!"
}

# Show security recommendations
show_security_recommendations() {
    log_step "Security Recommendations"
    echo ""
    
    echo -e "${RED}⚠️  CRITICAL SECURITY NOTES:${NC}"
    echo "============================="
    echo ""
    echo -e "${GREEN}✅ DO:${NC}"
    echo "  • 🔐 Use strong passwords (20+ characters)"
    echo "  • 📝 Save passwords in a secure password manager"
    echo "  • 🔄 Create multiple secure backups of your keystore"
    echo "  • ☁️  Store encrypted backups in cloud storage"
    echo "  • 🚫 Add keystore files to .gitignore"
    echo "  • 🔒 Use Google Play App Signing for new apps"
    echo "  • 👥 Limit access to keystore files"
    echo "  • 🔑 Use environment variables in CI/CD"
    echo ""
    echo -e "${RED}❌ DON'T:${NC}"
    echo "  • 🚫 Commit keystore to version control"
    echo "  • 📧 Share keystore passwords via email/chat"
    echo "  • 💾 Store keystore on shared drives without encryption"
    echo "  • ⏰ Set short validity periods"
    echo "  • 🔓 Use weak passwords"
    echo "  • 🗑️  Delete keystore without backups"
    echo ""
    
    log_tip "Encode keystore for CI/CD:"
    echo "  base64 -w 0 android/keystore/release.keystore"
    echo ""
    
    log_tip "Recovery options:"
    echo "  • With Play App Signing: Google can help recover"
    echo "  • Without Play App Signing: Must create new app listing"
    echo "  • Prevention: Always use Play App Signing for new apps"
}

# Show next steps
show_next_steps() {
    log_step "Next Steps"
    echo ""
    
    echo -e "${CYAN}🎯 What to do next:${NC}"
    echo ""
    echo "1. 🧪 Test your setup:"
    echo "   cd android && ./gradlew bundleRelease"
    echo ""
    echo "2. 🔐 Set up CI/CD secrets (if using GitHub Actions):"
    echo "   • KEYSTORE_BASE64 (base64 encoded keystore)"
    echo "   • KEYSTORE_PASSWORD"
    echo "   • KEY_PASSWORD"
    echo "   • KEY_ALIAS"
    echo ""
    echo "3. 🏪 Set up Google Play Console:"
    echo "   • Create service account"
    echo "   • Download JSON key"
    echo "   • Grant permissions in Play Console"
    echo ""
    echo "4. 🚀 Deploy your app:"
    echo "   • Upload first AAB manually to Play Console"
    echo "   • Create app listing"
    echo "   • Enable automated uploads"
    echo ""
    echo "5. 📋 Documentation:"
    echo "   • Read: docs/keystore-setup-guide.md"
    echo "   • Keep: android/keystore.properties (secure)"
    echo "   • Backup: android/keystore/release.keystore (secure)"
}

# Main menu
show_main_menu() {
    echo ""
    echo -e "${CYAN}🔧 What would you like to do?${NC}"
    echo ""
    echo "1. 🆕 Generate new keystore"
    echo "2. ✅ Verify existing keystore"
    echo "3. ⚙️  Configure Gradle signing"
    echo "4. 🧪 Test signing configuration"
    echo "5. 🚀 Generate CI/CD configuration"
    echo "6. 🔒 Show security recommendations"
    echo "7. 📖 Show complete setup guide"
    echo "8. 🚪 Exit"
    echo ""
    read -p "Enter your choice (1-8): " CHOICE
    
    case $CHOICE in
        1)
            interactive_keystore_generation
            update_gitignore
            show_security_recommendations
            show_next_steps
            ;;
        2)
            if verify_keystore; then
                log_success "Your keystore is properly configured!"
            else
                log_error "Keystore verification failed. You may need to generate a new one."
            fi
            ;;
        3)
            configure_gradle_signing
            ;;
        4)
            test_signing
            ;;
        5)
            generate_cicd_config
            ;;
        6)
            show_security_recommendations
            ;;
        7)
            log_info "Opening complete setup guide..."
            if command -v code &> /dev/null; then
                code docs/keystore-setup-guide.md
            else
                log_info "Please read: docs/keystore-setup-guide.md"
            fi
            ;;
        8)
            log_info "Goodbye! 👋"
            exit 0
            ;;
        *)
            log_error "Invalid choice. Please try again."
            show_main_menu
            ;;
    esac
}

# Main function
main() {
    show_banner
    check_prerequisites
    show_main_menu
}

# Run main function
main