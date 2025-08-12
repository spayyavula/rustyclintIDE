#!/bin/bash

# Android Keystore Generation Script
# This script helps generate a new Android signing keystore

set -e

echo "🔐 Android Keystore Generation Script"
echo "====================================="

# Check if keytool is available
if ! command -v keytool &> /dev/null; then
    echo "❌ keytool not found. Please install Java JDK."
    exit 1
fi

# Create keystore directory
KEYSTORE_DIR="android/keystore"
mkdir -p "$KEYSTORE_DIR"

# Default values
DEFAULT_ALIAS="release-key"
DEFAULT_KEYSTORE="$KEYSTORE_DIR/release.keystore"
DEFAULT_VALIDITY="10000"  # ~27 years

echo ""
echo "📋 Keystore Configuration"
echo "========================"

# Get keystore path
read -p "Keystore path [$DEFAULT_KEYSTORE]: " KEYSTORE_PATH
KEYSTORE_PATH=${KEYSTORE_PATH:-$DEFAULT_KEYSTORE}

# Get key alias
read -p "Key alias [$DEFAULT_ALIAS]: " KEY_ALIAS
KEY_ALIAS=${KEY_ALIAS:-$DEFAULT_ALIAS}

# Get validity period
read -p "Validity (days) [$DEFAULT_VALIDITY]: " VALIDITY
VALIDITY=${VALIDITY:-$DEFAULT_VALIDITY}

echo ""
echo "🔑 Security Information"
echo "======================"

# Get passwords
read -s -p "Keystore password: " KEYSTORE_PASSWORD
echo ""
read -s -p "Key password: " KEY_PASSWORD
echo ""

echo ""
echo "👤 Certificate Information"
echo "=========================="

read -p "Your name: " CERT_NAME
read -p "Organization: " CERT_ORG
read -p "Organization unit: " CERT_OU
read -p "City: " CERT_CITY
read -p "State/Province: " CERT_STATE
read -p "Country code (2 letters): " CERT_COUNTRY

echo ""
echo "🔨 Generating keystore..."

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

echo ""
echo "✅ Keystore generated successfully!"
echo ""

# Create keystore.properties file
PROPERTIES_FILE="android/keystore.properties"
echo "📝 Creating $PROPERTIES_FILE..."

cat > "$PROPERTIES_FILE" << EOF
storePassword=$KEYSTORE_PASSWORD
keyPassword=$KEY_PASSWORD
keyAlias=$KEY_ALIAS
storeFile=keystore/$(basename "$KEYSTORE_PATH")
EOF

echo ""
echo "🔍 Keystore Information:"
echo "========================"
keytool -list -v -keystore "$KEYSTORE_PATH" -storepass "$KEYSTORE_PASSWORD"

echo ""
echo "⚠️  IMPORTANT SECURITY NOTES:"
echo "============================="
echo "1. 🔐 BACKUP your keystore file securely!"
echo "2. 📝 SAVE the passwords in a secure password manager"
echo "3. 🚫 NEVER commit keystore.properties to version control"
echo "4. ✅ Add keystore files to .gitignore"
echo "5. 🔄 Consider using Google Play App Signing"

echo ""
echo "📁 Files created:"
echo "- $KEYSTORE_PATH"
echo "- $PROPERTIES_FILE"

echo ""
echo "🎯 Next steps:"
echo "1. Test signing: cd android && ./gradlew bundleRelease"
echo "2. Upload to Google Play Console"
echo "3. Set up CI/CD with environment variables"

echo ""
echo "🔐 For CI/CD, encode your keystore:"
echo "base64 -w 0 $KEYSTORE_PATH"