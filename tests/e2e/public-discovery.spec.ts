import { expect, test } from "@playwright/test";

test("guest users can browse discovery, search listings, and open item details", async ({
  page,
}) => {
  await page.route("**/api/forward/items/search**", async (route) => {
    const url = new URL(route.request().url());
    const text = url.searchParams.get("text");

    if (text?.toLowerCase() === "bike") {
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: 2,
            name: "City Bike",
            description: "Step-through bike for everyday rides.",
            available: true,
            ownerId: 55,
            comments: [],
          },
        ]),
      });

      return;
    }

    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify([
        {
          id: 1,
          name: "Camping Stove",
          description: "Compact stove for weekend trips.",
          available: true,
          ownerId: 44,
          comments: [],
        },
      ]),
    });
  });

  await page.route("**/api/forward/items/2", async (route) => {
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        id: 2,
        name: "City Bike",
        description: "Step-through bike for everyday rides.",
        available: true,
        ownerId: 55,
        comments: [
          {
            id: 7,
            text: "Easy to collect and smooth to ride.",
            authorName: "Jamie",
            created: "2026-04-04T10:00:00.000Z",
          },
        ],
      }),
    });
  });

  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Available listings", exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Camping Stove" }).first()).toBeVisible();

  await page.getByPlaceholder("What are you looking for?").fill("Bike");

  await expect(
    page.getByRole("heading", { name: 'Search results for "Bike"' }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "City Bike" })).toBeVisible();

  await page.getByRole("link", { name: "See details" }).last().click();

  await expect(page).toHaveURL(/\/items\/2$/);
  await expect(page.getByRole("heading", { name: "City Bike" })).toBeVisible();
  await expect(page.getByText("Easy to collect and smooth to ride.")).toBeVisible();
});
