import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { SERVICES, type Category, type City } from "@/lib/data";
import { ServiceGrid } from "@/components/ServiceCard";
import { Search } from "lucide-react";
import { z } from "zod";

const searchSchema = z.object({
  category: z.enum(["health", "accessible", "transport", "associations", "gov", "events"]).optional(),
  city: z.enum(["dammam", "khobar", "dhahran"]).optional(),
});

export const Route = createFileRoute("/services")({
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({
    meta: [
      { title: "الخدمات والمرافق | وصل" },
      { name: "description", content: "استعرض الخدمات والمرافق المهيأة في الدمام والخبر والظهران، مع فلاتر حسب المدينة والفئة." },
      { property: "og:title", content: "الخدمات والمرافق | وصل" },
      { property: "og:description", content: "دليل الخدمات المهيأة في المنطقة الشرقية." },
    ],
  }),
  component: ServicesPage,
});

const CATS: (Category | "all")[] = ["all", "health", "accessible", "transport", "associations", "gov", "events"];
const CITIES: (City | "all")[] = ["all", "dammam", "khobar", "dhahran"];

function ServicesPage() {
  const { tr, locale } = useI18n();
  const search = Route.useSearch();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category | "all">(search.category ?? "all");
  const [city, setCity] = useState<City | "all">(search.city ?? "all");

  const items = useMemo(() => {
    return SERVICES.filter((s) => {
      if (category !== "all" && s.category !== category) return false;
      if (city !== "all" && s.city !== city) return false;
      if (query) {
        const q = query.toLowerCase();
        const name = `${s.name.ar} ${s.name.en}`.toLowerCase();
        if (!name.includes(q)) return false;
      }
      return true;
    });
  }, [category, city, query]);

  return (
    <div className="container-page py-10 md:py-14">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-black">{tr("nav_services")}</h1>
        <p className="mt-2 text-muted-foreground">{tr("tagline")}</p>
      </header>

      <div className="surface-card p-4 md:p-5 mb-8">
        <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
          <label className="relative block">
            <span className="sr-only">{tr("search_placeholder")}</span>
            <Search size={18} className="absolute top-1/2 -translate-y-1/2 start-4 text-muted-foreground" aria-hidden />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={tr("search_placeholder")}
              className="w-full min-h-12 rounded-full border-2 border-border bg-background ps-11 pe-4 text-base focus:border-primary outline-none"
            />
          </label>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value as City | "all")}
            className="min-h-12 rounded-full border-2 border-border bg-background px-4 font-semibold focus:border-primary"
            aria-label={tr("filter_city")}
          >
            {CITIES.map((c) => (
              <option key={c} value={c}>
                {c === "all" ? `${tr("filter_city")}: ${tr("filter_all")}` : tr(`city_${c}` as const)}
              </option>
            ))}
          </select>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Category | "all")}
            className="min-h-12 rounded-full border-2 border-border bg-background px-4 font-semibold focus:border-primary"
            aria-label={tr("filter_category")}
          >
            {CATS.map((c) => (
              <option key={c} value={c}>
                {c === "all" ? `${tr("filter_category")}: ${tr("filter_all")}` : tr(`cat_${c}` as const)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="mb-5 text-sm text-muted-foreground">
        {items.length} {tr("results_count")}
      </p>

      {items.length > 0 ? (
        <ServiceGrid items={items} />
      ) : (
        <div className="surface-card p-10 text-center text-muted-foreground">
          {locale === "ar" ? "لا توجد نتائج مطابقة. جرّب فلترًا آخر." : "No matching results. Try different filters."}
        </div>
      )}
    </div>
  );
}
