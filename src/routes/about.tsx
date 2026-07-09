import { createFileRoute } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { ShieldCheck, Accessibility, Users, Target } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "عن المنصة | وصل" },
      { name: "description", content: "وصل: منصة تجمع الجهات الحكومية والقطاع الخاص والجمعيات لخدمة ذوي الاحتياجات الخاصة وكبار السن في المنطقة الشرقية." },
      { property: "og:title", content: "عن المنصة | وصل" },
      { property: "og:description", content: "مبادرة وطنية بروح خدمة." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { tr } = useI18n();
  const values = [
    { icon: ShieldCheck, title: "value_trusted", desc: "value_trusted_d" },
    { icon: Accessibility, title: "value_a11y", desc: "value_a11y_d" },
    { icon: Users, title: "value_community", desc: "value_community_d" },
  ] as const;

  return (
    <div className="container-page py-12 md:py-16">
      <header className="max-w-3xl mb-12">
        <span className="chip mb-4"><Target size={14} aria-hidden />{tr("nav_about")}</span>
        <h1 className="text-3xl md:text-5xl font-black leading-tight">{tr("about_title")}</h1>
        <p className="mt-5 text-lg text-muted-foreground leading-relaxed">{tr("about_p")}</p>
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        {values.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="surface-card p-6">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-primary-soft text-primary mb-4">
              <Icon size={26} aria-hidden />
            </span>
            <h2 className="text-lg font-bold mb-1">{tr(title)}</h2>
            <p className="text-muted-foreground">{tr(desc)}</p>
          </div>
        ))}
      </div>

      <section
        className="mt-16 rounded-3xl p-8 md:p-12 grid gap-6 md:grid-cols-3 text-center"
        style={{ background: "color-mix(in oklab, var(--color-primary) 8%, transparent)" }}
      >
        <div>
          <p className="text-4xl font-black text-primary">3</p>
          <p className="text-muted-foreground mt-1">{tr("stat_cities")}</p>
        </div>
        <div>
          <p className="text-4xl font-black text-primary">6</p>
          <p className="text-muted-foreground mt-1">{tr("stat_categories")}</p>
        </div>
        <div>
          <p className="text-4xl font-black text-primary">10+</p>
          <p className="text-muted-foreground mt-1">{tr("stat_services")}</p>
        </div>
      </section>
    </div>
  );
}
