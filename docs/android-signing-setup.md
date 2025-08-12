# Android Signing Key Setup Guide

## 1. Generate a New Signing Key

### Using Android Studio (Recommended for beginners)
1. Open Android Studio
2. Go to **Build** → **Generate Signed Bundle/APK**
3. Select **Android App Bundle**
4. Click **Create new...**
5. Fill in the keystore information:
   - **Key store path**: Choose location (e.g., `android/keystore/release.keystore`)
   - **Password**: Strong password for keystore
   - **Key alias**: Name for your key (e.g., `release-key`)
   - **Key password**: Password for the key
   - **Validity**: 25+ years (Google requirement)
   - **Certificate info**: Your details

### Using Command Line (keytool)
```bash
# Navigate to your project's android directory
cd android

# Create keystore directory
mkdir -p keystore

# Generate the keystore
keytool -genkey -v -keystore keystore/release.keystore -alias release-key -keyalg RSA -keysize 2048 -validity 10000

# You'll be prompted for:
# - Keystore password
# - Key password  
# - Your name and organization details
```

## 2. Keystore Information to Remember

**CRITICAL**: Save this information securely - you cannot recover it!

```
Keystore Path: android/keystore/release.keystore
Keystore Password: [YOUR_KEYSTORE_PASSWORD]
Key Alias: release-key
Key Password: [YOUR_KEY_PASSWORD]
```

## 3. Configure Gradle for Signing

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

## 4. Environment Variables for CI/CD

For automated builds, use environment variables instead:

Update `android/app/build.gradle`:
```gradle
android {
    signingConfigs {
        release {
            storeFile file('../keystore/release.keystore')
            storePassword System.getenv("KEYSTORE_PASSWORD") ?: keystoreProperties['storePassword']
            keyAlias System.getenv("KEY_ALIAS") ?: keystoreProperties['keyAlias']
            keyPassword System.getenv("KEY_PASSWORD") ?: keystoreProperties['keyPassword']
        }
    }
}
```

## 5. Secure the Keystore

### Add to .gitignore
```gitignore
# Android signing
android/keystore.properties
android/keystore/
*.keystore
*.jks
```

### For CI/CD - Base64 encode the keystore
```bash
# Encode keystore for GitHub secrets
base64 -i android/keystore/release.keystore | pbcopy

# On Linux:
base64 -w 0 android/keystore/release.keystore
```

## 6. Test the Signing

Build a signed AAB to test:
```bash
cd android
./gradlew bundleRelease

# Check if the AAB was created and signed
ls -la app/build/outputs/bundle/release/
```

## 7. Upload Key to Google Play Console

### Option A: Upload Signing Key (Traditional)
1. Go to Google Play Console
2. Select your app
3. Go to **Setup** → **App signing**
4. Upload your keystore file

### Option B: Use Play App Signing (Recommended)
1. Let Google manage your signing key
2. Upload your keystore as the "upload key"
3. Google generates the final signing key
4. More secure and allows key recovery

## 8. Backup Your Keystore

**CRITICAL**: Make multiple secure backups!

1. **Cloud Storage**: Encrypted backup to Google Drive/Dropbox
2. **Password Manager**: Store keystore info in 1Password/Bitwarden
3. **Physical Backup**: USB drive in safe location
4. **Team Access**: Share with trusted team members

## 9. Security Best Practices

- ✅ Use strong passwords (20+ characters)
- ✅ Set keystore validity to 25+ years
- ✅ Never commit keystore to version control
- ✅ Use environment variables in CI/CD
- ✅ Enable Play App Signing
- ✅ Create multiple secure backups
- ✅ Limit access to keystore files
- ✅ Use separate keystores for debug/release

## 10. Troubleshooting

### Common Issues:
1. **"keystore was tampered with"**: Wrong password
2. **"certificate expired"**: Keystore validity too short
3. **"key not found"**: Wrong alias name
4. **Build fails**: Check file paths and permissions

### Verify Keystore:
```bash
# List keystore contents
keytool -list -v -keystore android/keystore/release.keystore

# Check certificate validity
keytool -list -v -keystore android/keystore/release.keystore -alias release-key
```

## 11. Recovery Options

If you lose your keystore:
- **With Play App Signing**: Google can help recover
- **Without Play App Signing**: You must create a new app listing
- **Prevention**: Always use Play App Signing for new apps

---

**Remember**: Your signing key is like your app's identity. Losing it means you cannot update your app on the Play Store!