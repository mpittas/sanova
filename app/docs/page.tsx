import type { Metadata } from "next";
import Link from "next/link";
import { LuArrowLeft, LuArrowRight, LuDownload, LuPlus, LuTrash2 } from "react-icons/lu";
import { LogoMark } from "@/components/logo";
import { Button, type ButtonSize, type ButtonVariant } from "@/components/ui/button";
import { palette, paletteMeta, semantic, typeScale, type PaletteName } from "@/lib/tokens";
import { CopySwatch } from "./copy-swatch";
import styles from "./docs.module.css";

export const metadata: Metadata = {
  title: "Design System",
  description: "Sanova colors, typography and button components.",
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

export default function DocsPage() {
  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <Link href="/" className={styles.brand} aria-label="Sanova dashboard">
          <LogoMark size={36} />
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
        </nav>

        <main className={styles.content}>
          <div>
            <h1 className="text-h1">Design System</h1>
            <p className="text-body-lg text-muted" style={{ marginTop: 8, maxWidth: 560 }}>
              The building blocks of the Sanova interface. Everything here is generated from{" "}
              <code className="mono">lib/tokens.ts</code> and <code className="mono">app/globals.css</code>.
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
                    Geist Mono â€” 0123456789 {"{ }"} =&gt;
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
                        {style.size}px / {style.lineHeight} Â· {style.weight} Â· {style.tracking}
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
              <p className="text-caption text-muted">Heights: sm 34px Â· md 44px Â· lg 54px</p>
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
                <Button variant="secondary" iconOnly shape="rounded" aria-label="Add">
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
                Always give icon-only buttons an <code className="mono">aria-label</code>. Use{" "}
                <code className="mono">shape=&quot;rounded&quot;</code> for the squircle variant.
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
                Hover, active (pressed) and keyboard focus styles are built in â€” tab to a button to see the focus ring.
              </p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
