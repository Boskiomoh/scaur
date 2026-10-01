import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const stockLine = (page: import("@playwright/test").Page) =>
  page
    .getByRole("status")
    .filter({ hasText: /left in|in stock|Pick a size|Sold out/ });

test("Scarp Shell in Tide shows sold-out sizes and the low-stock line", async ({
  page,
}) => {
  await page.goto("/products/scarp-shell");
  await page.getByRole("button", { name: "Tide" }).click();
  await expect(page.getByText("Colour: Tide")).toBeVisible();

  for (const size of ["XS", "XXL"]) {
    await expect(
      page.getByRole("button", { name: `${size}, sold out` }),
    ).toHaveAttribute("aria-disabled", "true");
  }

  await page.getByRole("button", { name: "XL", exact: true }).click();
  await expect(stockLine(page)).toHaveText("Only 1 left in XL");
  await expect(page).toHaveURL(/colour=Tide&size=XL/);

  await page.reload();
  await expect(page.getByText("Colour: Tide")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "XL", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(stockLine(page)).toHaveText("Only 1 left in XL");
});

test("a sold-out size can't be chosen, and changing colour clears an unavailable size", async ({
  page,
}) => {
  await page.goto("/products/scarp-shell?colour=Moss&size=XXL");
  await expect(stockLine(page)).toHaveText("XXL in stock");

  await page.getByRole("button", { name: "Tide" }).click();
  await expect(stockLine(page)).toHaveText("Pick a size");
  await expect(
    page.getByRole("button", { name: "Choose a size" }),
  ).toBeVisible();

  await page
    .getByRole("button", { name: "XXL, sold out" })
    .click({ force: true });
  await expect(stockLine(page)).toHaveText("Pick a size");
});

test("the thermal switch swaps the stage image", async ({ page }) => {
  await page.goto("/products/scarp-shell");
  await page.getByRole("button", { name: "Thermal" }).click();
  await expect(
    page.getByRole("img", { name: /Illustrative thermal view/ }),
  ).toBeVisible();
  await expect(
    page.getByText("Illustrative thermal view, not a measurement."),
  ).toBeVisible();
});

test("the product page has product JSON-LD and no axe violations", async ({
  page,
}) => {
  await page.goto("/products/scarp-shell");
  const jsonLd = JSON.parse(
    (await page.locator('script[type="application/ld+json"]').textContent()) ??
      "{}",
  );
  expect(jsonLd["@type"]).toBe("Product");
  expect(jsonLd.offers).toHaveLength(12);

  await page.getByRole("button", { name: "Size guide" }).click();
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag22aa"])
    .analyze();
  expect(results.violations).toEqual([]);
});
