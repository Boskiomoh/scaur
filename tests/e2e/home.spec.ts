import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("the hero's thermal switch swaps the image without moving the layout", async ({
  page,
}) => {
  await page.goto("/");
  const hero = page.getByRole("region", { name: /Four layers/ });
  const figure = hero.locator("figure > div").first();
  // Page coordinates, so scrolling to the switch on phones doesn't count as a shift.
  const box = () =>
    figure.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      return {
        top: rect.top + window.scrollY,
        height: rect.height,
        width: rect.width,
      };
    });
  const before = await box();

  await hero.getByRole("button", { name: "Thermal" }).click();
  await expect(hero.getByRole("button", { name: "Thermal" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(
    hero.getByRole("img", { name: /Illustrative thermal view/ }),
  ).toBeVisible();
  expect(await box()).toEqual(before);
});

test("the kit teaser shows the same kit as /kit for the same day", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name === "phone",
    "The teaser has no controls on phones",
  );
  await page.goto("/");
  const teaser = page.getByRole("region", { name: /Tell us the day/ });
  await teaser.getByRole("button", { name: "Alpine climb" }).click();
  await teaser.getByRole("button", { name: "Showers" }).click();
  const teaserNames = await teaser
    .locator("li span.font-semibold")
    .allTextContents();

  await teaser.getByRole("link", { name: "See my kit" }).click();
  await expect(page).toHaveURL(/\/kit\?a=alpine&t=38&r=showers&w=breezy/);
  const kitNames = await page
    .getByRole("region", { name: "Your kit" })
    .locator("li span.font-semibold")
    .allTextContents();
  expect(kitNames).toEqual(teaserNames);
});

test("the home page has no axe violations", async ({ page }) => {
  await page.goto("/");
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag22aa"])
    .analyze();
  expect(results.violations).toEqual([]);
});
