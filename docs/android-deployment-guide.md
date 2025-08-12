# Complete Android Deployment Guide

This guide provides a comprehensive walkthrough of deploying your Android application to the Google Play Store, including setting up the necessary environment, configuring signing, and automating the deployment process.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Keystore Configuration](#keystore-configuration)
4. [Building the App](#building-the-app)
5. [Google Play Console Setup](#google-play-console-setup)
6. [Automated Deployment](#automated-deployment)
7. [Troubleshooting](#troubleshooting)
8. [Security Best Practices](#security-best-practices)

## Prerequisites

Before you begin, ensure you have the following:

- Android SDK installed
- Android NDK r25c or later installed
- Rust toolchain with Android targets
- Java JDK 11 or later
- Google Play Developer account ($25 one-time fee)
- Git repository for your project

## Environment Setup

### 1. Set Up Android NDK

Run our automated setup script:

```bash
chmod +x scripts/setup-android-env.sh
./scripts/setup-android-env.sh
```

This script will:
- Install Android NDK if not present
- Configure Rust for Android development
- Set up necessary environment variables
- Create a test project to verify the setup

### 2. Verify Environment

Test your environment with:

```bash
chmod +x scripts/test-android-build.sh
./scripts/test-android-build.sh
```

This will build a simple Rust library for all Android architectures to ensure everything is configured correctly.

## Keystore Configuration

### 1. Generate Keystore

For new projects, generate a keystore:

```bash
chmod +x scripts/generate-android-keystore.sh
./scripts/generate-android-keystore.sh
```

Follow the prompts to create a secure keystore. Remember to:
- Use a strong password
- Set validity to 25+ years (Google requirement)
- Store the keystore information securely

### 2. Configure Signing

Set up your project for signing:

```bash
chmod +x scripts/setup-android-signing.sh
./scripts/setup-android-signing.sh
```

This will:
- Update your build.gradle with signing configuration
- Create keystore.properties for secure credential storage
- Add keystore files to .gitignore
- Set up GitHub Actions workflow for CI/CD

### 3. Interactive Keystore Helper

For more control over keystore management:

```bash
chmod +x scripts/keystore-helper.sh
./scripts/keystore-helper.sh
```

This interactive tool helps with:
- Generating new keystores
- Verifying existing keystores
- Configuring Gradle signing
- Testing signing configuration
- Generating CI/CD configuration

## Building the App

### 1. Manual Build

Build your app manually:

```bash
# Navigate to android directory
cd android

# For AAB (recommended for Play Store)
./gradlew bundleRelease

# For APK
./gradlew assembleRelease
```

### 2. Automated Build

Use our deployment script for a complete build process:

```bash
chmod +x scripts/deploy-android-app.sh
./scripts/deploy-android-app.sh
```

Options:
```
--build-type <type>   Build type (debug or release, default: release)
--output-type <type>  Output type (apk or aab, default: aab)
--track <track>       Release track (internal, alpha, beta, production)
--no-minify           Disable code minification
--skip-upload         Skip uploading to Google Play
--verbose             Enable verbose output
```

Example:
```bash
./scripts/deploy-android-app.sh --build-type release --output-type aab --track internal
```

## Google Play Console Setup

### 1. Create Developer Account

1. Go to [Google Play Console](https://play.google.com/console/signup)
2. Sign up and pay the $25 one-time registration fee
3. Complete account details and developer agreement

### 2. Create App Listing

1. In Google Play Console, click "Create app"
2. Fill in app details:
   - App name
   - Default language
   - App or game
   - Free or paid
   - Declarations

### 3. Set Up App Signing

Google Play App Signing is strongly recommended:

1. During first upload, choose "Use Google Play App Signing"
2. Upload your app signing key
3. Google will manage the signing key for production

### 4. Create Service Account (for CI/CD)

1. Go to Google Play Console > Setup > API access
2. Create a new service account in Google Cloud Console
3. Grant necessary permissions
4. Download JSON key file
5. Store securely for automated deployments

## Automated Deployment

### 1. GitHub Actions

We've included a GitHub Actions workflow at `.github/workflows/android-release.yml`.

To use it:
1. Add these secrets to your GitHub repository:
   - `KEYSTORE_BASE64`: Base64-encoded keystore file
   - `KEYSTORE_PASSWORD`: Keystore password
   - `KEY_PASSWORD`: Key password
   - `KEY_ALIAS`: Key alias (usually "release-key")
   - `GOOGLE_PLAY_SERVICE_ACCOUNT`: Service account JSON

2. Create a tag to trigger deployment:
   ```bash
   git tag -a v1.0.0 -m "Version 1.0.0"
   git push origin v1.0.0
   ```

### 2. Fastlane

For more control, use Fastlane:

1. Install Fastlane:
   ```bash
   gem install fastlane
   ```

2. Configure Fastlane:
   ```bash
   cd android
   fastlane init
   ```

3. Deploy with Fastlane:
   ```bash
   cd android
   fastlane deploy
   ```

## Troubleshooting

### Common Issues

1. **Keystore Issues**
   - **Problem**: "keystore was tampered with" or "certificate expired"
   - **Solution**: Verify keystore password and validity period

2. **Build Failures**
   - **Problem**: Gradle build fails
   - **Solution**: Check logs in `android/app/build/outputs/logs`

3. **NDK Errors**
   - **Problem**: "NDK not found" or linker errors
   - **Solution**: Verify NDK installation and environment variables

4. **Upload Failures**
   - **Problem**: "Upload failed" in Google Play Console
   - **Solution**: Ensure AAB is properly signed and version code is incremented

### Verification Tools

```bash
# Verify keystore
keytool -list -v -keystore android/keystore/release.keystore

# Check APK signature
apksigner verify --verbose android/app/build/outputs/apk/release/app-release.apk

# Validate AAB
bundletool validate --bundle=android/app/build/outputs/bundle/release/app-release.aab
```

## Security Best Practices

1. **Keystore Security**
   - Store keystore files outside of version control
   - Use strong, unique passwords
   - Create multiple secure backups
   - Consider using a password manager for credentials

2. **CI/CD Security**
   - Use encrypted secrets in CI/CD systems
   - Limit access to deployment credentials
   - Rotate service account keys periodically
   - Use the principle of least privilege

3. **Google Play App Signing**
   - Always enable Google Play App Signing for new apps
   - This allows Google to manage your app signing key
   - Provides key recovery options if you lose your upload key

4. **Code Security**
   - Enable ProGuard/R8 for code obfuscation
   - Remove debug symbols in release builds
   - Implement proper SSL pinning
   - Use the Android Security Library

## Additional Resources

- [Android Developer Documentation](https://developer.android.com/docs)
- [Google Play Console Help](https://support.google.com/googleplay/android-developer)
- [Fastlane Documentation](https://docs.fastlane.tools)
- [ProGuard Manual](https://www.guardsquare.com/manual/home)

---

For more detailed information on specific topics, refer to our specialized guides:
- [Android Signing Key Setup Guide](./android-signing-setup.md)
- [Google Play Store Deployment Guide](./play-store-deployment.md)
- [Android App Icons Guide](./android-app-icons.md)
- [Play Store Listing Guide](./play-store-listing.md)