import { expect, test } from "@playwright/test";

const protectedRoutes = [
  { path: "/items", expectedRedirect: "/login?next=/items" },
  { path: "/bookings", expectedRedirect: "/login?next=/bookings" },
  { path: "/bookings/owner", expectedRedirect: "/login?next=/bookings/owner" },
];

for (const route of protectedRoutes) {
  test(`guest users are redirected from ${route.path}`, async ({ page }) => {
    await page.goto(route.path);

    await expect(page).toHaveURL(new RegExp(`${route.expectedRedirect.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`));
    await expect(page.getByRole("heading", { name: "Sign in to ShareIt" })).toBeVisible();
  });
}
