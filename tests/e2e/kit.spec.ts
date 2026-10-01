import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const slotNames = (page: Page) =>
  page
    .getByRole("region", { name: "Your kit" })
    .locator("li span.font-semibold");

test("the default kit is the worked example", async ({ page }) => {
  await page.goto("/kit");
  await expect(slotNames(page)).toHaveText([
    "Tarn Merino Quarter-Zip",
    "Knoll Grid Fleece",
    "Belay Hoody",
    "Scarp Shell",
  ]);
  await expect(page.getByText("10°F", { exact: true })).toBeVisible();
  await expect(page.getByText("$782")).toBeVisible();
  await expect(page.getByText("4 pieces in M")).toBeVisible();
});

test("swap, remove and add back update the kit, the total and the URL", async ({
  page,
}) => {
  await page.goto("/kit");
  await page
    .getByRole("link", { name: "Swap mid layer, currently Knoll Grid Fleece" })
    .click();
  await expect(slotNames(page).nth(1)).toHaveText("Bothy Pile Jacket");
  await expect(page.getByText("$812")).toBeVisible();
  await expect(page).toHaveURL(/pick=mid\.2/);

  await page.getByRole("link", { name: "Remove Belay Hoody from kit" }).click();
  await expect(page.getByText("Removed from this kit")).toBeVisible();
  await expect(page.getByText("3 pieces in M")).toBeVisible();
  await expect(page).toHaveURL(/off=insulation/);

  await page.getByRole("link", { name: "Add one anyway" }).click();
  await expect(page.getByText("4 pieces in M")).toBeVisible();
});

test("a shared URL reproduces the kit", async ({ page }) => {
  await page.goto("/kit?a=run&t=55&r=dry&w=calm&s=L");
  await expect(page.getByRole("radio", { name: "Trail run" })).toBeChecked();
  await expect(
    page.getByRole("slider", { name: "Temperature at the start" }),
  ).toHaveValue("55");
  await expect(page.getByText("1 piece in L")).toBeVisible();
  await expect(slotNames(page)).toHaveText(["Tarn Merino Crew"]);
});

test("one click adds the grouped kit, and Edit kit returns to it", async ({
  page,
}) => {
  await page.goto("/kit?a=hike&t=38&r=steady&w=breezy&s=M&pick=mid.2");
  await page.getByRole("button", { name: "Add kit to cart" }).click();
  const drawer = page.getByRole("dialog", { name: /Cart/ });
  await expect(
    drawer.getByText("Kit: day hike, 38°F, steady rain"),
  ).toBeVisible();
  await expect(drawer.getByRole("listitem")).toHaveCount(4);

  await drawer.getByRole("link", { name: "Edit kit" }).click();
  await expect(page).toHaveURL(
    /\/kit\?a=hike&t=38&r=steady&w=breezy&s=M&pick=mid\.2/,
  );
  await expect(slotNames(page).nth(1)).toHaveText("Bothy Pile Jacket");
});

test("the kit page has no axe violations", async ({ page }) => {
  await page.goto("/kit?off=insulation");
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag22aa"])
    .analyze();
  expect(results.violations).toEqual([]);
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("the form submits to the same URL and the kit follows", async ({
    page,
  }) => {
    await page.goto("/kit");
    await page.getByRole("radio", { name: "Alpine climb" }).check();
    await page.getByRole("button", { name: "Update kit" }).click();
    await expect(page).toHaveURL(/a=alpine/);
    await expect(
      page.getByRole("radio", { name: "Alpine climb" }),
    ).toBeChecked();
    await expect(page.getByText("comfortable down to")).toBeVisible();
  });
});
