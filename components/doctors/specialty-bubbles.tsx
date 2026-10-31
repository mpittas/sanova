"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";
import { TODAY } from "@/components/appointments/data";
import { addDays, formatDate, formatTime } from "@/components/appointments/dates";
import { specialties, specialtyTone, type Doctor, type Specialty } from "./data";
import styles from "./specialty-bubbles.module.css";

type Props = {
  title: string;
  summary: string;
  doctors: readonly Doctor[];
  /** The focused specialty. Leave undefined and the banner keeps its own selection. */
  selected?: Specialty | null;
  /** Called when a circle is clicked: the specialty, or null when the selected one is clicked again. */
  onSelect?: (specialty: Specialty | null) => void;
};

type Body = { x: number; y: number; vx: number; vy: number; scale: number; sv: number; homeX: number; homeY: number };
type Point = { key: Specialty; r: number; x: number; y: number; vx: number; vy: number; scale: number; sv: number; homeX: number; homeY: number };

/** A press that travels further than this many pixels becomes a drag instead of a click. */
const DRAG_FROM = 5;
/** Circles may sink into each other by this much before they are pushed apart outright. */
const SOFT = 3;
/** How much flatter than tall the resting cluster is allowed to be: the layout tries each and keeps the one that lets the circles grow largest. */
const SHAPES = [0.5, 0.8, 1.2, 2, 3.5];
/** Breathing room above and below the cluster, so a swollen circle isn't pressed against the banner's edge. */
const PAD = 8;
/** A hovered circle swells to at least this wide (px), so what is written inside it always fits. */
const HOVER_D = 150;
/** The most the circles are spread apart (px) when the banner is wider than the cluster. */
const MAX_GAP = 80;

const surname = (doctor: Doctor) => doctor.name.replace(/^Dr\.?\s+/, "").split(" ").slice(-1)[0];
const byWhen = (a: Doctor, b: Doctor) => `${a.next.date}${a.next.time}`.localeCompare(`${b.next.date}${b.next.time}`);
const when = (doctor: Doctor) =>
  doctor.next.date === TODAY ? "today" : doctor.next.date === addDays(TODAY, 1) ? "tomorrow" : formatDate(doctor.next.date, { day: "numeric", month: "short" });

/**
 * "Your care team" banner on the Doctors page: one circle per specialty, its area following how many doctors it has.
 * At rest the circles sit still, spread across the banner and as tall as it allows. Hovering one swells it on a soft spring while
 * its neighbours yield, and its face changes to say who is inside. Any circle can be dragged and springs back when
 * let go. Clicking selects the specialty (and tells the page through `onSelect`).
 */
export function SpecialtyBubbles({ title, summary, doctors, selected: selectedProp, onSelect }: Props) {
  const [ownSelection, setOwnSelection] = useState<Specialty | null>(null);
  const [hovered, setHovered] = useState<Specialty | null>(null);
  const selected = selectedProp !== undefined ? selectedProp : ownSelection;

  const groups = useMemo(
    () =>
      specialties
        .map((specialty) => {
          const people = doctors.filter((doctor) => doctor.specialty === specialty);
          const open = people.filter((doctor) => doctor.status === "Active").sort(byWhen)[0];
          return { specialty, tone: specialtyTone[specialty], people, open };
        })
        .filter(({ people }) => people.length > 0)
        .sort((a, b) => b.people.length - a.people.length),
    [doctors],
  );
  // The layout only restarts when a specialty appears, disappears or changes size.
  const signature = groups.map(({ specialty, people }) => `${specialty}:${people.length}`).join("|");

  const fieldRef = useRef<HTMLDivElement>(null);
  const elements = useRef(new Map<Specialty, HTMLButtonElement>());
  const bodies = useRef(new Map<Specialty, Body>());
  const radiiRef = useRef(new Map<Specialty, number>());
  const hoveredRef = useRef<Specialty | null>(null);
  const selectedRef = useRef<Specialty | null>(null);
  const wake = useRef<() => void>(() => {});
  const press = useRef<(specialty: Specialty, event: PointerEvent) => void>(() => {});
  const nudge = useRef<(from: Specialty) => void>(() => {});
  const suppressClick = useRef(false);

  useEffect(() => {
    hoveredRef.current = hovered;
    selectedRef.current = selected;
    wake.current();
  }, [hovered, selected]);

  useEffect(() => {
    const field = fieldRef.current;
    if (!field) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const list = groups.map(({ specialty, people }) => ({ specialty, count: people.length }));
    const radii = radiiRef.current;
    const pointer = { x: 0, y: 0, inside: false };
    const drag = { key: null as Specialty | null, active: false, startX: 0, startY: 0, offsetX: 0, offsetY: 0, id: 0, returning: null as Specialty | null };
    let width = field.clientWidth;
    let height = field.clientHeight;
    let lastWidth = width;
    let frame = 0;
    let calm = 0;
    let last = 0;

    const body = (key: Specialty) => bodies.current.get(key)!;
    const radiusOf = (key: Specialty) => radii.get(key)! * body(key).scale;
    const heavy = (key: Specialty) => (drag.active && drag.key === key) || drag.returning === key;

    /** Pushes two circles apart until they overlap by no more than `allow`. A held circle never gives way. */
    const separate = (a: Body, ra: number, b: Body, rb: number, aHeld: boolean, bHeld: boolean, allow: number) => {
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const distance = Math.hypot(dx, dy) || 0.01;
      const overlap = ra + rb - allow - distance;
      if (overlap <= 0) return;
      const nx = dx / distance;
      const ny = dy / distance;
      const share = aHeld ? 0 : bHeld ? 1 : (rb * rb) / (ra * ra + rb * rb);
      a.x -= nx * overlap * share;
      a.y -= ny * overlap * share;
      b.x += nx * overlap * (1 - share);
      b.y += ny * overlap * (1 - share);
      const approach = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
      if (approach < 0) {
        a.vx += nx * approach * share;
        a.vy += ny * approach * share;
        b.vx -= nx * approach * (1 - share);
        b.vy -= ny * approach * (1 - share);
      }
    };

    /** Lays the circles out as a packed cluster: everything is pulled to the middle (`shape` sets how much harder up and down), overlaps slide apart so the circles just touch. */
    const pack = (unit: number, shape: number, rounds: number, area: number) => {
      const points: Point[] = list.map(({ specialty, count }, index) => ({
        key: specialty,
        r: unit * Math.sqrt(count),
        x: (width * (index + 0.5)) / list.length,
        y: area / 2 + (index % 2 ? 1 : -1) * area * 0.12,
        vx: 0, vy: 0, scale: 1, sv: 0, homeX: 0, homeY: 0,
      }));
      for (let round = 0; round < rounds; round++) {
        for (const point of points) {
          point.x += (width / 2 - point.x) * 0.03;
          point.y += (area / 2 - point.y) * Math.min(0.5, 0.03 * shape);
        }
        for (let pass = 0; pass < 3; pass++) {
          for (let i = 0; i < points.length; i++) {
            for (let j = i + 1; j < points.length; j++) separate(points[i], points[i].r, points[j], points[j].r, false, false, 0);
          }
        }
      }
      const left = Math.min(...points.map((p) => p.x - p.r));
      const right = Math.max(...points.map((p) => p.x + p.r));
      const top = Math.min(...points.map((p) => p.y - p.r));
      const bottom = Math.max(...points.map((p) => p.y + p.r));
      return { points, left, right, top, bottom, fit: Math.min((width - 2) / (right - left), area / (bottom - top)) };
    };

    /** Finds the circle size at which the cluster just fills the space available. */
    const solve = (shape: number, rounds: number, area: number, from: number, ceiling: number) => {
      let unit = from;
      let result = pack(unit, shape, rounds, area);
      for (let attempt = 0; attempt < 8 && (result.fit < 0.985 || result.fit > 1.03); attempt++) {
        unit = Math.min(unit * Math.min(Math.max(result.fit, 0.8), 1.25), ceiling);
        result = pack(unit, shape, rounds, area);
        if (unit >= ceiling && result.fit > 1) break;
      }
      return { unit, result };
    };

    /**
     * Circle area follows headcount (radius grows with the square root). Of several cluster shapes, the one that lets the
     * circles grow largest wins, and the field is then cut to exactly the cluster's height: nothing empty above or below.
     */
    const measure = () => {
      field.style.height = "";
      width = field.clientWidth;
      const available = field.clientHeight - PAD * 2;
      const total = list.reduce((sum, { count }) => sum + count, 0);
      const most = Math.max(...list.map(({ count }) => count));
      const ceiling = available / 2 / Math.sqrt(most);
      const start = Math.min(Math.sqrt((0.6 * width * available) / (Math.PI * total)), ceiling);

      let best = { shape: SHAPES[0], unit: 0 };
      for (const shape of SHAPES) {
        const { unit } = solve(shape, 450, available, start, ceiling);
        if (unit > best.unit) best = { shape, unit };
      }
      const { unit, result } = solve(best.shape, 1600, available, best.unit, ceiling);
      const shiftX = width / 2 - (result.left + result.right) / 2;
      const shiftY = PAD - result.top;
      height = Math.ceil(result.bottom - result.top) + PAD * 2;
      field.style.height = `${height}px`;

      // A wide banner has room to spare: the circles keep their heights but drift apart left to right, evenly, up to MAX_GAP.
      const order = [...result.points].sort((a, b) => a.x - b.x);
      const gap = Math.min(MAX_GAP, Math.max(0, width - 2 - (result.right - result.left)) / Math.max(1, order.length - 1));
      const spread = new Map(order.map((point, rank) => [point.key, (rank - (order.length - 1) / 2) * gap]));

      result.points.forEach((point) => {
        radii.set(point.key, point.r);
        const home = { homeX: point.x + shiftX + (spread.get(point.key) ?? 0), homeY: point.y + shiftY };
        const known = bodies.current.get(point.key);
        if (known) Object.assign(known, home);
        else bodies.current.set(point.key, { x: home.homeX, y: home.homeY, vx: 0, vy: 0, scale: 1, sv: 0, ...home });
        const element = elements.current.get(point.key);
        if (!element) return;
        element.style.width = element.style.height = `${point.r * 2}px`;
        element.style.setProperty("--d", `${point.r * 2}px`);
      });
      void unit;
    };

    /** A hovered circle swells until its face is wide enough for the details written inside, as far as the banner is tall. */
    const swell = (key: Specialty) => {
      const diameter = radii.get(key)! * 2;
      return Math.max(1.12, Math.min(HOVER_D, height - 2) / diameter);
    };
    const scaleFor = (key: Specialty) => {
      if (drag.key === key) return drag.active ? 1.1 : swell(key) * 0.97;
      if (hoveredRef.current === key) return swell(key);
      return selectedRef.current === key ? 1.06 : 1;
    };

    const step = (dt: number) => {
      const before = list.map(({ specialty }) => ({ x: body(specialty).x, y: body(specialty).y, scale: body(specialty).scale }));
      const mean = list.reduce((sum, { specialty }) => sum + radii.get(specialty)!, 0) / list.length;
      const ax = new Map<Specialty, number>();
      const ay = new Map<Specialty, number>();

      for (const { specialty } of list) {
        const b = body(specialty);
        const held = drag.active && drag.key === specialty;
        const targetScale = scaleFor(specialty);
        let targetX = held ? pointer.x - drag.offsetX : b.homeX;
        let targetY = held ? pointer.y - drag.offsetY : b.homeY;
        if (!held && pointer.inside && hoveredRef.current === specialty && !drag.key) {
          // The hovered circle leans a little towards the pointer.
          const reach = radii.get(specialty)! * 0.12;
          targetX += Math.max(-reach, Math.min(reach, (pointer.x - b.homeX) * 0.14));
          targetY += Math.max(-reach, Math.min(reach, (pointer.y - b.homeY) * 0.14));
        }
        if (reduce) {
          b.scale = targetScale;
          b.x = targetX;
          b.y = targetY;
          b.vx = b.vy = 0;
          continue;
        }
        // Scale is a gentle under-damped spring, so a circle swells with a hint of overshoot instead of snapping.
        b.sv += ((targetScale - b.scale) * 230 - b.sv * 17) * dt;
        b.scale += b.sv * dt;
        // Position springs towards home (or the pointer); a released circle settles with a small bounce.
        const homing = drag.returning === specialty;
        const stiffness = held ? 420 : homing ? 170 : 95;
        const damping = held ? 36 : homing ? 20 : 14;
        ax.set(specialty, (targetX - b.x) * stiffness - b.vx * damping);
        ay.set(specialty, (targetY - b.y) * stiffness - b.vy * damping);
      }

      if (!reduce) {
        // Neighbours yield with a soft push: heavier (bigger) circles move less, and a held one doesn't move at all.
        for (let i = 0; i < list.length; i++) {
          for (let j = i + 1; j < list.length; j++) {
            const ka = list[i].specialty;
            const kb = list[j].specialty;
            const a = body(ka);
            const b = body(kb);
            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const distance = Math.hypot(dx, dy) || 0.01;
            const overlap = radiusOf(ka) + radiusOf(kb) - distance;
            if (overlap <= 0) continue;
            const nx = dx / distance;
            const ny = dy / distance;
            const approach = Math.max(0, -((b.vx - a.vx) * nx + (b.vy - a.vy) * ny));
            const force = 900 * overlap + 30 * approach;
            const massA = Math.pow(radii.get(ka)! / mean, 2);
            const massB = Math.pow(radii.get(kb)! / mean, 2);
            if (!heavy(ka)) {
              ax.set(ka, ax.get(ka)! - (nx * force) / massA);
              ay.set(ka, ay.get(ka)! - (ny * force) / massA);
            }
            if (!heavy(kb)) {
              ax.set(kb, ax.get(kb)! + (nx * force) / massB);
              ay.set(kb, ay.get(kb)! + (ny * force) / massB);
            }
          }
        }
        for (const { specialty } of list) {
          const b = body(specialty);
          b.vx += ax.get(specialty)! * dt;
          b.vy += ay.get(specialty)! * dt;
          b.x += b.vx * dt;
          b.y += b.vy * dt;
        }
      }

      // Backstop: a fast circle can't sink into another by more than a few pixels.
      for (let pass = 0; pass < 3; pass++) {
        for (let i = 0; i < list.length; i++) {
          for (let j = i + 1; j < list.length; j++) {
            const a = list[i].specialty;
            const c = list[j].specialty;
            const held = heavy(a) || heavy(c);
            separate(body(a), radiusOf(a), body(c), radiusOf(c), heavy(a), heavy(c), reduce || held ? 0 : SOFT);
          }
        }
      }

      if (drag.returning) {
        const b = body(drag.returning);
        if (Math.hypot(b.x - b.homeX, b.y - b.homeY) < 3 && Math.hypot(b.vx, b.vy) < 25) drag.returning = null;
      }

      let moved = 0;
      list.forEach(({ specialty }, index) => {
        const b = body(specialty);
        const radius = radiusOf(specialty);
        const base = radii.get(specialty)!;
        if (b.x < radius || b.x > width - radius) {
          b.x = Math.min(Math.max(b.x, radius), width - radius);
          b.vx *= -0.2;
        }
        if (b.y < radius || b.y > height - radius) {
          b.y = Math.min(Math.max(b.y, radius), height - radius);
          b.vy *= -0.2;
        }
        moved += Math.abs(b.x - before[index].x) + Math.abs(b.y - before[index].y) + Math.abs(b.scale - before[index].scale) * 100;
        const element = elements.current.get(specialty);
        if (element) {
          element.style.transform = `translate(${b.x - base}px, ${b.y - base}px) scale(${b.scale})`;
          // The details inside a swollen circle are drawn at a fixed size, so they divide the swell back out.
          element.style.setProperty("--s", String(b.scale));
        }
      });
      return moved;
    };

    const tick = (now: number) => {
      const elapsed = Math.min(0.05, last ? (now - last) / 1000 : 0.016);
      last = now;
      // Two half-steps when a frame runs long keep the springs stable.
      const steps = elapsed > 0.022 ? 2 : 1;
      let moved = 0;
      for (let i = 0; i < steps; i++) moved += step(elapsed / steps);
      calm = moved < 0.02 * steps && !drag.active && !drag.returning ? calm + 1 : 0;
      // Once everything has come to rest the loop stops; any interaction starts it again.
      frame = calm > 8 ? 0 : requestAnimationFrame(tick);
    };
    const run = () => {
      calm = 0;
      if (reduce) {
        step(1 / 60);
        return;
      }
      if (frame) return;
      last = 0;
      frame = requestAnimationFrame(tick);
    };
    wake.current = run;

    nudge.current = (from) => {
      if (reduce) return;
      const origin = body(from);
      for (const { specialty } of list) {
        if (specialty === from) continue;
        const b = body(specialty);
        const dx = b.x - origin.x;
        const dy = b.y - origin.y;
        const distance = Math.hypot(dx, dy) || 1;
        b.vx += (dx / distance) * 70;
        b.vy += (dy / distance) * 70;
      }
      origin.sv += 0.9;
      run();
    };

    const local = (event: PointerEvent) => {
      const box = field.getBoundingClientRect();
      pointer.x = event.clientX - box.left;
      pointer.y = event.clientY - box.top;
    };

    press.current = (key, event) => {
      if (event.button !== 0) return;
      local(event);
      const b = body(key);
      drag.key = key;
      drag.active = false;
      drag.id = event.pointerId;
      drag.startX = pointer.x;
      drag.startY = pointer.y;
      drag.offsetX = pointer.x - b.x;
      drag.offsetY = pointer.y - b.y;
      run();
    };
    const onMove = (event: PointerEvent) => {
      local(event);
      pointer.inside = true;
      if (!drag.key) {
        if (hoveredRef.current) run();
        return;
      }
      if (event.pointerId !== drag.id) return;
      if (!drag.active && Math.hypot(pointer.x - drag.startX, pointer.y - drag.startY) > DRAG_FROM) {
        drag.active = true;
        try {
          field.setPointerCapture(event.pointerId);
        } catch {
          // The pointer is already gone; the drag simply ends with the next release.
        }
        field.dataset.dragging = "";
      }
      if (drag.active) run();
    };
    const onRelease = (event: PointerEvent) => {
      if (!drag.key || event.pointerId !== drag.id) return;
      if (drag.active) {
        suppressClick.current = true;
        window.setTimeout(() => (suppressClick.current = false), 0);
        if (field.hasPointerCapture(event.pointerId)) field.releasePointerCapture(event.pointerId);
        delete field.dataset.dragging;
        drag.returning = drag.key;
      }
      drag.key = null;
      drag.active = false;
      run();
    };
    const onLeave = () => {
      pointer.inside = false;
      run();
    };
    field.addEventListener("pointermove", onMove);
    field.addEventListener("pointerup", onRelease);
    field.addEventListener("pointercancel", onRelease);
    field.addEventListener("pointerleave", onLeave);

    measure();
    // First paint: every circle is already at its place in the cluster.
    list.forEach(({ specialty }) => {
      const b = body(specialty);
      b.x = b.homeX;
      b.y = b.homeY;
    });
    step(1 / 60);
    // Only a change of width re-packs the circles; the field's own height follows from the packing.
    const resizer = new ResizeObserver(() => {
      if (Math.abs(field.clientWidth - lastWidth) < 1) return;
      lastWidth = field.clientWidth;
      measure();
      run();
    });
    resizer.observe(field);

    return () => {
      cancelAnimationFrame(frame);
      resizer.disconnect();
      field.removeEventListener("pointermove", onMove);
      field.removeEventListener("pointerup", onRelease);
      field.removeEventListener("pointercancel", onRelease);
      field.removeEventListener("pointerleave", onLeave);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `signature` stands for the group list.
  }, [signature]);

  const choose = (specialty: Specialty) => {
    if (suppressClick.current) return;
    const next = selected === specialty ? null : specialty;
    if (selectedProp === undefined) setOwnSelection(next);
    onSelect?.(next);
    nudge.current(specialty);
  };

  const enter = (specialty: Specialty) => setHovered(specialty);
  const leave = (specialty: Specialty) => setHovered((current) => (current === specialty ? null : current));

  return (
    <section className={styles.bubbles} aria-label="Care team overview">
      <div className={styles.copy}>
        <h2>{title}</h2>
        <p>{summary}</p>
      </div>

      <div ref={fieldRef} className={styles.field} role="group" aria-label="Doctors by specialty">
        {groups.map(({ specialty, tone, people, open }, index) => (
          <button
            key={specialty}
            type="button"
            ref={(element) => {
              if (element) elements.current.set(specialty, element);
              else elements.current.delete(specialty);
            }}
            className={styles.bubble}
            data-tone={tone}
            data-active={hovered === specialty || undefined}
            aria-pressed={selected === specialty}
            aria-label={`${specialty}, ${people.length} ${people.length === 1 ? "doctor" : "doctors"}: ${people.map(surname).join(", ")}`}
            style={{ "--i": index } as CSSProperties}
            onPointerDown={(event: ReactPointerEvent) => press.current(specialty, event.nativeEvent)}
            onPointerEnter={() => enter(specialty)}
            onPointerLeave={() => leave(specialty)}
            onFocus={() => enter(specialty)}
            onBlur={() => leave(specialty)}
            onClick={() => choose(specialty)}
          >
            <span className={styles.face}>
              <span className={styles.rest}>
                <b>{people.length}</b>
                <span>{specialty}</span>
              </span>
              {/* On hover the count gives way to who is inside and when they are next free. */}
              <span className={styles.detail} aria-hidden>
                <strong>{specialty}</strong>
                <span>{people.map(surname).join(", ")}</span>
                <small>{open ? `Next free ${when(open)} at ${formatTime(open.next.time)}` : "No one is free right now"}</small>
              </span>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
