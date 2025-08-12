// Script to create placeholder icon files
import fs from 'fs';
import path from 'path';

// Ensure the assets directory exists
const assetsDir = path.join(__dirname, '../public/assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
  console.log('Created assets directory');
}

// Create a simple SVG icon as a placeholder
function createPlaceholderSVG(size, text) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="100%" height="100%" fill="#1F2937"/>
  <text x="50%" y="50%" font-family="Arial" font-size="${size/4}" fill="#F9FAFB" text-anchor="middle" dominant-baseline="middle">${text}</text>
</svg>`;
}

// Convert SVG to PNG using canvas (in a browser environment)
// For this script, we'll just save the SVG as a placeholder
function saveSVGFile(svg, filePath) {
  try {
    fs.writeFileSync(filePath, svg);
    console.log(`Created ${filePath}`);
    return true;
  } catch (error) {
    console.error(`Error creating ${filePath}:`, error);
    return false;
  }
}

// Icon file paths
const icon192Path = path.join(assetsDir, 'icon-192.svg');
const icon512Path = path.join(assetsDir, 'icon-512.svg');

// Create placeholder SVGs
const svg192 = createPlaceholderSVG(192, '192');
const svg512 = createPlaceholderSVG(512, '512');

// Save the SVGs
saveSVGFile(svg192, icon192Path);
saveSVGFile(svg512, icon512Path);

console.log('\nPlaceholder icons created successfully!');
console.log('Note: These are SVG placeholders. For production, replace with actual PNG files.');
console.log('You can convert these SVGs to PNGs using online tools or image editing software.');