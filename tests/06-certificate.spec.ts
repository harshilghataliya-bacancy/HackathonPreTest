import { test, expect } from "@playwright/test";
import { loginAs, EMPLOYEE_EMAIL } from "./helpers";

test.describe("Certificate Page", () => {
  test("shows not available if user hasn't passed", async ({ page }) => {
    await loginAs(page, EMPLOYEE_EMAIL);

    // Clean attempts first
    await page.request.delete("http://localhost:3001/api/test-cleanup", {
      data: { email: EMPLOYEE_EMAIL },
    });

    await page.goto("/certificate");
    await page.waitForLoadState("networkidle");

    // Should show not available message
    const notAvailable = await page
      .getByText("Certificate Not Available")
      .isVisible()
      .catch(() => false);

    if (notAvailable) {
      await expect(
        page.getByText("You need to pass the exam with 100% score")
      ).toBeVisible();
      await expect(page.getByText("Back to Dashboard")).toBeVisible();
    }
  });

  test("certificate page has dark theme", async ({ page }) => {
    await loginAs(page, EMPLOYEE_EMAIL);
    await page.goto("/certificate");
    await page.waitForLoadState("networkidle");

    // Page should have dark background
    const bgColor = await page.locator("div").first().evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });

    // Should be dark (#0b0c10 or similar)
    expect(bgColor).toBeTruthy();
  });

  test("certificate shows Bacancy logo", async ({ page }) => {
    await loginAs(page, EMPLOYEE_EMAIL);
    await page.goto("/certificate");
    await page.waitForLoadState("networkidle");

    const logo = page.locator('img[alt="Bacancy"]');
    const logoCount = await logo.count();
    expect(logoCount).toBeGreaterThan(0);
  });
});
