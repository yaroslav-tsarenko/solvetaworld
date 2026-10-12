const PLACEHOLDER_BASE = "https://placehold.co";

/* Placeholder art follows the "Bold Utility" palette: ink, safety yellow and
 * concrete grounds. The swatch is picked by hashing the product name, so two
 * neighbouring cards rarely share the same image. */
const PLACEHOLDER_SWATCHES = [
  "111111/FFD21F",
  "FFD21F/111111",
  "F4F4F2/111111",
  "E9E9E5/111111",
  "2A2A2A/FFFFFF",
];

function swatchFor(name: string): string {
  let h = 0;
  for (let i = 0; i < name.length; i++) {
    h = (h * 31 + name.charCodeAt(i)) >>> 0;
  }
  return PLACEHOLDER_SWATCHES[h % PLACEHOLDER_SWATCHES.length];
}

export function getProductImage(
  imageUrl: string | null | undefined,
  productName?: string,
  size = "400x400"
): string {
  if (imageUrl && (imageUrl.startsWith("http") || imageUrl.startsWith("/"))) {
    return imageUrl;
  }

  const name = productName || "Product";
  const label = encodeURIComponent(name.slice(0, 20));
  return `${PLACEHOLDER_BASE}/${size}/${swatchFor(name)}?text=${label}`;
}

export function getProductImageFallback(size = "400x400"): string {
  return `${PLACEHOLDER_BASE}/${size}/F4F4F2/55554F?text=No+Image`;
}
