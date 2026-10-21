import puppeteer from "puppeteer-core";

const edge = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const pages = [
  ["dashboard", "/"],
  ["appointments", "/appointments"],
  ["reports", "/reports"],
  ["billing", "/billing"],
  ["doctors", "/doctors"],
];

const browser = await puppeteer.launch({ executablePath: edge, headless: true, args: ["--hide-scrollbars"] });
const page = await browser.newPage();
await page.setViewport({ width: 1600, height: 1000, deviceScaleFactor: 2 });
for (const [name, path] of pages) {
  await page.goto(`http://localhost:3000${path}`, { waitUntil: "load", timeout: 120000 });
  await new Promise((r) => setTimeout(r, 4500));
  await page.evaluate(() => {
    document.querySelectorAll("nextjs-portal, [data-nextjs-toast], [data-next-badge-root]").forEach((e) => e.remove());
    window.scrollTo(0, 0);
  });
  await new Promise((r) => setTimeout(r, 300));
  await page.screenshot({ path: `public/shots/${name}.png` });
  console.log("captured", name);
}
await browser.close();
