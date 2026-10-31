# Figma sync

Files in this folder keep the Figma file `kh9tzGfOy87OHDkuoNekJ3` and the React code mapped to each other.

| File | Role | Edit by hand? |
| --- | --- | --- |
| `component-map.json` | Source of truth: React component → Figma component, status (`figma`, `local`, `missing`), variants, notes; plus the page list (name, route, entry) | Yes |
| `manifest.json` | Generated: adds content hashes, each page's `uses` list and import tree | No |
| `synced.json` | Hashes recorded the last time each item was pushed to Figma | No (use `figma:mark`) |

## Update loop

1. Change code (a component, `lib/tokens.ts`, `app/ui.css`, or a page).
2. `npm run figma:sync` regenerates `manifest.json`.
3. `npm run figma:check` lists what is stale: tokens, shared components, components still missing from Figma, pages to refresh. Do tokens first, then components, then pages.
4. Push those items to Figma following the rules in `CLAUDE.md` (Figma sections 1–10).
5. `npm run figma:mark -- Button Chip "Dashboard"` (or `all`) records what you pushed. Commit `figma/`.

## Adding things

- New shared component: add an entry to `component-map.json` (`react`, `file`, `status`, `figma`, `variants`, `notes`).
- New page: add `{ name, route, entry }` to `pages`.
- After building a `missing` or `local` component in Figma, change its `status` to `figma` once it lives on the Design System page.
- A page's `uses` list is derived from its imports, so it updates itself.
