const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  // 桌面端：进入 DOM 首页需要先跳过 3D 开场？观察页面结构
  // 先截取整页顶部
  await page.screenshot({ path: 'C:/Users/hbg20/AppData/Local/Temp/site-shots/desk-top.png' });
  // 滚动到汉堡区
  await page.evaluate(() => document.getElementById('burger')?.scrollIntoView({ block: 'start' }));
  await page.waitForTimeout(900);
  await page.screenshot({ path: 'C:/Users/hbg20/AppData/Local/Temp/site-shots/desk-burger.png' });
  // 点开一个栏目抽屉
  const items = await page.$$('.formula-item');
  if (items.length) { await items[0].click(); await page.waitForTimeout(800); }
  await page.screenshot({ path: 'C:/Users/hbg20/AppData/Local/Temp/site-shots/desk-drawer.png' });
  await browser.close();
  console.log('done');
})();
