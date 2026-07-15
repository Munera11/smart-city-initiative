import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useA11y } from "@/lib/a11y";
import { A11yFab } from "@/components/A11yFab";
import {
  Moon,
  Sun,
  Languages,
  ArrowLeft,
  ArrowRight,
  AlertTriangle,
  Lightbulb,
  ThumbsUp,
  Check,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: Welcome,
});

type Choice = "complaint" | "idea" | "positive";
type Screen = "loading" | "welcome";

const COPY = {
  ar: {
    brand: "وصل",
    region: "المنطقة الشرقية · الدمام · الخبر · الظهران",
    intro:
      "مبادرة وصل منصة مجتمعية تجمع أصوات كبار السن وذوي الإعاقة وجميع سكان المنطقة الشرقية، لمشاركة تجاربكم واقتراحاتكم لتحسين المدينة وخدماتها.",
    pickTitle: "ماذا تريد أن تشارك؟",
    pickSub: "اختر نوع المشاركة لنبدأ",
    complaint: "شكوى أو بلاغ",
    complaint_d: "الإبلاغ عن مشكلة أو رفع طلب شكوى",
    idea: "فكرة تطويرية",
    idea_d: "اقتراح لتحسين المدينة أو الخدمات",
    positive: "رأي إيجابي",
    positive_d: "مشاركة تجربة أو ملاحظة جميلة",
    next: "التالي",
    a11y: "أدوات إمكانية الوصول",
    font_size: "حجم الخط",
    dark_on: "الوضع الداكن",
    dark_off: "الوضع الفاتح",
    read: "استماع",
    stop: "إيقاف",
    lang: "English",
    loading: "جاري التحميل",
    loading_sub: "منصة وصل لأصوات المنطقة الشرقية",
  },
  en: {
    brand: "Wasel",
    region: "Eastern Province · Dammam · Khobar · Dhahran",
    intro:
      "Wasel is a community initiative bringing together the voices of seniors, people with disabilities, and everyone in the Eastern Province — to share experiences and ideas to improve the city and its services.",
    pickTitle: "What would you like to share?",
    pickSub: "Pick the type of contribution to start",
    complaint: "Complaint / Report",
    complaint_d: "Report an issue or file a complaint",
    idea: "Improvement idea",
    idea_d: "Suggest a way to improve the city or a service",
    positive: "Positive feedback",
    positive_d: "Share a good experience or a nice note",
    next: "Next",
    a11y: "Accessibility tools",
    font_size: "Text size",
    dark_on: "Dark mode",
    dark_off: "Light mode",
    read: "Listen",
    stop: "Stop",
    lang: "عربي",
    loading: "Loading",
    loading_sub: "Wasel platform for the Eastern Province voices",
  },
} as const;

const LOADING_MS = 2400;

function SplashScreen({ locale, onDone }: { locale: "ar" | "en"; onDone: () => void }) {
  const c = COPY[locale];
  const [fadeOut, setFadeOut] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", handleChange);
    return () => mq.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFadeOut(true), LOADING_MS - 350);
    const doneTimer = setTimeout(onDone, LOADING_MS);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, [onDone]);

  return (
    <div
      className={`fixed inset-0 z-50 grid place-items-center bg-background transition-opacity duration-300 ${
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      aria-hidden="true"
    >
      <div className="flex flex-col items-center text-center px-6">
        <h1 className="text-6xl font-black tracking-tight text-primary">{c.brand}</h1>
        <p className="mt-3 text-base font-semibold text-muted-foreground">{c.loading_sub}</p>
        <div className="mt-8 h-2.5 w-48 rounded-full bg-muted overflow-hidden" role="progressbar" aria-label={c.loading}>
          <div
            className={`h-full rounded-full bg-primary origin-left ${prefersReducedMotion ? "" : "animate-loading-bar"}`}
            style={{ width: "100%" }}
          />
        </div>
        <p className="mt-2 text-sm font-bold text-primary">{c.loading}...</p>
      </div>
    </div>
  );
}

function Welcome() {
  const { locale, setLocale, dir } = useI18n();
  const { highContrast, toggleHighContrast, stopSpeaking } = useA11y();
  const [choice, setChoice] = useState<Choice | null>(null);
  const [screen, setScreen] = useState<Screen>("loading");
  const navigate = useNavigate();
  const c = COPY[locale];
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;

  const options = useMemo(
    () =>
      [
        { key: "complaint" as Choice, icon: AlertTriangle, tone: "bg-destructive/10 text-destructive" },
        { key: "idea" as Choice, icon: Lightbulb, tone: "bg-secondary/15 text-secondary" },
        { key: "positive" as Choice, icon: ThumbsUp, tone: "bg-accent/15 text-accent" },
      ],
    []
  );

  const goNext = () => {
    if (!choice) return;
    stopSpeaking();
    navigate({ to: "/share/$type", params: { type: choice } });
  };

  const readText = `${c.brand}. ${c.intro} ${c.pickTitle}. ${c.complaint}. ${c.idea}. ${c.positive}.`;

  return (
    <div className="min-h-dvh bg-background">
      {screen === "loading" && <SplashScreen locale={locale} onDone={() => setScreen("welcome")} />}

      {/* Slim top bar: only language + dark mode */}
      <div className="sticky top-0 z-30 bg-background/90 backdrop-blur border-b border-border">
        <div className="container-page flex items-center gap-2 py-2.5">
          <button
            onClick={() => setLocale(locale === "ar" ? "en" : "ar")}
            className="inline-flex items-center gap-1.5 min-h-11 rounded-full border-2 border-border bg-card px-3 font-bold text-sm hover:border-primary"
            aria-label="Toggle language"
          >
            <Languages size={16} aria-hidden />
            {c.lang}
          </button>

          <button
            onClick={toggleHighContrast}
            className={`ms-auto inline-flex items-center gap-1.5 min-h-11 rounded-full px-3 font-bold text-sm border-2 ${
              highContrast ? "bg-foreground text-background border-foreground" : "border-border bg-card hover:border-primary"
            }`}
            aria-pressed={highContrast}
            aria-label={highContrast ? c.dark_off : c.dark_on}
          >
            {highContrast ? <Sun size={16} aria-hidden /> : <Moon size={16} aria-hidden />}
            {highContrast ? c.dark_off : c.dark_on}
          </button>
        </div>
      </div>

      {/* Main content */}
      <main className="container-page pb-32 pt-10">
        {/* Brand — no logo */}
        <div className="text-center">
          <h1 className="text-5xl font-black tracking-tight text-primary">{c.brand}</h1>
          <p className="mt-2 text-sm font-semibold text-muted-foreground">{c.region}</p>
        </div>

        {/* Intro */}
        <section aria-labelledby="intro-title" className="surface-card mt-8 p-5">
          <h2 id="intro-title" className="sr-only">{c.brand}</h2>
          <p className="text-[1.05rem] leading-relaxed text-foreground">{c.intro}</p>
        </section>

        {/* Accessibility tools (Listen + font size) grouped with a11y icon */}
        <section
          aria-labelledby="a11y-title"
          className="mt-6 rounded-2xl border-2 border-border bg-card p-4"
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-primary-soft text-primary shrink-0" aria-hidden>
              <Accessibility size={20} />
            </span>
            <h2 id="a11y-title" className="text-base font-black text-foreground">
              {c.a11y}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={readIntro}
              className={`inline-flex items-center gap-2 min-h-11 rounded-full px-4 font-bold text-sm border-2 ${
                speaking ? "bg-primary text-primary-foreground border-primary" : "border-border bg-background hover:border-primary"
              }`}
              aria-pressed={speaking}
              aria-label={speaking ? c.stop : c.read}
            >
              {speaking ? <VolumeX size={16} aria-hidden /> : <Volume2 size={16} aria-hidden />}
              {speaking ? c.stop : c.read}
            </button>

            <div
              className="flex items-center gap-1 rounded-full border-2 border-border bg-background p-1"
              role="group"
              aria-label={c.font_size}
            >
              <button
                onClick={() => setFontScale(fontScale - 0.1)}
                className="grid h-9 w-9 place-items-center rounded-full hover:bg-primary-soft"
                aria-label="Decrease text size"
              >
                <Minus size={16} aria-hidden />
              </button>
              <span className="text-xs font-bold px-1 min-w-10 text-center tabular-nums" aria-live="polite">
                {Math.round(fontScale * 100)}%
              </span>
              <button
                onClick={() => setFontScale(fontScale + 0.1)}
                className="grid h-9 w-9 place-items-center rounded-full hover:bg-primary-soft"
                aria-label="Increase text size"
              >
                <Plus size={16} aria-hidden />
              </button>
            </div>
          </div>
        </section>

        {/* 3 options */}
        <section aria-labelledby="pick-title" className="mt-8">
          <div className="mb-4">
            <h2 id="pick-title" className="text-xl font-black">{c.pickTitle}</h2>
            <p className="text-sm text-muted-foreground">{c.pickSub}</p>
          </div>

          <ul className="grid gap-3" role="radiogroup" aria-labelledby="pick-title">
            {options.map(({ key, icon: Icon, tone }) => {
              const active = choice === key;
              return (
                <li key={key}>
                  <button
                    role="radio"
                    aria-checked={active}
                    onClick={() => setChoice(key)}
                    className={`w-full text-start flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                      active
                        ? "border-primary bg-primary-soft shadow-md"
                        : "border-border bg-card hover:border-primary/50"
                    }`}
                  >
                    <span
                      className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl ${
                        active ? "bg-primary text-primary-foreground" : tone
                      }`}
                    >
                      <Icon size={26} aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-lg font-black text-foreground">{c[key]}</span>
                      <span className="block text-sm text-muted-foreground">{c[`${key}_d` as const]}</span>
                    </span>
                    <span
                      className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 ${
                        active ? "bg-primary border-primary text-primary-foreground" : "border-border"
                      }`}
                      aria-hidden
                    >
                      {active ? <Check size={18} /> : null}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      </main>

      {/* Sticky Next */}
      <div className="fixed bottom-0 inset-x-0 z-30 bg-background/95 backdrop-blur border-t border-border">
        <div className="container-page py-3">
          <button
            onClick={goNext}
            disabled={!choice}
            className="btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
          >
            {c.next}
            <Arrow size={20} aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}
