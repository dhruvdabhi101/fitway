const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconDir = path.join(__dirname, '../public/icons');

// Create SVG icon
const svgIcon = `
<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="0" fill="#059669"/>
  <path d="M270 128V80L140 213H236V299L366 166H270V128Z" fill="white" stroke="white" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M242 384V432L372 299H276V213L146 346H242V384Z" fill="white" stroke="white" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

const maskableSvg = `
<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#059669"/>
  <path d="M280 148V100L150 233H246V319L376 186H280V148Z" fill="white" stroke="white" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M232 364V412L362 279H266V193L136 326H232V364Z" fill="white" stroke="white" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

if (!fs.existsSync(iconDir)) {
  fs.mkdirSync(iconDir, { recursive: true });
}

async function generateIcons() {
  for (const size of sizes) {
    await sharp(Buffer.from(svgIcon))
      .resize(size, size)
      .png()
      .toFile(path.join(iconDir, `icon-${size}.png`));
    console.log(`Generated icon-${size}.png`);
  }

  // Generate maskable icons (192 and 512)
  for (const size of [192, 512]) {
    await sharp(Buffer.from(maskableSvg))
      .resize(size, size)
      .png()
      .toFile(path.join(iconDir, `icon-maskable-${size}.png`));
    console.log(`Generated icon-maskable-${size}.png`);
  }

  console.log('All icons generated!');
}

generateIcons().catch(console.error);
