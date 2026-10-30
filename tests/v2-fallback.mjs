import { chromium } from "@playwright/test";
const browser = await chromium.launch({
  channel: "msedge",
  headless: true,
  args: ["--disable-webgl"],
});
const page = await browser.newPage();
await page.goto("http://127.0.0.1:3005/simulacao");
await page.locator(".fallback").waitFor({ timeout: 15000 });
await page
  .getByRole("button", { name: "Iniciar manobra ▷", exact: true })
  .click();
await page.waitForTimeout(200);
await page.getByRole("button", { name: "Pausar", exact: false }).click();
console.log(
  JSON.stringify({
    fallbackVisible: await page.locator(".fallback").isVisible(),
    loading: await page.locator(".scene-loading").count(),
  }),
);
await browser.close();
