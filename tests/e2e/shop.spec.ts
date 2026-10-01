import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("filters live in the URL and survive reload and back", async ({
  page,
}) => {
  await page.goto("/shop");
  await expect(
    page.getByRole("status").filter({ hasText: "products" }),
  ).toHaveText("11 products");

  await page.getByRole("button", { name: "Mid", exact: true }).click();
  await expect(page).toHaveURL(/\/shop\?layer=mid$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Mid layers",
  );
  await expect(
    page.getByRole("status").filter({ hasText: "products" }),
  ).toHaveText("3 products");

  await page.getByRole("button", { name: "Thermal" }).click();
  await expect(page).toHaveURL(/layer=mid&view=thermal/);
  await expect(
    page.getByRole("img", { name: /^Illustrative thermal view/ }).first(),
  ).toBeVisible();

  await page.reload();
  await expect(
    page.getByRole("button", { name: "Mid", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("button", { name: "Thermal" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );

  await page.getByRole("link", { name: /Knoll Grid Fleece/ }).click();
  await expect(page).toHaveURL(/\/products\/knoll-grid-fleece/);
  await page.goBack();
  await expect(page).toHaveURL(/layer=mid&view=thermal/);
  await expect(
    page.getByRole("status").filter({ hasText: "products" }),
  ).toHaveText("3 products");
});

test("the made-for slider filters by temperature, and 80°F is empty", async ({
  page,
}) => {
  await page.goto("/shop");
  const slider = page.getByRole("slider", { name: "Made for" });
  await slider.focus();
  await page.keyboard.press("ArrowLeft");
  await expect(page).toHaveURL(/t=80/);
  await expect(
    page.getByRole("heading", { name: "Nothing here is made for 80°F" }),
  ).toBeVisible();

  await page.getByRole("link", { name: "Clear filters" }).click();
  await expect(page).toHaveURL(/\/shop$/);
  await expect(
    page.getByRole("status").filter({ hasText: "products" }),
  ).toHaveText("11 products");
});

test("a shared URL reproduces the view", async ({ page }) => {
  await page.goto("/shop?layer=shell&t=40");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Shell layers",
  );
  await expect(page.getByRole("slider", { name: "Made for" })).toHaveValue(
    "40",
  );
  // All four shells cover 40°F; the Squall Jacket starts at exactly 40.
  await expect(
    page.getByRole("status").filter({ hasText: "products" }),
  ).toHaveText("4 products");
});

test("the shop has no axe violations, in photo and thermal views", async ({
  page,
}) => {
  for (const url of ["/shop", "/shop?view=thermal", "/shop?t=80"]) {
    await page.goto(url);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag22aa"])
      .analyze();
    expect(results.violations, url).toEqual([]);
  }
});
