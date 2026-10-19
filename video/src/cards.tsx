import type { ReactNode } from "react";
import { Img, interpolate, staticFile } from "remotion";
import { useCurrentFrame } from "./time";
import { LuArrowUpRight, LuBuilding2, LuCalendarCheck, LuCalendarDays, LuChartColumn, LuCircleHelp, LuEllipsisVertical, LuFileText, LuFlaskConical, LuLayoutDashboard, LuMessageSquare, LuPalette, LuPill, LuPlus, LuReceipt, LuSettings, LuStethoscope, LuUserRound, LuUsers, LuVideo } from "react-icons/lu";
import type { IconType } from "react-icons";
import { c, mono, sans } from "./theme";
import { L, ROWS_Y, ROW_H, TABS, TABS_Y } from "./layout";
import { Panel } from "./Panel";
import { countUp, curve, easeInOut, prog } from "./utils";

const Label = ({ children }: { children: ReactNode }) => <span style={{ fontSize: 14, fontWeight: 500, color: c.muted }}>{children}</span>;
const Title = ({ children, sub, right }: { children: ReactNode; sub?: string; right?: ReactNode }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
    <div>
      <div style={{ fontSize: 21, fontWeight: 600, color: c.ink, letterSpacing: "-0.025em" }}>{children}</div>
      {sub && <div style={{ marginTop: 4, fontSize: 14, color: c.muted }}>{sub}</div>}
    </div>
    {right}
  </div>
);
const Chip = ({ children, bg, fg }: { children: ReactNode; bg: string; fg: string }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "5px 11px", borderRadius: 999, background: bg, color: fg, fontSize: 13, fontWeight: 500, whiteSpace: "nowrap" }}>{children}</span>
);

/* ---------------- Header ---------------- */

export function Header({ at }: { at: number }) {
  const frame = useCurrentFrame();
  const words = "Welcome back, Dr. Carter".split(" ");
  return (
    <Panel box={L.header} at={at} card={false}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: "100%" }}>
        <div>
          <div style={{ display: "flex", gap: 12, fontSize: 40, fontWeight: 600, color: "#1f2a24", letterSpacing: "-0.035em" }}>
            {words.map((w, i) => {
              const p = prog(frame, at + 8 + i * 5, 24);
              return <span key={i} style={{ opacity: p, filter: `blur(${(1 - p) * 5}px)`, transform: `translateY(${(1 - p) * 14}px)`, display: "inline-block" }}>{w}</span>;
            })}
          </div>
          <div style={{ marginTop: 8, fontSize: 17, color: c.muted, opacity: prog(frame, at + 26, 24) }}>Sunday, October 18. Here's your clinic overview.</div>
        </div>
        <div style={{ display: "flex", gap: 12, opacity: prog(frame, at + 22, 24) }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 9, padding: "13px 24px", borderRadius: 999, background: "#fff", fontSize: 16, fontWeight: 500, color: c.ink, boxShadow: "inset 0 0 0 1px #e3e9e5" }}><LuCalendarDays size={18} />Calendar</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 9, padding: "13px 26px", borderRadius: 999, background: `linear-gradient(180deg, ${c.green[400]}, ${c.green[600]})`, fontSize: 16, fontWeight: 600, color: "#fff", boxShadow: "0 12px 24px -10px rgba(14,129,87,.6)" }}><LuPlus size={18} />Book appointment</span>
        </div>
      </div>
    </Panel>
  );
}

/* ---------------- Sidebar ---------------- */

const nav: { section: string; items: { label: string; icon: IconType; badge?: number; active?: boolean }[] }[] = [
  { section: "Main", items: [{ label: "Dashboard", icon: LuLayoutDashboard, active: true }, { label: "Appointments", icon: LuCalendarDays, badge: 28 }, { label: "Patients", icon: LuUsers }, { label: "Doctors", icon: LuStethoscope }, { label: "Departments", icon: LuBuilding2 }] },
  { section: "Clinical", items: [{ label: "Medical Records", icon: LuFileText }, { label: "Prescriptions", icon: LuPill }, { label: "Lab Results", icon: LuFlaskConical }, { label: "Telemedicine", icon: LuVideo }] },
  { section: "Manage", items: [{ label: "Billing", icon: LuReceipt }, { label: "Reports", icon: LuChartColumn }, { label: "Messages", icon: LuMessageSquare, badge: 3 }, { label: "Settings", icon: LuSettings }] },
];

export function Sidebar({ at }: { at: number }) {
  const frame = useCurrentFrame();
  let index = 0;
  return (
    <Panel box={L.sidebar} at={at} z={-8}>
      <div style={{ padding: "30px 22px", display: "flex", flexDirection: "column", height: "100%", boxSizing: "border-box" }}>
        <Img src={staticFile("brand/logo.svg")} style={{ height: 40, width: "auto", alignSelf: "flex-start", marginBottom: 34 }} />
        {nav.map((group) => (
          <div key={group.section} style={{ marginBottom: 22 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: "#98a59d", margin: "0 0 10px 12px" }}>{group.section}</div>
            {group.items.map((item) => {
              const p = prog(frame, at + 14 + index++ * 2.5, 22);
              const Icon = item.icon;
              return (
                <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 13, padding: "11px 12px", marginBottom: 3, borderRadius: 14, fontSize: 15, fontWeight: 500, color: item.active ? "#fff" : "#46534b", background: item.active ? c.green[700] : "transparent", opacity: p, filter: `blur(${(1 - p) * 3}px)`, transform: `translateX(${(1 - p) * -14}px)` }}>
                  <Icon size={19} />
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {item.badge && <span style={{ padding: "2px 9px", borderRadius: 999, fontSize: 12, fontWeight: 600, color: c.green[700], background: c.green[100] }}>{item.badge}</span>}
                </div>
              );
            })}
          </div>
        ))}
        <div style={{ marginTop: "auto" }}>
          {[{ l: "Design System", i: LuPalette }, { l: "Help Center", i: LuCircleHelp }].map(({ l, i: Icon }) => (
            <div key={l} style={{ display: "flex", alignItems: "center", gap: 13, padding: "11px 12px", fontSize: 15, fontWeight: 500, color: "#46534b" }}><Icon size={19} />{l}</div>
          ))}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 14, padding: 12, borderRadius: 18, background: "#f5f8f5" }}>
            <Img src={staticFile("p/carter.jpg")} style={{ width: 40, height: 40, borderRadius: 999, objectFit: "cover" }} />
            <div><div style={{ fontSize: 14, fontWeight: 600, color: c.ink }}>Dr. James Carter</div><div style={{ fontSize: 12, color: c.muted }}>General Practitioner</div></div>
          </div>
        </div>
      </div>
    </Panel>
  );
}

/* ---------------- Stat cards ---------------- */

const stats = [
  { label: "Total Patients", value: "1,248", change: "12%", period: "vs last month", icon: LuUsers, tone: c.green, trend: [38, 46, 54, 48, 38, 34, 44, 58, 64, 56, 52, 62] },
  { label: "Today's Appointments", value: "28", change: "8%", period: "vs last week", icon: LuCalendarCheck, tone: c.blue, trend: [44, 36, 28, 34, 46, 56, 50, 38, 30, 40, 54, 48] },
  { label: "Available Doctors", value: "14", change: "2%", period: "vs last month", icon: LuUserRound, tone: c.violet, trend: [30, 38, 46, 52, 44, 32, 28, 36, 48, 54, 46, 40] },
  { label: "Total Revenue", value: "$16,073", change: "9.3%", period: "vs last month", icon: LuFileText, tone: c.amber, trend: [26, 34, 30, 42, 56, 52, 40, 36, 46, 60, 66, 58] },
];

export function StatCard({ index, at }: { index: number; at: number }) {
  const frame = useCurrentFrame();
  const s = stats[index];
  const box = L.stat(index);
  const tone = s.tone as Record<number, string>;
  const accent = tone[500];
  const wash = tone[300] ?? tone[500];
  const W = 246;
  const H = 64;
  const lo = Math.min(...s.trend);
  const range = Math.max(...s.trend) - lo;
  const pts = s.trend.map((v, i) => [(i / (s.trend.length - 1)) * W, H * (0.9 - ((v - lo) / range) * 0.74)] as const);
  const line = curve(pts);
  const draw = prog(frame, at + 22, 46, easeInOut);
  const num = prog(frame, at + 12, 44, easeInOut);
  const gid = `g${index}`;
  return (
    <Panel box={box} at={at} z={10}>
      <div style={{ padding: "20px 22px", boxSizing: "border-box", height: "100%", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Label>{s.label}</Label>
          <span style={{ display: "grid", placeItems: "center", width: 34, height: 34, borderRadius: 11, background: tone[100] ?? tone[50], color: accent }}><s.icon size={18} /></span>
        </div>
        <div style={{ marginTop: 8, fontFamily: mono, fontSize: 28, fontWeight: 400, color: c.ink, letterSpacing: "-0.025em" }}>{countUp(s.value, num)}</div>
        <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 9 }}>
          <Chip bg={c.green[50]} fg={c.green[600]}><LuArrowUpRight size={13} />{s.change}</Chip>
          <span style={{ fontSize: 13, color: c.muted }}>{s.period}</span>
        </div>
        <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ marginTop: "auto", overflow: "visible" }}>
          <defs>
            <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={wash} stopOpacity=".34" /><stop offset="1" stopColor={wash} stopOpacity="0" /></linearGradient>
          </defs>
          <path d={`${line} L${W},${H} L0,${H} Z`} fill={`url(#${gid})`} opacity={draw} />
          <path d={line} fill="none" stroke={accent} strokeWidth={2.4} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
        </svg>
      </div>
    </Panel>
  );
}

/* ---------------- Appointments table ---------------- */

type Status = "Checked In" | "Upcoming" | "Rescheduled";
const rows: { time: string; ampm: string; name: string; mrn: string; visit: string; dept: string; fee: number; status: Status; photo: string }[] = [
  { time: "09:00", ampm: "AM", name: "Olivia Bennett", mrn: "MRN-20418", visit: "General Consultation", dept: "General Practice", fee: 80, status: "Checked In", photo: "olivia" },
  { time: "09:30", ampm: "AM", name: "Liam Carter", mrn: "MRN-20377", visit: "Cardiology Follow-up", dept: "Cardiology", fee: 140, status: "Upcoming", photo: "liam" },
  { time: "10:00", ampm: "AM", name: "Ava Martinez", mrn: "MRN-20562", visit: "Dermatology Consultation", dept: "Dermatology", fee: 110, status: "Upcoming", photo: "ava" },
  { time: "10:30", ampm: "AM", name: "Noah Wilson", mrn: "MRN-19984", visit: "Annual Physical", dept: "General Practice", fee: 95, status: "Rescheduled", photo: "noah" },
  { time: "11:00", ampm: "AM", name: "Mia Wong", mrn: "MRN-20611", visit: "Child Wellness Check", dept: "Pediatrics", fee: 70, status: "Checked In", photo: "mia" },
  { time: "11:30", ampm: "AM", name: "Lucas Young", mrn: "MRN-20290", visit: "Knee Assessment", dept: "Orthopedics", fee: 125, status: "Upcoming", photo: "lucas" },
];
const chipTone: Record<Status, [string, string]> = { "Checked In": [c.green[50], c.green[600]], Upcoming: [c.blue[50], c.blue[500]], Rescheduled: [c.amber[50], "#B45309"] };

/** `filter` 0 = every row, 1 = only the checked-in ones; `tab` 0 or 1 slides the tab pill. Both are driven by the cursor click in the scene. */
export function TableCard({ at, filter, tab }: { at: number; filter: number; tab: number }) {
  const frame = useCurrentFrame();
  const kept = rows.filter((r) => r.status === "Checked In");
  const pillX = interpolate(tab, [0, 1], [TABS[0].x, TABS[1].x]);
  const pillW = interpolate(tab, [0, 1], [TABS[0].w, TABS[1].w]);
  return (
    <Panel box={L.table} at={at} z={0}>
      <div style={{ padding: 28, position: "relative", height: "100%", boxSizing: "border-box" }}>
        <Title sub="Today's schedule" right={<span style={{ fontSize: 15, fontWeight: 500, color: c.green[600], display: "inline-flex", alignItems: "center", gap: 6 }}>View all <LuArrowUpRight size={16} /></span>}>Upcoming appointments</Title>
        <div style={{ position: "absolute", left: 28, top: TABS_Y, height: 40, width: 420 }}>
          <span style={{ position: "absolute", left: pillX, width: pillW, top: 0, height: 40, borderRadius: 999, background: c.green[50], boxShadow: `inset 0 0 0 1.5px ${c.green[400]}` }} />
          {TABS.map((t, i) => (
            <span key={t.label} style={{ position: "absolute", left: t.x, width: t.w, height: 40, display: "grid", placeItems: "center", fontSize: 15, fontWeight: 500, color: Math.round(tab) === i ? c.green[700] : c.muted }}>{t.label}</span>
          ))}
        </div>
        <div style={{ position: "absolute", left: 28, right: 28, top: ROWS_Y - 32, display: "flex", fontSize: 13, fontWeight: 500, color: "#98a59d" }}>
          <span style={{ width: 236 }}>Patient</span><span style={{ width: 212 }}>Visit</span><span style={{ width: 104 }}>Time</span><span style={{ width: 70 }}>Fee</span><span>Status</span>
        </div>
        {rows.map((r, i) => {
          const rp = prog(frame, at + 26 + i * 6, 26);
          const k = kept.indexOf(r);
          const stays = k >= 0;
          const y = i * ROW_H + (stays ? (k - i) * ROW_H * filter : 0);
          const gone = stays ? 0 : filter;
          return (
            <div
              key={r.name}
              style={{ position: "absolute", left: 28, right: 28, top: ROWS_Y + y, height: ROW_H, display: "flex", alignItems: "center", borderTop: `1px solid ${c.line}`, opacity: rp * (1 - gone), filter: `blur(${(1 - rp) * 4 + gone * 5}px)`, transform: `translateY(${(1 - rp) * 18}px) scale(${1 - gone * 0.03})` }}
            >
              <div style={{ width: 236, display: "flex", alignItems: "center", gap: 14 }}>
                <Img src={staticFile(`p/${r.photo}.jpg`)} style={{ width: 44, height: 44, borderRadius: 999, objectFit: "cover" }} />
                <div><div style={{ fontSize: 16, fontWeight: 600, color: c.ink }}>{r.name}</div><div style={{ fontSize: 13, color: c.muted }}>{r.mrn}</div></div>
              </div>
              <div style={{ width: 212 }}><div style={{ fontSize: 15, fontWeight: 600, color: c.ink }}>{r.visit}</div><div style={{ fontSize: 13, color: c.muted }}>{r.dept}</div></div>
              <div style={{ width: 104, fontSize: 15, color: c.ink }}>{r.time} <span style={{ color: c.muted, fontSize: 13 }}>{r.ampm}</span></div>
              <div style={{ width: 70, fontSize: 15, color: c.ink }}>${r.fee}</div>
              <div style={{ flex: 1 }}><Chip bg={chipTone[r.status][0]} fg={chipTone[r.status][1]}><span style={{ width: 6, height: 6, borderRadius: 99, background: chipTone[r.status][1] }} />{r.status}</Chip></div>
              <LuEllipsisVertical size={18} color="#98a59d" />
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

/* ---------------- Calendar heatmap ---------------- */

const heat = [0, 1, 2, 3, 2, 1, 0, 2, 3, 4, 3, 4, 2, 1, 3, 4, 5, 4, 5, 3, 2, 1, 3, 4, 5, 4, 3, 1, 0, 2, 3, 4, 2, 1, 0];
const ramp = ["#F1F5F2", "#E4F3EB", "#C8E9D8", "#9FD9BD", "#5DB892", "#23865F"];

export function CalendarCard({ at }: { at: number }) {
  const frame = useCurrentFrame();
  const total = prog(frame, at + 12, 40, easeInOut);
  return (
    <Panel box={L.calendar} at={at} z={6}>
      <div style={{ padding: 26 }}>
        <Title sub="May 2024" right={<span style={{ fontFamily: mono, fontSize: 26, color: c.ink, letterSpacing: "-0.025em" }}>{countUp("212", total)}</span>}>Appointments</Title>
        <div style={{ marginTop: 18, display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 7 }}>
          {heat.map((level, i) => {
            const p = prog(frame, at + 20 + (Math.floor(i / 7) * 6 + (i % 7) * 1.5), 22);
            return <span key={i} style={{ height: 30, borderRadius: 9, background: ramp[level], opacity: p, transform: `scale(${0.7 + 0.3 * p})`, filter: `blur(${(1 - p) * 3}px)`, display: "grid", placeItems: "center", fontSize: 12, fontWeight: 600, color: level >= 5 ? "#fff" : "#24453a" }}>{i < 31 ? i + 1 : ""}</span>;
          })}
        </div>
      </div>
    </Panel>
  );
}

/* ---------------- Departments ---------------- */

const depts = [
  { name: "General Practice", share: 40, color: c.green[500] },
  { name: "Cardiology", share: 25, color: c.coral[500] },
  { name: "Dermatology", share: 15, color: c.amber[500] },
  { name: "Pediatrics", share: 10, color: c.blue[500] },
  { name: "Orthopedics", share: 10, color: c.violet[500] },
];

export function DeptCard({ at }: { at: number }) {
  const frame = useCurrentFrame();
  const total = prog(frame, at + 12, 40, easeInOut);
  return (
    <Panel box={L.depts} at={at} z={-4}>
      <div style={{ padding: 26 }}>
        <Title sub="Share of patients" right={<span style={{ fontFamily: mono, fontSize: 26, color: c.ink, letterSpacing: "-0.025em" }}>{countUp("1,150", total)}</span>}>Departments</Title>
        <div style={{ display: "flex", gap: 4, height: 14, marginTop: 20 }}>
          {depts.map((d, i) => {
            const p = prog(frame, at + 18 + i * 5, 30);
            return <span key={d.name} style={{ flex: d.share, borderRadius: 99, background: d.color, transform: `scaleX(${p})`, transformOrigin: "left", opacity: 0.9 }} />;
          })}
        </div>
        <div style={{ marginTop: 18, display: "grid", gap: 11 }}>
          {depts.map((d, i) => {
            const p = prog(frame, at + 26 + i * 5, 22);
            return (
              <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 15, color: c.ink, opacity: p, transform: `translateX(${(1 - p) * 10}px)` }}>
                <span style={{ width: 10, height: 10, borderRadius: 99, background: d.color }} /><span style={{ flex: 1 }}>{d.name}</span><span style={{ color: c.muted }}>{d.share}%</span>
              </div>
            );
          })}
        </div>
      </div>
    </Panel>
  );
}

/* ---------------- Trends ---------------- */

const inPerson = [48, 54, 60, 59, 60, 55, 55, 59, 65, 70, 58, 55];
const tele = [32, 35, 38, 38, 38, 36, 35, 40, 42, 41, 37, 36];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function TrendsCard({ at }: { at: number }) {
  const frame = useCurrentFrame();
  const W = 520;
  const H = 190;
  const pt = (series: number[]) => series.map((v, i) => [(i / 11) * W, H - (v / 80) * H * 0.96 - 4] as const);
  const a = curve(pt(inPerson));
  const b = curve(pt(tele));
  const d1 = prog(frame, at + 18, 54, easeInOut);
  const d2 = prog(frame, at + 28, 54, easeInOut);
  const total = prog(frame, at + 14, 44, easeInOut);
  return (
    <Panel box={L.trends} at={at} z={-2}>
      <div style={{ padding: 26 }}>
        <Title sub="In-person and telemedicine visits" right={<div style={{ display: "flex", gap: 14, fontSize: 13, color: c.muted }}><span><i style={{ display: "inline-block", width: 9, height: 9, borderRadius: 9, background: c.green[500], marginRight: 6 }} />In-person</span><span><i style={{ display: "inline-block", width: 9, height: 9, borderRadius: 9, background: c.green[300], marginRight: 6 }} />Telemedicine</span></div>}>Appointment trends</Title>
        <div style={{ margin: "14px 0 10px", display: "flex", alignItems: "baseline", gap: 12 }}>
          <span style={{ fontFamily: mono, fontSize: 28, color: c.ink, letterSpacing: "-0.025em" }}>{countUp("1,248", total)}</span>
          <Chip bg={c.green[50]} fg={c.green[600]}><LuArrowUpRight size={13} />8.4%</Chip>
        </div>
        <svg viewBox={`-6 -6 ${W + 12} ${H + 36}`} width={W + 12} height={H + 36} style={{ overflow: "visible", marginLeft: -6 }}>
          <defs>
            <linearGradient id="tr1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={c.green[500]} stopOpacity=".22" /><stop offset="1" stopColor={c.green[500]} stopOpacity="0" /></linearGradient>
          </defs>
          {[0.25, 0.5, 0.75].map((g) => <line key={g} x1={0} x2={W} y1={H * g} y2={H * g} stroke="#eef1ef" strokeWidth={1} />)}
          <path d={`${a} L${W},${H} L0,${H} Z`} fill="url(#tr1)" opacity={d1} />
          <path d={b} fill="none" stroke={c.green[300]} strokeWidth={2.4} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - d2} />
          <path d={a} fill="none" stroke={c.green[500]} strokeWidth={2.6} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - d1} />
          {months.map((m, i) => (i % 2 === 0 ? <text key={m} x={(i / 11) * W} y={H + 24} textAnchor="middle" fontSize={12} fill="#98a59d" fontFamily={sans}>{m}</text> : null))}
        </svg>
      </div>
    </Panel>
  );
}

/* ---------------- Demographics ---------------- */

export function DemoCard({ at }: { at: number }) {
  const frame = useCurrentFrame();
  const R = 74;
  const C = 2 * Math.PI * R;
  const groups = [{ label: "Female", share: 52, color: c.green[500] }, { label: "Male", share: 45, color: c.green[300] }, { label: "Other", share: 3, color: "#cfd8d2" }];
  const sweep = prog(frame, at + 16, 58, easeInOut);
  const num = prog(frame, at + 14, 44, easeInOut);
  let offset = 0;
  return (
    <Panel box={L.demo} at={at} z={-6}>
      <div style={{ padding: 26 }}>
        <Title sub="Patients by gender" right={<span style={{ display: "inline-flex", padding: 4, borderRadius: 999, background: "#f1f5f2", fontSize: 13, fontWeight: 500 }}><span style={{ padding: "6px 14px", borderRadius: 999, background: "#fff", color: c.ink, boxShadow: "0 1px 3px rgba(0,0,0,.08)" }}>This Year</span><span style={{ padding: "6px 14px", color: c.muted }}>Last Year</span></span>}>Demographics</Title>
        <div style={{ display: "flex", alignItems: "center", gap: 40, marginTop: 22 }}>
          <div style={{ position: "relative", width: 190, height: 190 }}>
            <svg viewBox="0 0 190 190" width={190} height={190}>
              <circle cx={95} cy={95} r={R} fill="none" stroke="#eef1ef" strokeWidth={16} />
              {groups.map((g) => {
                const len = Math.max((g.share / 100) * C - 8, 0.01);
                const el = <circle key={g.label} cx={95} cy={95} r={R} fill="none" stroke={g.color} strokeWidth={16} strokeLinecap="round" strokeDasharray={`${len * sweep} ${C}`} strokeDashoffset={-offset} transform="rotate(-90 95 95)" />;
                offset += (g.share / 100) * C;
                return el;
              })}
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", textAlign: "center" }}>
              <div><div style={{ fontFamily: mono, fontSize: 26, color: c.ink, letterSpacing: "-0.025em" }}>{countUp("1,248", num)}</div><div style={{ fontSize: 13, color: c.muted }}>patients</div></div>
            </div>
          </div>
          <div style={{ flex: 1, display: "grid", gap: 14 }}>
            {groups.map((g) => (
              <div key={g.label} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 16, color: c.ink }}><span style={{ width: 11, height: 11, borderRadius: 99, background: g.color }} /><span style={{ flex: 1 }}>{g.label}</span><span style={{ fontWeight: 600 }}>{g.share}%</span></div>
            ))}
            <div style={{ display: "flex", gap: 30, marginTop: 8, paddingTop: 16, borderTop: `1px solid ${c.line}` }}>
              <div><div style={{ fontFamily: mono, fontSize: 22, color: c.ink }}>{countUp("892", num)}</div><div style={{ fontSize: 13, color: c.muted }}>Returning</div></div>
              <div><div style={{ fontFamily: mono, fontSize: 22, color: c.ink }}>{countUp("286", num)}</div><div style={{ fontSize: 13, color: c.muted }}>New</div></div>
            </div>
          </div>
        </div>
      </div>
    </Panel>
  );
}

/* ---------------- Cursor: the macOS arrow, with a soft click ripple ---------------- */

/** `click` runs 0 to 1 over the length of a click (0 when idle): the arrow dips, a ripple spreads and fades. */
export function Cursor({ x, y, opacity, click }: { x: number; y: number; opacity: number; click: number }) {
  const scale = 1.75;
  const dip = click > 0 && click < 0.4 ? Math.sin((click / 0.4) * Math.PI) : 0;
  const ring = click > 0 ? click : 0;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity, transform: `translateZ(60px) scale(${1 - dip * 0.14})`, transformOrigin: "2px 1.5px", pointerEvents: "none" }}>
      {click > 0 && (
        <>
          <span style={{ position: "absolute", left: -34, top: -34, width: 68, height: 68, borderRadius: 99, background: "rgba(19,154,104,.26)", opacity: 1 - ring, transform: `scale(${0.25 + ring * 1.15})` }} />
          <span style={{ position: "absolute", left: -34, top: -34, width: 68, height: 68, borderRadius: 99, border: "2px solid rgba(19,154,104,.55)", opacity: (1 - ring) * 0.9, transform: `scale(${0.2 + ring * 1.6})` }} />
        </>
      )}
      <svg width={20 * scale} height={28 * scale} viewBox="0 0 20 28" style={{ position: "absolute", left: -2 * scale, top: -1.5 * scale, overflow: "visible", filter: "drop-shadow(0 3px 4px rgba(0,0,0,.28))" }}>
        <path d="M2 1.5 L2 20.6 L6.6 16.5 L9.5 23.3 L12.7 21.9 L9.8 15.2 L16.2 14.8 Z" fill="#111" stroke="#fff" strokeWidth="1.7" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
