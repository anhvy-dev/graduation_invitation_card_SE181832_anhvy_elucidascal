import sharp from 'sharp';

async function extractCap() {
  const image = sharp('assets/pngtree-graduation-cap.jpg');
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;

  // RGBA buffer for output
  const outData = Buffer.alloc(width * height * 4);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const inIdx = (y * width + x) * 3;
      const outIdx = (y * width + x) * 4;

      const r = data[inIdx];
      const g = data[inIdx + 1];
      const b = data[inIdx + 2];

      // If outside the cap region, fully transparent
      if (x < 42 || x > 318 || y < 102 || y > 258) {
        outData[outIdx] = 0;
        outData[outIdx + 1] = 0;
        outData[outIdx + 2] = 0;
        outData[outIdx + 3] = 0;
        continue;
      }

      // Check whether it is background (checkerboard is either #ffffff or #eeeeee)
      // Checkerboard pixels have low saturation and high brightness (r,g,b all > 220, and max-min < 15)
      const maxVal = Math.max(r, g, b);
      const minVal = Math.min(r, g, b);
      const spread = maxVal - minVal;

      const isBgSquare = (minVal > 215 && spread < 16);

      if (isBgSquare) {
        outData[outIdx] = 0;
        outData[outIdx + 1] = 0;
        outData[outIdx + 2] = 0;
        outData[outIdx + 3] = 0;
        continue;
      }

      // Check for anti-aliasing near edges
      // If it's neutral greyish with high brightness, it might be an edge pixel
      if (spread < 20 && minVal > 160) {
        // Linear fade for edge anti-aliasing
        // minVal 220 -> alpha 0, minVal 160 -> alpha 255
        const alpha = Math.max(0, Math.min(255, Math.round(255 * (220 - minVal) / 60)));
        outData[outIdx] = r;
        outData[outIdx + 1] = g;
        outData[outIdx + 2] = b;
        outData[outIdx + 3] = alpha;
        continue;
      }

      // Cap or tassel pixel: fully opaque
      outData[outIdx] = r;
      outData[outIdx + 1] = g;
      outData[outIdx + 2] = b;
      outData[outIdx + 3] = 255;
    }
  }

  // Save full-res extracted PNG
  await sharp(outData, { raw: { width, height, channels: 4 } })
    .png()
    .toFile('scripts/cap-extracted.png');

  console.log('Saved scripts/cap-extracted.png');
}

extractCap().catch(console.error);
