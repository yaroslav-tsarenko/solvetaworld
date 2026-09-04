import sharp from "sharp";
import { writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, "..", "public");

const svg = `<svg width="512" height="512" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="favBg" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#0E8A5A"/>
      <stop offset="100%" stop-color="#07452D"/>
    </linearGradient>
  </defs>
  <rect width="40" height="40" rx="10" fill="url(#favBg)"/>
  <circle cx="19" cy="20" r="9.5" fill="none" stroke="#FFFFFF" stroke-width="2.7"/>
  <ellipse cx="19" cy="20" rx="4" ry="9.5" fill="none" stroke="#FFFFFF" stroke-width="1.7" stroke-opacity="0.7"/>
  <path d="M9.5 20 H28.5" stroke="#FFFFFF" stroke-width="1.7" stroke-opacity="0.7"/>
  <circle cx="25.7" cy="13.3" r="4.6" fill="#3ED598" fill-opacity="0.22"/>
  <circle cx="25.7" cy="13.3" r="2.7" fill="#3ED598"/>
</svg>`;

// Slightly optimized bitmap version for very small icon sizes — thicker strokes
const svgSmall = `<svg width="64" height="64" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="favBgS" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#0E8A5A"/>
      <stop offset="100%" stop-color="#07452D"/>
    </linearGradient>
  </defs>
  <rect width="40" height="40" rx="8" fill="url(#favBgS)"/>
  <circle cx="19" cy="20.5" r="10" fill="none" stroke="#FFFFFF" stroke-width="4"/>
  <circle cx="27.1" cy="13.4" r="4" fill="#3ED598" stroke="#07452D" stroke-width="2"/>
</svg>`;

const targets = [
  { size: 16,  name: "favicon-16x16.png",         source: svgSmall },
  { size: 32,  name: "favicon-32x32.png",         source: svgSmall },
  { size: 180, name: "apple-touch-icon.png",      source: svg },
  { size: 192, name: "android-chrome-192x192.png", source: svg },
  { size: 512, name: "android-chrome-512x512.png", source: svg },
];

for (const { size, name, source } of targets) {
  const buf = await sharp(Buffer.from(source))
    .resize(size, size)
    .png()
    .toBuffer();
  await writeFile(join(publicDir, name), buf);
  console.log("Generated", name);
}

// favicon.ico — 32x32 PNG (browsers accept PNG referenced via link tag)
const ico32 = await sharp(Buffer.from(svgSmall)).resize(32, 32).png().toBuffer();
await writeFile(join(publicDir, "favicon.ico"), ico32);
console.log("Generated favicon.ico (32x32 PNG)");
