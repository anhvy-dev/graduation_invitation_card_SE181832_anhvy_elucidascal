import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function generate() {
  const input = sharp('scripts/cap-extracted.png');
  const { data, info } = await input.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  // Find exact bounding box of non-transparent pixels
  let minX = width, maxX = 0, minY = height, maxY = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const alpha = data[(y * width + x) * channels + 3];
      if (alpha > 20) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  console.log(`Cap bounds: x=[${minX}, ${maxX}] (w=${maxX - minX + 1}), y=[${minY}, ${maxY}] (h=${maxY - minY + 1})`);

  const capWidth = maxX - minX + 1;
  const capHeight = maxY - minY + 1;

  // Extract just the cap
  const capBuffer = await sharp('scripts/cap-extracted.png')
    .extract({ left: minX, top: minY, width: capWidth, height: capHeight })
    .toBuffer();

  // Create a square canvas where the cap occupies ~92% width so it's large and recognizable at 16x16 & 32x32
  const squareSize = Math.round(capWidth / 0.92);
  const leftPad = Math.round((squareSize - capWidth) / 2);
  const topPad = Math.round((squareSize - capHeight) / 2);

  console.log(`Square canvas: ${squareSize}x${squareSize}, leftPad: ${leftPad}, topPad: ${topPad}`);

  const masterSquare = await sharp({
    create: {
      width: squareSize,
      height: squareSize,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  })
    .composite([{ input: capBuffer, left: leftPad, top: topPad }])
    .png()
    .toBuffer();

  // Ensure public directory exists
  const publicDir = 'public';
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Generate standard PNG sizes
  const sizes = [16, 32, 48, 64, 180, 192, 512];
  const pngBuffers = {};

  for (const s of sizes) {
    const buf = await sharp(masterSquare)
      .resize(s, s, { kernel: sharp.kernel.lanczos3 })
      .png()
      .toBuffer();
    pngBuffers[s] = buf;
  }

  fs.writeFileSync(path.join(publicDir, 'favicon-16x16.png'), pngBuffers[16]);
  fs.writeFileSync(path.join(publicDir, 'favicon-32x32.png'), pngBuffers[32]);
  fs.writeFileSync(path.join(publicDir, 'favicon.png'), pngBuffers[32]);
  fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), pngBuffers[180]);
  fs.writeFileSync(path.join(publicDir, 'android-chrome-192x192.png'), pngBuffers[192]);
  fs.writeFileSync(path.join(publicDir, 'android-chrome-512x512.png'), pngBuffers[512]);

  // Also build a valid multi-image ICO file containing 16x16, 32x32, 48x48
  const icoSizes = [16, 32, 48];
  const numImages = icoSizes.length;
  const headerLen = 6;
  const dirEntryLen = 16;
  let offset = headerLen + numImages * dirEntryLen;

  const entries = [];
  const imageBuffers = [];

  for (const s of icoSizes) {
    const buf = pngBuffers[s];
    imageBuffers.push(buf);

    const entry = Buffer.alloc(dirEntryLen);
    entry.writeUInt8(s === 256 ? 0 : s, 0); // Width
    entry.writeUInt8(s === 256 ? 0 : s, 1); // Height
    entry.writeUInt8(0, 2); // Color palette
    entry.writeUInt8(0, 3); // Reserved
    entry.writeUInt16LE(1, 4); // Color planes
    entry.writeUInt16LE(32, 6); // Bits per pixel
    entry.writeUInt32LE(buf.length, 8); // Size of image data
    entry.writeUInt32LE(offset, 12); // Offset to image data

    entries.push(entry);
    offset += buf.length;
  }

  const icoHeader = Buffer.alloc(headerLen);
  icoHeader.writeUInt16LE(0, 0); // Reserved
  icoHeader.writeUInt16LE(1, 2); // Image type (1 = icon)
  icoHeader.writeUInt16LE(numImages, 4); // Number of images

  const icoBuffer = Buffer.concat([icoHeader, ...entries, ...imageBuffers]);
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);

  console.log('Successfully generated all favicons:');
  console.log('- public/favicon.ico');
  console.log('- public/favicon-16x16.png');
  console.log('- public/favicon-32x32.png');
  console.log('- public/favicon.png');
  console.log('- public/apple-touch-icon.png');
  console.log('- public/android-chrome-192x192.png');
  console.log('- public/android-chrome-512x512.png');
}

generate().catch(console.error);
