import Image from "next/image";
import { Card } from "@/src/shared/ui";
import { HeroActions } from "./hero-actions";

const trustPoints = [
  "Explore nearby listings",
  "Borrow for one-off needs",
  "Share unused items with confidence",
];

export function MarketplaceHero() {
  return (
    <section className="relative overflow-hidden rounded-[36px] border border-border bg-[linear-gradient(135deg,#fffaf1_0%,#f4ede0_42%,#ece1d3_100%)] px-5 py-6 shadow-[0_24px_80px_-44px_rgba(30,27,23,0.42)] md:px-8 md:py-8 lg:px-10 lg:py-10">
      <div className="absolute inset-x-0 top-0 h-36 bg-[radial-gradient(circle_at_top_right,rgba(15,118,110,0.16),transparent_55%)]" />
      <div className="relative grid gap-8 lg:grid-cols-[1fr_0.95fr] lg:items-center">
        <div className="grid gap-6">
          <div className="grid gap-4">
            <p className="inline-flex w-fit rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-accent">
              ShareIt marketplace
            </p>
            <div className="grid gap-4">
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-foreground md:text-5xl lg:text-6xl">
                Borrow what you need. Share what you own.
              </h1>
              <p className="max-w-2xl text-base leading-8 text-muted md:text-lg">
                Discover useful things from people nearby, request them for the
                short term, and turn the items you already own into something
                helpful or profitable.
              </p>
            </div>
          </div>

          <HeroActions />

          <div className="grid gap-3 sm:grid-cols-3">
            {trustPoints.map((point) => (
              <Card
                key={point}
                className="rounded-[24px] border-white/70 bg-white/72 p-4"
              >
                <p className="text-sm font-medium leading-6 text-foreground">
                  {point}
                </p>
              </Card>
            ))}
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative min-h-[320px] overflow-hidden rounded-[30px] border border-border/80 bg-[#ede0ca] shadow-[0_20px_64px_-38px_rgba(30,27,23,0.45)]">
            <Image
              alt="Gold ShareIT lettering displayed as a bold brand visual"
              className="object-cover"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 34vw"
              src="/assets/home/shareit-3d-wordmark.jpeg"
            />
            <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,rgba(30,27,23,0)_0%,rgba(30,27,23,0.82)_100%)] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/72">
                Share locally
              </p>
              <p className="mt-2 max-w-xs text-sm leading-6 text-white">
                A simple way to borrow gear, list your own items, and keep useful
                things moving through the community.
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="relative min-h-[188px] overflow-hidden rounded-[28px] border border-border/80 bg-[#dbe9cc] shadow-[0_20px_52px_-36px_rgba(30,27,23,0.38)]">
              <Image
                alt="Two guinea pigs sitting together in leafy greens"
                className="object-cover"
                fill
                sizes="(max-width: 1024px) 100vw, 22vw"
                src="/assets/home/guinea-pigs-garden.jpeg"
              />
            </div>

            <Card className="grid gap-3 rounded-[28px] border-white/70 bg-white/76">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
                Why it works
              </p>
              <h2 className="text-2xl font-semibold text-foreground">
                A friendlier way to access useful things
              </h2>
              <p className="text-sm leading-7 text-muted">
                Borrow for a weekend project, lend something that would otherwise
                sit unused, and make everyday sharing feel easy.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
