// Script to create icon files from base64 strings
const fs = require('fs');
const path = require('path');

// Ensure the assets directory exists
const assetsDir = path.join(__dirname, '../public/assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
  console.log('Created assets directory');
}

// Function to save base64 string as file
function saveBase64AsFile(base64String, filePath) {
  // Remove data URL prefix if present
  const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
  
  try {
    // Write the file
    fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));
    console.log(`Created ${filePath}`);
    return true;
  } catch (error) {
    console.error(`Error creating ${filePath}:`, error);
    return false;
  }
}

// Instructions for the user
console.log('=== Icon Upload Instructions ===');
console.log('1. Replace the BASE64_STRING_HERE placeholders below with your base64-encoded icon data');
console.log('2. Run this script with: node scripts/upload-icons.js');
console.log('3. Your icons will be saved to the public/assets directory');
console.log('\nExample of base64 string format: data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...');

// Icon file paths
const icon192Path = path.join(assetsDir, 'icon-192.png');
const icon512Path = path.join(assetsDir, 'icon-512.png');

// Placeholder for user to replace with actual base64 data
const icon192Base64 = 'BASE64_STRING_HERE'; // Replace with your 192x192 icon base64
const icon512Base64 = 'BASE64_STRING_HERE'; // Replace with your 512x512 icon base64

// Only try to save if the placeholders have been replaced
if (icon192Base64 !== 'BASE64_STRING_HERE') {
  saveBase64AsFile(icon192Base64, icon192Path);
} else {
  console.log('\nPlease edit this script to add your base64-encoded 192x192 icon data');
}

if (icon512Base64 !== 'BASE64_STRING_HERE') {
  saveBase64AsFile(icon512Base64, icon512Path);
} else {
  console.log('Please edit this script to add your base64-encoded 512x512 icon data');
}