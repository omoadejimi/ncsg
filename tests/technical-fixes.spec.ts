import { expect, test } from "@playwright/test";

const principles = "/docs/foundations/principles";
const vocabulary = "/docs/nigeria/nigerian-english";

test.beforeEach(async ({ page }) => {
  // Tests do not send page views to the production analytics property.
  await page.route(/google-analytics\.com|googletagmanager\.com/, route => route.abort());
});

test("search contains keyboard focus and restores its trigger on dismissal", async ({ page }) => {
  await page.goto(principles);
  const trigger = page.getByRole("button", { name: /^Search the guide/ });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "Search the guide" });
  const input = dialog.getByRole("combobox");
  const close = dialog.getByRole("button", { name: "Close search" });
  await expect(input).toBeFocused();
  await input.fill("BVN");
  await expect(dialog.getByRole("option")).toHaveCount(3);
  // Options are selected with arrows, not separately tabbable buttons.
  await expect(dialog.locator('[role="option"] button, [role="option"] a')).toHaveCount(0);
  await page.keyboard.press("Tab");
  await expect(close).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(input).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(close).toBeFocused();
  // Escape works even after leaving the input.
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
  await trigger.click();
  await expect(input).toHaveValue("");
  await close.click();
  await expect(trigger).toBeFocused();
});

test("empty search is outside the listbox and cannot expose background controls", async ({ page }) => {
  await page.goto(principles);
  await page.getByRole("button", { name: /^Search the guide/ }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("combobox").fill("zzzzncsg");
  await expect(dialog.getByText('No results for "zzzzncsg"')).toBeVisible();
  await expect(dialog.getByRole("listbox")).toHaveCount(0);
  const home = page.getByRole("link", { name: "Nigerian Content Style Guide — home" });
  await home.evaluate(element => (element as HTMLElement).focus());
  await expect(home).not.toBeFocused();
  await expect(dialog.getByRole("combobox")).toBeFocused();
});

test("search arrow selection opens a result and focuses its content", async ({ page }) => {
  await page.goto(principles);
  await page.getByRole("button", { name: /^Search the guide/ }).click();
  const input = page.getByRole("combobox");
  await input.fill("BVN");
  await input.press("ArrowDown");
  await expect(input).toHaveAttribute("aria-activedescendant", "result-1");
  await input.press("Enter");
  await expect(page).toHaveURL(/\/docs\/patterns\/error-messages$/);
  await expect(page.getByRole("main")).toBeFocused();
  // Choosing the already open page must also leave focus in its content.
  await page.getByRole("button", { name: /^Search the guide/ }).click();
  await page.getByRole("combobox").fill("Error messages");
  await page.getByRole("combobox").press("Enter");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.getByRole("main")).toBeFocused();
});

test("pointer users can open a result and dismiss using the backdrop", async ({ page }) => {
  await page.goto(principles);
  await page.getByRole("button", { name: /^Search the guide/ }).click();
  await page.getByRole("combobox").fill("BVN");
  await page.getByRole("option", { name: /^Government IDs/ }).click();
  await expect(page).toHaveURL(/\/docs\/nigeria\/government-ids$/);
  await expect(page.getByRole("main")).toBeFocused();
  const trigger = page.getByRole("button", { name: /^Search the guide/ });
  await trigger.click();
  const size = page.viewportSize()!;
  await page.mouse.click(size.width / 2, size.height - 20);
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(trigger).toBeFocused();
});

test("vocabulary renders seven semantic rows and reflows on small screens", async ({ page }) => {
  await page.goto(vocabulary);
  const table = page.getByRole("table");
  await expect(table.getByRole("columnheader")).toHaveText(["Term", "Suggested wording", "Context and alternatives"]);
  await expect(table.locator("tbody tr")).toHaveCount(7);
  await expect(table.getByRole("cell", { name: "airtime", exact: true })).toBeVisible();
  await expect(table.locator('th[scope="col"]')).toHaveCount(3);
  await page.setViewportSize({ width: 320, height: 700 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

for (const slug of ["forms", "error-messages"]) {
  test(`the ${slug} page preserves the full BVN code`, async ({ page }) => {
    await page.goto(`/docs/patterns/${slug}`);
    await expect(page.locator("article code").filter({ hasText: "*565*0#" })).toHaveText("*565*0#");
    await expect(page.locator("article em").filter({ hasText: /^565$/ })).toHaveCount(0);
  });
}

test("all public pages and discovery metadata use the production domain", async ({ request }) => {
  const sitemap = await (await request.get("/sitemap.xml")).text();
  const urls = Array.from(sitemap.matchAll(/<loc>([^<]+)<\/loc>/g), match => match[1]);
  expect(urls).toHaveLength(23);
  expect(new Set(urls).size).toBe(23);
  for (const url of urls) {
    expect(url).toMatch(/^https:\/\/ncsg\.guide(?:\/docs\/[^\s]+)?$/);
    const pathname = new URL(url).pathname;
    const response = await request.get(pathname);
    expect(response.status()).toBe(200);
    const html = await response.text();
    const canonical = html.match(/<link rel="canonical" href="([^"]+)"/);
    const openGraph = html.match(/<meta property="og:url" content="([^"]+)"/);
    expect(new URL(canonical?.[1] ?? "").href).toBe(new URL(url).href);
    expect(openGraph?.[1]).toBe(pathname === "/" ? "https://ncsg.guide" : url);
    expect(html).not.toContain("ncsg-lukap42t7-huerebel.vercel.app");
    if (pathname !== "/") {
      const jsonLd = html.match(/<script type="application\/ld\+json">(.*?)<\/script>/)?.[1];
      expect(JSON.parse(jsonLd ?? "{}").url).toBe(url);
    }
  }
  expect(await (await request.get("/robots.txt")).text()).toContain("Sitemap: https://ncsg.guide/sitemap.xml");
});
