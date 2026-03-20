"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ActiveUserSelect } from "@/src/features";
import { cn } from "@/src/shared/lib";
import { useActiveUserStore } from "@/src/shared/model";

const navigationItems = [
  { href: "/", label: "Explore" },
  { href: "/users", label: "Profiles" },
  { href: "/items", label: "My listings" },
  { href: "/bookings", label: "Borrowing" },
  { href: "/bookings/owner", label: "Lending" },
];

export function AppHeader() {
  const pathname = usePathname();
  const hasProfileSelected = useActiveUserStore((state) => state.selectedUserId !== null);

  return (
    <header className="sticky top-0 z-50 bg-[rgb(239_231_216_/_0.82)] px-4 py-4 backdrop-blur md:px-6">
      <div className="mx-auto max-w-6xl rounded-[34px] border border-border/80 bg-[linear-gradient(135deg,rgba(255,250,242,0.96)_0%,rgba(247,240,227,0.92)_100%)] px-6 py-5 shadow-[0_22px_80px_-44px_rgba(30,27,23,0.45)] md:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="grid gap-5">
            <div>
              <p className="inline-flex rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-accent">
                Community sharing
              </p>
              <div className="mt-3 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-lg font-semibold text-accent-foreground">
                  S
                </div>
                <div>
                  <Link
                    className="text-2xl font-semibold tracking-tight text-foreground"
                    href="/"
                  >
                    ShareIt
                  </Link>
                  <p className="mt-1 text-sm text-muted">
                    Share useful things with others and borrow what you need.
                  </p>
                </div>
              </div>
            </div>

            <nav className="flex flex-wrap gap-2">
              {navigationItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-accent text-accent-foreground"
                        : "bg-surface-strong text-foreground ring-1 ring-border hover:bg-[#f7f0e4]",
                    )}
                    href={item.href}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="rounded-[28px] border border-border/80 bg-white/55 p-4">
            <ActiveUserSelect />
          </div>
        </div>

        <div className="mt-4 border-t border-border/70 pt-4 text-sm text-muted">
          {hasProfileSelected
            ? "Your current profile shapes what you can lend, borrow, and manage across the app."
            : "Choose a profile above to start exploring listings, sending requests, or managing shared items."}
        </div>
      </div>
    </header>
  );
}
