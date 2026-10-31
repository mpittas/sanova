import { AbsoluteFill, Img, staticFile } from "remotion";
import { sans } from "./theme";

/** A region of a captured page, in px of the page scaled to 2000 wide. */
export type DetailCrop = { x: number; y: number; w: number; h: number };

export type DetailProps = {
  /** File in public/pages, without extension. */
  page: string;
  crop: DetailCrop;
  /** The edge of the frame that falls out of focus. */
  blur: "left" | "right" | "top" | "bottom";
  /** Tilt of the card in degrees; keep it tiny. */
  rotate?: number;
  /** Blur radius at the far edge, px. */
  amount?: number;
};

/** Crops are measured on the page scaled to 2000 px wide (1600 × 1000 CSS px viewport, captured at 3×). */
const PAGE_W = 2000;
const PAGE_H = 1250;
/** The cards in the app have rounded corners of about this many px (page scaled to 2000 wide); the crop copies them. */
const CARD_RADIUS = 22;
const LAYERS = 8;
/** How far the crop runs past the bottom of the canvas, so its bottom corners are cut off. */
const BLEED = 80;

/**
 * Canvas size for a crop: the same grey margin on the top, left and right (a little larger on the narrower portrait
 * canvases, so it looks equal once they are shown smaller), with the UI running off the bottom.
 */
export function detailLayout(crop: DetailCrop) {
  const tall = crop.w / crop.h < 1;
  const width = tall ? 1920 : 2560;
  const margin = tall ? 190 : 140;
  const frame = width - margin * 2;
  const innerH = (frame * crop.h) / crop.w;
  return { width, height: Math.round(margin + innerH - BLEED), margin, frame, innerH, radius: Math.round((CARD_RADIUS * frame) / crop.w) };
}

/** The rounded crop of the page. */
function Frame({ page, crop, width, innerH, radius }: { page: string; crop: DetailCrop; width: number; innerH: number; radius: number }) {
  const scale = width / crop.w;
  return (
    <div style={{ position: "relative", width, height: innerH, borderRadius: radius, overflow: "hidden", background: "#f5f7fb", boxShadow: "inset 0 0 0 1px rgba(34,40,52,.06)" }}>
      <Img
        src={staticFile(`pages/${page}.png`)}
        style={{ position: "absolute", left: -crop.x * scale, top: -crop.y * scale, width: PAGE_W * scale, height: PAGE_H * scale, maxWidth: "none", display: "block" }}
      />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(115deg, rgba(255,255,255,.12) 0%, rgba(255,255,255,0) 30%)", pointerEvents: "none" }} />
    </div>
  );
}

/**
 * A close-up of one part of a page: the bare rounded crop on a soft gradient with a faint dot grid, an even margin on
 * the top, left and right, a subtle shadow, and the UI running off the bottom while the far edge eases out of focus.
 */
export function Detail({ page, crop, blur, rotate = 0, amount = 4 }: DetailProps) {
  const { margin, frame: width, innerH, radius } = detailLayout(crop);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(120% 100% at 28% 18%, #ffffff 0%, #f1f2f4 52%, #e6e8ec 100%)", fontFamily: sans, overflow: "hidden" }}>
      <AbsoluteFill style={{ backgroundImage: "radial-gradient(circle, rgba(34,40,52,.24) 1.8px, transparent 2.3px)", backgroundSize: "36px 36px", backgroundPosition: "18px 18px", opacity: 0.8, WebkitMaskImage: "radial-gradient(120% 100% at 50% 0%, #000 0%, rgba(0,0,0,.55) 70%, rgba(0,0,0,.25) 100%)", maskImage: "radial-gradient(120% 100% at 50% 0%, #000 0%, rgba(0,0,0,.55) 70%, rgba(0,0,0,.25) 100%)" }} />
      <div style={{ position: "absolute", left: margin, top: margin, width, height: innerH, transform: `rotate(${rotate}deg)`, transformOrigin: "50% 0" }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: radius, boxShadow: "0 36px 60px -42px rgba(34,40,52,.22), 0 8px 20px -14px rgba(34,40,52,.1)" }} />
        <Frame page={page} crop={crop} width={width} innerH={innerH} radius={radius} />
        {amount > 0 && Array.from({ length: LAYERS }, (_, i) => {
          const k = (i + 1) / LAYERS;
          const radius = amount * Math.pow(k, 1.3);
          const from = 0.66 + (i / LAYERS) * 0.3;
          const mask = `linear-gradient(to ${blur}, transparent ${from * 100}%, #000 ${Math.min(from + 0.17, 1) * 100}%)`;
          return (
            <div key={i} style={{ position: "absolute", inset: 0, filter: `blur(${radius}px)`, WebkitMaskImage: mask, maskImage: mask }}>
              <Frame page={page} crop={crop} width={width} innerH={innerH} radius={radius} />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}
