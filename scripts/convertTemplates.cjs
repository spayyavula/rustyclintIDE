const fs = require('fs');
const path = require('path');

const jsxPath = path.join(__dirname, '../src/data/templates.jsx');
const tsPath = path.join(__dirname, '../src/data/templates.ts');

const jsxContent = fs.readFileSync(jsxPath, 'utf-8');

// Match export const templates = [ ... ];
const match = jsxContent.match(/export\s+const\s+templates\s*=\s*\[((?:.|\n)*?)\]\s*;/);
if (!match) {
  console.error('Could not find templates array in templates.jsx');
  process.exit(1);
}

let templatesArray = match[1];

// Remove trailing commas before } or ]
templatesArray = templatesArray.replace(/,(\s*[}\]])/g, '$1');

// Remove JSX imports if present (e.g., import { Smartphone } from 'lucide-react';)
templatesArray = templatesArray.replace(/([A-Za-z0-9_]+),?/g, (m, p1) => {
  // Replace icon: Smartphone, with icon: 'Smartphone',
  if (/icon:\s*[A-Za-z0-9_]+/.test(m)) {
    return m.replace(/icon:\s*([A-Za-z0-9_]+)/, "icon: '$1'");
  }
  return m;
});

// Compose the new TEMPLATES array
const tsTemplates = `export const TEMPLATES = [${templatesArray.trim()}];\n`;

// Read the current templates.ts
let tsContent = fs.readFileSync(tsPath, 'utf-8');

// Replace the old TEMPLATES array with the new one
if (tsContent.includes('export const TEMPLATES = [')) {
  tsContent = tsContent.replace(
    /export const TEMPLATES = \[((?:.|\n)*?)\];/m,
    tsTemplates.trim()
  );
} else {
  // If not found, append at the end
  tsContent += '\n' + tsTemplates;
}

fs.writeFileSync(tsPath, tsContent, 'utf-8');
console.log('Templates have been updated in templates.ts');