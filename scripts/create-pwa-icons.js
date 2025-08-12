// Script to create PWA icon files
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

// Icon file paths
const icon192Path = path.join(assetsDir, 'icon-192.png');
const icon512Path = path.join(assetsDir, 'icon-512.png');

// Base64 data for the icons (from the file_changes)
const icon192Base64 = fs.readFileSync(path.join(__dirname, '../public/assets/icon-192.png'), 'base64');
const icon512Base64 = fs.readFileSync(path.join(__dirname, '../public/assets/icon-512.png'), 'base64');

// Save the icons
saveBase64AsFile(`data:image/png;base64,${icon192Base64}`, icon192Path);
saveBase64AsFile(`data:image/png;base64,${icon512Base64}`, icon512Path);

console.log('PWA icons created successfully!');