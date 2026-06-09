import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const dir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const port = process.env.SHOT_PORT || 6177;
const base = `http://localhost:${port}/iframe.html`;

// [storyId, outName, optionalButtonTextToClickFirst]
const shots = [
  ['components-dropdownmenu--default', 'dropdown-default'],
];

const browser = await chromium.launch();
const page = await browser.newPage({ deviceScaleFactor: 2, viewport: { width: 760, height: 520 } });
const out = [];
for (const [id, name, clickText] of shots) {
  try {
    await page.goto(`${base}?id=${id}&viewMode=story`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);
    if (clickText) {
      await page.getByRole('button', { name: clickText }).click();
      await page.waitForTimeout(300);
    }
    const file = `/tmp/${name}.png`;
    await page.screenshot({ path: file });
    out.push(file);
  } catch (e) {
    out.push(`FAILED ${name}: ${e.message.split('\n')[0]}`);
  }
}
await browser.close();
console.log(out.join('\n'));
