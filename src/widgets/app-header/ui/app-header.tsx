"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ActiveUserSelect } from "@/src/features";
import { cn } from "@/src/shared/lib";
import { useActiveUserStore } from "@/src/shared/model";

const navigationItems = [
  { href: "/", label: "Discover" },
  { href: "/users", label: "Users" },
  { href: "/items", label: "My items" },
  { href: "/bookings", label: "My bookings" },
  { href: "/bookings/owner", label: "Owner requests" },
];

export function AppHeader() {
  const pathname = usePathname();
  const selectedUserId = useActiveUserStore((state) => state.selectedUserId);

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-[#fff8ec]/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-4 md:px-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Link className="text-xl font-semibold tracking-tight text-foreground" href="/">
              ShareIt MVP
            </Link>
            <p className="mt-1 text-sm text-muted">
              A small sharing workflow for discovery, items, bookings, and comments.
            </p>
          </div>

          <ActiveUserSelect />
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
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

          <p className="text-sm text-muted">
            Active user:{" "}
            <span className="font-medium text-foreground">
              {selectedUserId || "not selected"}
            </span>
          </p>
        </div>
      </div>
    </header>
  );
}
