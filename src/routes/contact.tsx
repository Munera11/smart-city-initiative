import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { Mail, Phone, MapPin, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "تواصل معنا | وصل" },
      { name: "description", content: "أرسل اقتراحاتك لإضافة خدمات أو تحديث بيانات ضمن دليل وصل." },
      { property: "og:title", content: "تواصل معنا | وصل" },
      { property: "og:description", content: "نسعد بتلقي اقتراحاتكم." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { tr } = useI18n();
  const [sent, setSent] = useState(false);

  return (
    <div className="container-page py-12 md:py-16">
      <header className="max-w-2xl mb-10">
        <h1 className="text-3xl md:text-4xl font-black">{tr("contact_title")}</h1>
        <p className="mt-3 text-muted-foreground text-lg">{tr("contact_sub")}</p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
        <form
          onSubmit={(e) => { e.preventDefault(); setSent(true); }}
          className="surface-card p-6 md:p-8 space-y-4"
        >
          <div>
            <label className="block font-semibold mb-2" htmlFor="name">{tr("form_name")}</label>
            <input id="name" required className="w-full min-h-12 rounded-xl border-2 border-border bg-background px-4 focus:border-primary outline-none" />
          </div>
          <div>
            <label className="block font-semibold mb-2" htmlFor="email">{tr("form_email")}</label>
            <input id="email" type="email" required className="w-full min-h-12 rounded-xl border-2 border-border bg-background px-4 focus:border-primary outline-none" />
          </div>
          <div>
            <label className="block font-semibold mb-2" htmlFor="msg">{tr("form_message")}</label>
            <textarea id="msg" required rows={5} className="w-full rounded-xl border-2 border-border bg-background px-4 py-3 focus:border-primary outline-none resize-none" />
          </div>
          <button type="submit" className="btn-primary w-full sm:w-auto">{tr("form_send")}</button>
          {sent && (
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-accent">
              <CheckCircle2 size={18} aria-hidden />
              {tr("form_thanks")}
            </p>
          )}
        </form>

        <aside className="space-y-4">
          <div className="surface-card p-6">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary-soft text-primary mb-3">
              <Mail size={20} aria-hidden />
            </span>
            <p className="text-sm text-muted-foreground">Email</p>
            <a href="mailto:info@wasel.sa" className="font-bold text-foreground hover:text-primary">info@wasel.sa</a>
          </div>
          <div className="surface-card p-6">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary-soft text-primary mb-3">
              <Phone size={20} aria-hidden />
            </span>
            <p className="text-sm text-muted-foreground">{tr("call_now")}</p>
            <a href="tel:920001234" className="font-bold text-foreground hover:text-primary">920 001 234</a>
          </div>
          <div className="surface-card p-6">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary-soft text-primary mb-3">
              <MapPin size={20} aria-hidden />
            </span>
            <p className="text-sm text-muted-foreground">{tr("filter_city")}</p>
            <p className="font-bold text-foreground">{tr("hero_eyebrow")}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
