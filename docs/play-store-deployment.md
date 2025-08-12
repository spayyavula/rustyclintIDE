# Google Play Store Deployment Guide

This guide walks you through the process of deploying your Hello World app to the Google Play Store.

## 1. Prepare Your App

### Keystore Setup
You've already set up your keystore using our helper scripts. Make sure you have:
- A secure keystore file (`android/keystore/release.keystore`)
- Keystore configuration (`android/keystore.properties`)
- Added these files to `.gitignore`

### App Configuration
Ensure your app has:
- A unique package name (`com.rustyclint.helloworld`)
- Proper version code (1) and version name (1.0.0)
- Appropriate app icons
- Required permissions in the manifest

## 2. Build a Release AAB

```bash
# Navigate to the android directory
cd android

# Build the release AAB
./gradlew bundleRelease
```

The AAB file will be generated at:
```
android/app/build/outputs/bundle/release/app-release.aab
```

## 3. Create a Google Play Console Account

1. Go to [Google Play Console](https://play.google.com/console/signup)
2. Sign up with your Google account
3. Pay the one-time $25 registration fee
4. Complete the account details

## 4. Create a New App

1. In Google Play Console, click "Create app"
2. Fill in the app details:
   - App name: "Hello World"
   - Default language: English (or your preferred language)
   - App or game: App
   - Free or paid: Free
   - Declarations: Check all required boxes

## 5. Set Up Your App Listing

Complete all required sections:
- **App details**: Description, screenshots, feature graphic
- **Content rating**: Complete the questionnaire
- **Target audience**: Select appropriate age ranges
- **Store settings**: Category, contact details, etc.

## 6. Upload Your AAB

1. Go to "Production" > "Create new release"
2. Click "Continue" to set up app signing by Google
3. Upload your AAB file
4. Add release notes
5. Save and review the release

## 7. Complete Pre-launch Report

1. Fix any issues identified in the pre-launch report
2. Test your app on various devices

## 8. Submit for Review

1. Go back to your release
2. Click "Start rollout to Production"
3. Confirm the submission

## 9. Monitor Review Status

- The review process typically takes 1-3 days
- You'll receive an email when your app is approved or rejected
- If rejected, address the issues and resubmit

## 10. Post-Launch

After your app is live:
- Monitor crashes and ANRs
- Respond to user reviews
- Plan updates and improvements

## 11. Automating Future Deployments

For future updates:
1. Increment the `versionCode` and `versionName` in `build.gradle`
2. Build a new AAB
3. Create a new release in Google Play Console
4. Upload the new AAB
5. Submit for review

## 12. Using CI/CD for Deployment

You can use the GitHub Actions workflow we've set up:
1. Set up GitHub repository secrets:
   - `KEYSTORE_BASE64`: Base64-encoded keystore
   - `KEYSTORE_PASSWORD`: Keystore password
   - `KEY_PASSWORD`: Key password
   - `KEY_ALIAS`: Key alias
   - `GOOGLE_PLAY_SERVICE_ACCOUNT`: Service account JSON

2. Create a new tag to trigger the workflow:
   ```bash
   git tag -a v1.0.0 -m "Version 1.0.0"
   git push origin v1.0.0
   ```

## Important Notes

- **Keep your keystore safe!** If you lose it, you won't be able to update your app.
- Always test your app thoroughly before submitting.
- Make sure your app complies with [Google Play policies](https://play.google.com/about/developer-content-policy/).
- The first submission often takes longer to review than subsequent updates.