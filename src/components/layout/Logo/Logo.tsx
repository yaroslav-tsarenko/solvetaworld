/**
 * Solvetaworld wordmark — "Bold Utility".
 *
 * Typographic only: SOLVETA set in Barlow Condensed ExtraBold, followed by
 * WORLD reversed out of a solid block. `tone` picks the colourway for the
 * ground it sits on (yellow/white header vs ink footer). textLength pins the
 * geometry so the mark never reflows while the web font loads.
 */
export function Logo({
  tone = "light",
  height = 32,
  className,
}: {
  /** "light" = on yellow or white ground; "dark" = on ink ground */
  tone?: "light" | "dark";
  height?: number;
  className?: string;
}) {
  const word = tone === "dark" ? "#FFFFFF" : "#111111";
  const block = tone === "dark" ? "#FFD21F" : "#111111";
  const blockText = tone === "dark" ? "#111111" : "#FFD21F";
  const width = Math.round((height * 229) / 40);

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 229 40"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Solvetaworld"
      className={className}
    >
      <text
        x="0"
        y="33"
        textLength="116"
        lengthAdjust="spacingAndGlyphs"
        fill={word}
        style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 37 }}
      >
        SOLVETA
      </text>
      <rect x="121" y="0" width="108" height="40" fill={block} />
      <text
        x="127"
        y="33"
        textLength="96"
        lengthAdjust="spacingAndGlyphs"
        fill={blockText}
        style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 37 }}
      >
        WORLD
      </text>
    </svg>
  );
}

/** Square monogram used for favicons and very tight spaces. */
export function LogoMonogram({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect width="32" height="32" fill="#FFD21F" />
      <path d="M7 5h18v5H12v3.5h13V27H7v-5h13v-3.5H7z" fill="#111111" />
    </svg>
  );
}
