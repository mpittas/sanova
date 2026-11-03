// Renders every snapshot in snapshots.json as a still image.
//   node scripts/render.mjs [snapshots.json] [--only name] [--webp] [--scale 1] [--out out]
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";

const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const option = (name, fallback) => {
  const at = args.indexOf(`--${name}`);
  return at >= 0 ? args[at + 1] : fallback;
};
const positional = args.filter((arg, i) => !arg.startsWith("--") && !args[i - 1]?.startsWith("--"));
const file = positional[0] ?? "snapshots.json";
if (!fs.existsSync(file)) {
  console.error(`No ${file}. Copy snapshots.example.json to snapshots.json (or take entries from snapshots.generated.json).`);
  process.exit(1);
}

const config = JSON.parse(fs.readFileSync(file, "utf8"));
const only = option("only");
const scale = Number(option("scale", "1"));
const outDir = path.resolve(option("out", "out"));
fs.mkdirSync(outDir, { recursive: true });

const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts"), publicDir: path.resolve("public") });
const hasFfmpeg = spawnSync("ffmpeg", ["-version"], { stdio: "ignore" }).status === 0;
if (flag("webp") && !hasFfmpeg) console.warn("ffmpeg not found: skipping WebP, PNGs only.");

const list = (config.snapshots ?? []).filter((snapshot) => !only || snapshot.name === only);
for (const [index, snapshot] of list.entries()) {
  const { name, ...own } = snapshot;
  const props = { ...config.defaults, ...own };
  // Alternate the tilt direction through a set so it never feels mechanical, unless a snapshot sets its own sign.
  if (props.tilt !== undefined && snapshot.tilt === undefined) props.tilt = (index % 2 === 0 ? 1 : -1) * Math.abs(props.tilt);
  const composition = await selectComposition({ serveUrl, id: "Snapshot", inputProps: props });
  const png = path.join(outDir, `${name}.png`);
  await renderStill({ composition, serveUrl, inputProps: props, output: png, imageFormat: "png", scale });
  let note = `${composition.width}x${composition.height}`;
  if (flag("webp") && hasFfmpeg) {
    const webp = path.join(outDir, `${name}.webp`);
    spawnSync("ffmpeg", ["-v", "error", "-y", "-i", png, "-c:v", "libwebp", "-q:v", "86", webp]);
    note += " + webp";
  }
  console.log(`rendered ${name}  ${note}`);
}
console.log(`\n${list.length} snapshot(s) in ${path.relative(process.cwd(), outDir) || "."}/`);
