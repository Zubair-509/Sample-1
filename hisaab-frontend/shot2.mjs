import { chromium } from 'playwright';

const out = process.env.TEMP;
const browser = await chromium.launch({ channel: 'chrome' });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto('http://localhost:5190');
await page.waitForSelector('text=Dashboard');
await page.click('text=Ledger');
await page.waitForTimeout(2500);
await page.screenshot({ path: `${out}\\hisaab_ledger_desktop2.png`, fullPage: true });
await browser.close();
console.log('done');
