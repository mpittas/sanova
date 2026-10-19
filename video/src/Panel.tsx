import { createContext, useContext, type CSSProperties, type ReactNode } from "react";
import { useCurrentFrame } from "./time";
import type { Box } from "./layout";
import { clamp01, prog } from "./utils";

/** Where the camera is looking in world coordinates, for the depth-of-field blur. */
export const Focus = createContext({ x: 0, y: 0 });

/** How far out of focus a point of the world is, 0 (sharp) to 1. */
export function defocus(fx: number, fy: number, cx: number, cy: number) {
  const d = Math.hypot((cx - fx) * 0.9, (cy - fy) * 1.2);
  return Math.pow(clamp01((d - 640) / 520), 1.15);
}

type PanelProps = {
  box: Box;
  /** Frame the panel starts to appear. */
  at: number;
  /** Depth offset in px, for a little parallax. */
  z?: number;
  card?: boolean;
  radius?: number;
  style?: CSSProperties;
  children: ReactNode;
};

/** A panel floating in the world: eases in out of blur, and softens when the camera looks elsewhere. */
export function Panel({ box, at, z = 0, card = true, radius = 28, style, children }: PanelProps) {
  const frame = useCurrentFrame();
  const { x: fx, y: fy } = useContext(Focus);
  const p = prog(frame, at, 34);
  void fx;
  void fy;
  const out = 0; // depth blur now comes from one edge of the frame only (see Dashboard)
  const blur = out * 4.2 + (1 - p) * 12;
  return (
    <div
      style={{
        position: "absolute",
        left: box.x,
        top: box.y,
        width: box.w,
        height: box.h,
        borderRadius: radius,
        background: card ? "rgba(255,255,255,0.94)" : "transparent",
        boxShadow: card ? "0 40px 70px -40px rgba(20,24,30,0.26), 0 3px 10px rgba(20,24,30,0.05), inset 0 0 0 1px rgba(255,255,255,0.9)" : undefined,
        opacity: p * (1 - out * 0.12),
        filter: `blur(${blur}px)`,
        transform: `translateZ(${z - (1 - p) * 220}px) translateY(${(1 - p) * 36}px) scale(${0.965 + 0.035 * p})`,
        willChange: "transform, filter",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
