import { createFileRoute, Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { SERVICES } from "@/lib/data";
import { ServiceGrid } from "@/components/ServiceCard";
import {
  HeartPulse,
  Accessibility,
  Bus,
  HandHeart,
  Building2,
  CalendarHeart,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Users,
  Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const { tr, dir } = useI18n();
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;

  const cats = [
    { key: "health", icon: HeartPulse },
    { key: "accessible", icon: Accessibility },
    { key: "transport", icon: Bus },
    { key: "associations", icon: HandHeart },
    { key: "gov", icon: Building2 },
    { key: "events", icon: CalendarHeart },
  ] as const;

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(1000px 500px at 15% 0%, color-mix(in oklab, var(--color-primary) 22%, transparent), transparent 60%), radial-gradient(800px 500px at 100% 30%, color-mix(in oklab, var(--color-secondary) 22%, transparent), transparent 60%)",
          }}
        />
        <div className="container-page pt-14 pb-20 md:pt-20 md:pb-28 grid gap-10 lg:grid-cols-[1.15fr_1fr] items-center">
          <div>
            <span className="chip mb-5">
              <Sparkles size={14} aria-hidden />
              {tr("hero_eyebrow")}
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-[1.15] text-foreground">
              {tr("hero_title")}
            </h1>
            <p className="mt-5 text-lg text-muted-foreground max-w-2xl leading-relaxed">
              {tr("hero_sub")}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/services" className="btn-primary">
                {tr("hero_cta_primary")}
                <Arrow size={18} aria-hidden />
              </Link>
              <Link to="/community" className="btn-outline">
                {tr("hero_cta_secondary")}
              </Link>
            </div>

            <dl className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { n: `${SERVICES.length}+`, k: "stat_services" as const },
                { n: "3", k: "stat_cities" as const },
                { n: "6", k: "stat_categories" as const },
                { n: "1.2k", k: "stat_community" as const },
              ].map((s) => (
                <div key={s.k} className="surface-card px-4 py-3">
                  <dt className="text-xs font-semibold text-muted-foreground">{tr(s.k)}</dt>
                  <dd className="text-2xl font-black text-primary">{s.n}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative">
            <div className="surface-card p-6 md:p-8">
              <div className="flex items-center gap-3 mb-5">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary-soft text-primary">
                  <ShieldCheck size={24} aria-hidden />
                </span>
                <div>
                  <p className="font-bold text-foreground">{tr("value_trusted")}</p>
                  <p className="text-sm text-muted-foreground">{tr("value_trusted_d")}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 mb-5">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary-soft text-accent" style={{ background: "color-mix(in oklab, var(--color-accent) 15%, transparent)" }}>
                  <Accessibility size={24} aria-hidden />
                </span>
                <div>
                  <p className="font-bold text-foreground">{tr("value_a11y")}</p>
                  <p className="text-sm text-muted-foreground">{tr("value_a11y_d")}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-2xl text-secondary" style={{ background: "color-mix(in oklab, var(--color-secondary) 18%, transparent)", color: "var(--color-secondary)" }}>
                  <Users size={24} aria-hidden />
                </span>
                <div>
                  <p className="font-bold text-foreground">{tr("value_community")}</p>
                  <p className="text-sm text-muted-foreground">{tr("value_community_d")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="container-page py-16">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
          <h2 className="text-2xl md:text-3xl font-black">{tr("categories_title")}</h2>
          <Link to="/services" className="text-sm font-bold text-primary hover:underline inline-flex items-center gap-1">
            {tr("nav_services")} <Arrow size={16} aria-hidden />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cats.map(({ key, icon: Icon }) => (
            <Link
              key={key}
              to="/services"
              search={{ category: key } as never}
              className="surface-card p-6 text-start group hover:border-primary transition-colors"
            >
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-primary-soft text-primary mb-4 group-hover:scale-105 transition-transform">
                <Icon size={26} aria-hidden />
              </span>
              <h3 className="text-lg font-bold text-foreground mb-1">
                {tr(`cat_${key}` as const)}
              </h3>
              <p className="text-sm text-muted-foreground">
                {tr(`cat_${key}_desc` as const)}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      <section className="container-page py-8">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
          <h2 className="text-2xl md:text-3xl font-black">{tr("nav_services")}</h2>
          <Link to="/services" className="text-sm font-bold text-primary hover:underline inline-flex items-center gap-1">
            {tr("hero_cta_primary")} <Arrow size={16} aria-hidden />
          </Link>
        </div>
        <ServiceGrid items={SERVICES.slice(0, 6)} />
      </section>

      {/* CTA */}
      <section className="container-page py-20">
        <div
          className="rounded-3xl p-8 md:p-14 text-center"
          style={{
            background:
              "linear-gradient(135deg, var(--color-primary), color-mix(in oklab, var(--color-primary) 60%, var(--color-accent)))",
            color: "var(--color-primary-foreground)",
          }}
        >
          <h2 className="text-2xl md:text-4xl font-black">{tr("community_title")}</h2>
          <p className="mt-3 max-w-2xl mx-auto opacity-90">{tr("community_sub")}</p>
          <div className="mt-6 flex justify-center">
            <Link to="/community" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-bold text-primary hover:opacity-95">
              {tr("hero_cta_secondary")}
              <Arrow size={18} aria-hidden />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
