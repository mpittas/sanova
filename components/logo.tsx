import { palette } from "@/lib/tokens";

export function LogoMark({ size = 44 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden>
      <rect x="16" y="2" width="16" height="44" rx="6" fill={palette.primary[500]} />
      <rect x="2" y="16" width="44" height="16" rx="6" fill={palette.primary[500]} />
      <circle cx="24" cy="24" r="8.5" fill={palette.teal[400]} stroke="#fff" strokeWidth="3" />
    </svg>
  );
}
