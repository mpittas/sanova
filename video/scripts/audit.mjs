import puppeteer from "puppeteer-core";
const out = process.argv[2];
const edge = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const pages = ["", "appointments", "patients", "doctors", "departments", "medical-records", "prescriptions", "lab-results", "telemedicine", "billing", "reports", "messages"];
const browser = await puppeteer.launch({ executablePath: edge, headless: true, args: ["--hide-scrollbars"] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
for (const p of pages) {
  await page.goto(`http://localhost:3001/${p}`, { waitUntil: "load", timeout: 120000 });
  await new Promise((r) => setTimeout(r, 3500));
  await page.evaluate(() => document.querySelectorAll("nextjs-portal").forEach((e) => e.remove()));
  await page.screenshot({ path: `${out}/${p || "dashboard"}.png` });
}
await browser.close();
