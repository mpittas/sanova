import { AbsoluteFill, Img, interpolate, staticFile } from "remotion";
import { useCurrentFrame } from "./time";
import { CalendarCard, Cursor, DemoCard, DeptCard, Header, Sidebar, StatCard, TableCard, TrendsCard } from "./cards";
import { L, TABS, TABS_Y } from "./layout";
import { Focus } from "./Panel";
import { c, HEIGHT, sans, WIDTH } from "./theme";
import { easeInOut, easeOut, prog } from "./utils";

const PERSPECTIVE = 2000;

/** Camera keyframes (in beats): the world point at the centre of the frame, zoom, and slow rotation in degrees. */
const cam = [
  { f: 0, x: 915, y: 190, s: 1.16, rx: 10, ry: -18, rz: -1.2 },
  { f: 60, x: 915, y: 245, s: 1.3, rx: 8, ry: -13, rz: -0.6 },
  { f: 112, x: 790, y: 610, s: 1.36, rx: 7, ry: -8, rz: -0.3 },
  { f: 172, x: 802, y: 640, s: 1.4, rx: 6.5, ry: -4, rz: -0.1 },
  { f: 232, x: 880, y: 665, s: 1.44, rx: 6, ry: 0, rz: 0.1 },
  { f: 292, x: 1320, y: 660, s: 1.66, rx: 6, ry: 4, rz: 0.3 },
  { f: 352, x: 1230, y: 1090, s: 1.38, rx: 7, ry: 7, rz: 0.2 },
  { f: 404, x: 1150, y: 1100, s: 1.28, rx: 7, ry: 9, rz: 0.2 },
  { f: 452, x: 780, y: 780, s: 0.98, rx: 7, ry: 9, rz: 0.5 },
  { f: 510, x: 780, y: 720, s: 1.06, rx: 5, ry: 5, rz: 0.3 },
];

/** Smooth path through the keyframes: a cubic Hermite spline, so speed never drops to zero between shots. */
function track(key: "x" | "y" | "s" | "rx" | "ry" | "rz", frame: number) {
  const val = (k: (typeof cam)[number]) => (key === "s" ? Math.log(k.s) : k[key]);
  const last = cam.length - 1;
  let i = 0;
  while (i < last - 1 && frame >= cam[i + 1].f) i++;
  const p0 = cam[Math.max(i - 1, 0)];
  const p1 = cam[i];
  const p2 = cam[i + 1];
  const p3 = cam[Math.min(i + 2, last)];
  const h = p2.f - p1.f;
  const u = Math.min(1, Math.max(0, (frame - p1.f) / h));
  const m1 = i === 0 ? 0 : (val(p2) - val(p0)) / (p2.f - p0.f);
  const m2 = i + 1 === last ? 0 : (val(p3) - val(p1)) / (p3.f - p1.f);
  const u2 = u * u;
  const u3 = u2 * u;
  const v = (2 * u3 - 3 * u2 + 1) * val(p1) + (u3 - 2 * u2 + u) * h * m1 + (-2 * u3 + 3 * u2) * val(p2) + (u3 - u2) * h * m2;
  return key === "s" ? Math.exp(v) : v;
}

/** Blurred band along one edge of the frame, like a lens that only holds the middle in focus. */
const EdgeBlur = ({ side, size, amount }: { side: "top" | "bottom" | "left" | "right"; size: number; amount: number }) => {
  const horizontal = side === "top" || side === "bottom";
  const dir = { top: "to bottom", bottom: "to top", left: "to right", right: "to left" }[side];
  const mask = `linear-gradient(${dir}, #000 0%, transparent 100%)`;
  return (
    <div style={{ position: "absolute", [side]: 0, ...(horizontal ? { left: 0, right: 0, height: size } : { top: 0, bottom: 0, width: size }), backdropFilter: `blur(${amount}px)`, WebkitMaskImage: mask, maskImage: mask }} />
  );
};

/** A minimal flat device: thin dark bezel, rounded corners, a pin-prick camera. The dashboard sits on its screen. */
const Device = () => {
  const frame = useCurrentFrame();
  const p = prog(frame, 0, 36);
  return (
    <div style={{ position: "absolute", left: -150, top: -44, width: 1860, height: 1520, borderRadius: 56, background: "linear-gradient(160deg, #eceef1, #d9dce1)", padding: 20, boxSizing: "border-box", boxShadow: "0 60px 110px -50px rgba(40,46,56,.32), 0 8px 26px rgba(40,46,56,.09), inset 0 0 0 1.5px rgba(255,255,255,.9)", opacity: p, filter: `blur(${(1 - p) * 10}px)`, transform: `translateZ(-30px) scale(${0.97 + 0.03 * p})` }}>
      <div style={{ width: "100%", height: "100%", borderRadius: 36, background: "#f7f8f9", boxShadow: "inset 0 0 0 1px rgba(40,46,56,.08)" }} />
      <span style={{ position: "absolute", top: 7, left: "50%", marginLeft: -3, width: 6, height: 6, borderRadius: 99, background: "#b7bcc4" }} />
    </div>
  );
};

const noise = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .1 0 0 0 0 .3 0 0 0 0 .2 0 0 0 .55 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export function Dashboard() {
  const frame = useCurrentFrame();

  const fx = track("x", frame);
  const fy = track("y", frame);
  const s = track("s", frame);
  const z = PERSPECTIVE * (1 - 1 / s);
  const rx = track("rx", frame) + Math.sin(frame / 52) * 0.35;
  const ry = track("ry", frame) + Math.sin(frame / 71) * 0.5;
  const rz = track("rz", frame);

  /* Cursor: slides to the "Checked In" tab, clicks, comes back to "All" and clicks again. */
  const tabCenter = (i: number) => ({ x: L.table.x + 28 + TABS[i].x + TABS[i].w / 2, y: L.table.y + TABS_Y + 20 });
  const t1 = tabCenter(1);
  const t0 = tabCenter(0);
  const toTab1 = prog(frame, 98, 34, easeInOut);
  const toTab0 = prog(frame, 186, 28, easeInOut);
  let cx = interpolate(toTab1, [0, 1], [1030, t1.x]);
  let cy = interpolate(toTab1, [0, 1], [610, t1.y]) - Math.sin(toTab1 * Math.PI) * 50;
  if (frame > 150) {
    cx = interpolate(toTab0, [0, 1], [t1.x, t0.x]);
    cy = interpolate(toTab0, [0, 1], [t1.y, t0.y]) - Math.sin(toTab0 * Math.PI) * 14;
  }
  const click1 = prog(frame, 132, 26, (t) => t);
  const click2 = prog(frame, 212, 26, (t) => t);
  const click = frame < 180 ? (click1 > 0 && click1 < 1 ? click1 : 0) : click2 > 0 && click2 < 1 ? click2 : 0;
  const cursorOpacity = prog(frame, 98, 10) * (1 - prog(frame, 232, 14));

  const tab = prog(frame, 136, 14) * (1 - prog(frame, 216, 14));
  const filter = prog(frame, 138, 32, easeInOut) * (1 - prog(frame, 220, 30, easeInOut));

  /* End card */
  const veil = prog(frame, 452, 30);
  const logoIn = prog(frame, 464, 34);
  const tagIn = prog(frame, 478, 34);

  return (
    <AbsoluteFill style={{ background: "#eeeff1", fontFamily: sans, overflow: "hidden" }}>

      <div style={{ position: "absolute", inset: 0, perspective: PERSPECTIVE, perspectiveOrigin: "50% 50%" }}>
        <Focus.Provider value={{ x: fx, y: fy }}>
          <div
            style={{
              position: "absolute",
              left: WIDTH / 2,
              top: HEIGHT / 2,
              width: 0,
              height: 0,
              transformStyle: "preserve-3d",
              transform: `translateZ(${z}px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg) translate3d(${-fx}px, ${-fy}px, 0)`,
            }}
          >
            <Device />
            <Sidebar at={6} />
            <Header at={0} />
            {[0, 1, 2, 3].map((i) => <StatCard key={i} index={i} at={8 + i * 6} />)}
            <TableCard at={46} filter={filter} tab={tab} />
            <CalendarCard at={252} />
            <DeptCard at={260} />
            <TrendsCard at={322} />
            <DemoCard at={332} />
            <Cursor x={cx} y={cy} opacity={cursorOpacity} click={click} />
          </div>
        </Focus.Provider>
      </div>

      {/* One direction of blur: the far edge of the frame softens */}
      <EdgeBlur side="right" size={380} amount={9} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 60%, rgba(214,217,221,.45) 100%)", pointerEvents: "none" }} />
      <AbsoluteFill style={{ backgroundImage: noise, opacity: 0.07, mixBlendMode: "multiply", pointerEvents: "none" }} />

      {/* End card */}
      <AbsoluteFill style={{ backdropFilter: `blur(${veil * 6}px)`, background: `rgba(238,239,241,${veil * 0.55})`, display: "grid", placeItems: "center", pointerEvents: "none" }}>
        <div style={{ textAlign: "center" }}>
          <Img src={staticFile("brand/logo.svg")} style={{ height: 116, width: "auto", opacity: logoIn, filter: `blur(${(1 - logoIn) * 8}px)`, transform: `translateY(${(1 - logoIn) * 24}px) scale(${0.96 + 0.04 * logoIn})` }} />
          <div style={{ marginTop: 30, fontSize: 30, fontWeight: 500, color: c.green[800], letterSpacing: "-0.02em", opacity: tagIn, filter: `blur(${(1 - tagIn) * 6}px)`, transform: `translateY(${(1 - tagIn) * 14}px)` }}>Clinic management, beautifully simple.</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
