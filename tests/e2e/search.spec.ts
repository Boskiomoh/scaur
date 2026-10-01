import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("'down' finds the Cornice Down Jacket from the keyboard alone", async ({
  page,
}) => {
  await page.goto("/shop");
  await page
    .getByRole("banner")
    .getByRole("link", { name: "Search", exact: true })
    .focus();
  await page.keyboard.press("Enter");
  const overlay = page.getByRole("dialog", { name: "Search the store" });
  await expect(overlay).toBeVisible();
  await expect(overlay.getByRole("combobox")).toBeFocused();

  await page.keyboard.type("down");
  await expect(
    overlay.getByRole("option", { name: /Cornice Down Jacket/ }),
  ).toBeVisible();
  await page.keyboard.press("ArrowDown");
  await expect(
    overlay.getByRole("option", { name: /Cornice Down Jacket/ }),
  ).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/products\/cornice-down-jacket/);
});

test("Esc closes the overlay and Enter with no option opens /search", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("banner")
    .getByRole("link", { name: "Search", exact: true })
    .click();
  const overlay = page.getByRole("dialog", { name: "Search the store" });
  await page.keyboard.press("Escape");
  await expect(overlay).toBeHidden();

  await page
    .getByRole("banner")
    .getByRole("link", { name: "Search", exact: true })
    .click();
  await page.keyboard.type("shell");
  await expect(overlay.getByRole("status")).toHaveText("4 products");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/search\?q=shell/);
  await expect(
    page.getByRole("status").filter({ hasText: "results" }),
  ).toHaveText("4 results for “shell”");
});

test("search understands temperatures and shows a designed no-result state", async ({
  page,
}) => {
  await page.goto("/search?q=20°F");
  await expect(
    page.getByRole("status").filter({ hasText: "results" }),
  ).toHaveText("5 results for “20°F”");

  await page.goto("/search?q=parka");
  await expect(
    page.getByRole("heading", { name: "No layers match “parka”" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "down" }).click();
  await expect(
    page.getByRole("link", { name: /Cornice Down Jacket/ }),
  ).toBeVisible();
});

test("the search page and overlay have no axe violations", async ({ page }) => {
  await page.goto("/search?q=shell");
  let results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag22aa"])
    .analyze();
  expect(results.violations).toEqual([]);

  await page
    .getByRole("banner")
    .getByRole("link", { name: "Search", exact: true })
    .click();
  await page.keyboard.type("fleece");
  await expect(page.getByRole("option").first()).toBeVisible();
  results = await new AxeBuilder({ page })
    .include("dialog")
    .withTags(["wcag2a", "wcag2aa", "wcag22aa"])
    .analyze();
  expect(results.violations).toEqual([]);
});
