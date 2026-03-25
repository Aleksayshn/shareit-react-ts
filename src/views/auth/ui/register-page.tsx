import { RegisterForm } from "@/src/features";
import { Card, PageShell, StatCard } from "@/src/shared/ui";

interface RegisterPageProps {
  nextPath?: string | null;
}

export function RegisterPage({ nextPath }: RegisterPageProps) {
  return (
    <PageShell
      eyebrow="Join ShareIt"
      title="Create your sharing account"
      description="Borrow what you need, share what you own, and connect with people nearby."
    >
      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <Card className="grid gap-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
              Why ShareIt
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-foreground">
              Make sharing feel effortless
            </h2>
            <p className="mt-2 text-sm leading-7 text-muted">
              List unused items in minutes, earn extra cash or help neighbors, and
              borrow what you need without buying it outright.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <StatCard
              description="Access useful gear without the upfront purchase."
              label="Borrow smarter"
              value="Save money"
            />
            <StatCard
              description="Turn unused items into something helpful or profitable."
              label="Share more"
              value="Earn or help"
            />
          </div>
        </Card>

        <RegisterForm nextPath={nextPath} />
      </div>
    </PageShell>
  );
}
