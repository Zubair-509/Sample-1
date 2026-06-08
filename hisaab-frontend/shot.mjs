import { chromium } from 'playwright';

const out = process.env.TEMP;
const browser = await chromium.launch({ channel: 'chrome' });

// Desktop: Ledger and Tax Summary
const desktop = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await desktop.newPage();
await page.goto('http://localhost:5190');
await page.waitForSelector('text=Dashboard');

await page.click('text=Ledger');
await page.waitForTimeout(800);
await page.screenshot({ path: `${out}\\hisaab_ledger_desktop.png`, fullPage: true });

await page.click('text=Tax Summary');
await page.waitForTimeout(500);
await page.screenshot({ path: `${out}\\hisaab_taxsummary_desktop.png`, fullPage: true });

await desktop.close();

// Mobile: Dashboard
const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true });
const mpage = await mobile.newPage();
await mpage.goto('http://localhost:5190');
await mpage.waitForSelector('text=Hisaab');
await mpage.waitForTimeout(500);
await mpage.screenshot({ path: `${out}\\hisaab_dashboard_mobile.png`, fullPage: true });

await mobile.close();
await browser.close();
console.log('done');
