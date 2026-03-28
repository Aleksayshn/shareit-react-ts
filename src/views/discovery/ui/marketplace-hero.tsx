import { HeroActions } from "./hero-actions";

export function MarketplaceHero() {
  return (
    <section className="relative isolate overflow-hidden rounded-[36px] border border-border shadow-[0_24px_80px_-44px_rgba(30,27,23,0.42)]">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/assets/home/shareit-3d-wordmark.jpeg')",
        }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(30,27,23,0.9)_0%,rgba(30,27,23,0.78)_38%,rgba(30,27,23,0.52)_64%,rgba(30,27,23,0.28)_100%)]" />
      <div className="absolute inset-x-0 top-0 h-44 bg-[radial-gradient(circle_at_top_right,rgba(255,244,214,0.2),transparent_58%)]" />

      <div className="relative flex min-h-[460px] items-end px-5 py-6 md:min-h-[520px] md:px-8 md:py-8 lg:min-h-[560px] lg:px-10 lg:py-10">
        <div className="grid max-w-3xl gap-6">
          <div className="grid gap-4">
            <p className="inline-flex w-fit rounded-full bg-white/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-white/84 ring-1 ring-white/15 backdrop-blur-sm">
              ShareIt marketplace
            </p>
            <div className="grid gap-4">
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white md:text-5xl lg:text-6xl">
                Borrow what you need. Share what you own.
              </h1>
              <p className="max-w-2xl text-base leading-8 text-white/80 md:text-lg">
                Discover useful things from people nearby, request them for the
                short term, and turn the items you already own into something
                helpful or profitable.
              </p>
            </div>
          </div>

          <HeroActions />

          <div className="max-w-xl rounded-[28px] border border-white/16 bg-black/24 p-5 backdrop-blur-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/72">
              Share locally
            </p>
            <p className="mt-2 text-sm leading-7 text-white/82">
              A simple way to borrow gear, list your own items, and keep useful
              things moving through the community.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
