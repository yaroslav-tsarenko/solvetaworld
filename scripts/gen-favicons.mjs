/**
 * Regenerates every favicon / app icon from the "Bold Utility" monogram:
 * a blocky ink "S" on a safety-yellow square, hard corners.
 *
 *   node scripts/gen-favicons.mjs
 */
import sharp from "sharp";
import { writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const publicDir = join(root, "public");

const YELLOW = "#FFD21F";
const INK = "#111111";

// 32-unit grid. Square ground, stencil-like S built from straight runs.
const S_PATH = "M7 5h18v5H12v3.5h13V27H7v-5h13v-3.5H7z";

const monogram = (size) => `<svg width="${size}" height="${size}" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <rect width="32" height="32" fill="${YELLOW}"/>
  <path d="${S_PATH}" fill="${INK}"/>
</svg>
`;

// Maskable variant: same mark inset into the safe zone on a full yellow ground.
const maskable = (size) => `<svg width="${size}" height="${size}" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <rect width="32" height="32" fill="${YELLOW}"/>
  <g transform="translate(5.6 5.6) scale(0.65)"><path d="${S_PATH}" fill="${INK}"/></g>
</svg>
`;

// Typographic wordmark for places that load the logo as a file (emails, feeds).
const wordmark = (dark) => `<svg width="229" height="40" viewBox="0 0 229 40" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Solvetaworld">
  <text x="0" y="33" textLength="116" lengthAdjust="spacingAndGlyphs" font-family="'Barlow Condensed', 'Arial Narrow', Arial, sans-serif" font-weight="800" font-size="37" fill="${dark ? "#FFFFFF" : INK}">SOLVETA</text>
  <rect x="121" y="0" width="108" height="40" fill="${dark ? YELLOW : INK}"/>
  <text x="127" y="33" textLength="96" lengthAdjust="spacingAndGlyphs" font-family="'Barlow Condensed', 'Arial Narrow', Arial, sans-serif" font-weight="800" font-size="37" fill="${dark ? INK : YELLOW}">WORLD</text>
</svg>
`;

await writeFile(join(publicDir, "favicon.svg"), monogram(32));
await writeFile(join(root, "src", "app", "icon.svg"), monogram(32));
await writeFile(join(publicDir, "logo.svg"), wordmark(false));
await writeFile(join(publicDir, "logo-dark.svg"), wordmark(true));
console.log("Wrote favicon.svg, src/app/icon.svg, logo.svg, logo-dark.svg");

const targets = [
  { size: 16, name: "favicon-16x16.png", source: monogram },
  { size: 32, name: "favicon-32x32.png", source: monogram },
  { size: 180, name: "apple-touch-icon.png", source: monogram },
  { size: 192, name: "android-chrome-192x192.png", source: maskable },
  { size: 512, name: "android-chrome-512x512.png", source: maskable },
];

for (const { size, name, source } of targets) {
  const buf = await sharp(Buffer.from(source(size))).resize(size, size).png().toBuffer();
  await writeFile(join(publicDir, name), buf);
  console.log("Generated", name);
}

// favicon.ico — a real ICO container holding PNG-encoded 16, 32 and 48px images.
const icoSizes = [16, 32, 48];
const pngs = await Promise.all(
  icoSizes.map((s) => sharp(Buffer.from(monogram(s))).resize(s, s).png().toBuffer()),
);
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(icoSizes.length, 4);
let offset = 6 + 16 * icoSizes.length;
const entries = icoSizes.map((s, i) => {
  const e = Buffer.alloc(16);
  e.writeUInt8(s, 0);
  e.writeUInt8(s, 1);
  e.writeUInt8(0, 2);
  e.writeUInt8(0, 3);
  e.writeUInt16LE(1, 4);
  e.writeUInt16LE(32, 6);
  e.writeUInt32LE(pngs[i].length, 8);
  e.writeUInt32LE(offset, 12);
  offset += pngs[i].length;
  return e;
});
await writeFile(join(publicDir, "favicon.ico"), Buffer.concat([header, ...entries, ...pngs]));
console.log("Generated favicon.ico (16/32/48)");
