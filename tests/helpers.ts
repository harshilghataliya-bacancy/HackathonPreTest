import { Page } from "@playwright/test";

const BASE = "http://localhost:3001";

export async function loginAs(page: Page, email: string) {
  // Call test-auth API to get a session cookie
  const res = await page.request.post(`${BASE}/api/test-auth`, {
    data: { email },
  });
  const cookies = (await res.headerValue("set-cookie")) || "";

  // Parse and set the cookie in the browser context
  const match = cookies.match(/authjs\.session-token=([^;]+)/);
  if (!match) throw new Error("Failed to get session cookie");

  await page.context().addCookies([
    {
      name: "authjs.session-token",
      value: match[1],
      domain: "localhost",
      path: "/",
      httpOnly: true,
      sameSite: "Lax",
    },
  ]);
}

export const EMPLOYEE_EMAIL = "testemployee@bacancy.com";
export const ADMIN_EMAIL = "testadmin@bacancy.com";
