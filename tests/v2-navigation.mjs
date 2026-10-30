import { chromium } from "@playwright/test";
const b = await chromium.launch({ channel: "msedge", headless: true });
const p = await b.newPage({ reducedMotion: "reduce" });
const errors = [];
p.on("pageerror", (e) => errors.push(e.stack));
await p.goto("http://127.0.0.1:3005");
await p.locator("[data-ready=true]").waitFor();
for (let i = 0; i < 6; i++) {
  for (const name of ["Simulação", "Cálculos", "Inicial"]) {
    await p.getByRole("link", { name, exact: true }).click();
    await p.waitForTimeout(150);
  }
}
console.log(JSON.stringify({ errors }));
await b.close();
if (errors.length) process.exitCode = 1;
