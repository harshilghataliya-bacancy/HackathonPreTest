import { test, expect } from "@playwright/test";
import { loginAs, EMPLOYEE_EMAIL } from "./helpers";

test.describe("Dashboard (Employee)", () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, EMPLOYEE_EMAIL);
  });

  test("shows dashboard with navbar", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForLoadState("networkidle");

    // Navbar shows Bacancy branding
    await expect(page.locator("nav").getByText("Bacancy")).toBeVisible();

    // Shows user email
    await expect(page.getByText(EMPLOYEE_EMAIL)).toBeVisible();

    // Shows logout button
    await expect(page.locator("nav button")).toBeVisible();
  });

  test("shows hero section with hackathon title", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForLoadState("networkidle");

    // Hero title
    await expect(page.getByText("AI MAHAKURUKSHETRA")).toBeVisible();
    await expect(
      page.getByText("THINK, BUILD, AND LAUNCH A PRODUCT.")
    ).toBeVisible();
  });

  test("shows scroll down indicator", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForLoadState("networkidle");

    // Scroll down text visible initially
    await expect(
      page.getByText("Scroll down to start exam")
    ).toBeVisible();
  });

  test("shows event info cards after scroll", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForLoadState("networkidle");

    // Scroll down to static content
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);

    // Event info cards
    await expect(page.getByText("14 March 2026").first()).toBeVisible();
    await expect(page.getByText("9:00 AM - 7:00 PM").first()).toBeVisible();
  });

  test("shows pre-exam rules section", async ({ page }) => {
    await page.goto("/dashboard");
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);

    await expect(
      page.getByText("Pre-Exam Rules")
    ).toBeVisible();
    await expect(
      page.getByText("You must score 100% to pass")
    ).toBeVisible();
  });

  test("shows Start Pre-Exam button when exam is open", async ({ page }) => {
    await page.goto("/dashboard");
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);

    await expect(page.getByText("Start Pre-Exam")).toBeVisible();
  });

  test("Start Pre-Exam navigates to exam page", async ({ page }) => {
    await page.goto("/dashboard");
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);

    await page.getByText("Start Pre-Exam").click();
    await page.waitForURL("**/exam**");
    await expect(page).toHaveURL(/\/exam/);
  });
});
