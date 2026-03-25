import { LoginForm } from "@/src/features";
import { Card, PageShell, StatCard } from "@/src/shared/ui";

interface LoginPageProps {
  nextPath?: string | null;
}

export function LoginPage({ nextPath }: LoginPageProps) {
  return (
    <PageShell
      eyebrow="Welcome back"
      title="Sign in and keep sharing"
      description="Manage your listings, track borrowing requests, and stay connected with people nearby."
    >
      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <Card className="grid gap-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
              Marketplace snapshot
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-foreground">
              Borrow what you need today
            </h2>
            <p className="mt-2 text-sm leading-7 text-muted">
              Explore the latest listings, request what&apos;s useful, and follow your
              upcoming borrow dates.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <StatCard
              description="Track the requests you&apos;ve sent so you never miss an update."
              label="Borrowing"
              value="Stay on top"
            />
            <StatCard
              description="Manage the items you&apos;re lending with a clear dashboard."
              label="Lending"
              value="Stay in control"
            />
          </div>
        </Card>

        <LoginForm nextPath={nextPath} />
      </div>
    </PageShell>
  );
}
