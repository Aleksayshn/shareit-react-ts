import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LoginForm } from "./login-form";
import { createAppError, createAuthUser } from "@/src/test/factories";
import { createDeferred, renderWithProviders } from "@/src/test/test-utils";

const {
  mockPush,
  mockRefresh,
  mockLogin,
} = vi.hoisted(() => ({
  mockPush: vi.fn(),
  mockRefresh: vi.fn(),
  mockLogin: vi.fn(),
}));

vi.mock("next/navigation", () => ({
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
    login: mockLogin,
  };
});

describe("LoginForm", () => {
  beforeEach(() => {
    mockPush.mockReset();
    mockRefresh.mockReset();
    mockLogin.mockReset();
  });

  it("shows schema validation messages before submitting invalid data", async () => {
    const user = userEvent.setup();

    renderWithProviders(<LoginForm />);

    await user.click(screen.getByRole("button", { name: "Sign in" }));

    expect(await screen.findByText("Email is required.")).toBeInTheDocument();
    expect(screen.getByText("Password is required.")).toBeInTheDocument();
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it("shows a pending state and redirects after a successful login", async () => {
    const request = createDeferred<ReturnType<typeof mockLogin>>();
    mockLogin.mockReturnValueOnce(request.promise);
    const user = userEvent.setup();

    renderWithProviders(<LoginForm nextPath="/bookings" />);

    await user.type(screen.getByPlaceholderText("you@example.com"), "alex@example.com");
    await user.type(screen.getByPlaceholderText("Your password"), "secret123");
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    expect(mockLogin).toHaveBeenCalledWith({
      email: "alex@example.com",
      password: "secret123",
    });
    expect(screen.getByRole("button", { name: "Signing in..." })).toBeDisabled();

    request.resolve(createAuthUser({ id: "member-1" }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/bookings");
    });

    expect(mockRefresh).toHaveBeenCalled();
  });

  it("renders backend errors returned from the login request", async () => {
    mockLogin.mockRejectedValueOnce(createAppError("Invalid email or password."));
    const user = userEvent.setup();

    renderWithProviders(<LoginForm />);

    await user.type(screen.getByPlaceholderText("you@example.com"), "alex@example.com");
    await user.type(screen.getByPlaceholderText("Your password"), "secret123");
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    expect(
      await screen.findByText("Invalid email or password."),
    ).toBeInTheDocument();
  });
});
