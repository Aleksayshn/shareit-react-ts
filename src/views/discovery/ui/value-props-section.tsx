import { Card, SectionHeader } from "@/src/shared/ui";

const valueCards = [
  {
    eyebrow: "Discover listings",
    title: "Borrow what you need",
    description:
      "Browse useful gear, household items, and project essentials without committing to a full purchase.",
  },
  {
    eyebrow: "Share unused items",
    title: "List in minutes",
    description:
      "Create a listing, set availability, and make it easy for other people to request what they need.",
  },
  {
    eyebrow: "Help or earn",
    title: "Keep things moving",
    description:
      "Support people nearby or turn idle items into a steady source of extra income.",
  },
];

export function ValuePropsSection() {
  return (
    <section className="grid gap-4">
      <SectionHeader
        description="ShareIt is built for both sides of the marketplace so borrowing and lending feel equally natural."
        eyebrow="How it works"
        title="A marketplace for temporary sharing"
      />
      <div className="grid gap-4 lg:grid-cols-3">
        {valueCards.map((card, index) => (
          <Card key={card.title} className="grid gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/10 text-sm font-semibold text-accent">
              0{index + 1}
            </div>
            <div className="grid gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
                {card.eyebrow}
              </p>
              <h2 className="text-2xl font-semibold text-foreground">
                {card.title}
              </h2>
              <p className="text-sm leading-7 text-muted">{card.description}</p>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
