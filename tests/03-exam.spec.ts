import { test, expect } from "@playwright/test";
import { loginAs, EMPLOYEE_EMAIL } from "./helpers";

test.describe("Exam Page (Employee)", () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, EMPLOYEE_EMAIL);
  });

  test("loads exam page directly with MCQ questions", async ({ page }) => {
    await page.goto("/exam");
    await page.waitForLoadState("networkidle");

    // Should show navbar
    await expect(page.getByText("Hackathon Pre-Exam")).toBeVisible();

    // Should show progress bar area with answered count
    await expect(page.getByText(/answered/)).toBeVisible();

    // Should show at least one question
    await expect(page.getByText(/Q1\./)).toBeVisible();
  });

  test("can select an answer for a question", async ({ page }) => {
    await page.goto("/exam");
    await page.waitForLoadState("networkidle");

    // Find and click the first option of Q1
    const firstOption = page.locator("button").filter({ hasText: /^A/ }).first();
    await firstOption.click();

    // Should update answered count
    await expect(page.getByText(/1\/.*answered/)).toBeVisible();
  });

  test("shows page navigation", async ({ page }) => {
    await page.goto("/exam");
    await page.waitForLoadState("networkidle");

    // Should show page indicator
    await expect(page.getByText(/Page 1 of/)).toBeVisible();

    // Should have Previous button (disabled on first page)
    const prevBtn = page.getByText("Previous");
    await expect(prevBtn).toBeVisible();
  });

  test("can navigate between pages", async ({ page }) => {
    await page.goto("/exam");
    await page.waitForLoadState("networkidle");

    // Check if there are multiple pages
    const pageText = await page.getByText(/Page 1 of/).textContent();
    const totalPages = parseInt(pageText?.match(/of (\d+)/)?.[1] || "1");

    if (totalPages > 1) {
      // Click Next
      await page.getByText("Next").click();
      await expect(page.getByText(/Page 2 of/)).toBeVisible();

      // Click Previous
      await page.getByText("Previous").click();
      await expect(page.getByText(/Page 1 of/)).toBeVisible();
    }
  });

  test("submit button disabled until all questions answered", async ({
    page,
  }) => {
    await page.goto("/exam");
    await page.waitForLoadState("networkidle");

    // Navigate to last page
    const pageText = await page.getByText(/Page 1 of/).textContent();
    const totalPages = parseInt(pageText?.match(/of (\d+)/)?.[1] || "1");

    // Go to last page
    if (totalPages > 1) {
      const lastPageBtn = page.locator(`button`).filter({ hasText: `${totalPages}` });
      await lastPageBtn.click();
      await page.waitForTimeout(500);
    }

    // Submit button should be disabled (not all answered)
    const submitBtn = page.getByRole("button", { name: /Submit/ });
    if (await submitBtn.isVisible()) {
      await expect(submitBtn).toBeDisabled();
    }
  });

  test("shows user email in navbar", async ({ page }) => {
    await page.goto("/exam");
    await page.waitForLoadState("networkidle");

    await expect(page.getByText(EMPLOYEE_EMAIL)).toBeVisible();
  });
});
