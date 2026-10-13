"use client";

import { useState } from "react";
import styles from "./docs.module.css";

/** Colour swatch that copies its hex value on click. */
export function CopySwatch({ hex, label, variable }: { hex: string; label: string; variable: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(hex);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // Clipboard can be unavailable (insecure context); the hex is still visible.
    }
  }

  return (
    <button type="button" className={styles.swatch} onClick={copy} title={`${variable} — click to copy`}>
      <span className={styles.chipColor} style={{ background: hex }} />
      <span className="text-label">{label}</span>
      <span className={`mono text-caption text-muted`}>{copied ? "Copied!" : hex}</span>
    </button>
  );
}
