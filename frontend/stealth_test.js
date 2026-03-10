const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.goto('https://codeforces.com/api/user.info?handles=tourist', { waitUntil: 'domcontentloaded' });
  
  // Codeforces API wraps JSON in `body` or `pre`
  const content = await page.evaluate(() => document.body.innerText);
  console.log("Extracted content length:", content.length);
  console.log("Preview:", content.slice(0, 150));
  
  await browser.close();
})();
