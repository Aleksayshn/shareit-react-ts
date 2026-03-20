import type { HTMLAttributes } from "react";
import { cn } from "@/src/shared/lib";

type CardTone = "default" | "accent";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  tone?: CardTone;
}

const toneClasses: Record<CardTone, string> = {
  default: "bg-surface-strong/94 border-border",
  accent: "bg-[linear-gradient(135deg,#fffaf0_0%,#eef7f4_100%)] border-[#bfd7cf]",
};

export function Card({
  className,
  tone = "default",
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-[28px] border p-6 shadow-[0_18px_48px_-32px_rgba(30,27,23,0.35)] backdrop-blur",
        toneClasses[tone],
        className,
      )}
      {...props}
    />
  );
}
