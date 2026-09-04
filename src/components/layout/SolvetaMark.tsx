/**
 * The Solvetaworld mark.
 *
 * A globe reduced to what survives at 16px: one heavy ring, a meridian and an
 * equator at lower weight for texture, and a single mint node sitting on the
 * ring where the lines would meet. The node is the family resemblance to the
 * other Solveta properties; the ring is what makes this one "world".
 *
 * `gradientId` exists because two of these can share a page (header and mobile
 * drawer) and duplicate SVG gradient ids resolve to whichever came first.
 */
export function SolvetaMark({
  size = 28,
  gradientId = "solvetaMark",
}: {
  size?: number;
  gradientId?: string;
}) {
  const bg = `${gradientId}-bg`;
  const node = `${gradientId}-node`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={bg} x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0E8A5A" />
          <stop offset="100%" stopColor="#07452D" />
        </linearGradient>
        <linearGradient id={node} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3ED598" />
          <stop offset="100%" stopColor="#4FDCA3" />
        </linearGradient>
      </defs>

      <rect width="40" height="40" rx="10" fill={`url(#${bg})`} />
      <rect
        x="1"
        y="1"
        width="38"
        height="38"
        rx="9"
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="1"
      />

      <circle cx="19" cy="20" r="9.5" fill="none" stroke="#FFFFFF" strokeWidth="2.7" />
      <ellipse
        cx="19"
        cy="20"
        rx="4"
        ry="9.5"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="1.7"
        strokeOpacity="0.7"
      />
      <path d="M9.5 20 H28.5" stroke="#FFFFFF" strokeWidth="1.7" strokeOpacity="0.7" />

      <circle cx="25.7" cy="13.3" r="4.6" fill="#3ED598" fillOpacity="0.22" />
      <circle cx="25.7" cy="13.3" r="2.7" fill={`url(#${node})`} />
    </svg>
  );
}
