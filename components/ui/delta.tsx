import { LuArrowDown, LuArrowUp } from "react-icons/lu";

type DeltaProps = {
  /** The change, already formatted: "12%", "2". */
  value: string;
  direction?: "up" | "down";
  /** `success` is green, `danger` is red. Colour is independent of direction (a rising "at risk" count is bad). */
  tone?: "success" | "danger";
  /** `text` is coloured text; `chip` adds a tinted background. */
  variant?: "text" | "chip";
};

/** Change indicator with an arrow, e.g. "↑ 12%". */
export function Delta({ value, direction = "up", tone = "success", variant = "text" }: DeltaProps) {
  const Arrow = direction === "up" ? LuArrowUp : LuArrowDown;
  return (
    <span className={variant === "chip" ? "delta delta-chip" : "delta"} data-tone={tone}>
      <Arrow aria-hidden />
      <span className="sr-only">{direction === "up" ? "Up " : "Down "}</span>
      {value}
    </span>
  );
}
