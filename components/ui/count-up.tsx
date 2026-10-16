"use client";

import { useEffect, useState } from "react";

// Splits "$16,073", "9.3%" or "1,248" into prefix, number and suffix. Text without a number is shown as is.
const pattern = /^(\D*)([\d,]+(?:\.\d+)?)(.*)$/;

type CountUpProps = {
  /** Formatted value, e.g. "1,248" or "$16,073". The number counts up from zero. */
  value: string;
  duration?: number;
};

/** Counts a formatted number up from zero on mount. Users who prefer reduced motion get the final value at once. */
export function CountUp({ value, duration = 2400 }: CountUpProps) {
  const match = value.match(pattern);
  const [prefix, digits, suffix] = match ? [match[1], match[2], match[3]] : ["", "", value];
  const target = match ? Number(digits.replace(/,/g, "")) : null;
  const decimals = digits.includes(".") ? digits.split(".")[1].length : 0;

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (target === null) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = reduceMotion ? 1 : Math.min(1, (now - start) / duration);
      // Ease-in-out sine: starts and lands gently, with no sudden jumps at either end.
      setCurrent(target * (1 - (Math.cos(Math.PI * progress) + 1) / 2));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  if (target === null) return <>{value}</>;

  const formatted = current.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <>
      {prefix}
      {formatted}
      {suffix}
    </>
  );
}
