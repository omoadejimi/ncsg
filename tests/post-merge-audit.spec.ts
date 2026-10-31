import { expect, test } from "@playwright/test";

const principles = "/docs/foundations/principles";

test.beforeEach(async ({ page }) => {
  await page.route(/google-analytics\.com|googletagmanager\.com/, route => route.abort());
});

test("mobile menu fills small and tablet viewports, contains focus and restores its opener", async ({ page }) => {
  for (const width of [320, 375, 768]) {
    await page.setViewportSize({ width, height: 700 });
    await page.goto(principles);
    const trigger = page.getByRole("button", { name: "Open navigation menu" });
    await trigger.click();
    const dialog = page.getByRole("dialog", { name: "Site navigation" });
    const close = dialog.getByRole("button", { name: "Close navigation menu" });
    await expect(close).toBeFocused();
    const bounds = await dialog.boundingBox();
    expect(bounds?.height).toBe(700);
    const panel = await close.locator("../..").boundingBox();
    expect(panel?.height).toBe(700);
    await page.keyboard.press("Shift+Tab");
    await expect(dialog.getByRole("link", { name: "Changelog", exact: true })).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(close).toBeFocused();
    await page.getByRole("link", { name: "Nigerian Content Style Guide — home" }).evaluate(e => (e as HTMLElement).focus());
    await expect(close).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
    await expect(trigger).toBeFocused();
    await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
  }
});

test("mobile menu supports pointer dismissal, same-page navigation and destination focus", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 700 });
  await page.goto(principles);
  const trigger = page.getByRole("button", { name: "Open navigation menu" });
  const dialog = page.getByRole("dialog", { name: "Site navigation" });
  await trigger.click();
  await dialog.getByRole("button", { name: "Close navigation menu" }).click();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await page.mouse.click(370, 500);
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await trigger.click();
  await dialog.getByRole("link", { name: "Principles", exact: true }).click();
  await expect(dialog).toHaveCount(0);
  await expect(page.getByRole("main")).toBeFocused();
  await trigger.click();
  await dialog.getByRole("link", { name: "Forms", exact: true }).click();
  await expect(page).toHaveURL(/patterns\/forms$/);
  await expect(dialog).toHaveCount(0);
  await expect(page.getByRole("main")).toBeFocused();
  await trigger.click();
  await page.setViewportSize({ width: 1280, height: 900 });
  await expect(dialog).toHaveCount(0);
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
  await expect(page.getByRole("main")).toBeFocused();
});

test("search dismisses a filled input with one Escape and finds offline guidance", async ({ page }) => {
  await page.goto(principles);
  const trigger = page.getByRole("button", { name: /^Search the guide/ });
  await trigger.click();
  const input = page.getByRole("combobox");
  await input.fill("offline");
  await expect(page.getByRole("option", { name: /^Accessibility/ })).toBeVisible();
  await input.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(trigger).toBeFocused();
});

test("overflowing transaction table can be reached and scrolled with a keyboard", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto("/docs/patterns/error-messages");
  const region = page.getByRole("region", { name: "Scrollable table" });
  await expect(region).toHaveAttribute("tabindex", "0");
  await page.getByRole("main").focus();
  for (let i = 0; i < 15 && !(await region.evaluate(e => e === document.activeElement)); i++) {
    await page.keyboard.press("Tab");
  }
  await expect(region).toBeFocused();
  await page.keyboard.press("ArrowRight");
  await expect.poll(() => region.evaluate(e => e.scrollLeft)).toBeGreaterThan(0);
  await page.setViewportSize({ width: 1365, height: 900 });
  await expect(page.getByRole("region", { name: "Scrollable table" })).toHaveCount(0);
});

test("HTTP redirects preserve queries and work without JavaScript", async ({ request, browser, baseURL }) => {
  const docs = await request.get("/docs?from=test", { maxRedirects: 0 });
  expect(docs.status()).toBe(308);
  expect(docs.headers().location).toBe("/docs/foundations/principles?from=test");
  const www = await request.get("/docs/patterns/forms?from=test", { headers: { host: "www.ncsg.guide" }, maxRedirects: 0 });
  expect(www.status()).toBe(308);
  expect(www.headers().location).toBe("https://ncsg.guide/docs/patterns/forms?from=test");
  const context = await browser.newContext({ baseURL, javaScriptEnabled: false });
  const noJs = await context.newPage();
  await noJs.goto("/docs");
  await expect(noJs).toHaveURL(/foundations\/principles$/);
  await expect(noJs.getByRole("heading", { level: 1, name: "Principles" })).toBeVisible();
  await context.close();
});

test("all public pages have specific social metadata, edit dates and a fetchable image", async ({ request }) => {
  const sitemap = await (await request.get("/sitemap.xml")).text();
  const urls = Array.from(sitemap.matchAll(/<loc>([^<]+)<\/loc>/g), m => m[1]);
  expect(urls).toHaveLength(24);
  const titles = new Set<string>();
  for (const url of urls) {
    const response = await request.get(new URL(url).pathname);
    expect(response.status()).toBe(200);
    const html = await response.text();
    const meta = (name: string) => html.match(new RegExp(`<meta (?:name|property)="${name}" content="([^"]+)"`))?.[1];
    expect(meta("og:image")).toBe("https://ncsg.guide/social-card.png");
    expect(meta("twitter:image")).toBe(meta("og:image"));
    expect(meta("twitter:title")).toBe(meta("og:title"));
    expect(meta("twitter:description")).toBe(meta("og:description"));
    titles.add(meta("twitter:title")!);
    expect(html).toContain('rel="icon"');
    if (new URL(url).pathname !== "/") {
      expect(html).toContain("Specialist review not recorded");
      expect(html).toContain('dateTime="2026-10-31"');
    }
  }
  expect(titles.size).toBe(24);
  const image = await request.get("/social-card.png");
  expect(image.status()).toBe(200);
  expect(image.headers()["content-type"]).toContain("image/png");
  const png = await image.body();
  expect(png.subarray(1, 4).toString()).toBe("PNG");
  expect(png.readUInt32BE(16)).toBe(1200);
  expect(png.readUInt32BE(20)).toBe(630);
  const home = await (await request.get("/")).text();
  const schema = JSON.parse(home.match(/<script type="application\/ld\+json">(.*?)<\/script>/)![1]);
  expect(schema).toMatchObject({ "@type": "WebSite", name: "Nigerian Content Style Guide", alternateName: "NCSG", url: "https://ncsg.guide" });
});

test("changelog and maintenance links point to real guidance", async ({ page }) => {
  await page.goto("/docs/operations/changelog");
  await expect(page.getByRole("heading", { level: 1, name: "Changelog" })).toBeVisible();
  await expect(page.getByRole("link", { name: "content rewrite pull request 5" })).toHaveAttribute("href", "https://github.com/omoadejimi/ncsg/pull/5");
  await page.getByRole("link", { name: "How maintenance works" }).click();
  await expect(page).toHaveURL(/governance#content-maintenance$/);
  await expect(page.locator("#content-maintenance")).toBeVisible();
});
