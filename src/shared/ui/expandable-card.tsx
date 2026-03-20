"use client";

import { useId, useState, type PropsWithChildren } from "react";
import { cn } from "@/src/shared/lib";
import { Button } from "./button";
import { Card } from "./card";

interface ExpandableCardProps extends PropsWithChildren {
  title: string;
  description?: string;
  eyebrow?: string;
  openLabel: string;
  closeLabel: string;
  defaultOpen?: boolean;
  className?: string;
  tone?: "default" | "accent";
}

export function ExpandableCard({
  children,
  title,
  description,
  eyebrow,
  openLabel,
  closeLabel,
  defaultOpen = false,
  className,
  tone = "default",
}: ExpandableCardProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentId = useId();

  return (
    <Card className={cn("grid gap-5", className)} tone={tone}>
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="max-w-2xl">
          {eyebrow ? (
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
            {title}
          </h2>
          {description ? (
            <p className="mt-2 text-sm leading-7 text-muted">{description}</p>
          ) : null}
        </div>

        <Button
          aria-controls={contentId}
          aria-expanded={isOpen}
          size="sm"
          variant={isOpen ? "ghost" : "primary"}
          onClick={() => setIsOpen((current) => !current)}
        >
          {isOpen ? closeLabel : openLabel}
        </Button>
      </div>

      {isOpen ? (
        <div className="border-t border-border/70 pt-6" id={contentId}>
          {children}
        </div>
      ) : null}
    </Card>
  );
}
