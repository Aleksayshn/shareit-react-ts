import type { PropsWithChildren, ReactNode } from "react";

interface PageShellProps extends PropsWithChildren {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}

export function PageShell({
  children,
  eyebrow,
  title,
  description,
  actions,
}: PageShellProps) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-6 py-10 md:px-10 md:py-14">
      <section className="rounded-[36px] border border-border bg-[linear-gradient(135deg,#fffaf1_0%,#f5efe4_50%,#ede4d7_100%)] p-7 shadow-[0_24px_80px_-48px_rgba(30,27,23,0.55)] md:p-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            {eyebrow ? (
              <p className="text-sm font-semibold uppercase tracking-[0.26em] text-accent">
                {eyebrow}
              </p>
            ) : null}
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-foreground md:text-6xl">
              {title}
            </h1>
            {description ? (
              <p className="mt-4 max-w-2xl text-base leading-8 text-muted md:text-lg">
                {description}
              </p>
            ) : null}
          </div>
          {actions ? <div className="shrink-0">{actions}</div> : null}
        </div>
      </section>
      {children}
    </main>
  );
}
