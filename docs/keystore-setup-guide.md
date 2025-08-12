# Complete Android Keystore Setup Guide

## Overview
This guide will help you set up Android keystore configuration for automated deployment to Google Play Store.

## Quick Setup (Recommended)

### 1. Generate Keystore Automatically
```bash
# Make the script executable
chmod +x scripts/generate-android-keystore.sh

# Run the keystore generation script
./scripts/generate-android-keystore.sh
```

### 2. Configure Automated Signing
```bash
# Set up signing configuration
chmod +x scripts/setup-android-signing.sh
./scripts/setup-android-signing.sh
```

### 3. Test the Setup
```bash
# Test automated deployment
chmod +x scripts/deploy-android.sh
./scripts/deploy-android.sh
```

## Manual Setup

### Step 1: Generate Signing Key

#### Option A: Using keytool (Command Line)
```bash
# Navigate to android directory
cd android
mkdir -p keystore

# Generate keystore
keytool -genkey -v \
  -keystore keystore/release.keystore \
  -alias release-key \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

#### Option B: Using Android Studio
1. Open Android Studio
2. Go to **Build** → **Generate Signed Bundle/APK**
3. Select **Android App Bundle**
4. Click **Create new...**
5. Fill in keystore information:
   - **Keystore path**: `android/keystore/release.keystore`
   - **Password**: Strong password (save this!)
   - **Key alias**: `release-key`
   - **Key password**: Strong password (save this!)
   - **Validity**: 25+ years
   - **Certificate info**: Your details

### Step 2: Configure Gradle Signing

Create `android/keystore.properties`:
```properties
storePassword=YOUR_KEYSTORE_PASSWORD
keyPassword=YOUR_KEY_PASSWORD
keyAlias=release-key
storeFile=keystore/release.keystore
```

Update `android/app/build.gradle`:
```gradle
// Load keystore properties
def keystorePropertiesFile = rootProject.file("keystore.properties")
def keystoreProperties = new Properties()
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}

android {
    signingConfigs {
        release {
            keyAlias keystoreProperties['keyAlias']
            keyPassword keystoreProperties['keyPassword']
            storeFile file(keystoreProperties['storeFile'])
            storePassword keystoreProperties['storePassword']
        }
    }
    
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}
```

### Step 3: Security Configuration

Add to `.gitignore`:
```gitignore
# Android signing
android/keystore.properties
android/keystore/
*.keystore
*.jks
```

### Step 4: Test Signing

```bash
cd android
./gradlew bundleRelease

# Check if AAB was created and signed
ls -la app/build/outputs/bundle/release/
```

## Automation Setup

### Environment Variables for CI/CD

For GitHub Actions, set these secrets:
- `KEYSTORE_BASE64`: Base64 encoded keystore file
- `KEYSTORE_PASSWORD`: Keystore password
- `KEY_PASSWORD`: Key password
- `KEY_ALIAS`: Key alias (usually `release-key`)

Encode keystore for CI/CD:
```bash
base64 -w 0 android/keystore/release.keystore
```

### Google Play Console Setup

1. **Create Service Account**:
   - Go to Google Cloud Console
   - Create new service account
   - Download JSON key file

2. **Grant Permissions**:
   - Go to Google Play Console
   - Settings → API access
   - Link service account
   - Grant necessary permissions

3. **Set Environment Variable**:
   ```bash
   export GOOGLE_PLAY_SERVICE_ACCOUNT="$(cat service-account.json)"
   ```

## Troubleshooting

### Common Issues

1. **"keystore was tampered with"**
   - Wrong keystore password
   - Corrupted keystore file

2. **"certificate expired"**
   - Keystore validity too short
   - Regenerate with longer validity

3. **"key not found"**
   - Wrong key alias
   - Check alias with: `keytool -list -v -keystore release.keystore`

4. **Build fails with signing error**
   - Check file paths in keystore.properties
   - Verify permissions on keystore file

### Verification Commands

```bash
# List keystore contents
keytool -list -v -keystore android/keystore/release.keystore

# Check certificate details
keytool -list -v -keystore android/keystore/release.keystore -alias release-key

# Verify AAB signature
bundletool validate --bundle=app/build/outputs/bundle/release/app-release.aab
```

## Security Best Practices

✅ **DO:**
- Use strong passwords (20+ characters)
- Set keystore validity to 25+ years
- Enable Google Play App Signing
- Create multiple secure backups
- Use environment variables in CI/CD
- Limit access to keystore files

❌ **DON'T:**
- Commit keystore to version control
- Share keystore passwords in plain text
- Use weak passwords
- Set short validity periods
- Skip backups

## Backup Strategy

1. **Cloud Storage**: Encrypted backup to Google Drive/Dropbox
2. **Password Manager**: Store keystore info in 1Password/Bitwarden
3. **Physical Backup**: USB drive in secure location
4. **Team Access**: Share with trusted team members

## Recovery Options

- **With Play App Signing**: Google can help recover
- **Without Play App Signing**: Must create new app listing
- **Prevention**: Always use Play App Signing for new apps

## Next Steps

After setting up your keystore:

1. **Test Local Build**:
   ```bash
   ./scripts/deploy-android.sh
   ```

2. **Set up CI/CD**:
   - Configure GitHub secrets
   - Test automated deployment

3. **Upload to Play Store**:
   - Create app listing
   - Upload first AAB manually
   - Enable automated uploads

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Verify all file paths and permissions
3. Test keystore access manually
4. Review build logs for specific errors

Remember: Your signing key is your app's identity. Losing it means you cannot update your app on the Play Store!