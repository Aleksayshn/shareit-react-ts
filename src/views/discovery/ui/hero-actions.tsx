"use client";

import { useAuth } from "@/src/shared/auth";
import { LinkButton } from "@/src/shared/ui";

export function HeroActions() {
  const { isAuthenticated } = useAuth();
  const shareHref = isAuthenticated ? "/items" : "/register";

  return (
    <div className="flex flex-wrap gap-3">
      <LinkButton href="#featured" size="lg">
        Explore items
      </LinkButton>
      <LinkButton href={shareHref} size="lg" variant="secondary">
        Start sharing
      </LinkButton>
    </div>
  );
}
