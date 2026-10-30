import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";
mkdirSync(".taste-skill/v2/qa", { recursive: true });
const browser = await chromium.launch({ channel: "msedge", headless: true });
const page = await browser.newPage({
  viewport: { width: 1440, height: 1000 },
  reducedMotion: "reduce",
});
const errors = [];
const requests = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("requestfailed", (r) => requests.push(r.url()));
await page.goto("http://127.0.0.1:3005", { waitUntil: "networkidle" });
await page.locator("[data-ready=true]").waitFor({ timeout: 60000 });
await page.waitForTimeout(2000);
await page.screenshot({ path: ".taste-skill/v2/qa/home-desktop.png" });
console.log("home ready", JSON.stringify({ errors, requests }));
await page.getByRole("link", { name: "Simulação", exact: true }).click();
await page.locator("[data-ready=true]").waitFor();
await page
  .getByRole("button", { name: "Iniciar manobra ▷", exact: true })
  .click();
await page.waitForTimeout(300);
await page.getByRole("button", { name: "Pausar", exact: false }).click();
const time = await page.getByTestId("time").textContent();
await page.waitForTimeout(300);
if (time !== (await page.getByTestId("time").textContent()))
  throw Error("Tempo não congelou");
await page.getByRole("button", { name: "Reiniciar manobra" }).click();
if (!(await page.getByTestId("error").textContent()).includes("20.00"))
  throw Error("Reinício incorreto");
await page.getByRole("button", { name: "Oscilante", exact: false }).click();
await page.getByRole("slider", { name: "Instante da simulação" }).fill("5");
const error = await page.getByTestId("error").textContent();
await page.screenshot({
  path: ".taste-skill/v2/qa/simulation-desktop.png",
  fullPage: true,
});
await page.getByRole("link", { name: "Cálculos", exact: true }).click();
await page.getByRole("tab", { name: "Exemplo da simulação" }).click();
if (!(await page.locator(".example-result").textContent()).includes(error))
  throw Error("Cálculo não coincide");
await page
  .getByRole("tab", { name: "Transformada de Laplace", exact: false })
  .click();
await page.screenshot({
  path: ".taste-skill/v2/qa/calculations-desktop.png",
  fullPage: true,
});
await page.getByRole("link", { name: "Simulação", exact: true }).click();
if (error !== (await page.getByTestId("error").textContent()))
  throw Error("Estado perdido entre abas");
await page.getByRole("button", { name: "Modo apresentação" }).click();
await page.keyboard.press("Escape");
if (await page.getByRole("dialog").count()) throw Error("Escape falhou");
for (const width of [768, 390]) {
  await page.setViewportSize({ width, height: 1000 });
  for (const [path, name] of [
    ["/", "home"],
    ["/simulacao", "simulation"],
    ["/calculos", "calculations"],
  ]) {
    await page.goto("http://127.0.0.1:3005" + path, {
      waitUntil: "networkidle",
    });
    await page.waitForTimeout(800);
    if (path === "/simulacao") {
      const start = page.getByRole("button", {
        name: "Iniciar manobra ▷",
        exact: true,
      });
      const box = await start.boundingBox();
      if (!box || box.y + box.height > 844)
        throw Error(`Início abaixo da primeira tela: ${width}`);
      await start.click();
      await page.waitForTimeout(300);
      await page.getByRole("button", { name: "Pausar", exact: false }).click();
      await page.getByRole("button", { name: "Reiniciar manobra" }).click();
    }
    if (path === "/calculos" && width === 390) {
      await page
        .getByRole("combobox", { name: "Etapa do cálculo" })
        .selectOption("2");
      if (
        !(await page.getByRole("tabpanel").textContent()).includes(
          "Chamamos de E(s)",
        )
      )
        throw Error("Seleção mobile de capítulo falhou");
      await page
        .getByRole("combobox", { name: "Etapa do cálculo" })
        .selectOption("0");
    }
    await page.screenshot({
      path: `.taste-skill/v2/qa/${name}-${width}.png`,
      fullPage: true,
    });
    if (
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      )
    )
      throw Error(`Overflow ${path} ${width}`);
  }
}
console.log(JSON.stringify({ result: "passed", errors, requests }));
await browser.close();
if (errors.length || requests.length) process.exitCode = 1;
