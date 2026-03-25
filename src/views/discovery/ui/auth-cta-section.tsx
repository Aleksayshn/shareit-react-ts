"use client";

import Image from "next/image";
import { useAuth } from "@/src/shared/auth";
import { Card, LinkButton } from "@/src/shared/ui";

export function AuthCtaSection() {
  const { user, isAuthenticated } = useAuth();

  if (isAuthenticated && user) {
    return (
      <Card className="grid gap-6 overflow-hidden lg:grid-cols-[1fr_280px] lg:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
            Ready to share?
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-foreground">
            Publish your next listing
          </h2>
          <p className="mt-2 text-sm leading-7 text-muted">
            Add something you own, set availability, and start helping or earning
            today.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <LinkButton href="/items" size="sm">
              Add a listing
            </LinkButton>
            <LinkButton href="/bookings/owner" size="sm" variant="secondary">
              Review lending requests
            </LinkButton>
          </div>
        </div>

        <div className="relative min-h-[220px] overflow-hidden rounded-[28px] border border-border/70 bg-[#dbe9cc]">
          <Image
            alt="Two guinea pigs sitting together in leafy greens"
            className="object-cover"
            fill
            sizes="(max-width: 1024px) 100vw, 280px"
            src="/assets/home/guinea-pigs-garden.jpeg"
          />
          <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,rgba(30,27,23,0)_0%,rgba(30,27,23,0.72)_100%)] p-4">
            <p className="text-sm font-medium text-white">
              Friendly, local, and built around sharing.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="grid gap-6 overflow-hidden lg:grid-cols-[1fr_280px] lg:items-center">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
          Join the community
        </p>
        <h2 className="mt-3 text-2xl font-semibold text-foreground">
          Borrow or share in minutes
        </h2>
        <p className="mt-2 text-sm leading-7 text-muted">
          Create an account to request items, publish listings, and manage your
          sharing activity.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <LinkButton href="/register" size="sm">
            Create account
          </LinkButton>
          <LinkButton href="/login" size="sm" variant="secondary">
            Sign in
          </LinkButton>
        </div>
      </div>

      <div className="relative min-h-[220px] overflow-hidden rounded-[28px] border border-border/70 bg-[#eadcc7]">
        <Image
          alt="Gold ShareIT lettering displayed as a bold brand visual"
          className="object-cover"
          fill
          sizes="(max-width: 1024px) 100vw, 280px"
          src="/assets/home/shareit-3d-wordmark.jpeg"
        />
        <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,rgba(30,27,23,0)_0%,rgba(30,27,23,0.72)_100%)] p-4">
          <p className="text-sm font-medium text-white">
            Start borrowing useful things or share what you already own.
          </p>
        </div>
      </div>
    </Card>
  );
}
