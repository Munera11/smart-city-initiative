import { useI18n, type Locale } from "@/lib/i18n";
import { SERVICES, type Service } from "@/lib/data";
import { Phone, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

interface Props {
  service: Service;
  compact?: boolean;
}

export function ServiceCard({ service, compact }: Props) {
  const { tr, locale, dir } = useI18n();
  const Chevron = dir === "rtl" ? ChevronLeft : ChevronRight;
  const cityKey = `city_${service.city}` as const;
  const catKey = `cat_${service.category}` as const;

  return (
    <article className="surface-card p-5 flex flex-col gap-3 h-full">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap gap-2 mb-2">
            <span className="chip">{tr(cityKey)}</span>
            <span className="chip" style={{ background: "color-mix(in oklab, var(--color-accent) 15%, transparent)", color: "var(--color-accent)" }}>
              {tr(catKey)}
            </span>
          </div>
          <h3 className="text-lg font-bold text-foreground">{service.name[locale as Locale]}</h3>
        </div>
      </div>

      {!compact && (
        <p className="text-sm text-muted-foreground leading-relaxed">{service.description[locale as Locale]}</p>
      )}

      <div className="flex items-start gap-2 text-sm text-foreground/80">
        <MapPin size={16} className="mt-1 shrink-0" aria-hidden />
        <span>{service.address[locale as Locale]}</span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {service.features.slice(0, 4).map((f) => (
          <span key={f} className="text-[12px] font-medium rounded-full bg-muted px-2.5 py-1 text-foreground/70">
            {tr(f as keyof typeof import("@/lib/i18n").t)}
          </span>
        ))}
      </div>

      <div className="mt-auto flex items-center justify-between pt-3 border-t border-border">
        <a
          href={`tel:${service.phone}`}
          className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:underline"
        >
          <Phone size={16} aria-hidden />
          {tr("call_now")}
        </a>
        <span className="inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground">
          {tr("view_details")}
          <Chevron size={16} aria-hidden />
        </span>
      </div>
    </article>
  );
}

export function ServiceGrid({ items }: { items: Service[] }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((s) => (
        <ServiceCard key={s.id} service={s} />
      ))}
    </div>
  );
}

export function FeaturedServices() {
  const featured = SERVICES.slice(0, 3);
  return <ServiceGrid items={featured} />;
}

export { SERVICES };
