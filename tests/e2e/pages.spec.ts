import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("unknown pages get the designed 404 with a 404 status", async ({
  page,
}) => {
  const response = await page.goto("/not-a-real-trail");
  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole("heading", { name: "That trail doesn't go anywhere." }),
  ).toBeVisible();
});

test("search engines are kept out and links preview with the social card", async ({
  page,
  request,
}) => {
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toMatch(/Disallow: \//);

  await page.goto("/");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /noindex/,
  );
  const ogImage = await page
    .locator('meta[property="og:image"]')
    .getAttribute("content");
  expect(ogImage).toMatch(/opengraph-image/);
  const image = await request.get(new URL(ogImage!).pathname);
  expect(image.ok()).toBe(true);
});

for (const url of ["/about", "/credits", "/not-a-real-trail"]) {
  test(`${url} has no axe violations`, async ({ page }) => {
    await page.goto(url);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag22aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });
}
