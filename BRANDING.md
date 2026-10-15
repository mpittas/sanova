# Sanova brand guide

Sanova should feel calm, clear, human, and precise. Green anchors the identity; generous space, restrained typography, and softly flowing texture give it warmth.

This guide records visual direction for brand artwork and future design work. Exact interface colors, typography, radii, shadows, spacing, sizes, and motion are defined in [lib/tokens.ts](lib/tokens.ts) and rendered on the `/docs` page. Shared component styles remain in [app/ui.css](app/ui.css), which uses those tokens as CSS variables. Update those sources when changing implementation values rather than creating a parallel token system here.

## Visual reference

![White Sanova mark on emerald green flowing dither bands](public/branding/sanova-dither-flat-logo-v2.png)

This reference establishes the direction: an almost flat white logo over a green background with flowing dithered light and shadow. It replaces the earlier heavy, sculpted logo treatment as the styling reference. Use [components/logo.tsx](components/logo.tsx) for the canonical logo geometry; generated artwork is a styling reference, not a replacement master logo.

## Logo

- Preserve the mark's proportions, curved connections, circular nodes, detached dots, and negative spaces. Scale uniformly and keep its silhouette crisp.
- Default to a flat mark: primary green on light surfaces, white on dark green brand backgrounds.
- In large brand artwork, an optional inner shadow may add a barely perceptible edge. Start around 1–2% opacity with a narrow, soft falloff. If the shading reads as a visible effect at normal viewing size, reduce it or remove it.
- Keep the face visually uniform. Avoid thick bevels, extrusion, inflated shapes, glossy highlights, external drop shadows, and shadow halos around the mark. The background supplies the depth.
- Give the logo generous clear space. For standalone square artwork, start with a centered mark occupying roughly half the canvas width. This is a composition starting point, not a change to interface logo sizing.

## Signature background: flowing dither

Flowing dither is a core Sanova brand element: broad organic bands of green light and shade, with fine stippled or halftone transitions. The texture should feel soft and atmospheric while remaining visibly intentional.

### Color and form

- Anchor the field in primary green `#0B865A`.
- Build depth with primary 600 `#086E49` and 700 `#07583B`. Use primary 800 `#084630` sparingly in the deepest areas.
- Use primary 400 `#3FB583` and restrained mint tones for illuminated bands. Keep the overall result recognizably green.
- Let broad, gently curved bands drift diagonally across the canvas. Use asymmetric placement and gradual transitions, with calmer areas around important content.
- Concentrate visible dithering in tonal transitions. Vary dot density gradually; avoid a uniform polka-dot overlay or a hard repeating tile.
- Keep grain fine enough to read as texture at the intended display size. Avoid coarse speckles, muddy noise, obvious repetition, and sharp stripes.

### Where to use it

Use the expressive background on brand covers, marketing heroes, launch artwork, social graphics, and other large identity surfaces. Let one main subject lead each composition.

For product banners, a quieter adaptation may use the pale primary tints and much lower texture contrast. Keep body text and controls over calm, readable areas. Cards, tables, forms, charts, and dense clinical information should retain the clean surfaces defined by the interface system.

The current `.grain` utility in `app/ui.css` is a subtle noise treatment. It is related in mood, but it does not implement the flowing dither bands. This guide establishes the new brand direction; it does not imply that all existing pages already use it.

The reference PNG includes the logo. Use it as a complete composition or styling reference. For a reusable background behind new content, create a separate background-only asset rather than placing content over the embedded mark.

## Color roles

These representative values come from `lib/tokens.ts`. In interface code, use the corresponding tokens and semantic aliases.

| Family | Representative value | Role |
| --- | --- | --- |
| Primary green | `#0B865A` | Brand identity, active states, primary accents |
| Blue | `#2F6BF2` | Informational and scheduled states |
| Success | `#10B981` | Confirmations, completed states, positive trends |
| Violet | `#8B5CF6` | Supporting accent, doctors, records |
| Coral | `#F0583A` | Alerts, destructive actions, revenue accents |
| Amber | `#F59E0B` | Warnings and highlights |
| Teal | `#14B8A6` | Supporting highlights |
| Text / neutral 900 | `#0F172A` | Primary text |
| Page background | `#F5F7FB` | Clean interface ground |
| Surface | `#FFFFFF` | Cards, inputs, reversed logo |

Keep green dominant in brand imagery. Introduce supporting colors for a clear purpose rather than mixing every accent into one background. Solid interface buttons use primary 600 at rest and primary 700 on hover, as documented in `/docs`; the brand swatch at 500 does not override that guidance.

## Typography and composition

Use Geist Sans for headings, labels, and body copy; Geist Mono for code and precise values. Follow the existing type scale. Favor clear hierarchy, short headings, generous space, and deliberate alignment.

Use the established corner and surface tokens for interface work. Keep depth restrained and functional. The flat-logo rule applies to the brand mark; existing soft card and floating-panel shadows retain their interface roles.

Keep texture behind content and preserve readable contrast across every crop. Background gradients should never carry essential meaning or make status, text, or controls harder to distinguish.

## Reusable image brief

Use the canonical logo as a visual input when generating brand artwork. Start with this brief and adapt the composition to the requested format:

> Sanova brand artwork with a rich medical green background anchored in #0B865A, shaded with #086E49 and #07583B, with restrained #3FB583 highlights. Broad, softly curved diagonal bands of light and shade blend through fine dithered halftone transitions. Calm negative space and a tactile, refined finish. Preserve the supplied Sanova logo silhouette exactly, including its curved connections, nodes, detached dots, and negative spaces. Render it matte white and almost completely flat. At most, add barely visible narrow inner shading around 1–2% opacity. No extrusion, thick bevel, glossy highlights, inflated volume, external drop shadows, or shadow halos. Let the background provide depth. No added text or decorative objects unless requested.

For a background-only asset, omit the logo instructions and explicitly request no logo or text. When editing an existing composition, specify that the background, crop, logo position, scale, and geometry should stay unchanged unless the brief calls for a change.

## Review before delivery

- Does the mark match the canonical geometry and remain almost flat?
- Does the background read as green flowing dither with a clear focal area?
- Are colors, type, and interface treatments consistent with the source tokens?
- Are text, controls, and logo edges clear at the final display size and crop?
- Is the composition calm, with texture supporting the content?

Reference artwork was produced with the built-in image generation tool. Keep future reference images versioned and update this guide when the brand direction changes.
