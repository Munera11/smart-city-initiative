import { Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { Menu, X, Heart, Phone } from "lucide-react";
import { useState } from "react";

export function Header() {
  const { tr, locale, setLocale } = useI18n();
  const [open, setOpen] = useState(false);

  const nav = [
    { to: "/", label: tr("nav_home") },
    { to: "/services", label: tr("nav_services") },
    { to: "/community", label: tr("nav_community") },
    { to: "/about", label: tr("nav_about") },
    { to: "/contact", label: tr("nav_contact") },
  ] as const;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="container-page flex items-center gap-4 py-3">
        <Link to="/" className="flex items-center gap-2 shrink-0" aria-label={tr("brand")}>
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-md">
            <Heart size={22} aria-hidden />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-lg font-black text-foreground">{tr("brand")}</span>
            <span className="text-[11px] font-medium text-muted-foreground max-w-[220px] truncate">
              {tr("hero_eyebrow")}
            </span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1 mx-auto" aria-label="Primary">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="px-4 py-2 rounded-full text-[15px] font-semibold text-foreground/80 hover:text-foreground hover:bg-primary-soft transition-colors"
              activeProps={{ className: "px-4 py-2 rounded-full text-[15px] font-semibold bg-primary text-primary-foreground" }}
              activeOptions={{ exact: n.to === "/" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="ms-auto lg:ms-0 flex items-center gap-2">
          <a
            href="tel:997"
            className="hidden sm:inline-flex items-center gap-2 rounded-full border-2 border-destructive/30 bg-destructive/5 px-3 py-2 text-sm font-bold text-destructive"
          >
            <Phone size={16} aria-hidden />
            {tr("emergency")}
          </a>
          <button
            onClick={() => setLocale(locale === "ar" ? "en" : "ar")}
            className="min-w-11 min-h-11 rounded-full border-2 border-border bg-card px-3 font-bold text-foreground hover:border-primary"
            aria-label="Switch language"
          >
            {tr("lang_switch")}
          </button>
          <button
            className="lg:hidden min-w-11 min-h-11 grid place-items-center rounded-full border-2 border-border"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-card">
          <nav className="container-page py-3 flex flex-col gap-1" aria-label="Mobile">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="px-4 py-3 rounded-xl text-base font-semibold text-foreground hover:bg-primary-soft"
                activeProps={{ className: "px-4 py-3 rounded-xl text-base font-semibold bg-primary text-primary-foreground" }}
                activeOptions={{ exact: n.to === "/" }}
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
