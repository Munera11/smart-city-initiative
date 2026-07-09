import { useI18n } from "@/lib/i18n";
import { Heart } from "lucide-react";

export function Footer() {
  const { tr } = useI18n();
  return (
    <footer className="mt-24 border-t border-border bg-card">
      <div className="container-page py-12 grid gap-8 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Heart size={20} aria-hidden />
            </span>
            <span className="text-lg font-black">{tr("brand")}</span>
          </div>
          <p className="text-sm text-muted-foreground max-w-sm">{tr("tagline")}</p>
        </div>
        <div>
          <h4 className="font-bold mb-3">{tr("nav_services")}</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>{tr("cat_health")}</li>
            <li>{tr("cat_accessible")}</li>
            <li>{tr("cat_transport")}</li>
            <li>{tr("cat_associations")}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-3">{tr("footer_partner")}</h4>
          <p className="text-sm text-muted-foreground">{tr("hero_eyebrow")}</p>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container-page py-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} {tr("brand")} — {tr("footer_rights")}
        </div>
      </div>
    </footer>
  );
}
