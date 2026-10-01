import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const cart = (page: Page) => page.getByRole("dialog", { name: /Cart/ });

const addTideXl = async (page: Page) => {
  await page.goto("/products/scarp-shell?colour=Tide&size=XL");
  await expect(
    page.getByRole("status").filter({ hasText: "left in" }),
  ).toHaveText("Only 1 left in XL");
  await page.getByRole("button", { name: "Add to cart" }).click();
  await expect(cart(page)).toBeVisible();
};

test("add to cart opens the drawer with the right line, capped at stock", async ({
  page,
}) => {
  await addTideXl(page);
  const drawer = cart(page);
  await expect(drawer.getByRole("link", { name: "Scarp Shell" })).toBeVisible();
  await expect(drawer.getByText("Tide, XL")).toBeVisible();
  await expect(
    drawer.getByRole("button", { name: "No more in stock" }),
  ).toHaveAttribute("aria-disabled", "true");
  await expect(drawer.getByText("Only 1 left in this size")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Cart, 1 item" }).first(),
  ).toBeAttached();
});

test("the server refuses more than the stock", async ({ page }) => {
  await addTideXl(page);
  await page.keyboard.press("Escape");
  await expect(cart(page)).toBeHidden();

  await page.getByRole("button", { name: "Add to cart" }).click();
  await expect(page.getByText("Only 1 left in this size.")).toBeVisible();
  await expect(cart(page)).toBeHidden();
});

test("the cart survives a reload, and removing the last line shows the empty state", async ({
  page,
}) => {
  await addTideXl(page);
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Cart, 1 item" }).first(),
  ).toBeAttached();

  await page
    .getByRole("button", { name: "Cart, 1 item" })
    .filter({ visible: true })
    .click();
  const drawer = cart(page);
  await drawer.getByRole("button", { name: "Remove", exact: true }).click();
  await expect(
    drawer.getByRole("heading", { name: "Your cart is empty" }),
  ).toBeVisible();

  await page.reload();
  await expect(
    page.getByRole("button", { name: "Cart, empty" }).first(),
  ).toBeAttached();
});

test("quantity changes update the line and the subtotal", async ({ page }) => {
  await page.goto("/products/tarn-merino-crew?colour=Slate+Blue&size=M", {
    waitUntil: "networkidle",
  });
  await page.getByRole("button", { name: "Add to cart" }).click();
  const drawer = cart(page);
  await drawer
    .getByRole("button", { name: "One more Tarn Merino Crew" })
    .click();
  await expect(
    drawer.getByRole("group", { name: "Quantity of Tarn Merino Crew" }),
  ).toContainText("2");
  await expect(drawer.getByText("$156").first()).toBeVisible();
  await expect(drawer.locator('li[aria-busy="true"]')).toHaveCount(0);

  await page.reload();
  await expect(
    page.getByRole("button", { name: "Cart, 2 items" }).first(),
  ).toBeAttached();
});

test("checkout shows the test notice, then points at Shopify's checkout", async ({
  page,
}) => {
  await addTideXl(page);
  const drawer = cart(page);
  await drawer.getByRole("button", { name: "Checkout" }).click();
  await expect(
    drawer.getByRole("heading", { name: "This is a test checkout" }),
  ).toBeVisible();
  const href = await drawer
    .getByRole("link", { name: "Continue to checkout" })
    .getAttribute("href");
  expect(href).toMatch(/^https:\/\/scaur-demo\.myshopify\.com\/.*cart/);

  await drawer.getByRole("button", { name: "Back to cart" }).click();
  await expect(drawer.getByRole("button", { name: "Checkout" })).toBeVisible();
});

test("the drawer is keyboard operable, returns focus and has no axe violations", async ({
  page,
}) => {
  await addTideXl(page);
  const results = await new AxeBuilder({ page })
    .include("dialog")
    .withTags(["wcag2a", "wcag2aa", "wcag22aa"])
    .analyze();
  expect(results.violations).toEqual([]);

  await page.keyboard.press("Escape");
  await expect(cart(page)).toBeHidden();

  const opener = page
    .getByRole("button", { name: "Cart, 1 item" })
    .filter({ visible: true });
  await opener.focus();
  await page.keyboard.press("Enter");
  await expect(cart(page)).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(opener).toBeFocused();
});
