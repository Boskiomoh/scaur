import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("the shell is accessible and noindexed", async ({ page }) => {
  await page.goto("/brand");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /noindex/,
  );
  await expect(page.getByText(/Scaur is a fictional brand/)).toBeVisible();

  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag22aa"])
    .analyze();
  expect(results.violations).toEqual([]);
});

test("the menu sheet traps focus and returns it on Esc", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== "phone",
    "The menu sheet is for widths under 1024px",
  );
  await page.goto("/");
  const menuButton = page.getByRole("button", { name: "Menu" });
  await menuButton.click();
  const sheet = page.getByRole("dialog", { name: "Menu" });
  await expect(sheet).toBeVisible();

  for (let i = 0; i < 14; i++) {
    await page.keyboard.press("Tab");
    const isOutside = await page.evaluate(
      () =>
        document.activeElement !== document.body &&
        !document.activeElement?.closest("dialog"),
    );
    expect(isOutside).toBe(false);
  }

  await page.keyboard.press("Escape");
  await expect(sheet).toBeHidden();
  await expect(menuButton).toBeFocused();
});
