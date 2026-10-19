import Image from "next/image";
import type { ReactNode } from "react";
import type { Tone } from "@/components/ui/tone-tile";
import type { DepartmentName } from "./data";
import styles from "./department-art.module.css";

/**
 * Backdrops for the department renders. Every one is built from the department's own tone, so the same pattern
 * looks right in sage, coral, amber, sky, lavender or teal. The simplified renders have real alpha transparency
 * and composite directly over each pattern without color blending or background-removal tricks.
 */
export const artVariants = [
  { id: "wash", label: "Wash", note: "Soft colour pooling in two corners." },
  { id: "rings", label: "Rings", note: "Concentric rings radiating from behind the model." },
  { id: "glow", label: "Glow", note: "A bright halo rising from behind the model." },
  { id: "dots", label: "Dots", note: "A fine dot grid on a warm gradient." },
  { id: "clouds", label: "Clouds", note: "Two soft white shapes drifting in a gradient." },
  { id: "lines", label: "Lines", note: "Fine diagonal hatching on a gradient." },
  { id: "blobs", label: "Blobs", note: "Two colour blobs meeting in the middle." },
  { id: "grid", label: "Grid", note: "A light blueprint grid on a vertical fade." },
] as const;

export type ArtVariant = (typeof artVariants)[number]["id"];

type DepartmentArtProps = {
  name: DepartmentName;
  tone: Tone;
  variant?: ArtVariant;
  className?: string;
  compact?: boolean;
  /** Badges and buttons laid over the artwork. */
  children?: ReactNode;
};

export function DepartmentArt({ name, tone, variant = "wash", className, compact = false, children }: DepartmentArtProps) {
  const image = `/images/departments/${name.toLowerCase().replaceAll(" ", "-")}-simple.png`;

  return (
    <div className={[styles.art, compact && styles.compact, className].filter(Boolean).join(" ")} data-tone={tone} data-variant={variant}>
      <div className={styles.model}>
      <Image
        src={image}
        alt=""
        fill
        sizes="176px"
        className={styles.image}
      />
      </div>
      {children}
    </div>
  );
}
