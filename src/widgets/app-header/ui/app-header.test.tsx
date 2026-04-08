import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { AppHeader } from "./app-header";
import { createAuthUser } from "@/src/test/factories";
import { createDeferred, renderWithProviders } from "@/src/test/test-utils";

const {
  mockPush,
  mockRefresh,
  mockLogout,
  mockUsePathname,
} = vi.hoisted(() => ({
  mockPush: vi.fn(),
  mockRefresh: vi.fn(),
  mockLogout: vi.fn(),
  mockUsePathname: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  usePathname: () => mockUsePathname(),
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
}));

vi.mock("@/src/entities/auth", async () => {
  const actual = await vi.importActual<typeof import("@/src/entities/auth")>(
    "@/src/entities/auth",
  );

  return {
    ...actual,
    logout: mockLogout,
  };
});

describe("AppHeader", () => {
  it("renders guest navigation and highlights the active route", () => {
    mockUsePathname.mockReturnValue("/");

    renderWithProviders(<AppHeader />);

    expect(screen.getByRole("link", { name: "Sign in" })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Create account" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Explore" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "My listings" })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("logs the user out, updates the header, and refreshes the route", async () => {
    mockUsePathname.mockReturnValue("/items");
    const request = createDeferred<ReturnType<typeof mockLogout>>();
    mockLogout.mockReturnValueOnce(request.promise);
    const user = userEvent.setup();

    renderWithProviders(<AppHeader />, {
      user: createAuthUser({ name: "Alex Johnson" }),
    });

    await user.click(screen.getByRole("button", { name: "Log out" }));

    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button", { name: "Signing out..." })).toBeDisabled();

    request.resolve(undefined);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/");
    });

    expect(mockRefresh).toHaveBeenCalled();
    expect(screen.getByRole("link", { name: "Sign in" })).toBeInTheDocument();
  });
});
