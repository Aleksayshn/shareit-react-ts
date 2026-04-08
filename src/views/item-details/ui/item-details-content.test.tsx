import { screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ItemDetailsContent } from "./item-details-content";
import {
  createAppError,
  createAuthUser,
  createComment,
  createItem,
} from "@/src/test/factories";
import { createDeferred, renderWithProviders } from "@/src/test/test-utils";

const { mockGetItemDetails } = vi.hoisted(() => ({
  mockGetItemDetails: vi.fn(),
}));

vi.mock("@/src/entities/item", async () => {
  const actual = await vi.importActual<typeof import("@/src/entities/item")>(
    "@/src/entities/item",
  );

  return {
    ...actual,
    getItemDetails: mockGetItemDetails,
  };
});

describe("ItemDetailsContent", () => {
  it("shows the guest sign-in CTA and renders borrower comments", async () => {
    const request = createDeferred<ReturnType<typeof mockGetItemDetails>>();
    mockGetItemDetails.mockReturnValueOnce(request.promise);

    renderWithProviders(<ItemDetailsContent itemId="item-1" />);

    expect(screen.getByText("Loading listing...")).toBeInTheDocument();

    request.resolve(
      createItem({
        id: "item-1",
        ownerId: "owner-99",
        comments: [createComment({ text: "Easy pickup and great condition." })],
      }),
    );

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "Camping Stove" })).toBeInTheDocument();
    });

    expect(screen.getByRole("heading", { name: "Sign in to request it" })).toBeInTheDocument();
    expect(screen.getByText("Easy pickup and great condition.")).toBeInTheDocument();
  });

  it("shows the owner message when the signed-in user owns the listing", async () => {
    mockGetItemDetails.mockResolvedValueOnce(
      createItem({
        id: "item-2",
        ownerId: "owner-2",
      }),
    );

    renderWithProviders(<ItemDetailsContent itemId="item-2" />, {
      user: createAuthUser({ id: "owner-2" }),
    });

    expect(
      await screen.findByText("You cannot borrow your own item"),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Manage my listings" })).toHaveAttribute(
      "href",
      "/items",
    );
  });

  it("hides the borrow form when the listing is unavailable", async () => {
    mockGetItemDetails.mockResolvedValueOnce(
      createItem({
        id: "item-3",
        isAvailable: false,
        ownerId: "owner-3",
      }),
    );

    renderWithProviders(<ItemDetailsContent itemId="item-3" />, {
      user: createAuthUser({ id: "borrower-3" }),
    });

    expect(
      await screen.findByText("This item is not open for requests"),
    ).toBeInTheDocument();
    expect(screen.queryByText("Send a borrow request")).not.toBeInTheDocument();
  });

  it("renders an error state when the details request fails", async () => {
    mockGetItemDetails.mockRejectedValueOnce(
      createAppError("We could not load this listing."),
    );

    renderWithProviders(<ItemDetailsContent itemId="missing-item" />);

    expect(
      await screen.findByText("We could not load this listing."),
    ).toBeInTheDocument();
  });
});
