import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuthProvider } from "@/src/shared/auth";
import { SearchItemsSection } from "./search-items-section";

const { mockGetDiscoveryItems, mockSearchItems } = vi.hoisted(() => ({
  mockGetDiscoveryItems: vi.fn(),
  mockSearchItems: vi.fn(),
}));

vi.mock("@/src/entities/item", async () => {
  const actual = await vi.importActual<typeof import("@/src/entities/item")>(
    "@/src/entities/item",
  );

  return {
    ...actual,
    getDiscoveryItems: mockGetDiscoveryItems,
    searchItems: mockSearchItems,
  };
});

function createDeferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;

  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return { promise, resolve, reject };
}

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
}

function renderSearchItemsSection() {
  const queryClient = createQueryClient();

  return render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider initialUser={null}>
        <SearchItemsSection />
      </AuthProvider>
    </QueryClientProvider>,
  );
}

describe("SearchItemsSection", () => {
  beforeEach(() => {
    mockGetDiscoveryItems.mockReset();
    mockSearchItems.mockReset();
  });

  it("loads discovery listings by default and shows search results after typing", async () => {
    const discoveryDeferred = createDeferred<
      Awaited<ReturnType<typeof mockGetDiscoveryItems>>
    >();
    const searchDeferred = createDeferred<
      Awaited<ReturnType<typeof mockSearchItems>>
    >();

    mockGetDiscoveryItems.mockReturnValueOnce(discoveryDeferred.promise);
    mockSearchItems.mockReturnValueOnce(searchDeferred.promise);

    const user = userEvent.setup();

    renderSearchItemsSection();

    expect(screen.getByText("Loading listings...")).toBeInTheDocument();

    discoveryDeferred.resolve([
      {
        id: "1",
        name: "Camping Stove",
        description: "Compact stove for weekend trips.",
        isAvailable: true,
        ownerId: "42",
        requestId: null,
        lastBooking: null,
        nextBooking: null,
        comments: [],
      },
    ]);

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "Listings available now" }),
      ).toBeInTheDocument();
    });

    expect(
      screen.getByRole("heading", { name: "Camping Stove" }),
    ).toBeInTheDocument();

    await user.type(
      screen.getByPlaceholderText("What are you looking for?"),
      "Bike",
    );

    expect(screen.getByText("Searching as you type...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Looking for listings...")).toBeInTheDocument();
    });

    searchDeferred.resolve([
      {
        id: "2",
        name: "City Bike",
        description: "Step-through bike for everyday rides.",
        isAvailable: true,
        ownerId: "21",
        requestId: null,
        lastBooking: null,
        nextBooking: null,
        comments: [],
      },
    ]);

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: 'Search results for "Bike"' }),
      ).toBeInTheDocument();
    });

    expect(screen.getByRole("heading", { name: "City Bike" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Sign in to request" })).toBeInTheDocument();
  });
});
