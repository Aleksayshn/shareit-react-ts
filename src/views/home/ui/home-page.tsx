import { env } from "@/src/shared/config";
import { Card, EmptyState, LinkButton, PageShell } from "@/src/shared/ui";

const foundationAreas = [
  {
    title: "App shell and providers",
    description:
      "Next.js route files stay thin while the provider tree is centralized in a dedicated application layer.",
  },
  {
    title: "Shared API layer",
    description:
      "All requests flow through one fetch client with query param support, REST verbs, and automatic active-user header injection.",
  },
  {
    title: "Predictable state split",
    description:
      "Server data is handled by TanStack Query and the selected sharer is persisted locally with Zustand.",
  },
];

export function HomePage() {
  return (
    <PageShell
      eyebrow="Stage 1"
      title="ShareIt foundation is ready for feature work"
      description="This stage sets the project up for the Users flow without introducing mock data or premature domain code."
      actions={
        <LinkButton
          href="https://tanstack.com/query/latest"
          target="_blank"
          rel="noreferrer"
        >
          Query docs
        </LinkButton>
      }
    >
      <section className="grid gap-4 lg:grid-cols-3">
        {foundationAreas.map((area) => (
          <Card key={area.title}>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">
              Foundation
            </p>
            <h2 className="mt-4 text-xl font-semibold text-foreground">
              {area.title}
            </h2>
            <p className="mt-3 text-sm leading-7 text-muted">
              {area.description}
            </p>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <Card tone="accent">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">
            Environment
          </p>
          <h2 className="mt-4 text-2xl font-semibold text-foreground">
            Real backend ready
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
            Requests resolve against{" "}
            <span className="rounded-full bg-white/85 px-3 py-1 font-mono text-xs text-foreground">
              {env.apiBaseUrl}
            </span>{" "}
            and backend or network failures are normalized into a shared
            `AppError` shape before they reach features.
          </p>
        </Card>

        <EmptyState
          title="Stage 2 next"
          description="Build the Users entity, CRUD features, user switcher widget, and the `/users` plus `/users/[id]` pages."
        />
      </section>
    </PageShell>
  );
}
