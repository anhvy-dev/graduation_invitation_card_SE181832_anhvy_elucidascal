import sharp from 'sharp';

async function analyze() {
  const image = sharp('assets/pngtree-graduation-cap.jpg');
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  let minCapX = width, maxCapX = 0, minCapY = height, maxCapY = 0;
  let capPixels = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * channels;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];

      // Check if pixel is part of cap:
      // Cap is either dark (black/grey) OR golden yellow (tassel)
      const maxVal = Math.max(r, g, b);
      const minVal = Math.min(r, g, b);
      const isDark = maxVal < 140; // cap fabric
      const isGold = (r > 160 && g > 110 && b < 80); // tassel

      if (isDark || isGold) {
        capPixels++;
        if (x < minCapX) minCapX = x;
        if (x > maxCapX) maxCapX = x;
        if (y < minCapY) minCapY = y;
        if (y > maxCapY) maxCapY = y;
      }
    }
  }

  console.log(`Cap pixels: ${capPixels}`);
  console.log(`Bounding box: x: [${minCapX}, ${maxCapX}] (width: ${maxCapX - minCapX + 1}), y: [${minCapY}, ${maxCapY}] (height: ${maxCapY - minCapY + 1})`);
}

analyze().catch(console.error);
