import { AbsoluteFill, Img, staticFile } from "remotion";
import { sans } from "./theme";

export type ShotProps = {
  /** File in public/shots, without extension. */
  image: string;
  /** Camera rotation in degrees. */
  rx: number;
  ry: number;
  rz: number;
  /** The side of the screenshot that falls out of focus (the side turned away from the camera). */
  blur: "left" | "right" | "top" | "bottom";
  /** Blur radius at the far edge, px. */
  amount?: number;
  /** How wide the frame is on the canvas, px. */
  width?: number;
  /** How far the frame runs off the bottom of the canvas, px (a negative offset from the bottom). */
  overflow?: number;
  /** Shift the frame sideways, px. */
  x?: number;
};

export const SHOT_W = 2560;
export const SHOT_H = 1600;
const RATIO = 1600 / 1000;

/** Progressive blur: stacked copies of the screenshot, each softer than the last and revealed further along the ramp. */
const LAYERS = 7;

function DepthBlur({ src, side, amount, inner, innerH }: { src: string; side: ShotProps["blur"]; amount: number; inner: number; innerH: number }) {
  const horizontal = side === "left" || side === "right";
  const span = horizontal ? inner : innerH;
  return (
    <>
      {Array.from({ length: LAYERS }, (_, i) => {
        const k = (i + 1) / LAYERS;
        const radius = amount * Math.pow(k, 1.35);
        // Layer k starts to appear a little further along the ramp, and is fully in by the next layer's start.
        const from = 0.3 + (i / LAYERS) * 0.56;
        const to = from + 0.17;
        const mask = `linear-gradient(to ${side}, transparent ${from * 100}%, #000 ${Math.min(to, 1) * 100}%)`;
        // Scale just enough that the blur never pulls transparent edge pixels into the frame.
        const grow = 1 + (radius * 2.6) / span;
        return (
          <Img
            key={i}
            src={src}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", transform: `scale(${grow})`, filter: `blur(${radius}px)`, WebkitMaskImage: mask, maskImage: mask }}
          />
        );
      })}
    </>
  );
}

/**
 * One portfolio still: the screenshot in a light rounded frame (no device bezel), turned a few degrees in 3D as if
 * filmed by a camera, running off the bottom of the canvas. The side turned away from the camera falls out of focus.
 */
export function Shot({ image, rx, ry, rz, blur, amount = 12, width = 2400, overflow = 210, x = 0 }: ShotProps) {
  const pad = 16;
  const inner = width - pad * 2;
  const innerH = inner / RATIO;
  const frameH = innerH + pad * 2;
  const src = staticFile(`shots/${image}.png`);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(120% 100% at 28% 18%, #ffffff 0%, #eff0f2 48%, #e2e5e9 100%)", fontFamily: sans, overflow: "hidden" }}>
      <AbsoluteFill style={{ perspective: 2800, perspectiveOrigin: "50% 60%" }}>
        <div
          style={{
            position: "absolute",
            left: SHOT_W / 2 - width / 2 + x,
            top: SHOT_H + overflow - frameH,
            width,
            padding: pad,
            boxSizing: "border-box",
            borderRadius: 52,
            background: "linear-gradient(160deg, rgba(255,255,255,.95), rgba(244,245,247,.9))",
            boxShadow: "0 90px 130px -60px rgba(34,40,52,.34), 0 28px 50px -24px rgba(34,40,52,.18), inset 0 0 0 1.5px rgba(255,255,255,.95), 0 0 0 1px rgba(34,40,52,.05)",
            transform: `rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)`,
            transformOrigin: "50% 100%",
          }}
        >
          <div style={{ position: "relative", width: inner, height: innerH, borderRadius: 38, overflow: "hidden", boxShadow: "inset 0 0 0 1px rgba(34,40,52,.07)" }}>
            <Img src={src} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }} />
            <DepthBlur src={src} side={blur} amount={amount} inner={inner} innerH={innerH} />
            {/* A faint sheen across the glass */}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(115deg, rgba(255,255,255,.14) 0%, rgba(255,255,255,0) 30%)", pointerEvents: "none" }} />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
