import { test, expect } from "@playwright/test";

test.describe("Login Page", () => {
  test("shows login page with correct elements", async ({ page }) => {
    await page.goto("/login");

    // Should show title
    await expect(page.locator("h1")).toContainText("AI");
    await expect(page.locator("h1")).toContainText("MAHAKURUKSHETRA");

    // Should show badge
    await expect(page.getByText("The Ultimate AI Battle")).toBeVisible();

    // Should show Google sign-in button
    await expect(page.getByText("Enter with Google")).toBeVisible();

    // Should show domain restriction notice
    await expect(
      page.getByText("Only @bacancy.com accounts are allowed")
    ).toBeVisible();

    // Should show footer
    await expect(
      page.getByText("Bacancy Technology · AI Mahakurukshetra 2026")
    ).toBeVisible();
  });

  test("unauthenticated user is redirected to login", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForURL("**/login**");
    await expect(page).toHaveURL(/\/login/);
  });

  test("root redirects to login when not authenticated", async ({ page }) => {
    await page.goto("/");
    await page.waitForURL("**/login**");
    await expect(page).toHaveURL(/\/login/);
  });
});
