const fs = require('fs');
const path = require('path');

// Simple script to generate placeholder PNG icons (1x1 transparent pixel)
// For production, replace with actual app icons
// Usage: node scripts/generate-icons.js

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Minimal 1x1 transparent PNG
const transparentPNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
  'base64'
);

const iconsDir = path.join(__dirname, '..', 'public');

if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

sizes.forEach(size => {
  const filename = `icon-${size}x${size}.png`;
  const filepath = path.join(iconsDir, filename);
  fs.writeFileSync(filepath, transparentPNG);
  console.log(`Created ${filename}`);
});

console.log('\nNOTE: These are placeholder 1x1 transparent icons.');
console.log('Replace with actual app icons for production.\n');
