import type { Metadata } from "next";
import Link from "next/link";
import { LuArrowLeft, LuArrowRight, LuDownload, LuPlus, LuTrash2 } from "react-icons/lu";
import { LogoMark } from "@/components/logo";
import { Button, type ButtonSize, type ButtonVariant } from "@/components/ui/button";
import { contrastRatio, lightness, palette, paletteMeta, semantic, typeScale, type PaletteName } from "@/lib/tokens";
import { ComponentDocs, componentNav } from "./component-docs";
import { CopySwatch } from "./copy-swatch";
import styles from "./docs.module.css";

export const metadata: Metadata = {
  title: "Design System",
  description: "Sanova colors, typography, buttons and reusable components.",
};

const sections = [
  { id: "colors", label: "Colors" },
  { id: "typography", label: "Typography" },
  { id: "buttons", label: "Buttons" },
];

const variants: { name: ButtonVariant; usage: string }[] = [
  { name: "primary", usage: "Main action on a screen" },
  { name: "secondary", usage: "Neutral / secondary action" },
  { name: "soft", usage: "Low-emphasis, tinted action" },
  { name: "ghost", usage: "Tertiary and toolbar actions" },
  { name: "danger", usage: "Destructive action" },
];

const sizes: ButtonSize[] = ["sm", "md", "lg"];

const paletteNames = Object.keys(palette) as PaletteName[];

const primaryUsage: { step: keyof typeof palette.primary; use: string }[] = [
  { step: "50", use: "Tinted surfaces: selected rows, active sidebar item, soft button background" },
  { step: "100", use: "Hover on tinted surfaces, outgoing chat bubbles, unread highlights" },
  { step: "200", use: "Borders on tinted surfaces, light chart series" },
  { step: "300", use: "Secondary chart series, decorative accents" },
  { step: "400", use: "Chart series, focus ring, illustrations" },
  { step: "500", use: "Icons, progress bars, chart series, counters. Lowest step that passes for white text" },
  { step: "600", use: "Solid buttons (resting), links, text on white and on tints" },
  { step: "700", use: "Button hover and pressed, text on tinted backgrounds" },
  { step: "800", use: "Headings on tints, dark surfaces" },
  { step: "900", use: "Deepest text and dark surfaces" },
];

export default function DocsPage() {
  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <Link href="/" className={styles.brand} aria-label="Sanova dashboard">
          <LogoMark size={44} />
          <span className="text-h4">Sanova</span>
          <span className={styles.badge}>Design System</span>
        </Link>
        <Button href="/" variant="secondary" size="sm" iconLeft={<LuArrowLeft />}>
          Back to dashboard
        </Button>
      </header>

      <div className={styles.layout}>
        <nav className={styles.nav} aria-label="Design system sections">
          {sections.map((section) => (
            <a key={section.id} href={`#${section.id}`}>
              {section.label}
            </a>
          ))}
          <span className={styles.navGroup}>Components</span>
          {componentNav.map((section) => (
            <a key={section.id} href={`#${section.id}`}>
              {section.label}
            </a>
          ))}
        </nav>

        <main className={styles.content}>
          <div>
            <h1 className="text-h1">Design System</h1>
            <p className="text-body-lg text-muted" style={{ marginTop: 8, maxWidth: 560 }}>
              The building blocks of the Sanova interface. Everything here is generated from{" "}
              <code className="mono">lib/tokens.ts</code>, <code className="mono">app/globals.css</code> and{" "}
              <code className="mono">app/ui.css</code>.
            </p>
          </div>

          {/* ---------- Colors ---------- */}
          <section id="colors" className={styles.section}>
            <h2 className="text-h2">Colors</h2>
            <p className="text-body text-muted">
              Click any swatch to copy its hex value. Use the CSS variables, e.g.{" "}
              <code className="mono">var(--color-primary-500)</code>.
            </p>

            <div className={styles.panel}>
              <h3 className="text-h4">Semantic</h3>
              <div className={styles.swatchGrid}>
                {semantic.map((token) => (
                  <div key={token.name} className={styles.semantic}>
                    <CopySwatch hex={token.value} label={token.name} variable={`--color-${token.name}`} />
                    <span className="text-caption text-muted">{token.usage}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.panel}>
              <div className={styles.panelHeader}>
                <h3 className="text-h4">Using the primary green</h3>
                <span className="text-small text-muted">Which step to reach for, and how bright it is</span>
              </div>
              <div className={styles.usageTable} role="table" aria-label="Primary green usage guide">
                <div className={styles.usageHead} role="row">
                  <span role="columnheader">Step</span>
                  <span role="columnheader">Brightness</span>
                  <span role="columnheader">With white</span>
                  <span role="columnheader">Use it for</span>
                </div>
                {primaryUsage.map(({ step, use }) => {
                  const hex = palette.primary[step];
                  const ratio = contrastRatio(hex, "#FFFFFF");
                  return (
                    <div key={step} className={styles.usageRow} role="row">
                      <span className={styles.usageStep} role="cell">
                        <span className={styles.usageChip} style={{ background: hex }} />
                        <code className="mono text-label">{step}</code>
                      </span>
                      <span className="num text-small" role="cell">
                        {lightness(hex).toFixed(2)}
                      </span>
                      <span className="num text-small" role="cell" data-pass={ratio >= 4.5 ? "" : undefined}>
                        {ratio.toFixed(1)}:1
                      </span>
                      <span className="text-small text-muted" role="cell">
                        {use}
                      </span>
                    </div>
                  );
                })}
              </div>
              <p className="text-caption text-muted">
                Rules of thumb: a solid fill with white text should be at least 4.5:1 (ideally 5–7:1); hover is one step
                darker; use 500 and lighter for tints, charts and icons but never for small text on a tint; text on a tint
                should use 600 or darker. Brightness is OKLab lightness (0 black, 1 white); steps about 0.07 apart look
                clearly different.
              </p>
            </div>

            {paletteNames.map((name) => (
              <div key={name} className={styles.panel}>
                <div className={styles.panelHeader}>
                  <h3 className="text-h4">{paletteMeta[name].label}</h3>
                  <span className="text-small text-muted">{paletteMeta[name].usage}</span>
                </div>
                <div className={styles.scale}>
                  {Object.entries(palette[name]).map(([step, hex]) => (
                    <CopySwatch key={step} hex={hex} label={step} variable={`--color-${name}-${step}`} />
                  ))}
                </div>
              </div>
            ))}
          </section>

          {/* ---------- Typography ---------- */}
          <section id="typography" className={styles.section}>
            <h2 className="text-h2">Typography</h2>

            <div className={styles.panel}>
              <div className={styles.fontSpecimen}>
                <span className={styles.glyph}>Aa</span>
                <div>
                  <h3 className="text-h3">Geist</h3>
                  <p className="text-body text-muted">
                    By Vercel. Geist Sans for all interface text, Geist Mono for code and values.
                  </p>
                  <p className="text-body-lg" style={{ marginTop: 12 }}>
                    ABCDEFGHIJKLMNOPQRSTUVWXYZ
                    <br />
                    abcdefghijklmnopqrstuvwxyz
                    <br />
                    0123456789 $ % & ( ) ! ?
                  </p>
                  <p className="mono text-small text-muted" style={{ marginTop: 8 }}>
                    Geist Mono — 0123456789 {"{ }"} =&gt;
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.panel}>
              <h3 className="text-h4">Type scale</h3>
              <div className={styles.typeList}>
                {typeScale.map((style) => (
                  <div key={style.name} className={styles.typeRow}>
                    <div className={styles.typeMeta}>
                      <code className="mono text-label">.text-{style.name}</code>
                      <span className="text-caption text-muted">
                        {style.size}px / {style.lineHeight} · {style.weight} · {style.tracking}
                      </span>
                    </div>
                    <p className={`text-${style.name}`}>
                      {style.name === "stat" ? "$16,073" : "Clinic overview for today"}
                    </p>
                    <span className="text-caption text-subtle">{style.usage}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ---------- Buttons ---------- */}
          <section id="buttons" className={styles.section}>
            <h2 className="text-h2">Buttons</h2>
            <p className="text-body text-muted">
              Import <code className="mono">Button</code> from <code className="mono">@/components/ui/button</code>. Pass{" "}
              <code className="mono">href</code> to render a link with the same styles.
            </p>

            <div className={styles.panel}>
              <h3 className="text-h4">Variants</h3>
              <div className={styles.buttonTable}>
                {variants.map(({ name, usage }) => (
                  <div key={name} className={styles.buttonRow}>
                    <div className={styles.typeMeta}>
                      <code className="mono text-label">variant=&quot;{name}&quot;</code>
                      <span className="text-caption text-muted">{usage}</span>
                    </div>
                    <div className={styles.buttonRowItems}>
                      <Button variant={name}>Button</Button>
                      <Button variant={name} iconLeft={<LuPlus />}>
                        With icon
                      </Button>
                      <Button variant={name} disabled>
                        Disabled
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.panel}>
              <h3 className="text-h4">Sizes</h3>
              <div className={styles.buttonRowItems}>
                {sizes.map((size) => (
                  <Button key={size} size={size}>
                    {size === "sm" ? "Small" : size === "md" ? "Medium" : "Large"}
                  </Button>
                ))}
              </div>
              <p className="text-caption text-muted">Heights: sm 32px · md 44px · lg 52px. Corner radius: 8px · 12px · 14px.</p>
            </div>

            <div className={styles.panel}>
              <h3 className="text-h4">Icons</h3>
              <div className={styles.buttonRowItems}>
                <Button iconLeft={<LuPlus />}>Add patient</Button>
                <Button size="lg" iconLeft={<LuPlus />} iconRight={<LuArrowRight />}>
                  Book Appointment
                </Button>
                <Button variant="soft" iconLeft={<LuDownload />}>
                  Export
                </Button>
                <Button variant="danger" iconLeft={<LuTrash2 />}>
                  Delete
                </Button>
              </div>
              <h4 className="text-label" style={{ marginTop: 8 }}>
                Icon only
              </h4>
              <div className={styles.buttonRowItems}>
                <Button iconOnly aria-label="Add">
                  <LuPlus />
                </Button>
                <Button variant="secondary" iconOnly aria-label="Add">
                  <LuPlus />
                </Button>
                <Button variant="soft" iconOnly size="sm" aria-label="Add">
                  <LuPlus />
                </Button>
                <Button variant="ghost" iconOnly aria-label="Add">
                  <LuPlus />
                </Button>
              </div>
              <p className="text-caption text-muted">
                Always give icon-only buttons an <code className="mono">aria-label</code>.
              </p>
              <p className="text-caption text-muted">
                Every button on every page has the same slightly rounded corners (8px · 12px · 14px by size). There is no pill
                option; round shapes are reserved for chips, counters and avatars.
              </p>
            </div>

            <div className={styles.panel}>
              <h3 className="text-h4">States</h3>
              <div className={styles.buttonRowItems}>
                <Button loading>Saving</Button>
                <Button variant="secondary" loading>
                  Loading
                </Button>
                <Button disabled>Disabled</Button>
                <Button variant="secondary" disabled>
                  Disabled
                </Button>
              </div>
              <p className="text-caption text-muted">
                Hover, active (pressed) and keyboard focus styles are built in — tab to a button to see the focus ring.
              </p>
            </div>
          </section>

          <ComponentDocs />
        </main>
      </div>
    </div>
  );
}
