import Link from "next/link";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";
import { cn } from "@/src/shared/lib";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonStyleProps {
  className?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonStyleProps {}

export interface LinkButtonProps
  extends AnchorHTMLAttributes<HTMLAnchorElement>,
    ButtonStyleProps {
  href: string;
  children: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-accent-foreground shadow-[0_14px_28px_-20px_rgba(15,118,110,0.9)] hover:bg-[#0d655f]",
  secondary:
    "bg-surface-strong text-foreground ring-1 ring-border hover:bg-[#f7f0e4]",
  ghost: "bg-transparent text-foreground hover:bg-white/60",
  danger:
    "bg-danger text-white shadow-[0_14px_28px_-20px_rgba(185,56,31,0.75)] hover:bg-[#9d301a]",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

function getButtonClasses({
  className,
  variant = "primary",
  size = "md",
}: ButtonStyleProps) {
  return cn(
    "inline-flex items-center justify-center rounded-full font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/35 disabled:pointer-events-none disabled:opacity-60",
    variantClasses[variant],
    sizeClasses[size],
    className,
  );
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      className={getButtonClasses({ className, variant, size })}
      type={type}
      {...props}
    />
  );
}

export function LinkButton({
  href,
  children,
  className,
  variant = "primary",
  size = "md",
  ...props
}: LinkButtonProps) {
  const isExternal = href.startsWith("http");

  if (isExternal) {
    return (
      <a
        className={getButtonClasses({ className, variant, size })}
        href={href}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      className={getButtonClasses({ className, variant, size })}
      href={href}
      {...props}
    >
      {children}
    </Link>
  );
}
