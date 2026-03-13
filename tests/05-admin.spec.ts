import { test, expect } from "@playwright/test";
import { loginAs, ADMIN_EMAIL, EMPLOYEE_EMAIL } from "./helpers";

test.describe("Admin Panel", () => {
  test("employee cannot access admin page", async ({ page }) => {
    await loginAs(page, EMPLOYEE_EMAIL);
    await page.goto("/admin");
    await page.waitForURL("**/dashboard**");
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test("admin can access admin page", async ({ page }) => {
    await loginAs(page, ADMIN_EMAIL);
    await page.goto("/admin");
    await page.waitForLoadState("networkidle");

    // Should show admin dashboard
    await expect(page.getByText("Admin Dashboard").first()).toBeVisible();
  });

  test("admin can see stats cards", async ({ page }) => {
    await loginAs(page, ADMIN_EMAIL);
    await page.goto("/admin");
    await page.waitForLoadState("networkidle");

    // Should show stats
    await expect(page.getByText("Total Employees").first()).toBeVisible();
  });

  test("admin can toggle exam open/close", async ({ page }) => {
    await loginAs(page, ADMIN_EMAIL);
    await page.goto("/admin");
    await page.waitForLoadState("networkidle");

    // Find the exam toggle button (Start Exam or Close Exam)
    const startBtn = page.getByRole("button", { name: /Start Exam/i });
    const closeBtn = page.getByRole("button", { name: /Close Exam/i });

    const isStartVisible = await startBtn.isVisible().catch(() => false);
    const isCloseVisible = await closeBtn.isVisible().catch(() => false);

    // Toggle it
    if (isStartVisible) {
      await startBtn.click();
      await page.waitForTimeout(1000);
      await expect(page.getByRole("button", { name: /Close Exam/i })).toBeVisible();
    } else if (isCloseVisible) {
      await closeBtn.click();
      await page.waitForTimeout(1000);
      await expect(page.getByRole("button", { name: /Start Exam/i })).toBeVisible();

      // Toggle back to open for other tests
      await page.getByRole("button", { name: /Start Exam/i }).click();
      await page.waitForTimeout(1000);
    }
  });

  test("admin can see users table", async ({ page }) => {
    await loginAs(page, ADMIN_EMAIL);
    await page.goto("/admin");
    await page.waitForLoadState("networkidle");

    // Should show the employee in the table
    await expect(page.getByText(EMPLOYEE_EMAIL).first()).toBeVisible();
  });
});
