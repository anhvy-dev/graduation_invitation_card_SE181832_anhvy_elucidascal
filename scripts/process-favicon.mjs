import sharp from 'sharp';
import fs from 'fs';

async function main() {
  const inputPath = 'assets/pngtree-graduation-cap.jpg';
  const image = sharp(inputPath);
  const metadata = await image.metadata();
  console.log('Metadata:', metadata);

  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  console.log(`Dimensions: ${width}x${height}, channels: ${channels}`);

  // Sample corner pixel (top-left) to see checkerboard colors
  const corners = [
    { name: 'top-left (0,0)', idx: 0 },
    { name: 'top-right (w-1, 0)', idx: (width - 1) * channels },
    { name: 'bottom-left (0, h-1)', idx: (height - 1) * width * channels },
  ];
  for (const c of corners) {
    const r = data[c.idx];
    const g = data[c.idx + 1];
    const b = data[c.idx + 2];
    console.log(`${c.name}: rgb(${r}, ${g}, ${b})`);
  }

  // Find non-checkerboard pixels (the cap and tassel)
  // Let's analyze pixel colors across the image.
  // Checkerboard squares in pngtree are typically white (~255,255,255) and light grey (~238,238,238 or ~240,240,240).
  // Also pngtree watermark at the bottom might exist. Let's check!
}

main().catch(console.error);
