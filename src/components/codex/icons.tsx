import type { SVGProps } from "react";

/**
 * Lung icon — clearly recognizable pair of lungs with trachea & bronchi.
 * Designed at 24x24, stroke-based to match Lucide style.
 */
export function LungIcon({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Trachea */}
      <path d="M12 3v6" />
      {/* Bronchi splitting into each lung */}
      <path d="M12 9c0 1.5 -1.2 2.5 -3 3" />
      <path d="M12 9c0 1.5 1.2 2.5 3 3" />
      {/* Left lung body */}
      <path d="M9 12c-2 1 -3.5 3 -4 5.5c-.4 2 .6 3.5 2.2 3.5c1.6 0 3.3 -1.2 3.8 -3c.5 -1.8 .5 -4 0 -6Z" />
      {/* Right lung body (mirror) */}
      <path d="M15 12c2 1 3.5 3 4 5.5c.4 2 -.6 3.5 -2.2 3.5c-1.6 0 -3.3 -1.2 -3.8 -3c-.5 -1.8 -.5 -4 0 -6Z" />
    </svg>
  );
}

/**
 * Running stick figure — head, torso, two arms (one forward, one back),
 * two legs (one forward bent, one extended back). Reads clearly at 18-24px.
 */
export function RunningManIcon({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Head */}
      <circle cx="14" cy="4" r="2" />
      {/* Torso (leaning forward) */}
      <path d="M13.5 7l-2 5" />
      {/* Front arm (punching forward / up) */}
      <path d="M13 8l4 -2" />
      {/* Back arm (swung back) */}
      <path d="M13 8l-4 3" />
      {/* Hip / pelvis point */}
      {/* Front leg (knee up, foot forward) */}
      <path d="M11.5 12l3 3l-1 5" />
      {/* Back leg (extended pushing off) */}
      <path d="M11.5 12l-3.5 4l-3 0" />
    </svg>
  );
}
