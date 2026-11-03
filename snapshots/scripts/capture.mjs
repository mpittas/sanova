// Captures pages and individual UI sections from a running app, using the Chrome/Edge already on the machine.
//   node scripts/capture.mjs [capture.json]
// Writes PNGs to public/captures/ and snapshots.generated.json (a starting point for snapshots.json).
import fs from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer-core";

const configPath = process.argv[2] ?? "capture.json";
if (!fs.existsSync(configPath)) {
  console.error(`No ${configPath}. Copy capture.example.json to capture.json and edit it.`);
  process.exit(1);
}
const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
const viewport = { width: 1440, height: 900, scale: 2, mobile: false, ...config.viewport };
const outDir = path.resolve(config.outDir ?? "public/captures");
fs.mkdirSync(outDir, { recursive: true });

function findBrowser() {
  const candidates = [
    process.env.CHROME_PATH,
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
  ].filter(Boolean);
  const found = candidates.find((candidate) => fs.existsSync(candidate));
  if (!found) {
    console.error("No Chrome/Edge/Chromium found. Set CHROME_PATH to its executable.");
    process.exit(1);
  }
  return found;
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Small scripted steps so menus, tabs and dialogs can be opened before capturing. */
async function runActions(page, actions = []) {
  for (const action of actions) {
    if (action.click) await page.click(action.click);
    else if (action.hover) await page.hover(action.hover);
    else if (action.type) await page.type(action.type[0], action.type[1]);
    else if (action.press) await page.keyboard.press(action.press);
    else if (action.scrollTo) await page.evaluate((selector) => document.querySelector(selector)?.scrollIntoView({ block: "start" }), action.scrollTo);
    else if (action.wait) await sleep(action.wait);
  }
}

/** Waits for running CSS animations and transitions (page entrances, charts drawing) to finish, so crops are taken on a still layout. */
async function settle(page, timeout = 4000) {
  await page.evaluate((limit) => Promise.race([Promise.all(document.getAnimations().map((animation) => animation.finished.catch(() => {}))), new Promise((resolve) => setTimeout(resolve, limit))]), timeout);
  await sleep(250);
}

const browser = await puppeteer.launch({ executablePath: findBrowser(), headless: true, args: ["--hide-scrollbars", "--force-color-profile=srgb"] });
const page = await browser.newPage();
await page.setViewport({ width: viewport.width, height: viewport.height, deviceScaleFactor: viewport.scale, isMobile: viewport.mobile, hasTouch: viewport.mobile });
const defaults = config.defaults ?? {};
const generated = [];

for (const entry of config.pages ?? []) {
  const url = entry.url ?? `${config.baseUrl}${entry.path ?? "/"}`;
  console.log(`> ${entry.name}  ${url}`);
  await page.goto(url, { waitUntil: "load", timeout: 120000 });
  await sleep(config.waitMs ?? 3000);
  if (config.hide?.length) {
    await page.addStyleTag({ content: `${config.hide.join(",")}{display:none!important}` });
  }
  await runActions(page, entry.actions);
  await settle(page);

  if (entry.screenshot !== false) {
    const file = `${entry.name}.png`;
    await page.screenshot({ path: path.join(outDir, file), fullPage: entry.fullPage === true });
    generated.push({ name: entry.name, mode: "screen", items: [{ image: `captures/${file}` }] });
  }

  if (entry.sections?.length) {
    // Grow the viewport to the whole page and settle again, so nothing scrolls or reflows while a section is cropped.
    const full = await page.evaluate(() => Math.max(document.documentElement.scrollHeight, document.body.scrollHeight));
    await page.setViewport({ width: viewport.width, height: Math.min(Math.max(viewport.height, full), 8000), deviceScaleFactor: viewport.scale, isMobile: viewport.mobile, hasTouch: viewport.mobile });
    await page.evaluate(() => window.scrollTo(0, 0));
    await settle(page);
  }

  for (const section of entry.sections ?? []) {
    const handles = await page.$$(section.selector);
    const handle = handles[section.index ?? 0];
    if (!handle) {
      console.warn(`  ! no element for "${section.selector}" (${section.name})`);
      continue;
    }
    if (section.actions) {
      await runActions(page, section.actions);
      await settle(page);
    }
    const box = await handle.evaluate((target) => {
      const rect = target.getBoundingClientRect();
      return { x: rect.left, y: rect.top, w: rect.width, h: rect.height, radius: parseFloat(getComputedStyle(target).borderTopLeftRadius) || 0 };
    });
    const pad = section.pad ?? 0;
    const clip = { x: Math.max(0, box.x - pad), y: Math.max(0, box.y - pad), width: box.w + pad * 2, height: box.h + pad * 2 };
    const file = `${entry.name}--${section.name}.png`;
    // captureBeyondViewport off: Chrome would otherwise re-flow responsive layouts while it captures, shifting the crop.
    await page.screenshot({ path: path.join(outDir, file), clip, captureBeyondViewport: false });
    generated.push({
      name: `${entry.name}--${section.name}`,
      mode: "section",
      items: [{ image: `captures/${file}`, radius: Math.round(box.radius * viewport.scale) }],
    });
    console.log(`  + ${section.name}  ${Math.round(box.w)}x${Math.round(box.h)}  radius ${box.radius}px`);
  }

  await page.setViewport({ width: viewport.width, height: viewport.height, deviceScaleFactor: viewport.scale, isMobile: viewport.mobile, hasTouch: viewport.mobile });
}
await browser.close();
fs.writeFileSync("snapshots.generated.json", JSON.stringify({ defaults, snapshots: generated }, null, 2));
console.log(`\nDone. ${generated.length} captures in ${path.relative(process.cwd(), outDir)}/. Listed in snapshots.generated.json.`);
