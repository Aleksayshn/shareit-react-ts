import { screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { FeaturedListingsSection } from "./featured-listings-section";
import { createAppError, createAuthUser, createItem } from "@/src/test/factories";
import { createDeferred, renderWithProviders } from "@/src/test/test-utils";

const { mockGetFeaturedItems } = vi.hoisted(() => ({
  mockGetFeaturedItems: vi.fn(),
}));

vi.mock("@/src/entities/item", async () => {
  const actual = await vi.importActual<typeof import("@/src/entities/item")>(
    "@/src/entities/item",
  );

  return {
    ...actual,
    getFeaturedItems: mockGetFeaturedItems,
  };
});

describe("FeaturedListingsSection", () => {
  it("shows a loading state and guest CTA before rendering listings", async () => {
    const request = createDeferred<ReturnType<typeof mockGetFeaturedItems>>();
    mockGetFeaturedItems.mockReturnValueOnce(request.promise);

    renderWithProviders(<FeaturedListingsSection />);

    expect(screen.getByText("Loading available listings...")).toBeInTheDocument();

    request.resolve([
      createItem({
        id: "listing-1",
        name: "Power Drill",
        ownerId: "owner-99",
      }),
    ]);

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "Power Drill" })).toBeInTheDocument();
    });

    expect(
      screen.getByRole("link", { name: "Sign in to request" }),
    ).toHaveAttribute("href", "/login?next=%2Fitems%2Flisting-1%23borrow");
  });

  it("shows the authenticated CTA for a non-owner", async () => {
    mockGetFeaturedItems.mockResolvedValueOnce([
      createItem({
        id: "listing-2",
        name: "Projector",
        ownerId: "owner-22",
      }),
    ]);

    renderWithProviders(<FeaturedListingsSection />, {
      user: createAuthUser({ id: "borrower-22" }),
    });

    expect(
      await screen.findByRole("link", { name: "Request to borrow" }),
    ).toHaveAttribute("href", "/items/listing-2#borrow");
  });

  it("shows the owner CTA when the listing belongs to the signed-in user", async () => {
    mockGetFeaturedItems.mockResolvedValueOnce([
      createItem({
        id: "listing-3",
        name: "Ladder",
        ownerId: "owner-3",
      }),
    ]);

    renderWithProviders(<FeaturedListingsSection />, {
      user: createAuthUser({ id: "owner-3" }),
    });

    expect(
      await screen.findByRole("link", { name: "Your listing" }),
    ).toHaveAttribute("href", "/items");
  });

  it("renders a readable error state when the query fails", async () => {
    mockGetFeaturedItems.mockRejectedValueOnce(
      createAppError("Listings are temporarily unavailable."),
    );

    renderWithProviders(<FeaturedListingsSection />);

    expect(
      await screen.findByText("Listings are temporarily unavailable."),
    ).toBeInTheDocument();
    expect(screen.getByText("Listings unavailable")).toBeInTheDocument();
  });
});
