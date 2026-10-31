# Sanova — Claude project rules

## Figma: transferring HTML / React pages into Figma

Apply this every time the user asks to put a page, screen, section, or component from this repo (React/TSX, CSS modules, or static HTML) into Figma through the Figma MCP. The user should not need to restate any of it.

### 1. Setup and skills

- Load the Figma tools with one `ToolSearch` call using `select:` (batch every schema you expect to need).
- Before any `use_figma` call, load the `figma-use` skill, and the `figma-generate-design` skill for page or screen work. For reusable library assets (components, variants, variables, styles), load `figma-generate-library` instead. Include every loaded skill name in `skillNames` on each call.
- `figma-design-to-code` is for the reverse direction (Figma to code). Do not use it for this workflow.
- Raw static HTML with no React source: use `html_to_figma` if it is available in the session.
- Use `send_code_to_figma` (Figma Code layer) only when the user explicitly asks for a code import. The default output is editable design layers.

### 2. Files and pages

- **Sanova design-system file:** `kh9tzGfOy87OHDkuoNekJ3` (https://www.figma.com/design/kh9tzGfOy87OHDkuoNekJ3/Sanova).
- **Design system location:** the **Design System** page (`5:2`), frame **"Sanova Design System"** (`8:2`). It is local to this file, not a published library, so `search_design_system` will not find it. Find assets by scanning that page (`findAllWithCriteria` on `COMPONENT` and `COMPONENT_SET`) and by reading the local variable collections and styles.
- **Screens go on the UI page** (`0:1`). Use this page unless the user names another.
- **Ignore the subscribed community libraries** (Material 3, iOS and iPadOS 26/27, watchOS, visionOS, macOS). They are not Sanova's design system. Use them only when the user asks.
- Never add, edit, or delete components, variables, or styles in the Design System page unless the user asks for library work. If a token or component is missing, use the nearest match and report it.
- Never delete or overwrite existing Figma nodes without showing the user what will be removed and getting a yes.

### 3. Design system first (no hardcoded values)

1. Read the local variable collections (`Color`, `Radius`, `Spacing`) and the local text and effect styles listed in section 4.
2. Scan the Design System page for the component sets listed in section 5.
3. Reuse matching components as instances. Bind colours, spacing, and radii to variables, and apply text and effect styles. Hardcoded values are allowed only when no matching asset exists, and each one must be reported.
4. Pick each component's variant from the React component's defaults, not from what the caller passes. For example `<Button>` with no `variant` is `Variant=Primary, Size=Md`. State any mismatch.

### 4. Tokens: code to Figma

The source of truth is `lib/tokens.ts`, with CSS variables generated from it. Each row says which Figma variable or style to use.

**Colours** (collection `Color`, 88 variables)

| Code | Figma variable |
| --- | --- |
| `--color-primary-{50…900}`, `blue`, `success`, `violet`, `coral`, `amber`, `teal`, `neutral` `-{50…900}` | `primary/50` … `neutral/900` (same names) |
| `--color-white` | `base/white` |
| `--color-bg`, `--color-panel`, `--color-surface`, `--color-border` | `semantic/bg`, `semantic/panel`, `semantic/surface`, `semantic/border` |
| `--color-text`, `--color-text-muted`, `--color-text-subtle` | `semantic/text`, `semantic/text-muted`, `semantic/text-subtle` |
| `--color-scrim`, `--color-scrim-soft`, `--color-white-muted` | **Not in Figma.** Use `neutral/900` or `base/white` at the matching opacity (50%, 40%, 20%) and report it |

**Radius** (collection `Radius`)

| Code | Figma variable |
| --- | --- |
| `--radius-sm`, `md`, `xl`, `lg`, `2xl`, `pill`, `control` | `radius/sm`, `md`, `xl`, `lg`, `2xl`, `pill`, `control` |
| `--radius-xs` (6px) | **Not in Figma.** Use `radius/sm` (8px) and report it, or add the variable only if the user asks |

**Spacing** (collection `Spacing`, named by pixel value)

- Use `space/2`, `4`, `6`, `8`, `10`, `12`, `14`, `16`, `20`, `24`, `32`, `40`, `48`.
- **Not in Figma:** 18, 28, 36, 56 (`--space-18` etc.). Use the nearest value and report it.

**Text styles** (`Text/…`)

- `.text-display`, `h1`, `h2`, `h3`, `h4`, `stat`, `lead`, `body-lg`, `body`, `label`, `small`, `caption` map to `Text/display`, `Text/h1`, … `Text/caption` (same names).
- `mono` (code and values) maps to `Text/mono`.
- Figma also has `Text/button-lg`, `micro`, `counter`, `counter-sm`, `delta`, `delta-chip`, `small-medium`, `label-lg`, `overline`, `label-strong`. Use them where a component already uses them. Do not invent new ones.

**Effect styles** (`Shadow/…`)

| Code | Figma style |
| --- | --- |
| `--shadow-card` / `--shadow-xs` | `Shadow/card` (`--shadow-xs` has no exact match, so use `Shadow/hairline` and report it) |
| `--shadow-float` | `Shadow/float` |
| `--shadow-popover` (modal) | `Shadow/modal` |
| `--shadow-primary` | `Shadow/primary` |
| `--shadow-danger` | `Shadow/danger` |
| `--shadow-focus` / `--shadow-focus-danger` | `Shadow/focus` / `Shadow/focus-danger` |
| `--shadow-hairline` | `Shadow/hairline` |
| stepper current ring (`0 0 0 4px primary-100`) | `Shadow/ring-stepper` |
| `--shadow-control`, `raised`, `menu`, `drawer`, `cta`, `cta-lg`, `avatar-ring` | **Not in Figma.** Report each one that a component uses |

**Sizes**

- `--control-sm/md/lg/xl/chip/xs` (heights): read the height from the matching component variant (Button Sm, Md, Lg, and so on). Do not set heights by hand.
- `--icon-xs` … `--icon-2xl`: size the icon instance to match. Icon sizes are not variables.
- Motion tokens (`--duration-*`, `--ease-*`) have no Figma equivalent. Leave them out and say so.

### 5. Components: code to Figma

The design system has these component sets (on the Design System page) and standalone components. Look them up by name at the start of each session. Node IDs can change.

| React component (`components/…`) | Figma component |
| --- | --- |
| `Button` (`ui/button`) | **Button** set: `Variant` (Primary, Secondary, Soft, Ghost, Danger), `Size` (Sm, Md, Lg), `State` (Default, Hover, Disabled). Props: Label, Show left icon, Left icon, Show right icon, Right icon |
| `Button` icon-only | **Icon Button** set |
| `Chip` | **Chip** (Tone, Variant, Size) |
| `Counter` | **Counter** (Tone, Size) |
| `Delta` | **Delta** (Style, Tone, Direction) |
| `Avatar` / rounded | **Avatar** (Tint, Size) / **Avatar Rounded** |
| `ToneTile` | **Tone Tile** |
| `SearchInput` | **Search Input** |
| `TextInput` | **Text Input** (Show icon, Size, State) |
| `Select` / `Select` with icon | **Select** / **Select Field** |
| `Checkbox` | **Checkbox** |
| `Segmented` | **Segmented** |
| `Tabs` | **Tabs** |
| `FilterChips` | **Filter Chip** |
| `ChoiceChips` | **Choice Chip** |
| `ProgressBar` | **Progress Bar** (Tone, Size) |
| `Legend` item | **Legend Item** |
| `Card` | **Card** (Show header, Show description, Padding, Rounded) |
| `StatTile` | **Stat Tile** (Tone, Delta) |
| `InfoTile` | **Info Tile** (Tone, Style) |
| `ActionTile` | **Action Tile** (Tone, State) |
| `DetailItem` | **Detail Item** (Style) |
| `Table` headers | **Table Header Cell** (Style, Sort). Table bodies: **Table / Banded** or **Table / Simple** |
| `Pagination` | **Pagination** and **Page Button** |
| `NoResults`, `EmptyState` | **Empty State** |
| `Field` | **Field** (State, Required) |
| `Stepper` | **Stepper Step** |
| `ImageUpload` | **Image Upload** |
| `SplitLayout` | **Split Layout** (Side) |
| `Notice` | **Notice** |
| `Modal` | **Modal** |
| `PageHeader` | **Page Header** |
| `PageBanner` | **Page Banner** |
| `FilterBar` | **Filter Bar** |
| `ResultsFooter` | **Results Footer** |

**Not in the design system yet.** Build these once as local components from instances of the parts above, then name them after the React component: `TextArea`, `FilterPanel`, `FilterField`, `ModalPanel`, `ModalHeader`, `ModalBody`, `ModalFooter`, `ModalForm`, `FieldRow`, `DetailList`, `StatGrid`, `ActionGrid`, `InfoGrid`, `ArchLineup`, `Person`, `Sidebar`, `AppShell`, `PageContent`. Report that each one was built locally.

Do not paste copies of the same frame. Repeated rows, cards, and list items become one component with instances.

### 6. Structure

- **One wrapper frame per view.** Name it after the route (for example `Appointments`, `Doctors`). Use auto layout from the top down.
- **Section frames** follow the page's own landmarks: sidebar, page header, page banner, filter bar, content grid or table, side column, footer.
- **Auto layout** for every container with related children. Use absolute positioning only for overlays such as the tooltip, avatar presence dots, and the modal backdrop.
- **Component instances over frames.** A frame is only for layout. If something looks like a card, button, or chip, it should be an instance.
- **Name layers in English after the React component** (`PageBanner`, `StatTile / Revenue`). Do not use `Frame 123`.
- **Responsive:** build the desktop view at 1440px. Use the page's container width and padding (`PageContent`: 32px side padding, 28px top, 48px bottom). Add a 375px mobile frame only when the user asks for it.

### 7. Read the source before building

- Read the page file and every component it imports. Read each component's CSS module or `ui.css` rules for spacing, sizes, and colours.
- Check each component's default props and resolve them.
- Translate layout from CSS (flex, grid, gap, padding) into auto layout. Do not copy absolute coordinates.
- Use the text and copy from the source as it appears in the UI, not the placeholder text.

### 8. Icons, images, and fonts

- **Icons:** the design system has a full Lucide set as **`Icon/<Name>`** components (for example `Icon/ChevronDown`, `Icon/CalendarCheck`). The React code uses `react-icons/lu`, so `LuChevronDown` maps to `Icon/ChevronDown`. Create an instance (or swap the instance) instead of drawing or importing an SVG. The set has 33 icons: Plus, ArrowRight, ArrowLeft, Download, Trash2, Search, ChevronDown, Check, Minus, ArrowUp, ArrowDown, ArrowUpRight, X, Users, Calendar, Clock, FileText, Inbox, CircleAlert, CircleCheck, ChevronLeft, ChevronRight, ChevronsUpDown, Video, Heart, Stethoscope, Upload, User, CalendarCheck, UserPlus, Info.
- **Icons not in the set:** import the SVG from `node_modules/react-icons/lu` with `figma.createNodeFromSvg`. Set `width` and `height` in the SVG string, and bind the colour to a variable after import. Report the icon as missing from the design system.
- **Images** (portraits in `lib/portraits.ts`, anything under `public/`): run the `generate_figma_design` capture against the same file key first, so the image fills can be copied. Delete the capture when you finish. Never put a screenshot of the full page inside the deliverable.
- **Fonts:** Geist Sans for interface text, Geist Mono for code and values. Do not default to Inter. Assert the font family on every text node after building. Check the design system's text styles for the font they use before building.

### 9. Validation and reporting

- Return the created node IDs, the component instance count, and the number of variables bound from every write call.
- Take one composition screenshot of the wrapper, compare it with the running page, fix any real defects with a targeted edit, and take one more screenshot only if you changed something.
- Check for leftover placeholder text (`Title`, `Heading`, `Button`) and for `placeholder = true` shimmers. Remove them.
- Report back: the file URL, which components were matched to the design system, which were built locally, which values are hardcoded, which tokens or styles were missing (section 4), and the motion tokens that were left out.
- Do not commit or push anything as part of a Figma transfer.

### 10. Lessons from transferring the dashboard

- **Instances are fixed.** A design-system instance keeps its child sizes and text structure. You cannot resize a child such as the Progress Bar `Fill`, and you cannot add children to an instance. When a component has no slot for what the app renders (the `Card` has no content slot; `Page Header` has exactly two actions), build that part as a local auto-layout frame and say so in the report.
- **Instance names are the component name**, for example `Progress Bar` or `Tone Tile`, not the variant name. Look children up by that name.
- **Absolute children need an auto-layout parent.** `layoutPositioning = 'ABSOLUTE'` fails on a plain frame. Use `figma.createAutoLayout(...)` for the parent.
- **Later siblings draw on top.** For nested shapes such as the patient bubbles, put labels where the next shape will not cover them (the app puts them at the top).
- **Wrapping text** needs `textAutoResize = 'HEIGHT'` and `layoutSizingHorizontal = 'FILL'`, set after the text is appended.
- **Icons:** most Lucide icons are design-system `Icon/<Name>` components. For any other icon, build a local component with `figma.createComponent()` around `figma.createNodeFromSvg()`, then swap it into an INSTANCE_SWAP slot such as Tone Tile's `Icon`. Keep the local icon components in a holder frame beside the page.
- **Number formatting:** `toLocaleString()` returns no thousands separator in Figma, so write `1,146` by hand.
- **Failed scripts roll back.** A `use_figma` call that throws leaves nothing behind, so fix the script and rerun the whole thing.
- **Layout to match:** the app switches to two-column rows when the content area is 1240px wide or less. Design at 1440px with the sidebar open (content width 1112px) so the layout matches what the app shows.

### 11. Keeping Figma in sync

- The code-to-Figma mapping lives in `figma/component-map.json`. See `figma/README.md`.
- Before a Figma update, run `npm run figma:sync` then `npm run figma:check`. It lists the tokens, components and pages that changed since the last push. Update only those.
- After a push, run `npm run figma:mark -- <Name...>` and commit `figma/`.
- When a component or page is added, renamed, or its Figma status changes, edit `component-map.json`, not `manifest.json`.
