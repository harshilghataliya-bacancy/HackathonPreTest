import { test, expect } from "@playwright/test";
import { loginAs, EMPLOYEE_EMAIL } from "./helpers";

test.describe("Exam Submission Flow", () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, EMPLOYEE_EMAIL);

    // Clean previous attempts for this test user
    await page.request.delete("http://localhost:3001/api/test-cleanup", {
      data: { email: EMPLOYEE_EMAIL },
    });
  });

  test("can answer all questions and submit exam", async ({ page }) => {
    await page.goto("/exam");
    await page.waitForLoadState("networkidle");

    // Get total question count from the progress text
    const progressText = await page.getByText(/\/.*answered/).first().textContent();
    const totalQuestions = parseInt(progressText?.match(/\/(\d+)/)?.[1] || "0");

    if (totalQuestions === 0) {
      test.skip();
      return;
    }

    // Get total pages
    const pageText = await page.getByText(/Page 1 of/).textContent();
    const totalPages = parseInt(pageText?.match(/of (\d+)/)?.[1] || "1");

    // Answer all questions on each page
    for (let p = 0; p < totalPages; p++) {
      if (p > 0) {
        // Navigate to next page
        const nextBtn = page.getByText("Next");
        if (await nextBtn.isVisible()) {
          await nextBtn.click();
          await page.waitForTimeout(500);
        }
      }

      // Select option A for each question on this page
      const optionButtons = page.locator("button").filter({ hasText: /^A/ });
      const count = await optionButtons.count();
      for (let i = 0; i < count; i++) {
        await optionButtons.nth(i).click();
        await page.waitForTimeout(100);
      }
    }

    // Now submit should be enabled on the last page
    const submitBtn = page.getByRole("button", { name: /Submit/ });
    await expect(submitBtn).toBeEnabled();
    await submitBtn.click();

    // Should show results (either passed or failed)
    await page.waitForTimeout(2000);
    const passed = await page.getByText("Congratulations").isVisible().catch(() => false);
    const failed = await page.getByText("Exam Results").isVisible().catch(() => false);

    expect(passed || failed).toBeTruthy();
  });

  test("failed exam shows incorrect questions and retake button", async ({
    page,
  }) => {
    await page.goto("/exam");
    await page.waitForLoadState("networkidle");

    const progressText = await page.getByText(/\/.*answered/).first().textContent();
    const totalQuestions = parseInt(progressText?.match(/\/(\d+)/)?.[1] || "0");
    if (totalQuestions === 0) {
      test.skip();
      return;
    }

    const pageText = await page.getByText(/Page 1 of/).textContent();
    const totalPages = parseInt(pageText?.match(/of (\d+)/)?.[1] || "1");

    // Answer all with option D (likely wrong for most)
    for (let p = 0; p < totalPages; p++) {
      if (p > 0) {
        const nextBtn = page.getByText("Next");
        if (await nextBtn.isVisible()) {
          await nextBtn.click();
          await page.waitForTimeout(500);
        }
      }

      const optionButtons = page.locator("button").filter({ hasText: /^D/ });
      const count = await optionButtons.count();
      for (let i = 0; i < count; i++) {
        await optionButtons.nth(i).click();
        await page.waitForTimeout(100);
      }
    }

    const submitBtn = page.getByRole("button", { name: /Submit/ });
    await submitBtn.click();
    await page.waitForTimeout(2000);

    const passed = await page.getByText("Congratulations").isVisible().catch(() => false);

    if (!passed) {
      // Should show results page
      await expect(page.getByText("Exam Results")).toBeVisible();

      // Should show score stats
      await expect(page.getByText("Correct")).toBeVisible();
      await expect(page.getByText("Incorrect")).toBeVisible();

      // Should show "keep trying" message
      await expect(
        page.getByText("You need 100% correct answers to pass")
      ).toBeVisible();

      // Wait for retake button (appears after 3 seconds)
      await page.waitForTimeout(3500);
      await expect(page.getByText("Retake Exam")).toBeVisible();

      // Click retake — should go back to MCQ
      await page.getByText("Retake Exam").click();
      await page.waitForTimeout(1000);
      await expect(page.getByText(/Q1\./)).toBeVisible();
    }
  });
});
