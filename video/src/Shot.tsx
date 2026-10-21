import { AbsoluteFill, Img, staticFile } from "remotion";
import { sans } from "./theme";

export type ShotProps = {
  /** File in public/shots, without extension. */
  image: string;
  /** Camera rotation in degrees. Keep these small: a slight tilt, not a poster. */
  rx: number;
  ry: number;
  rz: number;
  /** The edge of the frame that falls out of focus (the side turned away from the camera). */
  blur: "left" | "right" | "top" | "bottom";
  /** Blur radius at the far edge, px. */
  amount?: number;
  /** How wide the frame is on the canvas, px. */
  width?: number;
  /** Gap above the frame, px. The frame is tall enough that its bottom runs off the canvas. */
  top?: number;
  /** Shift the frame sideways, px. */
  x?: number;
};

export const SHOT_W = 2560;
export const SHOT_H = 1440;
const RATIO = 1600 / 1000;
const PAD = 16;

/** The light rounded frame with the screenshot in it. Blurred copies of this whole element give the depth of field. */
function Frame({ src, width, innerH }: { src: string; width: number; innerH: number }) {
  return (
    <div
      style={{
        width,
        padding: PAD,
        boxSizing: "border-box",
        borderRadius: 52,
        background: "linear-gradient(160deg, #d9dce1, #cfd2d8)",
        
      }}
    >
      <div style={{ position: "relative", width: width - PAD * 2, height: innerH, borderRadius: 38, overflow: "hidden", boxShadow: "inset 0 0 0 1px rgba(34,40,52,.04)" }}>
        <Img src={src} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(115deg, rgba(255,255,255,.12) 0%, rgba(255,255,255,0) 30%)", pointerEvents: "none" }} />
      </div>
    </div>
  );
}

/** Progressive blur on the whole frame: stacked copies, each softer than the last and revealed further along the ramp. */
const LAYERS = 8;

/** The sharp frame fades out over the outermost strip, so no crisp border line survives; blurred copies cover that strip. */
const SHARP_MASK = "linear-gradient(to right, transparent 0, #000 46px, #000 calc(100% - 46px), transparent 100%), linear-gradient(to bottom, transparent 0, #000 46px, #000 calc(100% - 46px), transparent 100%)";

/** Two thin blurred rims around the frame: a wide faint one and a narrow stronger one. */
const EDGES = [
  { radius: 1.6, band: 110 },
  { radius: 3.2, band: 40 },
];

/**
 * One portfolio still: a light rounded frame (no device bezel) turned a few degrees in 3D, with only a faint shadow,
 * running off the bottom of the canvas. The side turned away from the camera, border and all, falls out of focus.
 */
export function Shot({ image, rx, ry, rz, blur, amount = 3.5, width = 2500, top = 64, x = 0 }: ShotProps) {
  const innerH = (width - PAD * 2) / RATIO;
  const frameH = innerH + PAD * 2;
  const src = staticFile(`shots/${image}.png`);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(120% 100% at 28% 18%, #ffffff 0%, #f1f2f4 52%, #e6e8ec 100%)", fontFamily: sans, overflow: "hidden" }}>
      {/* A faint dot grid across the background */}
      <AbsoluteFill style={{ backgroundImage: "radial-gradient(circle, rgba(34,40,52,.24) 1.8px, transparent 2.3px)", backgroundSize: "36px 36px", backgroundPosition: "18px 18px", opacity: 0.8, WebkitMaskImage: "radial-gradient(120% 100% at 50% 0%, #000 0%, rgba(0,0,0,.55) 70%, rgba(0,0,0,.25) 100%)", maskImage: "radial-gradient(120% 100% at 50% 0%, #000 0%, rgba(0,0,0,.55) 70%, rgba(0,0,0,.25) 100%)" }}/>
      <AbsoluteFill style={{ perspective: 3200, perspectiveOrigin: "50% 60%" }}>
        <div
          style={{
            position: "absolute",
            left: SHOT_W / 2 - width / 2 + x,
            top,
            width,
            height: frameH,
            transform: `rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)`,
            transformOrigin: "50% 100%",
          }}
        >
          {/* A single, light shadow under the sharp frame */}
          <div style={{ position: "absolute", inset: 0, borderRadius: 52, boxShadow: "0 36px 60px -42px rgba(34,40,52,.16), 0 8px 20px -14px rgba(34,40,52,.07)" }} />
          <div style={{ position: "absolute", inset: 0, WebkitMaskImage: SHARP_MASK, maskImage: SHARP_MASK, WebkitMaskComposite: "source-in", maskComposite: "intersect" }}>
            <Frame src={src} width={width} innerH={innerH} />
          </div>
          {amount > 0 && Array.from({ length: LAYERS }, (_, i) => {
            const k = (i + 1) / LAYERS;
            const radius = amount * Math.pow(k, 1.3);
            const from = 0.42 + (i / LAYERS) * 0.46;
            const mask = `linear-gradient(to ${blur}, transparent ${from * 100}%, #000 ${Math.min(from + 0.17, 1) * 100}%)`;
            return (
              <div key={i} style={{ position: "absolute", inset: 0, filter: `blur(${radius}px)`, WebkitMaskImage: mask, maskImage: mask }}>
                <Frame src={src} width={width} innerH={innerH} />
              </div>
            );
          })}
          {/* Soft edges all round: the border and the outer strip of the screenshot blur slightly */}
          {EDGES.map(({ radius, band }) => {
            const mask = `linear-gradient(to right, #000 0, transparent ${band}px, transparent calc(100% - ${band}px), #000 100%), linear-gradient(to bottom, #000 0, transparent ${band}px, transparent calc(100% - ${band}px), #000 100%)`;
            return (
              <div key={radius} style={{ position: "absolute", inset: 0, filter: `blur(${radius}px)`, WebkitMaskImage: mask, maskImage: mask }}>
                <Frame src={src} width={width} innerH={innerH} />
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
