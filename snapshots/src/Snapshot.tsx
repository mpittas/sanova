import { AbsoluteFill, Img, staticFile } from "remotion";
import { palette } from "./palette";

export type Edge = "left" | "right" | "top" | "bottom";
/** A region of an image, in image pixels. */
export type Crop = { x: number; y: number; w: number; h: number };

export type Item = {
  /** Path inside public/, e.g. "captures/dashboard--stats.png". */
  image: string;
  /** Optional region of the image to show, in image pixels. */
  crop?: Crop;
  /** Corner radius of the design, in image pixels. Defaults to about 1.2% of the width. */
  radius?: number;
  /** Filled in automatically from the image file. */
  natural?: { width: number; height: number };
};

export type SnapshotProps = {
  /** 1 item = a single snapshot. 2-3 items = a row (the middle one stays sharp). */
  items: Item[];
  /** `section` = bare rounded crop. `screen` = crop in a thin gray frame with soft edges. */
  mode?: "section" | "screen";
  /** The design's primary colour (#rrggbb). Tints the background by a few percent. */
  accent?: string;
  /** Rotation in degrees (signed). Keep it under 1. */
  tilt?: number;
  /** The edge that falls out of focus. */
  blur?: Edge;
  /** Blur radius at the far edge, px. 0 turns depth of field off. */
  blurAmount?: number;
  /** Where the sharp area ends and the blur starts, 0-1 along the blur direction. */
  blurStart?: number;
  /** How far the design runs off the bottom of the canvas, px. */
  bleed?: number;
  /** Canvas margin around the design, px. */
  margin?: number;
  /** The faint dot grid. */
  dots?: boolean;
  /** Canvas width, px. */
  width?: number;
  /** For rows: index of the sharp item. */
  focus?: number;
  /** Fixed canvas for a single item: the design is scaled to a consistent size, centred, and tall designs run off the bottom. */
  canvas?: { width: number; height: number };
  /** Direction the blur grows, in CSS degrees (180 = down, 90 = right, 135 = down-right). Overrides `blur`. */
  blurAngle?: number;
  /** With `canvas`: centre the design in the frame instead of aligning it to the top and bleeding it off the bottom. */
  center?: boolean;
  /** With `canvas`: always use the full canvas height. The design is scaled to fill it from the top margin and runs off the bottom. */
  fill?: boolean;
  /** With `fill`: zoom in until the design is at least this share of the canvas width (0-1). Its top edge always stays visible. */
  minWidthShare?: number;
};

const DOF_LAYERS = 8;
const PORTRAIT_TARGET_HEIGHT = 2400;

const sizeOf = (item: Item) => (item.crop ? { w: item.crop.w, h: item.crop.h } : { w: item.natural?.width ?? 1600, h: item.natural?.height ?? 1000 });

/** Canvas size and the box of every item, from the images' proportions. Also used to size the still before rendering. */
export function computeLayout(props: SnapshotProps) {
  const { items, mode = "section" } = props;
  const n = items.length;
  if (props.canvas && n === 1) return computeCanvasLayout(props);
  const bleed = props.bleed ?? 80;
  const sizes = items.map(sizeOf);
  const aspect = sizes[0].w / sizes[0].h;
  const portrait = n === 1 && aspect < 0.9;
  const width = props.width ?? (portrait ? 1920 : 2560);
  const margin = props.margin ?? Math.round(width * (portrait ? 0.1 : 0.055));
  const gap = Math.round(margin * 0.6);
  const pad = mode === "screen" ? Math.max(8, Math.round(width * 0.0065)) : 0;

  const boxes = items.map((item, i) => {
    const { w, h } = sizes[i];
    let outerW = n === 1 ? width - margin * 2 : (width - margin * 2 - gap * (n - 1)) / n;
    let innerW = outerW - pad * 2;
    let innerH = (innerW * h) / w;
    if (portrait) {
      const maxOuterH = PORTRAIT_TARGET_HEIGHT - margin + bleed;
      if (innerH + pad * 2 > maxOuterH) {
        innerH = maxOuterH - pad * 2;
        innerW = (innerH * w) / h;
        outerW = innerW + pad * 2;
      }
    }
    const left = n === 1 ? (width - outerW) / 2 : margin + i * (outerW + gap);
    const innerRadius = ((item.radius ?? w * 0.012) * innerW) / w;
    return { left, top: margin, outerW, outerH: innerH + pad * 2, innerW, innerH, innerRadius, outerRadius: innerRadius + pad };
  });

  const tallest = Math.max(...boxes.map((b) => b.outerH));
  const height = Math.round(margin + tallest - bleed + (bleed <= 0 ? margin : 0));
  return { width, height, margin, pad, boxes };
}

/** Same canvas and margin for every image: wide designs are centred, narrow ones are scaled to a minimum width and may bleed off the bottom. */
function computeCanvasLayout(props: SnapshotProps) {
  const { width, height } = props.canvas!;
  const item = props.items[0];
  const { w, h } = sizeOf(item);
  const margin = props.margin ?? Math.round(width * 0.075);
  const availW = width - margin * 2;
  const availH = height - margin * 2;
  const contain = Math.min(availW / w, availH / h);
  const narrow = Math.min((width * 0.46) / w, (availH + height * 0.22) / h);
  const bleedPx = props.bleed ?? Math.round(width * 0.03);
  const scale = props.fill ? Math.min(availW / w, Math.max((height - margin + bleedPx) / h, ((props.minWidthShare ?? 0) * width) / w)) : Math.max(contain, narrow);
  const innerW = w * scale;
  const innerH = h * scale;
  const innerRadius = (item.radius ?? w * 0.012) * scale;
  const fits = innerH <= availH;
  const bleed = bleedPx;
  // Top-aligned with an even margin; short designs get a canvas that ends just below them, tall ones fill the frame and run off the bottom.
  const top = props.center && fits ? (height - innerH) / 2 : margin;
  const canvasHeight = props.center || props.fill || !fits ? height : Math.round(margin + innerH - bleed);
  const box = { left: (width - innerW) / 2, top, outerW: innerW, outerH: innerH, innerW, innerH, innerRadius, outerRadius: innerRadius };
  return { width, height: canvasHeight, margin, pad: 0, boxes: [box] };
}

type FrameProps = {
  item: Item;
  box: ReturnType<typeof computeLayout>["boxes"][number];
  pad: number;
  mode: "section" | "screen";
  pal: ReturnType<typeof palette>;
};

/** The design in its rounded crop (and, in screen mode, its thin gray frame). Blurred copies of this give the depth of field. */
function Frame({ item, box, pad, mode, pal }: FrameProps) {
  const natural = item.natural ?? { width: 1600, height: 1000 };
  const crop = item.crop ?? { x: 0, y: 0, w: natural.width, h: natural.height };
  const scale = box.innerW / crop.w;
  return (
    <div
      style={{
        width: box.outerW,
        height: box.outerH,
        padding: pad,
        boxSizing: "border-box",
        borderRadius: box.outerRadius,
        background: mode === "screen" ? `linear-gradient(160deg, ${pal.frameA}, ${pal.frameB})` : "transparent",
      }}
    >
      <div style={{ position: "relative", width: box.innerW, height: box.innerH, borderRadius: box.innerRadius, overflow: "hidden", boxShadow: `inset 0 0 0 1px ${pal.hairline}` }}>
        <Img
          src={staticFile(item.image)}
          style={{ position: "absolute", left: -crop.x * scale, top: -crop.y * scale, width: natural.width * scale, height: natural.height * scale, maxWidth: "none", display: "block" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(115deg, rgba(255,255,255,.10) 0%, rgba(255,255,255,0) 30%)", pointerEvents: "none" }} />
      </div>
    </div>
  );
}

/**
 * Minimal presentation image: the design on a near-white background with a faint dot grid, a slight tilt, a light
 * shadow, a bottom bleed, and the far edge easing out of focus. The colour comes from the design, not the background.
 */
export function Snapshot(props: SnapshotProps) {
  const { items, mode = "section", accent, tilt = 0.6, blur = "bottom", blurAmount = 4, blurStart = 0.55, dots = true, blurAngle } = props;
  const layout = computeLayout(props);
  const pal = palette(accent);
  const n = items.length;
  const focus = props.focus ?? Math.floor((n - 1) / 2);
  const k = layout.width / 2560;
  const step = Math.max(24, Math.round(36 * k));

  const sharpMask = `linear-gradient(to right, transparent 0, #000 ${Math.round(46 * k)}px, #000 calc(100% - ${Math.round(46 * k)}px), transparent 100%), linear-gradient(to bottom, transparent 0, #000 ${Math.round(46 * k)}px, #000 calc(100% - ${Math.round(46 * k)}px), transparent 100%)`;
  const rims = [
    { radius: 1.6 * k, band: Math.round(110 * k) },
    { radius: 3.2 * k, band: Math.round(40 * k) },
  ];
  const dotMask = "radial-gradient(120% 100% at 50% 0%, #000 0%, rgba(0,0,0,.55) 70%, rgba(0,0,0,.25) 100%)";

  return (
    <AbsoluteFill style={{ background: `radial-gradient(120% 100% at 28% 18%, ${pal.bgA} 0%, ${pal.bgB} 52%, ${pal.bgC} 100%)`, overflow: "hidden" }}>
      {dots && (
        <AbsoluteFill
          style={{ backgroundImage: `radial-gradient(circle, ${pal.dot} ${1.8 * k}px, transparent ${2.3 * k}px)`, backgroundSize: `${step}px ${step}px`, backgroundPosition: `${step / 2}px ${step / 2}px`, opacity: 0.8, WebkitMaskImage: dotMask, maskImage: dotMask }}
        />
      )}
      {items.map((item, i) => {
        const box = layout.boxes[i];
        const sharp = n === 1 || i === focus;
        const sign = n === 1 ? 1 : i % 2 === 0 ? 1 : -1;
        const frame = <Frame item={item} box={box} pad={layout.pad} mode={mode} pal={pal} />;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: box.left,
              top: box.top,
              width: box.outerW,
              height: box.outerH,
              transform: `rotate(${tilt * sign}deg)`,
              transformOrigin: "50% 0",
              filter: sharp || blurAmount <= 0 ? undefined : `blur(${blurAmount * 1.2 * k}px)`,
            }}
          >
            <div style={{ position: "absolute", inset: 0, borderRadius: box.outerRadius, boxShadow: `0 ${36 * k}px ${60 * k}px -${42 * k}px ${pal.shadowSoft}, 0 ${8 * k}px ${20 * k}px -${14 * k}px ${pal.shadowTight}` }} />
            <div style={{ position: "absolute", inset: 0, ...(mode === "screen" ? { WebkitMaskImage: sharpMask, maskImage: sharpMask, WebkitMaskComposite: "source-in", maskComposite: "intersect" } : {}) }}>{frame}</div>
            {sharp &&
              blurAmount > 0 &&
              Array.from({ length: DOF_LAYERS }, (_, layer) => {
                const strength = (layer + 1) / DOF_LAYERS;
                const radius = blurAmount * k * Math.pow(strength, 1.3);
                const from = blurStart + (layer / DOF_LAYERS) * (0.9 - blurStart);
                const mask = `linear-gradient(${blurAngle ?? { top: 0, right: 90, bottom: 180, left: 270 }[blur]}deg, transparent ${from * 100}%, #000 ${Math.min(from + 0.17, 1) * 100}%)`;
                return (
                  <div key={layer} style={{ position: "absolute", inset: 0, filter: `blur(${radius}px)`, WebkitMaskImage: mask, maskImage: mask }}>
                    {frame}
                  </div>
                );
              })}
            {mode === "screen" &&
              sharp &&
              rims.map(({ radius, band }) => {
                const mask = `linear-gradient(to right, #000 0, transparent ${band}px, transparent calc(100% - ${band}px), #000 100%), linear-gradient(to bottom, #000 0, transparent ${band}px, transparent calc(100% - ${band}px), #000 100%)`;
                return (
                  <div key={radius} style={{ position: "absolute", inset: 0, filter: `blur(${radius}px)`, WebkitMaskImage: mask, maskImage: mask }}>
                    {frame}
                  </div>
                );
              })}
          </div>
        );
      })}
    </AbsoluteFill>
  );
}
