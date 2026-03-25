"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { logout } from "@/src/entities/auth";
import { useAuth } from "@/src/shared/auth";
import { cn } from "@/src/shared/lib";
import { Button, LinkButton } from "@/src/shared/ui";

const navigationItems = [
  { href: "/", label: "Explore" },
  { href: "/items", label: "My listings" },
  { href: "/bookings", label: "Borrowing" },
  { href: "/bookings/owner", label: "Lending" },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, setUser, isAuthenticated } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await logout();
      setUser(null);
      router.push("/");
      router.refresh();
    } catch {
      // Keep the current session if logout fails.
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-[rgb(245_236_221_/_0.9)] backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3 md:px-6">
        <Link className="flex shrink-0 items-center gap-3" href="/">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent text-sm font-semibold uppercase tracking-[0.18em] text-accent-foreground">
            S
          </div>
          <div className="leading-tight">
            <p className="text-lg font-semibold tracking-tight text-foreground">
              ShareIt
            </p>
            <p className="text-[11px] uppercase tracking-[0.22em] text-muted">
              Borrow and share
            </p>
          </div>
        </Link>

        <nav className="order-3 flex w-full gap-2 overflow-x-auto pb-1 md:order-2 md:ml-4 md:w-auto md:flex-1 md:justify-center md:pb-0">
          {navigationItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "shrink-0 rounded-full px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "bg-white/72 text-foreground ring-1 ring-border hover:bg-[#f7f0e4]",
                )}
                href={item.href}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="order-2 ml-auto flex shrink-0 items-center gap-2 md:order-3">
          {isAuthenticated && user ? (
            <>
              <div className="hidden items-center gap-3 rounded-full border border-border/80 bg-white/65 px-3 py-2 sm:flex">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/12 text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
                  {getInitials(user.name)}
                </div>
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-foreground">{user.name}</p>
                  <p className="text-[11px] text-muted">Account</p>
                </div>
              </div>
              <Button
                disabled={isLoggingOut}
                size="sm"
                variant="ghost"
                onClick={handleLogout}
              >
                {isLoggingOut ? "Signing out..." : "Log out"}
              </Button>
            </>
          ) : (
            <>
              <LinkButton href="/login" size="sm" variant="secondary">
                Sign in
              </LinkButton>
              <LinkButton href="/register" size="sm">
                Create account
              </LinkButton>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
